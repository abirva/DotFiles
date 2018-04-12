/* exported processRequest */
var processRequest = (function() {
    // This module provides an implementation of processRequest.
    // If possible, fetch() is used because its default behavior is to NOT
    // include cookies. XMLHttpRequest is used as a fallback (which does not
    // support credential-less requests https://crbug.com/48118).
    //
    // requestObject requires the following keys:
    // - url: string
    // - afterSend: function - Called when request is initiated (note: not called when fail or found was called before)
    // - fail: function
    // - found: function
    // Optional:
    // - method: string
    // - payload: string (formdata)
    // - headers: object of headername-headervalue pairs
    // - encoding: override expected encoding of response

    var g_fetchContextCounter = 0;

    /**
     * Retrieve a fetch method plus an endFetch method.
     * @return {fetch:function,endFetch:function} - fetch is equivalent to
     *   window.fetch, endFetch should always be called AT LEAST ONCE. When it
     *   is called, the request is aborted if possible.
     */
    function getFetchContext() {
        // fetch does usually not support cancellation...
        // https://github.com/whatwg/fetch/issues/27
        // ... but Chrome does support abortion by unload or stop():
        // https://github.com/whatwg/fetch/issues/53

        // Note: Chrome supports fetch since Chrome 42 (41 behind flag).

        if (/Chrome\/4[1-4]\.0\.2([23]|40[01])/.test(navigator.userAgent)) {
            // In Chrome 41 - 44, fetch inside a frame in an extension does not
            // work due to https://crbug.com/478345. This has been fixed with
            // Chrome 45.0.2402.0 (14 may 2015). To work around this issue,
            // we don't support abort() if more than one request is pending.
            var hasEnded = false;
            return {
                fetch: function(url, requestInit) {
                    ++g_fetchContextCounter;
                    return window.fetch(url, requestInit);
                },
                endFetch: function() {
                    if (!hasEnded) {
                        hasEnded = true;
                        if (--g_fetchContextCounter === 0) {
                            // If the counter has reached 0, assume that this
                            // was the only request in the document, and cancel
                            // the request
                            window.stop();
                        }
                        // If fetchContextCounter > 0, the request cannot safely
                        // be aborted: If we call stop(), then other requests
                        // will also be aborted. We choose the lesser evil of
                        // the options, and decide to not abort the request.
                    }
                }
            };
        }

        // Create a separate frame to allow fetch to be canceled per request.
        var f = document.createElement('iframe');
        document.body.appendChild(f);
        return {
            fetch: f.contentWindow.fetch.bind(f.contentWindow),
            endFetch: function() {
                if (f) {
                    f.remove();
                    f = null;
                }
            }
        };
    }

    function processRequestFetch(requestObject) {
        var url = requestObject.url;

        var context = getFetchContext();
        var fetch = context.fetch;
        var endFetch = context.endFetch;

        var requestInit = {
            method: requestObject.method || 'GET',
            headers: requestObject.headers || {},
            redirect: 'follow',
            mode: 'cors'
        };
        if (requestObject.payload && requestObject.method &&
            !/^(GET|HEAD)$/.test(requestObject.method)) {
            requestInit.body = requestObject.payload;
        }

        var encoding = requestObject.encoding;

        fetch(url, requestInit).then(function(response) {
            if (response.status < 200 || response.status >= 300) {
                // Fall through to .fail
                throw new Error('Unsuccessful response');
            }
            if (encoding) {
                return response.arrayBuffer().then(function(arraybuffer) {
                    try {
                        return new TextDecoder(encoding).decode(arraybuffer);
                    } catch (e) {
                        // Invalid encoding specified. Fall back to default.
                        return new TextDecoder().decode(arraybuffer);
                    }
                });
            }
            return response.text();
        }).then(function(responseText) {
            requestObject.found({
                url: url,
                responseText: responseText
            });
        }).then(null, function() {
            requestObject.fail({ url: url });
        }).then(endFetch, endFetch);

        // Promises are resolved/rejected asynchronously, so the .afterSend call
        // at this point will always be before the .found/.fail calls.
        requestObject.afterSend({
            url: url,
            abort: endFetch
        });
    }

    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var NOOP = function() {};
    function processRequestXHR(requestObject) {
        var url = requestObject.url;
        var x = new XMLHttpRequest();

        // Declare return value, so that the abort method can be changed to
        // release the scope when the request finishes
        var returnValue = {
            url: url,
            abort: function() {
                if (x) {
                    returnValue.abort = NOOP;
                    x.abort();
                    x = null;
                }
            }
        };

        x.open(requestObject.method || 'GET', url, true);

        if (requestObject.headers) {
            var headerNames = Object.keys(requestObject.headers);
            for (var i=0; i<headerNames.length; i++) {
                var headerName = headerNames[i];
                if (_hasOwnProperty.call(requestObject.headers, headerName)) {
                    var headerValue = requestObject.headers[headerName];
                    x.setRequestHeader(headerName, headerValue);
                }
            }
        }

        x.onload = function() {
            if (returnValue.abort === NOOP) return;
            var status = x.status;
            var responseText = x.responseText;
            returnValue.abort = NOOP;
            x = null;
            if (status >= 200 && status < 300 || status === 304) {
                requestObject.found({url: url, responseText: responseText});
            } else {
                requestObject.fail({url: url});
            }
        };

        x.onerror = function() {
            if (returnValue.abort === NOOP) return;
            returnValue.abort = NOOP;
            x = null;
            requestObject.fail({url: url});
        };

        if (requestObject.encoding) {
            x.overrideMimeType('text/plain;charset=' + requestObject.encoding);
        }

        // try-catch in case a new URL was added while the permissions were not updated yet
        try {
            // If requestObject.method === 'GET', then the payload will be ignored
            x.send(requestObject.payload);
        } catch (e) {
            console.error(e.message);
            requestObject.fail({url: url});
        }

        if (x) {
            // The request hasn't immediately failed yet, notify that the request is being processed
            requestObject.afterSend(returnValue);
        }
    }

    function processRequest(requestObject) {
        if (window.fetch) {
            // Hurray, we have fetch (Chrome 42+)!
            return processRequestFetch(requestObject);
        }
        return processRequestXHR(requestObject);
    }

    // Set of recent requests.
    var pendingRequests = {};

    function PendingRequest(cacheKey) {
        this.requestObjects = [];
        // Set soon after the request was started.
        // _afterSend is always set if _fail or _found is non-null.
        this._afterSend = null;
        // _fail and _found are mutually exclusive.
        this._fail = null;
        this._found = null;

        this.expire = function() {
            if (pendingRequests[cacheKey] === this) {
                delete pendingRequests[cacheKey];
            }
        }.bind(this);
    }

    PendingRequest.getInstance = function(cacheKey) {
        if (pendingRequests[cacheKey]) {
            return pendingRequests[cacheKey];
        }
        return (pendingRequests[cacheKey] = new PendingRequest(cacheKey));
    };

    PendingRequest.prototype.callCallbacks = function(requestObject) {
        if (this._afterSend && !requestObject._afterSendWasCalled) {
            requestObject._afterSendWasCalled = true;
            requestObject.afterSend({
                url: this._afterSend.url,
                abort: function() {
                    var i = this.requestObjects.indexOf(requestObject);
                    if (i >= 0) {
                        this.requestObjects.splice(i, 1);
                        if (this._afterSend && !this._fail && !this._found &&
                            this.requestObjects.length === 0) {
                            this._afterSend.abort();
                            this._afterSend = null;
                        }
                    }
                }.bind(this)
            });
        }

        if (this._found) {
            requestObject.found(this._found);
        } else if (this._fail) {
            requestObject.fail(this._fail);
        } else {
            // Neither found nor fail has been called, so do not remove the
            // request yet.
            return;
        }

        // fail or found has been called, so the request has finished.
        var i = this.requestObjects.indexOf(requestObject);
        if (i >= 0) {
            this.requestObjects.splice(i, 1);
        }

        clearTimeout(this._expirationTimer);
        // Expire soon (this class only exists to prevent hammering the servers
        // with the same requests).
        this._expirationTimer = setTimeout(this.expire, 3000);
    };

    PendingRequest.prototype.addRequest = function(requestObject) {
        this.requestObjects.push(requestObject);
        if (this._afterSend || this.requestObjects.length > 1) {
            this.callCallbacks(requestObject);
            return;
        }

        // This is a new request.
        processRequest({
            method: requestObject.method,
            url: requestObject.url,
            headers: requestObject.headers,
            payload: requestObject.payload,
            encoding: requestObject.encoding,
            afterSend: function(data) {
                this._afterSend = data;
                this.requestObjects.forEach(this.callCallbacks, this);
            }.bind(this),
            found: function(data) {
                this._found = data;
                // Use .slice() because this.requestObjects is modified during
                // the loop.
                this.requestObjects.slice().forEach(this.callCallbacks, this);
            }.bind(this),
            fail: function(data) {
                this._fail = data;
                this.requestObjects.slice().forEach(this.callCallbacks, this);
            }.bind(this)
        });
    };

    function processRequestWithCache(requestObject) {
        var cacheKey = JSON.stringify([
            requestObject.method || 'GET',
            requestObject.url,
            requestObject.headers || {},
            requestObject.payload,
            requestObject.encoding || ''
        ]);

        PendingRequest.getInstance(cacheKey).addRequest(requestObject);
    }

    return processRequestWithCache;
})();
