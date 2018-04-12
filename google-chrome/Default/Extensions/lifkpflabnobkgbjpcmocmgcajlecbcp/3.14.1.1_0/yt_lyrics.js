/**
 * (c) 2011 - 2016 Rob Wu <rob@robwu.nl>
 * Website: https://robwu.nl/lyricshere/
 * 
 * Milestones:
 *  4 sep 2011 - Initial release of version 1 and 2 branches
 *  8 jan 2013 - Public release of version 3 branch - new features and a modular codebase
 *  9 jan 2013 - Released Safari extension
 * 10 jan 2013 - Released Opera extension
 * 11 jan 2013 - Released Firefox add-on
 *  5 feb 2013 - Published Internet Explorer extension
 * 12 feb 2013 - Grooveshark support (13 Feb: added support for HTML5 and Retro Grooveshark)
 * 15 apr 2013 - Spotify support
 * 18 jul 2013 - Added support for Chromium-based Opera (15)
 *  2 aug 2013 - Jango support
 * 25 oct 2013 - AccuRadio support
 *  2 dec 2013 - Rename "YouTube Lyrics by Rob W" to "Lyrics Here by Rob W"
 * 27 dec 2013 - Started to code-sign Firefox add-on and Internet Explorer extension
 *  7 jan 2014 - IE extension submitted and approved in the Internet Explorer Gallery
 *  8 feb 2014 - Deezer support
 *  8 feb 2014 - 8tracks support
 * 28 feb 2014 - Rdio support
 * 21 apr 2014 - Xbox Music support
 * 26 apr 2014 - Google Music support
 * 18 may 2014 - Released Maxthon extension
 * 21 jul 2014 - iHeartRadio support
 * 21 jul 2014 - Superplayer.fm support
 *  5 sep 2014 - Last.fm support
 * 31 dec 2014 - Yandex Music support
 *  1 jan 2015 - Qobuz support
 * 20 feb 2015 - Songza support
 *  2 mar 2015 - SoundCloud support
 *  2 mar 2015 - Saavn support
 * 17 may 2015 - Drop Grooveshark support
 * 17 may 2015 - Pandora support
 * 30 dec 2015 - Drop Rdio support
 * 30 dec 2015 - Drop Xbox Music support
 * 15 oct 2016 - Bandcamp support
 * 10 jun 2017 - Drop Songza support
 * 15 nov 2017 - Rewrite Firefox add-on with WebExtensions API.
 * 
 * Websites:
 * - https://robwu.nl/lyricshere/
 * - https://chrome.google.com/webstore/detail/lifkpflabnobkgbjpcmocmgcajlecbcp
 * - https://addons.mozilla.org/firefox/addon/youtube-lyrics-by-rob-w/
 * - https://addons.opera.com/en/extensions/details/youtube-lyrics-by-rob-w/
 * - http://www.iegallery.com/Addons/Details/16391
 * - http://extension.maxthon.com/detail/index.php?view_id=2462
 * 
 * Contact:
 * - Rob Wu <rob@robwu.nl>
 * 
 * Distributed in the following forms:
 * - Chrome extension
 * - Firefox add-on
 * - Safari extension
 * - Opera extension
 * - Internet Explorer extension (32 and 64 bits)
 * - Maxthon extension
 * 
 * A full list plus links to the distributed versions can be found at
 * https://robwu.nl/lyricshere/#get-extension
 *
 * Change log:
 * https://robwu.nl/lyricshere/CHANGELOG
 */
!window.hasRun && (window.hasRun = 1) && function() {
    function requestPermission(identifier, optionalPermissions, onPermissionRequestDone) {
        function requestPermissionFallback(error) {
            error && console.warn("chrome.permissions.request unavailable (" + error + "). Falling back to background.");
            port = chrome.runtime.connect({
                name: "requestPermission"
            });
            port.onDisconnect.addListener(function() {
                port = null;
                if (!isCompleted) {
                    isCompleted = !0;
                    onPermissionRequestDone(!1);
                }
            });
            port.onMessage.addListener(function(isGranted) {
                port = null;
                if (!isCompleted) {
                    isCompleted = !0;
                    onPermissionRequestDone(isGranted);
                }
            });
            port.postMessage(identifier);
        }
        if (isValidChromeRuntime()) {
            var port, isCompleted = !1;
            chrome.permissions && "chrome-extension:" !== location.protocol ? chrome.permissions.request(optionalPermissions, function(granted) {
                if (chrome.runtime.lastError) requestPermissionFallback(chrome.runtime.lastError); else if (!isCompleted) {
                    isCompleted = !0;
                    onPermissionRequestDone(granted);
                }
            }) : requestPermissionFallback();
            return {
                cancel: function() {
                    port && port.disconnect && port.disconnect();
                }
            };
        }
        console.warn("Extension runtime is unavailable. Cannot request additional permissions.");
        setTimeout(function() {
            onPermissionRequestDone(!1);
        });
    }
    function hasChromePermission(permissions, callback) {
        if (!isValidChromeRuntime()) {
            console.warn("Extension runtime is unavailable. Cannot check for any optional permissions.");
            setTimeout(function() {
                callback(!1);
            });
        }
        chrome.permissions ? chrome.permissions.contains(permissions, callback) : chrome.runtime.sendMessage({
            containsPermissions: permissions
        }, callback);
    }
    function isValidChromeRuntime() {
        return chrome.runtime && !!chrome.runtime.getManifest();
    }
    var requirejs, require, define;
    (function(e) {
        function p(e, i) {
            return s.call(e, i);
        }
        function a(e, i) {
            var n, r, t, f, u, l, s, c, p, a, g = i && i.split("/"), d = o.map, h = d && d["*"] || {};
            if (e && "." === e.charAt(0)) if (i) {
                g = g.slice(0, g.length - 1);
                e = g.concat(e.split("/"));
                for (c = 0; e.length > c; c += 1) {
                    a = e[c];
                    if ("." === a) {
                        e.splice(c, 1);
                        c -= 1;
                    } else if (".." === a) {
                        if (1 === c && (".." === e[2] || ".." === e[0])) break;
                        if (c > 0) {
                            e.splice(c - 1, 2);
                            c -= 2;
                        }
                    }
                }
                e = e.join("/");
            } else 0 === e.indexOf("./") && (e = e.substring(2));
            if ((g || h) && d) {
                n = e.split("/");
                for (c = n.length; c > 0; c -= 1) {
                    r = n.slice(0, c).join("/");
                    if (g) for (p = g.length; p > 0; p -= 1) {
                        t = d[g.slice(0, p).join("/")];
                        if (t) {
                            t = t[r];
                            if (t) {
                                f = t;
                                u = c;
                                break;
                            }
                        }
                    }
                    if (f) break;
                    if (!l && h && h[r]) {
                        l = h[r];
                        s = c;
                    }
                }
                if (!f && l) {
                    f = l;
                    u = s;
                }
                if (f) {
                    n.splice(0, u, f);
                    e = n.join("/");
                }
            }
            return e;
        }
        function g(i, r) {
            return function() {
                return n.apply(e, c.call(arguments, 0).concat([ i, r ]));
            };
        }
        function d(e) {
            return function(i) {
                return a(i, e);
            };
        }
        function h(e) {
            return function(i) {
                f[e] = i;
            };
        }
        function m(n) {
            if (p(u, n)) {
                var r = u[n];
                delete u[n];
                l[n] = !0;
                i.apply(e, r);
            }
            if (!p(f, n) && !p(l, n)) throw Error("No " + n);
            return f[n];
        }
        function x(e) {
            var i, n = e ? e.indexOf("!") : -1;
            if (n > -1) {
                i = e.substring(0, n);
                e = e.substring(n + 1, e.length);
            }
            return [ i, e ];
        }
        function y(e) {
            return function() {
                return o && o.config && o.config[e] || {};
            };
        }
        var i, n, r, t, f = {}, u = {}, o = {}, l = {}, s = Object.prototype.hasOwnProperty, c = [].slice;
        r = function(e, i) {
            var n, r = x(e), t = r[0];
            e = r[1];
            if (t) {
                t = a(t, i);
                n = m(t);
            }
            if (t) e = n && n.normalize ? n.normalize(e, d(i)) : a(e, i); else {
                e = a(e, i);
                r = x(e);
                t = r[0];
                e = r[1];
                t && (n = m(t));
            }
            return {
                f: t ? t + "!" + e : e,
                n: e,
                pr: t,
                p: n
            };
        };
        t = {
            require: function(e) {
                return g(e);
            },
            exports: function(e) {
                var i = f[e];
                return i !== void 0 ? i : f[e] = {};
            },
            module: function(e) {
                return {
                    id: e,
                    uri: "",
                    exports: f[e],
                    config: y(e)
                };
            }
        };
        i = function(i, n, o, s) {
            var c, a, d, x, y, q, j = [];
            s = s || i;
            if ("function" == typeof o) {
                n = !n.length && o.length ? [ "require", "exports", "module" ] : n;
                for (y = 0; n.length > y; y += 1) {
                    x = r(n[y], s);
                    a = x.f;
                    if ("require" === a) j[y] = t.require(i); else if ("exports" === a) {
                        j[y] = t.exports(i);
                        q = !0;
                    } else if ("module" === a) c = j[y] = t.module(i); else if (p(f, a) || p(u, a) || p(l, a)) j[y] = m(a); else {
                        if (!x.p) throw Error(i + " missing " + a);
                        x.p.load(x.n, g(s, !0), h(a), {});
                        j[y] = f[a];
                    }
                }
                d = o.apply(f[i], j);
                i && (c && c.exports !== e && c.exports !== f[i] ? f[i] = c.exports : d === e && q || (f[i] = d));
            } else i && (f[i] = o);
        };
        requirejs = require = n = function(f, u, l, s, c) {
            if ("string" == typeof f) return t[f] ? t[f](u) : m(r(f, u).f);
            if (!f.splice) {
                o = f;
                if (u.splice) {
                    f = u;
                    u = l;
                    l = null;
                } else f = e;
            }
            u = u || function() {};
            if ("function" == typeof l) {
                l = s;
                s = c;
            }
            s ? i(e, f, u, l) : setTimeout(function() {
                i(e, f, u, l);
            }, 15);
            return n;
        };
        n.config = function(e) {
            o = e;
            return n;
        };
        define = function(e, i, n) {
            if (!i.splice) {
                n = i;
                i = [];
            }
            p(f, e) || p(u, e) || (u[e] = [ e, i, n ]);
        };
        define.amd = {
            jQuery: !0
        };
    })();
    define("config-chrome", [], function() {
        var config = {}, storageArea = chrome.storage.local, cache = {};
        config.getItem = function(key, callback) {
            isValidChromeRuntime() ? storageArea.get(key, function(items) {
                cache[key] = items[key];
                callback(items[key]);
            }) : setTimeout(function() {
                callback(cache[key] && JSON.parse(JSON.stringify(cache[key])));
            });
        };
        config.setItem = function(key, value, callback) {
            cache[key] = JSON.parse(JSON.stringify(value));
            if (isValidChromeRuntime()) {
                var data = {};
                data[key] = value;
                storageArea.set(data, function() {
                    callback(!chrome.runtime.lastError);
                });
            } else setTimeout(function() {
                callback(!1);
            });
        };
        config.removeItem = function(key, callback) {
            delete cache[key];
            isValidChromeRuntime() ? storageArea.remove(key, function() {
                callback(!chrome.runtime.lastError);
            }) : setTimeout(function() {
                callback(!1);
            });
        };
        config.clear = function(callback) {
            cache = {};
            isValidChromeRuntime() ? storageArea.clear(function() {
                callback(!chrome.runtime.lastError);
            }) : setTimeout(function() {
                callback(!1);
            });
        };
        config.init = function() {};
        return config;
    });
    define("config", [ "config-chrome" ], function(config) {
        config.init();
        return config;
    });
    define("processRequest-xhr", [ "require", "exports", "module" ], function(require, exports) {
        function processRequest(requestObject) {
            var url = requestObject.url, x = new XMLHttpRequest(), returnValue = {
                url: url,
                abort: function() {
                    if (x) {
                        returnValue.abort = NOOP;
                        x.abort();
                        x = null;
                    }
                }
            };
            x.open(requestObject.method || "GET", url, !0);
            if (requestObject.headers) for (var headerNames = Object.keys(requestObject.headers), i = 0; headerNames.length > i; i++) {
                var headerName = headerNames[i];
                if (_hasOwnProperty.call(requestObject.headers, headerName)) {
                    var headerValue = requestObject.headers[headerName];
                    x.setRequestHeader(headerName, headerValue);
                }
            }
            x.onload = function() {
                if (returnValue.abort !== NOOP) {
                    var status = x.status, responseText = x.responseText;
                    returnValue.abort = NOOP;
                    x = null;
                    status >= 200 && 300 > status || 304 === status ? requestObject.found({
                        url: url,
                        responseText: responseText
                    }) : requestObject.fail({
                        url: url
                    });
                }
            };
            x.onerror = function() {
                if (returnValue.abort !== NOOP) {
                    returnValue.abort = NOOP;
                    x = null;
                    requestObject.fail({
                        url: url
                    });
                }
            };
            requestObject.encoding && x.overrideMimeType("text/plain;charset=" + requestObject.encoding);
            try {
                x.send(requestObject.payload);
            } catch (e) {
                "undefined" != typeof console && console && console.error && console.error(e.message);
                requestObject.fail({
                    url: url
                });
            }
            x && requestObject.afterSend(returnValue);
        }
        var _hasOwnProperty = Object.prototype.hasOwnProperty, NOOP = function() {};
        exports.processRequest = processRequest;
    });
    define("SimpleTemplating", [ "require", "exports", "module" ], function(require, exports) {
        function SimpleTemplating(template) {
            if (!(this instanceof SimpleTemplating)) return new SimpleTemplating(template);
            this.useTemplate(template);
            return void 0;
        }
        function transferExpandoProperty(node, node_properties, expando) {
            var expando_name = /^on(.+)$/.exec(expando);
            if (expando_name) {
                var eventName = expando_name[1], prefixed_eventName = "data-robw-" + eventName, oldEventListener = node[prefixed_eventName], newEventListener = node_properties[expando];
                if (oldEventListener) {
                    node.removeEventListener(eventName, oldEventListener, !1);
                    delete node[prefixed_eventName];
                }
                if ("function" == typeof newEventListener) {
                    node.addEventListener(eventName, newEventListener, !1);
                    node[prefixed_eventName] = newEventListener;
                }
            } else node[expando] = node_properties[expando];
        }
        var _debug = function(method, type, message) {
            console && console.log(method + ": " + message);
        }, _error = function(method, type, error) {
            var e = Error(method + ": " + error);
            e.type = type;
            throw e;
        };
        SimpleTemplating.prototype.useTemplate = function(template) {
            var tagName = template.tagName;
            if (tagName && template.cloneNode) {
                this.element = template;
                return this;
            }
            tagName || (tagName = "div");
            var element = document.createElement(tagName);
            Object.keys(template).forEach(function(expando) {
                "tagName" !== expando && (element[expando] = template[expando]);
            });
            this.element = element;
            return this;
        };
        SimpleTemplating.prototype.getElement = function() {
            this.element || _error("SimpleTemplating::getElement", "invalid_state", "Cannot use getElement() before an element has been defined! Construct the base element using useTemplate(template)");
            return this.element;
        };
        SimpleTemplating.prototype.update = function(properties) {
            var rootNode = this.getElement();
            Object.keys(properties).forEach(function(selector) {
                var nodes = rootNode.querySelectorAll(selector);
                if (nodes.length) for (var node_properties = properties[selector], _pre = node_properties._pre, _post = node_properties._post, i = nodes.length - 1; i >= 0; --i) {
                    var node = nodes[i], data = {};
                    "function" == typeof _pre && _pre(node, data);
                    for (var expando_properties = Object.keys(node_properties), j = 0; expando_properties.length > j; ++j) {
                        var expando = expando_properties[j];
                        "_pre" !== expando && "_post" !== expando && transferExpandoProperty(node, node_properties, expando);
                    }
                    "function" == typeof _post && _post(node, data);
                } else _debug("SimpleTemplating::update", "no_nodes", "No matching nodes found for " + selector);
            });
            return this;
        };
        exports.SimpleTemplating = SimpleTemplating;
    });
    define("processRequest-chrome", [ "require", "exports", "module", "processRequest-xhr", "SimpleTemplating" ], function(require, exports) {
        function processRequest(requestObject) {
            function initiateRequest() {
                port.postMessage({
                    type: "request",
                    requestObject: {
                        method: requestObject.method,
                        url: requestObject.url,
                        headers: requestObject.headers,
                        payload: requestObject.payload,
                        encoding: requestObject.encoding
                    }
                });
            }
            if (isValidChromeRuntime()) {
                var permissionRequest, url = requestObject.url, aborted = !1, receivedReply = !1, receivedFailOrFound = !1, port = chrome.runtime.connect({
                    name: "processRequest"
                });
                port.onDisconnect.addListener(function() {
                    port = null;
                    permissionRequest && permissionRequest.cancel();
                    receivedReply ? receivedFailOrFound || requestObject.fail({
                        url: url
                    }) : processRequestXHR(requestObject);
                });
                var abort = function() {
                    aborted = !0;
                    port && port.disconnect && port.disconnect();
                    permissionRequest && permissionRequest.cancel();
                };
                port.onMessage.addListener(function(message) {
                    receivedReply = !0;
                    if (!aborted && message) switch (message.type) {
                      case "afterSend":
                        requestObject.afterSend({
                            url: url,
                            abort: abort
                        });
                        break;

                      case "fail":
                      case "found":
                        receivedFailOrFound = !0;
                        requestObject[message.type](message.data);
                        break;

                      default:
                        if ("requestPermissionEarlyGrant" === message.type) {
                            permissionRequest && permissionRequest.cancel();
                            !aborted && port && initiateRequest();
                            return;
                        }
                        "requestPermission" === message.type && requestObject.afterSend({
                            url: url,
                            abort: abort,
                            _chrome_only_render_permission_request: function(node, realSourceIdentifier) {
                                function onPermissionRequestDone(isGranted) {
                                    if (isGranted) {
                                        SimpleTemplating(node).update({
                                            ".L759-b-yes": {
                                                textContent: "Permission granted!",
                                                disabled: !0
                                            },
                                            ".L759-b-no": {
                                                disabled: !0
                                            }
                                        });
                                        aborted || !port ? processRequest(requestObject) : initiateRequest();
                                    } else SimpleTemplating(node).update({
                                        ".L759-permission-description": {
                                            textContent: "Permission not granted. Do you want to try again?"
                                        }
                                    });
                                }
                                node.innerHTML = '<div class="L759-permission-description">Cannot read from <span class="L759-chrome-permission-identifier"></span>.<br>Do you want to see lyrics from this source?</div><button class="L759-b-yes">Yes, add permission</button><button class="L759-b-always" title="Allow the extension to read lyrics from every known site.">Yes, always</button><button class="L759-b-no" title="Skip source">No</button><button class="L759-b-never" title="Skip source and never ask again for this site">Never</button>';
                                SimpleTemplating(node).update({
                                    ".L759-chrome-permission-identifier": {
                                        textContent: message.sourceIdentifier
                                    },
                                    ".L759-b-yes": {
                                        title: "Allows Lyrics Here to read lyrics from " + message.sourceIdentifier,
                                        onclick: function() {
                                            permissionRequest && permissionRequest.cancel();
                                            permissionRequest = requestPermission(message.sourceIdentifier, message.chromePermissions, onPermissionRequestDone);
                                        }
                                    },
                                    ".L759-b-always": {
                                        title: "Allows Lyrics Here to read lyrics from all known lyrics and music sites",
                                        onclick: function() {
                                            permissionRequest && permissionRequest.cancel();
                                            isValidChromeRuntime() ? chrome.runtime.sendMessage("getAllLyricsPermissions", function(permissions) {
                                                permissionRequest && permissionRequest.cancel();
                                                permissionRequest = requestPermission("all-lyrics", permissions, onPermissionRequestDone);
                                            }) : console.warn("Extension runtime unavailable, cannot request any permissions. Reload the page and try again.");
                                        }
                                    },
                                    ".L759-b-no": {
                                        onclick: function() {
                                            permissionRequest && permissionRequest.cancel();
                                            requestObject.fail({
                                                url: url
                                            });
                                        }
                                    },
                                    ".L759-b-never": {
                                        _post: function(node) {
                                            (message.sourceIdentifier !== realSourceIdentifier || message.cannotBeDisabled) && (node.style.display = "none");
                                        },
                                        onclick: function() {
                                            permissionRequest && permissionRequest.cancel();
                                            requestObject.fail({
                                                _chrome_only_blocked_identifier: message.sourceIdentifier,
                                                url: url
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                initiateRequest();
            } else processRequestXHR(requestObject);
        }
        var processRequestXHR = require("processRequest-xhr").processRequest, SimpleTemplating = require("SimpleTemplating").SimpleTemplating;
        exports.processRequest = processRequest;
    });
    define("processRequest", [ "processRequest-chrome" ], function(exports) {
        return exports;
    });
    define("ScrapedSource", [ "require", "exports", "module" ], function(require, exports) {
        function ScrapedSource(options) {
            if (this instanceof ScrapedSource) {
                this.parseOptions(options);
                this.validate();
            } else _error("ScrapedSource", "invalid_constructor_call", 'Constructor cannot be called as a function. Use "new ScrapedSource(options)" instead of "ScrapedSource(options)"');
        }
        var _error = function(method, type, error) {
            var e = Error(method + ": " + error);
            e.type = type;
            throw e;
        }, _regexp_url_param = /^\$[A-Za-z]+$/, _regexp_url_param_matcher_g = /\$\{([A-Za-z]+)\}|\$([A-Za-z]+)/g;
        ScrapedSource.Scheme = {
            identifier: "string",
            disabled: [ "undefined", "boolean" ],
            r_url_result: [ "regexp" ],
            result_charset: [ "undefined", "string" ],
            url_result: [ "string", "function" ],
            method_result: [ "undefined", "string" ],
            payload_result: [ "undefined", "string", "function" ],
            headers_result: [ "undefined", "object", "function" ],
            process_result: "function",
            url_search: [ "string", "function" ],
            method_search: [ "undefined", "string" ],
            payload_search: [ "undefined", "string", "function" ],
            headers_search: [ "undefined", "object", "function" ],
            process_search: "function"
        };
        ScrapedSource.StrictScheme = !1;
        ScrapedSource.prototype.disabled = !1;
        ScrapedSource.prototype.validate = function() {
            var scrapedSource = this;
            return Object.keys(this.constructor.Scheme).every(function(key) {
                return scrapedSource.validateKey(key, scrapedSource[key]);
            });
        };
        ScrapedSource.prototype.validateKey = function(key, value) {
            if (!this.constructor || !this.constructor.Scheme) {
                _error("ScrapedSource::validateKey", "scheme_not_found", 'The caller\'s constructor must have a property "Scheme"!');
                return !1;
            }
            var type = this.constructor.Scheme[key];
            if (!type) {
                if (!_regexp_url_param.test(key)) {
                    if (this.constructor.StrictScheme) {
                        _error("ScrapedSource::validateKey", "unknown_key", "Unknown key " + key + ", forbidden by strict scheme!");
                        return !1;
                    }
                    return !0;
                }
                type = "function";
            }
            Array.isArray(type) || (type = [ type ]);
            var actual_type = typeof value;
            value && (value.test && value.exec ? actual_type = "regexp" : Array.isArray(value) && (actual_type = "array"));
            if (-1 === type.indexOf(actual_type)) {
                _error("ScrapedSource::validateKey", "type_mismatch", 'typeof "' + key + '" must be "' + type + '"! Actual type: "' + actual_type + '"');
                return !1;
            }
            return !0;
        };
        ScrapedSource.prototype.parseOptions = function(options) {
            if ("object" != typeof options) {
                _error("ScrapedSource::parseOptions", "type_mismatch", "Argument options is required and must be an object!");
                return !1;
            }
            var scrapedSource = this;
            return Object.keys(options).every(function(key) {
                var isValid = scrapedSource.validateKey(key, options[key]);
                isValid && (scrapedSource[key] = options[key]);
                return isValid;
            });
        };
        ScrapedSource.prototype.get_url = function(type, query) {
            var scrapedSource = this, url = scrapedSource["url_" + type];
            if ("function" == typeof url) {
                url = url.call(scrapedSource, query);
                "string" != typeof url && _error("ScrapedSource::get_url", "type_mismatch", "url_" + type + " dit not return a string.");
                return url;
            }
            "string" != typeof url && _error("ScrapedSource::get_url", "type_mismatch", "url_" + type + " is not a string.");
            return scrapedSource.expand_vars(url, query);
        };
        ScrapedSource.prototype.expand_vars = function(url, query) {
            var scrapedSource = this, isAllParametersResolved = !0;
            url = url.replace(_regexp_url_param_matcher_g, function(full_match, key, key2) {
                key = "$" + (key || key2);
                if ("function" == typeof scrapedSource[key]) return scrapedSource[key](query);
                _error("ScrapedSource::expand_vars", "invalid_parameter", "No function found for " + key);
                isAllParametersResolved = !1;
            });
            return isAllParametersResolved ? url : null;
        };
        ScrapedSource.prototype.getMethod = function(type) {
            var method = this["method_" + type];
            return "string" == typeof method ? method : null;
        };
        ScrapedSource.prototype.getHeaders = function(type, query) {
            var scrapedSource = this, headers = scrapedSource["headers_" + type];
            "function" == typeof headers && (headers = headers.call(scrapedSource, query));
            return !headers || "object" != typeof headers || headers instanceof Array ? null : headers;
        };
        ScrapedSource.prototype.getPayload = function(type, query) {
            var scrapedSource = this, payload = scrapedSource["payload_" + type];
            "function" == typeof payload && (payload = payload.call(scrapedSource, query));
            if ("string" != typeof payload) return null;
            var isAllParametersResolved = !0;
            payload = payload.replace(_regexp_url_param_matcher_g, function(full_match, key, key2) {
                key = "$" + (key || key2);
                if ("function" == typeof scrapedSource[key]) return scrapedSource[key](query);
                _error("ScrapedSource::getPayload", "invalid_parameter", "No function found for " + key);
                isAllParametersResolved = !1;
            });
            return isAllParametersResolved ? payload : null;
        };
        ScrapedSource.prototype.getEncoding = function(url) {
            return this.result_encoding && this.r_url_result.test(url) ? this.result_encoding : void 0;
        };
        exports.ScrapedSource = ScrapedSource;
    });
    define("InfoProvider", [ "require", "exports", "module", "processRequest", "ScrapedSource" ], function(require, exports) {
        function InfoProvider(sources) {
            this.parseSources(sources);
        }
        var processRequest = require("processRequest").processRequest, ScrapedSource = require("ScrapedSource").ScrapedSource, _hasOwnProperty = Object.prototype.hasOwnProperty, _error = function(method, type, error) {
            var e = Error(method + ": " + error);
            e.type = type;
            throw e;
        }, _extend = function(target, source) {
            if (source) {
                for (var key in source) _hasOwnProperty.call(source, key) && (target[key] = source[key]);
                return target;
            }
        }, _bind = function(fn, context) {
            var args = [].slice.call(arguments, 2);
            return function() {
                return fn.apply(context, args);
            };
        };
        InfoProvider.prototype.parseSources = function(sources) {
            if (sources instanceof Array) {
                var infoProvider_sources = [];
                sources.forEach(function(source, index) {
                    source instanceof ScrapedSource ? infoProvider_sources.push(source) : _error("InfoProvider::parseSources", "type_mismatch", "Source " + index + " is not a ScrapedSource instance!");
                });
                this.sources = infoProvider_sources;
                this.sourceCount = sources.length;
            } else _error("InfoProvider::parseSources", "type_mismatch", "The only argument must be an array of ScrapedSource instances!");
        };
        InfoProvider.prototype.query = function(type, query, callback, sourceIndex) {
            function _processURL(result, tempData) {
                if (++_redirectCount > 7) {
                    callCallbackFail();
                    _error("InfoProvider::query:_processURL", "redirect_loop", "Too many redirects");
                } else {
                    if (result.redirSource && result.redirSource instanceof ScrapedSource) {
                        source = result.redirSource;
                        resultObject.sourceIdentifier = source.identifier;
                    }
                    processRequest({
                        url: result.redir,
                        afterSend: callCallbackFetching,
                        fail: callCallbackFail,
                        found: function(result) {
                            result.tempData = tempData;
                            _process_result_after_Request(result);
                        },
                        method: result.method,
                        headers: result.headers,
                        payload: result.payload,
                        encoding: source.getEncoding(result.redir)
                    });
                }
            }
            function _process_result_after_Request(responseObject) {
                resultObject.url = responseObject.url;
                source.process_result(responseObject.responseText, {
                    fail: callCallbackFail,
                    found: function(result) {
                        result.redir ? _processURL(result, result.tempData) : callCallbackFound(result);
                    }
                }, {
                    url: responseObject.url,
                    query: query,
                    tempData: responseObject.tempData
                });
            }
            function _process_search_after_Request(responseObject) {
                resultObject.url = responseObject.redir || responseObject.url;
                source.process_search(responseObject.responseText, {
                    fail: callCallbackFail,
                    found: _processURL
                }, {
                    url: responseObject.url,
                    query: query,
                    tempData: responseObject.tempData
                });
            }
            var _this = this;
            _this.abort();
            if ("function" == typeof callback && query && type) {
                var source;
                if (("number" != typeof sourceIndex || isNaN(sourceIndex) || -1 == sourceIndex) && query.source instanceof ScrapedSource) {
                    sourceIndex = -1;
                    source = query.source;
                } else {
                    sourceIndex = +sourceIndex || 0;
                    source = _this.sources[sourceIndex];
                }
                var hasRun = !1, lastTimeAborted = _this.lastTimeAborted, original_query = _extend({}, query), resultObject = {
                    sourceIndex: sourceIndex,
                    sourceCount: _this.sourceCount,
                    sourceIdentifier: "<unknown>",
                    searchTerms: query.searchTerms,
                    url: "",
                    retry: _bind(_this.query, _this, type, original_query, callback, sourceIndex),
                    query: query,
                    abort: null
                };
                _this.sourceCount > sourceIndex + 1 ? resultObject.next = _bind(_this.query, _this, type, original_query, callback, sourceIndex + 1) : resultObject.restart = _bind(_this.query, _this, type, original_query, callback);
                var _callCallback = function(type, response, hasRunFlag) {
                    if (!hasRun && _this.lastTimeAborted === lastTimeAborted) {
                        hasRun = hasRunFlag;
                        var finalResultObject = {};
                        _extend(finalResultObject, resultObject);
                        _extend(finalResultObject, response);
                        finalResultObject.type = type;
                        callback(finalResultObject);
                    }
                }, callCallbackFail = function(response) {
                    _callCallback("fail", response, !0);
                }, callCallbackFound = function(response) {
                    _callCallback("found", response, !0);
                }, callCallbackFetching = function(response) {
                    _this._abort = response.abort;
                    _callCallback("fetching", response, !1);
                };
                if (source) {
                    source.$SEARCHTERMS && (resultObject.searchTerms = source.$SEARCHTERMS(query));
                    var url;
                    if (-1 == sourceIndex && query.sourceResultUrl) {
                        type = "result";
                        url = query.sourceResultUrl;
                    } else url = source.get_url(type, query);
                    resultObject.url = url;
                    resultObject.sourceIdentifier = source.identifier;
                    if (url) {
                        var _redirectCount = 0;
                        processRequest({
                            url: url,
                            afterSend: callCallbackFetching,
                            fail: callCallbackFail,
                            found: function(responseObject) {
                                hasRun || ("search" === type ? _process_search_after_Request(responseObject) : _process_result_after_Request(responseObject));
                            },
                            method: source.getMethod(type, query),
                            headers: source.getHeaders(type, query),
                            payload: source.getPayload(type, query),
                            encoding: source.getEncoding(url)
                        });
                    } else callCallbackFail();
                } else callCallbackFail();
            } else _error("InfoProvider::query", "invalid_args", "Usage: function( String type, object query, function callback(result) )");
        };
        InfoProvider.prototype.lastTimeAborted = 0;
        InfoProvider.prototype.abort = function() {
            this.lastTimeAborted++;
            var abort = this._abort;
            if (abort) {
                this._abort = null;
                abort();
            }
        };
        exports.InfoProvider = InfoProvider;
    });
    define("normalize_accents", [ "require", "exports", "module" ], function(require, exports) {
        var _hasOwnProperty = Object.prototype.hasOwnProperty, dictionary = {
            a: [ "ª", "à", "á", "â", "ã", "ä", "å", "ā", "ă", "ą", "ǎ", "ȁ", "ȃ", "ȧ", "ᵃ", "ḁ", "ẚ", "ạ", "ả", "ₐ", "ａ" ],
            A: [ "À", "Á", "Â", "Ã", "Ä", "Å", "Ā", "Ă", "Ą", "Ǎ", "Ȁ", "Ȃ", "Ȧ", "ᴬ", "Ḁ", "Ạ", "Ả", "Ａ" ],
            b: [ "ᵇ", "ḃ", "ḅ", "ḇ", "ｂ" ],
            B: [ "ᴮ", "Ḃ", "Ḅ", "Ḇ", "Ｂ" ],
            c: [ "ç", "ć", "ĉ", "ċ", "č", "ᶜ", "ⅽ", "ｃ" ],
            C: [ "Ç", "Ć", "Ĉ", "Ċ", "Č", "Ⅽ", "Ｃ" ],
            d: [ "ď", "ᵈ", "ḋ", "ḍ", "ḏ", "ḑ", "ḓ", "ⅾ", "ｄ" ],
            D: [ "Ď", "ᴰ", "Ḋ", "Ḍ", "Ḏ", "Ḑ", "Ḓ", "Ⅾ", "Ｄ" ],
            e: [ "è", "é", "ê", "ë", "ē", "ĕ", "ė", "ę", "ě", "ȅ", "ȇ", "ȩ", "ᵉ", "ḙ", "ḛ", "ẹ", "ẻ", "ẽ", "ₑ", "ｅ" ],
            E: [ "È", "É", "Ê", "Ë", "Ē", "Ĕ", "Ė", "Ę", "Ě", "Ȅ", "Ȇ", "Ȩ", "ᴱ", "Ḙ", "Ḛ", "Ẹ", "Ẻ", "Ẽ", "Ｅ" ],
            f: [ "ᶠ", "ḟ", "ｆ" ],
            F: [ "Ḟ", "℉", "Ｆ" ],
            g: [ "ĝ", "ğ", "ġ", "ģ", "ǧ", "ǵ", "ᵍ", "ḡ", "ｇ" ],
            G: [ "Ĝ", "Ğ", "Ġ", "Ģ", "Ǧ", "Ǵ", "ᴳ", "Ḡ", "Ｇ" ],
            h: [ "ĥ", "ȟ", "ʰ", "ḣ", "ḥ", "ḧ", "ḩ", "ḫ", "ẖ", "ℎ", "ｈ" ],
            H: [ "Ĥ", "Ȟ", "ᴴ", "Ḣ", "Ḥ", "Ḧ", "Ḩ", "Ḫ", "Ｈ" ],
            i: [ "ì", "í", "î", "ï", "ĩ", "ī", "ĭ", "į", "ǐ", "ȉ", "ȋ", "ᵢ", "ḭ", "ỉ", "ị", "ⁱ", "ｉ" ],
            I: [ "Ì", "Í", "Î", "Ï", "Ĩ", "Ī", "Ĭ", "Į", "İ", "Ǐ", "Ȉ", "Ȋ", "ᴵ", "Ḭ", "Ỉ", "Ị", "Ｉ" ],
            j: [ "ĵ", "ǰ", "ʲ", "ｊ" ],
            J: [ "Ĵ", "ᴶ", "Ｊ" ],
            k: [ "ķ", "ǩ", "ᵏ", "ḱ", "ḳ", "ḵ", "ｋ" ],
            K: [ "Ķ", "Ǩ", "ᴷ", "Ḱ", "Ḳ", "Ḵ", "K", "Ｋ" ],
            l: [ "ĺ", "ļ", "ľ", "ˡ", "ŀ", "ḷ", "ḻ", "ḽ", "ⅼ", "ｌ" ],
            L: [ "Ĺ", "Ļ", "Ľ", "ᴸ", "Ḷ", "Ḻ", "Ḽ", "Ⅼ", "Ｌ" ],
            m: [ "ᵐ", "ḿ", "ṁ", "ṃ", "ⅿ", "ｍ" ],
            M: [ "ᴹ", "Ḿ", "Ṁ", "Ṃ", "Ⅿ", "Ｍ" ],
            n: [ "ñ", "ń", "ņ", "ň", "ŉ", "ṅ", "ṇ", "ṉ", "ṋ", "ｎ" ],
            N: [ "Ñ", "Ń", "Ņ", "Ň", "ᴺ", "Ṅ", "Ṇ", "Ṉ", "Ṋ", "Ｎ" ],
            o: [ "º", "ò", "ó", "ô", "õ", "ö", "ō", "ŏ", "ő", "ǒ", "ǫ", "ȍ", "ȏ", "ȯ", "ᵒ", "ọ", "ỏ", "ｏ" ],
            O: [ "Ò", "Ó", "Ô", "Ö", "Õ", "Ō", "Ŏ", "Ő", "Ǒ", "Ǫ", "Ȍ", "Ȏ", "Ȯ", "ᴼ", "Ọ", "Ỏ", "Ｏ" ],
            p: [ "ᵖ", "ṕ", "ṗ", "ｐ" ],
            P: [ "ᴾ", "Ṕ", "Ṗ", "Ｐ" ],
            q: [ "ｑ" ],
            Q: [ "Ｑ" ],
            r: [ "ŕ", "ŗ", "ř", "ȑ", "ȓ", "ʳ", "ᵣ", "ṙ", "Ṛ", "ṛ", "ṟ", "ｒ" ],
            R: [ "Ŕ", "Ŗ", "Ř", "Ȑ", "Ȓ", "ᴿ", "Ṙ", "Ṟ", "Ｒ" ],
            s: [ "ś", "ŝ", "ş", "š", "ș", "ṡ", "ṣ", "ｓ" ],
            S: [ "Ś", "Ŝ", "Ş", "Š", "Ș", "Ṡ", "Ṣ", "Ｓ" ],
            t: [ "ţ", "ť", "ț", "ᵗ", "ṫ", "ṭ", "ṯ", "ṱ", "ẗ", "ｔ" ],
            T: [ "Ţ", "Ť", "Ț", "ᵀ", "Ṫ", "Ṭ", "Ṯ", "Ṱ", "Ｔ" ],
            u: [ "ù", "ú", "û", "ü", "ũ", "ū", "ŭ", "ů", "ű", "ư", "ǔ", "ȕ", "ȗ", "ᵘ", "ᵤ", "ṳ", "ṵ", "ṷ", "ụ", "ủ", "ｕ" ],
            U: [ "Ù", "Ú", "Ü", "Û", "Ũ", "Ū", "Ŭ", "Ů", "Ű", "Ų", "Ư", "Ǔ", "Ȕ", "Ȗ", "ᵁ", "Ṳ", "Ṵ", "Ṷ", "Ụ", "Ủ", "Ｕ" ],
            v: [ "ṽ", "ṿ", "ᵛ", "ᵥ", "ｖ" ],
            V: [ "Ṽ", "Ṿ", "ⱽ", "Ｖ" ],
            w: [ "ŵ", "ʷ", "ẁ", "ẃ", "ẅ", "ẇ", "ẉ", "ẘ", "ｗ" ],
            W: [ "Ŵ", "ᵂ", "Ẁ", "Ẃ", "Ẅ", "Ẇ", "Ẉ", "Ｗ" ],
            x: [ "ˣ", "ẋ", "ẍ", "ₓ", "ｘ" ],
            X: [ "Ẋ", "Ẍ", "Ｘ" ],
            y: [ "ý", "ÿ", "ŷ", "ȳ", "ʸ", "ẏ", "ẙ", "ỳ", "ỵ", "ỷ", "ỹ", "ｙ" ],
            Y: [ "Ý", "Ŷ", "Ÿ", "Ȳ", "Ẏ", "Ỳ", "Ỵ", "Ỷ", "Ỹ", "Ｙ" ],
            z: [ "ź", "ż", "ž", "ẑ", "ẓ", "ẕ", "ｚ" ],
            Z: [ "Ź", "Ż", "Ž", "Ẑ", "Ẓ", "Ẕ", "Ｚ" ]
        }, map = {}, pattern = "";
        for (var oneChar in dictionary) if (_hasOwnProperty.call(dictionary, oneChar)) for (var chars = dictionary[oneChar], i = 0; chars.length > i; i++) {
            map[chars[i]] = oneChar;
            pattern += chars[i];
        }
        pattern = RegExp("[" + pattern + "]", "gi");
        exports.normalize_accents = function(string) {
            return string ? string.replace(pattern, function(oneChar) {
                return _hasOwnProperty.call(map, oneChar) ? map[oneChar] : oneChar;
            }) : string;
        };
    });
    define("sources/shared", {
        searchProviders: {},
        lyricsSources: [],
        lastAnnouncement: 0
    });
    define("SearchEngineRules", [ "require", "exports", "module" ], function(require, exports) {
        function normalizeSite(site) {
            site = site.split("/", 1)[0];
            return "www.plyrics.com" === site ? "plyrics.com" : "en.touhouwiki.net" === site ? "touhouwiki.net" : "www.siamzone.com" === site ? "siamzone.com" : "myhindilyrics.com" === site ? "hindilyrics.net" : site;
        }
        function canUseSearchEngine(searchProviderIdentifier, site) {
            return site && SearchRules[searchProviderIdentifier][site] || ALWAYS;
        }
        var ALWAYS = "ALWAYS", MAYBE = "MAYBE", NEVER = "NEVER", SearchRules = {};
        SearchRules.bing = {
            "plyrics.com": NEVER,
            "lyrics.my": NEVER,
            "newreleasetoday.com": NEVER,
            "supermusic.sk": NEVER,
            "touhouwiki.net": NEVER,
            "siamzone.com": MAYBE,
            "teksteshqip.com": MAYBE
        };
        SearchRules.google = {};
        SearchRules.yahoo = SearchRules.bing;
        SearchRules.duckduckgo = {
            "newreleasetoday.com": MAYBE,
            "supermusic.sk": NEVER,
            "siamzone.com": MAYBE
        };
        SearchRules.qwant = {
            "plyrics.com": NEVER,
            "lyrics.my": NEVER,
            "newreleasetoday.com": NEVER,
            "supermusic.sk": NEVER,
            "touhouwiki.net": NEVER,
            "siamzone.com": NEVER,
            "teksteshqip.com": MAYBE
        };
        SearchRules.startpage = SearchRules.ixquick = {
            "songmeanings.com": MAYBE,
            "songteksten.nl": MAYBE,
            "guitarparty.com": MAYBE,
            "lyrics.my": NEVER,
            "hindilyrics.net": NEVER,
            "newreleasetoday.com": NEVER,
            "tekstove.info": MAYBE,
            "tamillyrics.hosuronline.com": NEVER,
            "kpoplyrics.net": NEVER,
            "gasazip.com": NEVER,
            "sarki.alternatifim.com": NEVER,
            "sing365.com": NEVER,
            "touhouwiki.net": NEVER,
            "cmtv.com.ar": NEVER,
            "flashlyrics.com": MAYBE,
            "teksteshqip.com": MAYBE
        };
        SearchRules.ixquickeu = {
            "vagalume.com.br": NEVER,
            "songteksten.nl": MAYBE,
            "hindilyrics.net": NEVER,
            "supermusic.sk": NEVER,
            "siamzone.com": NEVER,
            "coveralia.com": NEVER
        };
        exports.ALWAYS = ALWAYS;
        exports.MAYBE = MAYBE;
        exports.NEVER = NEVER;
        exports.normalizeSite = normalizeSite;
        exports.canUseSearchEngine = canUseSearchEngine;
    });
    define("SourceScraperUtils", [ "require", "exports", "module", "normalize_accents", "processRequest", "sources/shared", "SearchEngineRules" ], function(require, exports) {
        function bing_getDeleteSearchResultLink(url, callback) {
            function onFoundHistory(result) {
                var responseText = result.responseText;
                if (responseText.indexOf("oma=toggle_on&amp;") > 0) {
                    bing_searchHistoryIsEnabled = !1;
                    callback();
                } else if (0 > responseText.indexOf("oma=toggle_off&amp;")) {
                    bing_searchHistoryIsEnabled = !1;
                    callback();
                } else {
                    var q_escaped = bresult[2];
                    q_escaped = q_escaped.replace(/([[^$.|?*+(){}])/g, "\\$&").replace(/'/g, "%27").replace(/%[A-Z0-9]{2}/g, function(perccode) {
                        return perccode.toUpperCase();
                    });
                    var i = responseText.search(q_escaped);
                    if (-1 != i) {
                        i = responseText.indexOf('href="/historyHandler?oma=delete_query', i) + 6;
                        var end = responseText.indexOf('"', i);
                        if (5 != i && -1 != end) {
                            var historyHandler = _decodeHTMLEntitiesInHref(responseText.slice(i, end));
                            callback(borigin + historyHandler);
                        } else {
                            _debug("bing_getDeleteSearchResultLink", "bing_history", "Cannot find delete history item link.");
                            callback();
                        }
                    } else {
                        _debug("bing_getDeleteSearchResultLink", "bing_history", "Cannot find the last search result in the search history.");
                        callback();
                    }
                }
            }
            if (bing_searchHistoryIsEnabled) {
                var bresult = /^(https?:\/\/[^\/]*bing[^\/]+)\/.*[&?](q=[^&#]+)/.exec(url);
                if (bresult) {
                    var borigin = bresult[1];
                    processRequest({
                        url: borigin + "/profile/history",
                        afterSend: function() {},
                        fail: function() {},
                        found: onFoundHistory
                    });
                } else callback();
            } else callback();
        }
        function google_getDeleteSearchResultLink(url, responseText, callback) {
            if (google_searchHistoryIsEnabled) {
                var gresult = /^(https?:\/\/[^\/]*google[^\/]+)\/.*[&?]q=([^&#]+)/.exec(url);
                if (gresult) {
                    var gorigin = gresult[1], q_escaped = gresult[2], client = "chrome";
                    if (client) {
                        var token = /[,{]"token":"([^"]{8,64})"[,}]/.exec(responseText);
                        if (token) {
                            token = token[1];
                            callback(gorigin + "/complete/deleteitems?delq=" + q_escaped + "&client=" + client + "&tok=" + token);
                        } else callback();
                    } else callback();
                } else callback();
            } else callback();
        }
        function yahoo_getDeleteSearchResultLink(url, responseText, callback) {
            if (yahoo_searchHistoryIsEnabled) {
                var yresult = /^(https?:\/\/)[^\/]*yahoo[^\/]+\/.*?[&?]p=([^&#]+)/.exec(url);
                if (yresult) {
                    var scheme_and_slashes = yresult[1], q_escaped = yresult[2];
                    q_escaped = q_escaped.toLowerCase().replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/~/g, "%7E").replace(/\*/g, "%2A").replace(/%20/g, "+").replace(/%[a-z0-9]{2}/g, function(perccode) {
                        return perccode.toUpperCase();
                    });
                    var bcrumb = /"bcrumb":"([.a-zA-Z0-9]+)/.exec(responseText), ts = / data-flight="(\d+)"/.exec(responseText);
                    if (bcrumb && ts) {
                        bcrumb = bcrumb[1];
                        ts = ts[1];
                        callback(scheme_and_slashes + "search.yahoo.com/history;?action=del&_bcrumb=" + bcrumb + "&query=" + q_escaped + "&ts=" + ts);
                    } else {
                        _debug("yahoo_getDeleteSearchResultLink", "yahoo_history", "Cannot find the last search result in the search history.");
                        callback();
                    }
                } else callback();
            } else callback();
        }
        function yahoo_isHistoryTurnedOff(responseText) {
            return /href="(https:\/\/search\.yahoo\.com\/web)?\/savepref;[^"\n]*[?&]sh=1&(?:amp;)?pref_done=/.test(responseText);
        }
        function yahoo_doDeleteSearchResult(url) {
            url && processRequest({
                url: url,
                afterSend: function() {},
                fail: function() {},
                found: function(result) {
                    yahoo_isHistoryTurnedOff(result.responseText) && (yahoo_searchHistoryIsEnabled = !1);
                }
            });
        }
        function duckduckgo_url_to_fallback_url(url) {
            var new_url = url && url.replace(/^(https:\/\/duckduckgo\.com)(\/\?q=)/, "$1/html$2");
            return url && new_url !== url ? new_url : "";
        }
        function duckduckgo_getResultsFromResponseFallback(data, callback) {
            var fallback_url = duckduckgo_url_to_fallback_url(data.url);
            if (fallback_url) processRequest({
                url: fallback_url,
                afterSend: function() {},
                fail: function() {
                    callback([]);
                },
                found: function(result) {
                    for (var doc = SourceScraperUtils.toDOM(result.responseText), results = [], links = doc.querySelectorAll('a[href^="https:"],a[href^="http:"]'), i = 0; links.length > i; ++i) results.push(links[i].getAttribute("href"));
                    callback(results);
                }
            }); else {
                _debug("SourceScraperUtils:duckduckgo:getResultsFromResponse", "ddg_result_fallback_failed", "unable to fall back to HTML results via " + data.url);
                callback([]);
            }
        }
        function sendRequestIfUrlIsSet(url) {
            url && processRequest({
                url: url,
                afterSend: function() {},
                fail: function() {},
                found: function() {}
            });
        }
        function _decodeHTMLEntitiesInHref(url) {
            url = url.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
            return url;
        }
        function getRandomSearchEngine(site) {
            site = site && SearchEngineRules.normalizeSite(site);
            for (var fallbackIndex = -1, lastresortIndex = -1, i = 0; se_id.length > i; ++i) {
                setSearchProviderIndex(se_index + 1);
                var searchProviderIdentifier = se_id[se_index];
                if (isSearchProviderEnabled(searchProviderIdentifier)) {
                    var verdict = SearchEngineRules.canUseSearchEngine(searchProviderIdentifier, site);
                    if (verdict === SearchEngineRules.ALWAYS) return SearchProviders[searchProviderIdentifier];
                    verdict === SearchEngineRules.MAYBE && -1 === fallbackIndex && (fallbackIndex = se_index);
                    verdict === SearchEngineRules.NEVER && -1 === lastresortIndex && (lastresortIndex = se_index);
                }
            }
            if (-1 !== fallbackIndex) {
                setSearchProviderIndex(fallbackIndex);
                return SearchProviders[se_id[se_index]];
            }
            if (-1 !== lastresortIndex) {
                setSearchProviderIndex(lastresortIndex);
                return SearchProviders[se_id[se_index]];
            }
        }
        function getSearchProviderIndex() {
            return se_index;
        }
        function setSearchProviderIndex(index) {
            se_index = index % se_id.length;
        }
        function isSearchProviderEnabled(searchProviderIdentifier) {
            if (-1 === se_id.indexOf(searchProviderIdentifier)) return !1;
            var isEnabled = shared.searchProviders[searchProviderIdentifier];
            return "boolean" == typeof isEnabled ? isEnabled : !SearchProviders[searchProviderIdentifier].disabledByDefault;
        }
        function getSearchProviderDescriptions() {
            return se_id.map(function(searchProviderIdentifier) {
                var searchProvider = SearchProviders[searchProviderIdentifier];
                return {
                    searchProviderIdentifier: searchProviderIdentifier,
                    name: searchProvider.name,
                    enabled: isSearchProviderEnabled(searchProviderIdentifier),
                    isUserDefined: "boolean" == typeof shared.searchProviders[searchProviderIdentifier]
                };
            });
        }
        var normalize_accents = require("normalize_accents").normalize_accents, processRequest = require("processRequest").processRequest, shared = require("sources/shared"), SearchEngineRules = require("SearchEngineRules"), _debug = function(method, type, message) {
            console && console.log(method + ": " + message);
        }, SourceScraperUtils = {};
        SourceScraperUtils.toStringArray = function(node, options) {
            if (!node) return [];
            options || (options = {});
            if (!options.isFirstChild && !(node = node.firstChild)) return [];
            var opts = {};
            opts.tags = options.tags || /^(?:[bui]|strong|em)$/i;
            opts.flushBefore = options.flushBefore || /^br$/i;
            opts.flushAfter = options.flushAfter;
            opts.lineAfterFlush = options.lineAfterFlush;
            opts.isEndNode = options.isEndNode;
            opts.ignoreNode = options.ignoreNode;
            opts.ignoreLine = options.ignoreLine;
            opts.pushLine = options.splitAtLF ? _pushLine : _pushLineDontSplit;
            opts.tmpLine = "";
            opts.lines = [];
            _toStringArray(node, opts);
            opts.tmpLine && opts.pushLine(opts.lines, opts.tmpLine, opts.ignoreLine);
            opts.lines[opts.lines.length - 1] || opts.lines.pop();
            return opts.lines;
        };
        var _toStringArray = function(node, o) {
            if (node) do {
                if (o.isEndNode && o.isEndNode(node)) return !0;
                if (!o.ignoreNode || !o.ignoreNode(node)) if (3 === node.nodeType) o.tmpLine += node.nodeValue; else if (1 === node.nodeType) {
                    var tagName = node.tagName;
                    if (o.flushBefore && o.flushBefore.test(tagName)) {
                        o.pushLine(o.lines, o.tmpLine, o.ignoreLine);
                        o.tmpLine = "";
                    }
                    if (o.tags && o.tags.test(tagName) && _toStringArray(node.firstChild, o)) return !0;
                    if (o.flushAfter && o.flushAfter.test(tagName)) {
                        if (o.tmpLine) {
                            o.pushLine(o.lines, o.tmpLine, o.ignoreLine);
                            o.tmpLine = "";
                        }
                        o.lineAfterFlush && o.lineAfterFlush.test(tagName) && o.pushLine(o.lines, "", o.ignoreLine);
                    }
                }
            } while (node = node.nextSibling);
        }, _pushLine = function(lines, line, ignoreLine) {
            for (var lineParts = line.trim().split(/\r\n|\n\r|\n|\r/), i = 0; lineParts.length > i; ++i) _pushLineDontSplit(lines, lineParts[i], ignoreLine);
        }, _pushLineDontSplit = function(lines, line, ignoreLine) {
            line = line.trim();
            ignoreLine && ignoreLine(line) || (line || lines[lines.length - 1]) && lines.push(line);
        };
        try {
            new DOMParser().parseFromString("", "text/html").body;
            SourceScraperUtils.toDOM = function(html_string) {
                return new DOMParser().parseFromString(html_string, "text/html");
            };
        } catch (e) {
            SourceScraperUtils.toDOM = function(html_string) {
                var doc = document.implementation.createHTMLDocument("");
                if (html_string && !/^\s+$/.test(html_string)) {
                    doc.open();
                    doc.write(html_string + "</html>");
                    doc.close();
                }
                return doc;
            };
        }
        SourceScraperUtils.normalize_accents = normalize_accents;
        SourceScraperUtils.search = {};
        var SearchProviders = {};
        SourceScraperUtils.search.engines = SearchProviders;
        SourceScraperUtils.search.getSearchProviderDescriptions = getSearchProviderDescriptions;
        SourceScraperUtils.search.getSearchProviderIndex = getSearchProviderIndex;
        SourceScraperUtils.search.setSearchProviderIndex = setSearchProviderIndex;
        SourceScraperUtils.search.isSearchURL = function(url) {
            for (var searchEngineId in SearchProviders) if (SearchProviders[searchEngineId].r_url.test(url)) return !0;
            return !1;
        };
        SourceScraperUtils.search.get_url = function(options) {
            var searchProvider;
            if (isSearchProviderEnabled(options.engine)) searchProvider = SearchProviders[options.engine]; else {
                searchProvider = getRandomSearchEngine(options.site);
                if (!searchProvider) return "";
            }
            return searchProvider.get_url(options);
        };
        SourceScraperUtils.search.getResultsFromResponse = function(responseText, data, callback) {
            if (responseText && "string" == typeof responseText) {
                var searchEngine;
                if (data && data.url) for (var searchEngineId in SearchProviders) if (SearchProviders[searchEngineId].r_url.test(data.url)) {
                    searchEngine = SearchProviders[searchEngineId];
                    break;
                }
                if (!searchEngine) {
                    searchEngine = SearchProviders.bing;
                    _debug("SourceScraperUtils:search:getResultsFromResponse", "response_not_recognized", "Not recognized as a search result: " + (data && data.url));
                }
                searchEngine.getResultsFromResponse(responseText, data, callback);
            } else callback([]);
        };
        SearchProviders.bing = {};
        SearchProviders.bing.name = "Bing";
        SearchProviders.bing.r_url = /^https?:\/\/(?:www|m)\.bing\.com\//;
        SearchProviders.bing.get_url = function(options) {
            var search_url = "https://www.bing.com/search?q=", search_terms = options.query;
            options.site && (search_terms = "site:" + options.site + " " + search_terms);
            search_url += encodeURIComponent(search_terms);
            return search_url;
        };
        SearchProviders.bing.getResultsFromResponse = function(responseText, data, callback) {
            supports_anonymous_requests || setTimeout(function() {
                bing_getDeleteSearchResultLink(data.url, sendRequestIfUrlIsSet);
            }, 500);
            for (var resultEntry, url, a_urls = [], regex = /<a href="(\/ins\?[^"]*?&amp;url=([A-Za-z0-9+\/=_]+)&amp;[^"]+)/g; null !== (resultEntry = regex.exec(responseText)); ) {
                var base64encodedURL = resultEntry[2];
                try {
                    for (var parts = base64encodedURL.split("_"), i = 0; parts.length > i; ++i) {
                        0 === i ? url = "" : url += 1 === i ? "?" : "&";
                        url += window.atob(parts[i]);
                    }
                } catch (e) {
                    _debug("SourceScraperUtils:bing:getResultsFromResponse", "atob_error", "Failed to decode the URL, " + e);
                    url = resultEntry[1].replace(/&amp;/g, "&");
                }
                a_urls.push(url);
            }
            if (!a_urls.length) {
                regex = /<a href="(https?:[^"]+)/g;
                var startOfResults = responseText.indexOf('id="content"');
                startOfResults > 0 && (regex.lastIndex = startOfResults);
                for (;null !== (resultEntry = regex.exec(responseText)); ) {
                    url = _decodeHTMLEntitiesInHref(resultEntry[1]);
                    try {
                        url = decodeURI(url);
                    } catch (e) {}
                    var host = url.split("/")[2];
                    /(?:bing|live|microsoft|microsofttranslator|msn)\.com$/.test(host) || a_urls.push(url);
                }
            }
            callback(a_urls);
        };
        var bing_searchHistoryIsEnabled = !0;
        SearchProviders.google = {};
        SearchProviders.google.name = "Google";
        SearchProviders.google.r_url = /^https:\/\/www\.google\.com\//;
        SearchProviders.google.get_url = function(options) {
            var search_url = "https://www.google.com/search?gws_rd=cr&q=", search_terms = options.query;
            options.site && (search_terms = "site:" + options.site + " " + search_terms);
            search_url += encodeURIComponent(search_terms);
            return search_url;
        };
        SearchProviders.google.getResultsFromResponse = function(responseText, data, callback) {
            supports_anonymous_requests || google_getDeleteSearchResultLink(data.url, responseText, sendRequestIfUrlIsSet);
            for (var resultEntry, url, regex = /<h3 class="r"><a href="(\/url?q=)?(https?:\/\/[^"]+)"/g, a_urls = []; null !== (resultEntry = regex.exec(responseText)); ) {
                url = _decodeHTMLEntitiesInHref(resultEntry[2]);
                if (resultEntry[1]) {
                    url = url.split("&", 1)[0];
                    try {
                        url = decodeURIComponent(url);
                    } catch (e) {}
                }
                a_urls.push(url);
            }
            callback(a_urls);
        };
        var google_searchHistoryIsEnabled = !0;
        SearchProviders.yahoo = {};
        SearchProviders.yahoo.name = "Yahoo";
        SearchProviders.yahoo.r_url = /^https?:\/\/search\.yahoo\.com\//;
        SearchProviders.yahoo.get_url = function(options) {
            var search_url = "https://search.yahoo.com/search;?p=", search_terms = options.query;
            search_terms = (search_terms + "").replace(/^!+/, "");
            options.site && (search_terms = "site:" + options.site + " " + search_terms);
            search_url += encodeURIComponent(search_terms);
            return search_url;
        };
        SearchProviders.yahoo.getResultsFromResponse = function(responseText, data, callback) {
            supports_anonymous_requests || yahoo_getDeleteSearchResultLink(data.url, responseText, yahoo_doDeleteSearchResult);
            for (var resultEntry, regex = /<h3[^>]*><a [^>]*?\bhref="((https?:)?\/\/[^"]+)/g, a_urls = []; null !== (resultEntry = regex.exec(responseText)); ) {
                var url = resultEntry[1];
                resultEntry[2] || (url = "https:" + url);
                url = /^https?:\/\/ri?\.search\.yahoo\.com\/[^"]+\/RU=(http[^"\/]+)/.exec(url);
                url = url ? decodeURIComponent(_decodeHTMLEntitiesInHref(url[1])) : _decodeHTMLEntitiesInHref(resultEntry[1]);
                a_urls.push(url);
            }
            callback(a_urls);
        };
        var yahoo_searchHistoryIsEnabled = !0;
        SearchProviders.duckduckgo = {};
        SearchProviders.duckduckgo.name = "DuckDuckGo";
        SearchProviders.duckduckgo.r_url = /^https?:\/\/duckduckgo\.com\//;
        SearchProviders.duckduckgo.get_url = function(options) {
            var search_url = "https://duckduckgo.com/?q=", search_terms = options.query;
            options.site && (search_terms = "site:" + options.site + " " + search_terms);
            search_url += encodeURIComponent(search_terms);
            return search_url;
        };
        SearchProviders.duckduckgo.getResultsFromResponse = function(responseText, data, callback) {
            var result_js = /'(\/d\.js\?[^']+)'/.exec(responseText);
            if (result_js) processRequest({
                url: "https://duckduckgo.com" + result_js[1],
                afterSend: function() {},
                fail: function() {
                    duckduckgo_getResultsFromResponseFallback(data, callback);
                },
                found: function(result) {
                    for (var responseText = result.responseText, startIndices = [], endIndices = [], i = 0; -1 !== (i = responseText.indexOf('[{"', i)); ) {
                        startIndices.push(i);
                        i += 3;
                    }
                    if (startIndices.length) {
                        i = startIndices[0];
                        for (;-1 !== (i = responseText.indexOf("}]", i)); ) {
                            i += 2;
                            endIndices.unshift(i);
                        }
                    }
                    var result_parts = [];
                    startIndices.forEach(function(startIndex) {
                        endIndices.some(function(endIndex) {
                            if (startIndex >= endIndex) return !0;
                            var array, json = responseText.substring(startIndex, endIndex);
                            try {
                                array = JSON.parse(json);
                            } catch (e) {
                                return;
                            }
                            var potential_results = [];
                            array.forEach(function(elem) {
                                elem && "string" == typeof elem.c && /^https?:/i.test(elem.c) && potential_results.push(elem.c);
                            });
                            potential_results.length && result_parts.push(potential_results);
                            return !0;
                        });
                    });
                    result_parts.sort(function(a, b) {
                        return a.length < b.length;
                    });
                    var a_urls = [];
                    result_parts.forEach(function(result_part) {
                        a_urls = a_urls.concat(result_part);
                    });
                    callback(a_urls);
                }
            }); else {
                _debug("SourceScraperUtils:duckduckgo:getResultsFromResponse", "ddg_result_not_found", "d.js not found in DDG result, falling back to HTML results if possible.");
                duckduckgo_getResultsFromResponseFallback(data, callback);
            }
        };
        SearchProviders.qwant = {};
        SearchProviders.qwant.disabledByDefault = !0;
        SearchProviders.qwant.name = "Qwant";
        SearchProviders.qwant.r_url = /^https?:\/\/api\.qwant\.com\//;
        SearchProviders.qwant.get_url = function(options) {
            var search_url = "https://api.qwant.com/api/search/web?count=10&q=", search_terms = options.query;
            options.site && (search_terms = "site:" + options.site + " " + search_terms);
            search_url += encodeURIComponent(search_terms);
            return search_url;
        };
        SearchProviders.qwant.getResultsFromResponse = function(responseText, data, callback) {
            var res;
            try {
                res = JSON.parse(responseText);
            } catch (e) {}
            res = res && res.data;
            res = res && res.result;
            res = res && res.items;
            var a_urls = [];
            Array.isArray(res) && res.forEach(function(item) {
                var url = item && item.url;
                "string" == typeof url && a_urls.push(url);
            });
            callback(a_urls);
        };
        SearchProviders.startpage = {};
        SearchProviders.startpage.name = "Startpage";
        SearchProviders.startpage.r_url = /^https?:\/\/[a-z0-9\-]+\.startpage\.com\//;
        SearchProviders.startpage.get_url = function(options) {
            var search_url = "https://www.startpage.com/do/search?prfh=disable_family_filterEEE1N1N&cat=web&query=", search_terms = options.query;
            options.site && (search_terms = "site:" + options.site + " " + search_terms);
            search_url += encodeURIComponent(search_terms);
            return search_url;
        };
        SearchProviders.startpage.getResultsFromResponse = function(responseText, data, callback) {
            for (var resultEntry, regex = /<h3 class='clk'><a href='(https?:\/\/[^']+)'/g, a_urls = []; null !== (resultEntry = regex.exec(responseText)); ) a_urls.push(_decodeHTMLEntitiesInHref(resultEntry[1]));
            callback(a_urls);
        };
        SearchProviders.ixquick = {};
        SearchProviders.ixquick.name = "ixquick.com";
        SearchProviders.ixquick.r_url = /^https?:\/\/[a-z0-9\-]+\.ixquick\.com\//;
        SearchProviders.ixquick.get_url = function(options) {
            return SearchProviders.startpage.get_url(options).replace("startpage.com", "ixquick.com");
        };
        SearchProviders.ixquick.getResultsFromResponse = SearchProviders.startpage.getResultsFromResponse;
        SearchProviders.ixquickeu = {};
        SearchProviders.ixquickeu.name = "ixquick.eu";
        SearchProviders.ixquickeu.r_url = /^https?:\/\/[a-z0-9\-]+\.ixquick\.eu\//;
        SearchProviders.ixquickeu.get_url = function(options) {
            return SearchProviders.startpage.get_url(options).replace("startpage.com", "ixquick.eu");
        };
        SearchProviders.ixquickeu.getResultsFromResponse = SearchProviders.startpage.getResultsFromResponse;
        var se_id = Object.keys(SearchProviders), se_index = se_id.length - 1, supports_anonymous_requests = false || true && window.fetch || false;
        exports.SourceScraperUtils = SourceScraperUtils;
    });
    define("LyricsSource", [ "require", "exports", "module", "ScrapedSource", "SourceScraperUtils" ], function(require, exports) {
        function LyricsSource(options) {
            options && expandShortOptions(options);
            ScrapedSource.call(this, options);
        }
        function expandShortOptions(options) {
            options.searchterms_site || (options.searchterms_site = options.identifier);
            !options.url_result && options.searchterms_result && (options.url_result = LyricsSourceDefaults.url_result);
            !options.url_search && options.searchterms_search && (options.url_search = LyricsSourceDefaults.url_search);
            !options.process_result && options.process_result_selector && (options.process_result = LyricsSourceDefaults.process_result);
            !options.process_search && options.r_url_result && (options.process_search = LyricsSourceDefaults.process_search);
        }
        function _normalize_string(value, options) {
            options && options.keepAccents || (value = SourceScraperUtils.normalize_accents(value));
            return value;
        }
        function _formatSearchTokens(value) {
            value = value.replace(/["*:+@%$#()\[\]|]/g, " ");
            value = value.replace(/\s-([^\s])/g, " - $1");
            value = value.replace(/^[\s\-']+|[\s\-']+$/g, "");
            value = value.replace(/\s+/g, " ");
            return value;
        }
        var ScrapedSource = require("ScrapedSource").ScrapedSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils;
        LyricsSource.prototype = Object.create(ScrapedSource.prototype);
        LyricsSource.prototype.constructor = LyricsSource;
        LyricsSource.Scheme = {
            identifier: "string",
            disabled: [ "undefined", "boolean" ],
            banned: [ "undefined", "boolean" ],
            homepage: "string",
            description: [ "undefined", "string" ],
            searchengine: [ "undefined", "string" ],
            searchterms_site: [ "undefined", "string" ],
            searchterms_search: [ "undefined", "string" ],
            searchterms_result: [ "undefined", "string" ],
            r_url_result: [ "regexp" ],
            result_charset: [ "undefined", "string" ],
            process_result_exclude_pattern: [ "undefined", "regexp" ],
            process_result_selector: [ "undefined", "string", "array" ],
            process_result_scraper_options: [ "undefined", "object", "array" ],
            process_result_fallback: [ "undefined", "function" ],
            process_result_get_title: [ "undefined", "function" ],
            process_result_replace_url: [ "undefined", "array" ],
            process_search_replace_url: [ "undefined", "array" ],
            url_result: [ "string", "function" ],
            method_result: [ "undefined", "string" ],
            payload_result: [ "undefined", "string", "function" ],
            headers_result: [ "undefined", "object", "function" ],
            process_result: "function",
            url_search: [ "string", "function" ],
            method_search: [ "undefined", "string" ],
            payload_search: [ "undefined", "string", "function" ],
            headers_search: [ "undefined", "object", "function" ],
            process_search: "function"
        };
        var LyricsSourceDefaults = {};
        LyricsSourceDefaults.url_result = function(query) {
            return SourceScraperUtils.search.get_url({
                engine: this.searchengine,
                site: this.searchterms_site,
                query: this.expand_vars(this.searchterms_result, query)
            });
        };
        LyricsSourceDefaults.url_search = function(query) {
            return SourceScraperUtils.search.get_url({
                engine: this.searchengine,
                site: this.searchterms_site,
                query: this.expand_vars(this.searchterms_search, query)
            });
        };
        LyricsSourceDefaults.process_result = function(responseText, callbacks, data) {
            if (SourceScraperUtils.search.isSearchURL(data.url)) return this.process_search(responseText, callbacks, data);
            if (this.process_result_exclude_pattern && this.process_result_exclude_pattern.test(responseText)) callbacks.fail(); else {
                var lyricbox, doc = SourceScraperUtils.toDOM(responseText), process_result_selector = this.process_result_selector, process_result_scraper_options = this.process_result_scraper_options;
                if (Array.isArray(process_result_selector)) {
                    for (var i = 0; !lyricbox && process_result_selector.length > i; ++i) lyricbox = doc.querySelector(process_result_selector[i]);
                    Array.isArray(process_result_scraper_options) && (process_result_scraper_options = process_result_scraper_options[i]);
                } else lyricbox = doc.querySelector(process_result_selector);
                var lyrics = SourceScraperUtils.toStringArray(lyricbox, process_result_scraper_options);
                if (lyrics.length) {
                    var title;
                    if (this.process_result_get_title) {
                        title = this.process_result_get_title(doc);
                        if (!title) {
                            callbacks.fail();
                            return;
                        }
                    } else title = doc.title.replace(/\s+Lyrics\s*$/i, "");
                    var response = {
                        lyrics: lyrics,
                        title: title
                    }, process_result_replace_url = this.process_result_replace_url;
                    if (process_result_replace_url) {
                        for (var url = data.url, k = 0; process_result_replace_url.length > k; k += 2) url = url.replace(process_result_replace_url[k], process_result_replace_url[k + 1]);
                        response.url = url;
                    }
                    callbacks.found(response);
                } else this.process_result_fallback ? this.process_result_fallback(doc, callbacks, data) : callbacks.fail();
            }
        };
        LyricsSourceDefaults.process_search = function(responseText, callbacks, data) {
            var lyricsSource = this;
            SourceScraperUtils.search.getResultsFromResponse(responseText, data, function(a_urls) {
                for (var i = 0; a_urls.length > i; ++i) {
                    var url = a_urls[i];
                    if (lyricsSource.r_url_result.test(url)) {
                        var process_search_replace_url = lyricsSource.process_search_replace_url;
                        if (process_search_replace_url) for (var k = 0; process_search_replace_url.length > k; k += 2) url = url.replace(process_search_replace_url[k], process_search_replace_url[k + 1]);
                        callbacks.found({
                            redir: url
                        });
                        return;
                    }
                }
                callbacks.fail();
            });
        };
        LyricsSource.prototype.$ARTIST$SONG = function(value, options) {
            value += "";
            value = value.replace(/\([^)]*\)/g, "");
            value = value.replace(/\[[^\]]*\]/g, "");
            value = _normalize_string(value, options);
            value = _formatSearchTokens(value);
            return value;
        };
        LyricsSource.prototype.$ARTIST = function(query, options) {
            return this.$ARTIST$SONG(query.artist + "", options);
        };
        LyricsSource.prototype.$SONG = function(query, options) {
            return this.$ARTIST$SONG(query.song + "", options);
        };
        LyricsSource.prototype.$SEARCHTERMS = function(query, options) {
            if (query.artist && query.song) return _formatSearchTokens(query.artist + " - " + query.song);
            if (!query.videotitle && query.searchTerms) return query.searchTerms;
            var s = query.videotitle + "";
            s = s.replace(/\([^)]*\)/g, " ");
            s = s.replace(/\[[^\]]*\]/g, " ");
            s = s.replace(/(.)\b(ft|feat)\b[^\-]+/i, "$1");
            s = s.replace(/\bhd\b/i, "");
            s = s.replace(/(?:w.(?:th)? ?)?((?:on)?.?screen ?)?lyrics?/i, "");
            s = s.replace(/\b(?:(?:piano|guitar|drum|acoustic|instrument(?:al)?) ?)?cover( by [^ )\]]+)?/i, "");
            s = s.replace(/\b(?:recorded )?live (?:at|@|on).+$/i, "");
            s = s.replace(/\b(from )?(the )?(original|\d{2,4}) [a-z]+ cast( recordings| album)?s?\b/i, "");
            s = s.replace(/\b\d{1,2}[\-.\/]\d{1,2}[\-.\/](?:(?:1[789]|20)\d{2}|\d{2})\b/, "");
            s = s.replace(/[(\[][^\])]*(?:20|19)\d{2}[^\])]*[)\]]/, "");
            s = s.replace(/\b1[789]\d{2}|20\d{2}\b/, "");
            s = s.replace(/\bYouTube\b/gi, "");
            s = s.replace(/\bre.?uploaded\b/i, "");
            s = s.replace(/\bhigh[\- ]?quality\b/i, "");
            s = s.replace(/\boffici?al\b/i, "");
            s = s.replace(/\b(minecraft|rsmv|mmv|(?:(?:naruto|bleach|avatar|toradora|final ?fantasy ?\d{0,2})[^a-z0-9]+)?amv)/i, "");
            s = s.replace(/\b(?:full )?music\b/gi, "");
            s = s.replace(/\bdemo\b/i, "");
            s = s.replace(/\bfan(?:[\- ]?(?:video|made))?\b/i, "");
            s = s.replace(/\b(videos?|audio|acoustic)/gi, "");
            s = s.replace(/\b(on ?)?iTunes\b/i, "");
            s = s.replace(/(^|[^a-z0-9])(?:240|360|480)p\b/i, "");
            s = s.replace(/\.(3gp?[2p]|as[fx]|avi|flv|m[4o]v|mpe?g?[34]|rm|webm|wmv)\s*$/i, "");
            s = _normalize_string(s, options);
            s = s.replace(/(?:^|\s)[^a-zA-Z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\uFF10-\uFF19\uD800-\uDFFF ]+(?=\s|$)/g, " ");
            s = _formatSearchTokens(s);
            return s;
        };
        LyricsSource.prototype.$encARTIST = function(query, options) {
            return encodeURIComponent(this.$ARTIST(query), options);
        };
        LyricsSource.prototype.$encSONG = function(query, options) {
            return encodeURIComponent(this.$SONG(query), options);
        };
        LyricsSource.prototype.$encSEARCHTERMS = function(query, options) {
            return encodeURIComponent(this.$SEARCHTERMS(query), options);
        };
        exports.LyricsSource = LyricsSource;
    });
    define("MultiLyricsSource", [ "require", "exports", "module", "LyricsSource", "sources/shared", "SearchEngineRules" ], function(require, exports) {
        function MultiLyricsSource(options) {
            options && expandOptions(options);
            LyricsSource.call(this, options);
            this._lastAnnouncement = 0;
            this._sources = [];
        }
        function expandOptions(options) {
            !options.url_result && options.url_search && (options.url_result = options.url_search);
            !options.process_result && options.process_search && (options.process_result = options.process_search);
        }
        var LyricsSource = require("LyricsSource").LyricsSource, shared = require("sources/shared"), SearchEngineRules = require("SearchEngineRules");
        MultiLyricsSource.prototype = Object.create(LyricsSource.prototype);
        MultiLyricsSource.prototype.constructor = MultiLyricsSource;
        MultiLyricsSource.Scheme = {
            identifier: "string",
            searchProviderIdentifier: "string",
            disabled: [ "undefined", "boolean" ],
            homepage: "string",
            description: [ "undefined", "string" ],
            url_result: [ "undefined", "string", "function" ],
            process_result: [ "undefined", "function" ],
            url_search: [ "string", "function" ],
            process_search: [ "undefined", "function" ],
            getSources: [ "undefined", "function" ],
            getResultsFromResponse: "function"
        };
        MultiLyricsSource.prototype.r_url_result = /$./;
        MultiLyricsSource.prototype.process_result = MultiLyricsSource.prototype.process_search = function(responseText, callbacks, data) {
            var lyricsSources = this.getSources();
            this.getResultsFromResponse(responseText, data, function(a_urls) {
                for (var urlCount = a_urls.length, i = 0; lyricsSources.length > i; ++i) {
                    var source = lyricsSources[i];
                    if (source.disabled) for (var r_url_result = source.r_url_result, j = 0; urlCount > j; ++j) {
                        var url = a_urls[j];
                        if (r_url_result.test(url)) {
                            callbacks.found({
                                redir: url,
                                redirSource: source
                            });
                            return;
                        }
                    }
                }
                callbacks.fail();
            });
        };
        MultiLyricsSource.prototype.getSources = function() {
            var lyricsSources = shared.lyricsSources;
            lyricsSources.length || console && console.log("Used MultiLyricsSource::getSources before shared.lyricsSources was ready!");
            if (this.lastAnnouncement !== shared.lastAnnouncement) {
                this.lastAnnouncement = shared.lastAnnouncement;
                this._sources.length = 0;
                for (var indexOfMaybe = 0, i = 0; lyricsSources.length > i; ++i) {
                    var source = lyricsSources[i], verdict = SearchEngineRules.canUseSearchEngine(this.searchProviderIdentifier, source.identifier);
                    verdict === SearchEngineRules.ALWAYS ? this._sources.splice(indexOfMaybe++, 0, source) : verdict === SearchEngineRules.MAYBE && this._sources.push(source);
                }
            }
            return this._sources;
        };
        exports.MultiLyricsSource = MultiLyricsSource;
    });
    define("sources/lyrics.wikia.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !1,
            identifier: "lyrics.wikia.com",
            homepage: "http://lyrics.wikia.com/",
            description: "The biggest lyrics database, containing millions of lyrics in several languages.",
            searchterms_search: '"This song is by" $SEARCHTERMS',
            r_url_result: /^https?:\/\/lyrics\.wikia\.com\/(?!(?:Category|User|Help|File|MediaWiki|LyricWiki)(?:_Talk)?:|(?:Talk|User_blog|Top_10_list):)[^:]+:./i,
            url_result: "http://lyrics.wikia.com/$ARTIST:$SONG",
            process_result_selector: ".lyricbox",
            process_result_fallback: function(doc, callbacks) {
                var redirectLink = doc.querySelector(".redirectText a[href]");
                if (redirectLink) {
                    redirectLink = redirectLink.getAttribute("href") || "";
                    "/" === redirectLink.charAt(0) && (redirectLink = "http://lyrics.wikia.com" + redirectLink);
                    if (redirectLink) {
                        callbacks.found({
                            redir: redirectLink
                        });
                        return;
                    }
                }
                callbacks.fail();
            },
            process_result_get_title: function(doc) {
                var title = doc.title.split(/(?: Lyrics)* [-|] Lyric ?Wiki/)[0].replace(":", " - ");
                title = title.replace(/^(Gracenote|LyricFind):/, "");
                return title;
            },
            $ARTIST$SONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.replace(/ /g, "_");
                value = value.replace(/^_+|_+$/g, "");
                value = value.replace(/(_|^)(.)/g, function(full_match, delimiter, anything) {
                    return delimiter + anything.toUpperCase();
                });
                return value;
            },
            $ARTIST: function(query, options) {
                var artist = LyricsSource.prototype.$ARTIST.call(this, query, options);
                /^(Category|User|Help|File|Special|Talk)$/i.test(artist) && (artist += "_(Artist)");
                return artist;
            }
        });
    });
    define("sources/multi/bing.com", [ "require", "exports", "module", "MultiLyricsSource", "SourceScraperUtils" ], function(require, exports) {
        var MultiLyricsSource = require("MultiLyricsSource").MultiLyricsSource, bing = require("SourceScraperUtils").SourceScraperUtils.search.engines.bing;
        exports.source = new MultiLyricsSource({
            disabled: !1,
            identifier: "bing.com",
            searchProviderIdentifier: "bing",
            homepage: "https://www.bing.com/",
            description: "Search in all known lyrics sites at once.\nIt is recommended to put this source near the top of the list.\nOnly disabled sources are used in the search query.",
            url_search: function(query) {
                var lyricsSources = this.getSources();
                if (!lyricsSources.length) return "";
                for (var search_url = "/search?q=" + encodeURIComponent(this.$SEARCHTERMS(query) + " (site:" + lyricsSources[0].searchterms_site), i = 1; lyricsSources.length > i; ++i) {
                    var queryPart = encodeURIComponent(" OR site:" + lyricsSources[i].searchterms_site);
                    if (queryPart.length + search_url.length >= 2047) break;
                    search_url += queryPart;
                }
                search_url += ")";
                search_url = "https://www.bing.com" + search_url;
                return search_url;
            },
            getResultsFromResponse: bing.getResultsFromResponse
        });
    });
    define("sources/lyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !1,
            identifier: "lyrics.com",
            homepage: "http://www.lyrics.com/",
            description: "Millions of lyrics in several languages.",
            searchterms_result: "$SONG lyrics $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.lyrics\.com\/(.+-lyrics-.+\.html($|[?#])|lyric\/\d+)/i,
            process_result_selector: "#lyric-body-text",
            process_result_scraper_options: {
                tags: /^(?:[buiap]|div|strong|em)$/i,
                splitAtLF: !0
            },
            process_result_get_title: function(doc) {
                var song = doc.querySelector("#lyric-title-text"), artist = doc.querySelector('.lyric-artist a[href*="artist/"]');
                if (song && artist) {
                    song = song.textContent;
                    artist = artist.textContent;
                    return artist + " - " + song;
                }
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/[^a-z0-9\- ]/g, "");
                value = value.replace(/ /g, "-");
                value = value.replace(/-{2,}/, "-");
                value = value.replace(/^-|-$/, "");
                return value;
            }
        });
    });
    define("sources/metrolyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !1,
            identifier: "metrolyrics.com",
            homepage: "http://www.metrolyrics.com/",
            description: "Millions of lyrics in several languages.",
            url_result: "http://www.metrolyrics.com/$SONG-lyrics-$ARTIST.html",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/(?:m|www)\.metrolyrics\.com\/[a-z0-9\-]+-lyrics-[a-z0-9\-]+\.html($|[?#])/,
            process_result_exclude_pattern: /Looks like we don.t have the lyrics just yet|Unfortunately, we don.t/,
            process_result_selector: [ "#lyrics-body-text", ".lyrics-body,.lyricsbody,.gnlyricsbody" ],
            process_result_scraper_options: {
                tags: /^(?:[buip]|strong|em)$/i,
                flushBefore: /^(br|p)$/i,
                flushAfter: /^p$/i
            },
            process_result_get_title: function(doc) {
                return doc.title.replace(/ Lyrics(?:\s*\| MetroLyrics)?\s*$/i, "");
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/([a-z])!([a-z])/g, "$1i$2");
                value = value.replace(/[^a-z0-9+\- ]/g, "");
                value = value.replace(/[\- ]+/g, "-");
                value = value.replace(/^-+|-+$/g, "");
                return value;
            }
        });
    });
    define("sources/lyricsmania.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "lyricsmania.com",
            homepage: "http://www.lyricsmania.com/",
            description: "Millions of English, French, German, Spanish and Italian lyrics (and others).",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.lyricsmania\.com\/(?!.*_(?:traduzione|ubersetzung|traduction|traduccion|traducao|album)_lyrics).+_lyrics_.+\.html($|[?#])/i,
            url_result: "http://www.lyricsmania.com/$SONG_lyrics_$ARTIST.html",
            process_result_selector: ".lyrics-body, .discography > .col-left",
            process_result_scraper_options: {
                tags: /^(?:[bui]|strong|em|div)$/i,
                ignoreNode: function(node) {
                    return 3 === node.nodeType ? /^Lyrics to /.test(node.nodeValue) : 1 === node.nodeType && "DIV" === node.tagName.toUpperCase() ? !/p402_premium|fb-quotable/.test(node.className) : void 0;
                }
            },
            process_result_get_title: function(doc) {
                var title = /^(.+ - .+) Lyrics$/.exec(doc.title);
                if (title) return title[1];
                title = /^(.*?) \(([^)]*)\) lyrics /.exec(doc.title);
                return title ? title[2] + " - " + title[1] : void 0;
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/&/g, "and");
                value = value.replace("[ost]", "_soundtrack_");
                value = value.replace(/[ \/]/g, "_");
                value = value.replace(/[^a-z0-9!,_\-@*:$°]/g, "");
                value = value.replace(/[`'\\]/g, "");
                return value;
            }
        });
    });
    define("sources/azlyrics.com", [ "require", "exports", "module", "LyricsSource", "SourceScraperUtils" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils;
        exports.source = new LyricsSource({
            disabled: !1,
            identifier: "azlyrics.com",
            homepage: "https://www.azlyrics.com/",
            description: "Hundred thousands of mostly English lyrics.",
            r_url_result: /^https?:\/\/www\.azlyrics\.com\/lyrics\/[^\/]+\/[^\/]+\.html($|[?#])/i,
            url_result: "https://www.azlyrics.com/lyrics/$ARTIST/$SONG.html",
            method_search: "GET",
            url_search: "https://search.azlyrics.com/search.php?q=$encSEARCHTERMS",
            process_result_selector: ".lyricsh ~ br ~ div",
            process_result_get_title: function(doc) {
                var title = doc.title.split(/LYRICS -/i);
                title[0] = title[0].replace(/([A-Z])(\S*)/g, function(full_match, firstChar, remainder) {
                    return firstChar.toUpperCase() + remainder.toLowerCase();
                });
                title = title.join("-");
                return title;
            },
            process_search: function(responseText, callbacks) {
                var doc = SourceScraperUtils.toDOM(responseText), link = doc.querySelector('a[href^="https://www.azlyrics.com/lyrics/"]');
                link ? callbacks.found({
                    redir: link.href
                }) : callbacks.fail();
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/([a-z])!([a-z])/g, "$1i$2");
                value = value.replace(/^(the|an?) /, "");
                value = value.replace(/[^a-z0-9]/g, "");
                return value;
            },
            $SEARCHTERMS: function(query, options) {
                var s = LyricsSource.prototype.$SEARCHTERMS.call(this, query, options);
                query.videotitle && (s = s.replace(/\s+-\s+/g, " "));
                return s;
            }
        });
    });
    define("sources/stlyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !1,
            identifier: "stlyrics.com",
            homepage: "http://www.stlyrics.com/",
            description: "OST (original sound track) lyrics (movies, games, musicals, etc.) and (popular) song lyrics.",
            searchterms_result: "$SONG Lyrics by $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.stlyrics\.com\/(songs\/[^\/]+|lyrics)\/[^\/]+\/.+/i,
            process_result_selector: "#page > div",
            process_result_scraper_options: {
                isFirstChild: !0,
                tags: /^(?:[buip]|strong|em|div)$/i,
                flushAfter: /^div$/i,
                lineAfterFlush: /^div$/i,
                ignoreNode: function(node) {
                    return 3 === node.nodeType && "\n" === node.textContent;
                }
            },
            process_result_get_title: function(doc) {
                var title = doc.title;
                if (!/\([^)]*translation|^TRANSLATION:/i.test(title)) {
                    title = /^(.+?) Lyrics by (.+) \| Album:/.exec(title);
                    if (title) return title[2] + " - " + title[1];
                    title = /^(.+?) Lyrics — (.*?) \| from (.*)$/.exec(doc.title);
                    title = title || /^(.+?) (?:Lyrics|Song texts) by (.*?) \| From (.*) Soundtrack$/.exec(doc.title);
                    if (title) return (title[2] || title[3]) + " - " + title[1];
                    title = doc.querySelector("h1");
                    title = title && /^(.+) Lyrics by (.+)$/.exec(title.textContent.trim());
                    if (title) return title[2] + " - " + title[1];
                    var metadata = /artist:\s*(".+?"),\s*song:\s*(".+?"),/.exec(doc.body && doc.body.textContent);
                    if (metadata) try {
                        return JSON.parse(metadata[1]) + " - " + JSON.parse(metadata[2]);
                    } catch (e) {}
                }
            }
        });
    });
    define("sources/lyricsmode.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !1,
            identifier: "lyricsmode.com",
            homepage: "http://www.lyricsmode.com/",
            description: "Millions of lyrics in many languages.",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.lyricsmode\.com\/lyrics\/(.)\/\1[^\/]+\/.+\.html($|[?#])/i,
            url_result: "http://www.lyricsmode.com/lyrics/$ARTISTFIRSTLETTER/$ARTIST/$SONG.html",
            process_result_selector: "#lyrics_text",
            process_result_scraper_options: {
                tags: /^(?:[bui]|strong|em|span)$/i
            },
            process_result_get_title: function(doc) {
                var title = doc.title.split(" lyrics |", 1)[0];
                return title;
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/[ \-]/g, "_");
                value = value.replace(/([a-z])!([a-z])/g, "$1i$2");
                value = value.replace(/[^a-z0-9_\-]/g, "");
                value = value.replace(/_{2,}/g, "_");
                value = value.replace(/^_+|_+$/g, "");
                return value;
            },
            $ARTISTFIRSTLETTER: function(query) {
                return this.$ARTIST(query).charAt(0);
            }
        });
    });
    define("sources/songtexte.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "songtexte.com",
            homepage: "http://www.songtexte.com/",
            description: "German source with hundred thousands of lyrics (German, English and other international songs).",
            searchterms_site: "www.songtexte.com/songtext",
            searchterms_result: "Songtext von $ARTIST $SONG",
            searchterms_search: "Songtext $SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.songtexte\.com\/songtext\/[^\/]+\/.+-.+\.html/i,
            process_result_exclude_pattern: /Leider kein Songtext vorhanden/,
            process_result_selector: "#lyrics",
            process_result_get_title: function(doc) {
                var title = /^Songtext von (.+ - .+) Lyrics$/.exec(doc.title);
                return title ? title[1] : void 0;
            }
        });
    });
    define("sources/vagalume.com.br", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "vagalume.com.br",
            homepage: "https://www.vagalume.com.br/",
            description: "Brazilian site providing millions of lyrics in many languages.",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/(www|m)(\.vagalume\.com\.br\/(?!(my|top100|especiais|news|plugin|facebook|browse|playlisteiros)\/).*?\/(?!(discografia|fotos|popularidade|relacionados|news)\b).*?)($|[?#])/i,
            url_result: "https://www.vagalume.com.br/$ARTIST/$SONG.html",
            process_result_selector: "#lyr_original > div, .lyric > pre",
            process_result_scraper_options: {
                tags: /^(?:[buip]|strong|em|span)$/i,
                flushBefore: /^(?:br|p)$/i,
                flushAfter: /^p$/i
            },
            process_result_get_title: function(doc) {
                var title = doc.title.replace(/ - VAGALUME$/i, "").replace(/ \(TRADUÇÃO\)/i, ""), split = title.split(" - ");
                return 2 === split.length ? split[1] + " - " + split[0] : title;
            },
            process_result_replace_url: [ /^(https?:\/\/)m\./, "$1www." ],
            process_search_replace_url: [ /-cifrada(\.html)?$/i, "$1" ],
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/([a-z])!([a-z])/g, "$1i$2");
                value = value.replace(/[ .]/g, "-");
                value = value.replace(/[^a-z0-9\-]/g, "");
                value = value.replace(/-{2,}/g, "-");
                value = value.replace(/^-|-$/g, "");
                return value;
            }
        });
    });
    define("sources/letras.mus.br", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "letras.mus.br",
            homepage: "https://www.letras.mus.br/",
            description: "A big Brazilian source with millions of lyrics (also in many other languages).",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/(www\.)?letras\.mus\.br\/(?!estilos\/)(?!membros\/).*?\/.*?\//i,
            url_result: "https://www.letras.mus.br/$ARTIST/$SONG/",
            process_result_selector: ".cnt-letra,.cnt-trad_l",
            process_result_scraper_options: {
                tags: /^(?:[buip]|strong|em|div|article|span)$/i,
                flushBefore: /^(?:br|p|div)$/i,
                flushAfter: /^(?:p|div)$/i,
                lineAfterFlush: /^p$/i
            },
            process_result_get_title: function(doc) {
                var song = doc.querySelector(".cnt-head_title h1"), artist = doc.querySelector(".cnt-head_title h2");
                return song && artist ? song.textContent.trim() + " - " + artist.textContent.trim() : void 0;
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/[_ ]/g, "-");
                value = value.replace(/[^a-z0-9\-]/g, "");
                value = value.replace(/-{2,}/g, "-");
                value = value.replace(/^-+|-+$/g, "");
                return value;
            }
        });
    });
    define("algorithms", [ "require", "exports", "module", "normalize_accents" ], function(require, exports) {
        function get_bigramsHash(string, b_literalstring) {
            string += "";
            string = string.toLocaleLowerCase();
            if (!b_literalstring) {
                string = normalize_accents(string);
                string = string.replace(/[.,?\/"':;|\\\]\[\{\}\(\)\-_=+!@#$%\^&*~`]/g, " ");
            }
            string = (" " + string + " ").replace(/\s+/g, " ");
            for (var hash = {}, index = -1, stringLengthMinus1 = string.length - 1; stringLengthMinus1 > ++index; ) {
                var pair = string.substr(index, 2);
                hash[pair] = hash[pair] ? hash[pair] + 1 : 1;
            }
            return {
                length: stringLengthMinus1,
                hash: hash
            };
        }
        function getSimilarityCoefficient(str1, str2, b_literalstring) {
            var info1 = get_bigramsHash(str1, b_literalstring), info2 = get_bigramsHash(str2, b_literalstring), match_count = 0, totalPairCount = info1.length + info2.length;
            if (!info1.length || !info2.length) return totalPairCount ? 0 : 1;
            var hash1, hash2;
            if (info2.length > info1.length) {
                hash1 = info1.hash;
                hash2 = info2.hash;
            } else {
                hash1 = info2.hash;
                hash2 = info1.hash;
            }
            for (var allPairs1 = Object.keys(hash1), i = 0; allPairs1.length > i; ++i) {
                var p = allPairs1[i];
                hash2[p] && (match_count += hash1[p] > hash2[p] ? hash2[p] : hash1[p]);
            }
            return 2 * match_count / totalPairCount;
        }
        function splitSongTitle(title) {
            if (-1 == title.indexOf("-")) return null;
            title = title.match(/^(.+?)\s-\s(.+)/) || title.match(/^(.+?)\s-(.+)/) || title.match(/^(.+?)-\s(.+)/) || title.match(/^(.+?)-(.+)/);
            var artist = title[1].trim(), song = title[2].trim();
            return artist && song ? [ artist, song ] : null;
        }
        function isTitleSimilar(title1, title2, dsc) {
            dsc = !isNaN(dsc) && isFinite(dsc) ? +dsc : .3;
            var splittitle1 = splitSongTitle(title1), splittitle2 = splitSongTitle(title2);
            return splittitle1 && splittitle2 ? getSimilarityCoefficient(splittitle1[0], splittitle2[0]) > dsc && getSimilarityCoefficient(splittitle1[1], splittitle2[1]) > dsc : getSimilarityCoefficient(title1, title2) > dsc;
        }
        var normalize_accents = require("normalize_accents").normalize_accents;
        exports.getSimilarityCoefficient = getSimilarityCoefficient;
        exports.splitSongTitle = splitSongTitle;
        exports.isTitleSimilar = isTitleSimilar;
    });
    define("sources/darklyrics.com", [ "require", "exports", "module", "LyricsSource", "SourceScraperUtils", "algorithms" ], function(require, exports) {
        function strip(s) {
            return s.replace(/[^a-z0-9'. ]/i, " ").replace(/\s+/, " ").trim();
        }
        function encodeMagic(s) {
            return s.replace(/[^A-Za-z0-9@*_+-.\/]/g, function(c) {
                var codepoint = c.charCodeAt(0);
                if (256 > codepoint) {
                    c = codepoint.toString(16);
                    16 > codepoint && (c = "0" + c);
                    return "%" + c;
                }
                return encodeURIComponent(c);
            });
        }
        function formatSongTitle(songTitle) {
            return songTitle && songTitle.replace(/^\s*\d+\./, "").trim() || "";
        }
        function getMostLikelyEntry(nodes, term) {
            for (var bestMatchNode, bestMatchSimilarityCoefficient = -1 / 0, i = 0; nodes.length > i; i++) {
                var a = nodes[i], aTitle = formatSongTitle(a.textContent).toLowerCase(), dsc = algorithms.getSimilarityCoefficient(aTitle, term);
                if (dsc > bestMatchSimilarityCoefficient) {
                    bestMatchSimilarityCoefficient = dsc;
                    bestMatchNode = a;
                }
            }
            return bestMatchSimilarityCoefficient > .3 ? bestMatchNode : null;
        }
        var LyricsSource = require("LyricsSource").LyricsSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils, algorithms = require("algorithms");
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "darklyrics.com",
            homepage: "http://www.darklyrics.com/",
            description: "Dark Lyrics provides Metal lyrics for 4500+ bands.",
            r_url_result: /^https?:\/\/www\.darklyrics\.com\/lyrics\/[^\/]+\/[^\/]+\.html($|[?#])/i,
            url_result: function(query) {
                return "http://www.darklyrics.com/search?q=" + encodeMagic(strip(this.$ARTIST(query, {
                    keepAccents: !0
                })) + " " + strip(this.$SONG(query, {
                    keepAccents: !0
                })));
            },
            url_search: function(query) {
                return "http://www.darklyrics.com/search?q=" + encodeMagic(strip(this.$SEARCHTERMS(query, {
                    keepAccents: !0
                })));
            },
            process_result: function(responseText, callbacks, data) {
                if (/^https?:\/\/www\.darklyrics\.com\/search/.test(data.url)) return this.process_search(responseText, callbacks, data);
                var doc = SourceScraperUtils.toDOM(responseText), toc = doc.querySelectorAll("h3 > a");
                if (toc) {
                    var artist = doc.title.split(/\sLyrics\s/i, 1)[0].toLowerCase(), song = data.query.song && this.$SONG(data.query);
                    if (!song) {
                        song = this.$SEARCHTERMS(data.query) || "";
                        song = song.toLowerCase().replace(artist, " ");
                        song = song.replace(/\s+/, " ").replace(/^[\s\-]+|[\s\-]+$/g, "");
                    }
                    var bestMatchAnchor = getMostLikelyEntry(toc, song);
                    if (bestMatchAnchor && bestMatchAnchor.parentNode) {
                        var lyrics = SourceScraperUtils.toStringArray(bestMatchAnchor.parentNode.nextSibling, {
                            isFirstChild: !0,
                            isEndNode: function(node) {
                                return "H3" === node.nodeName.toUpperCase();
                            }
                        });
                        if (lyrics.length) {
                            artist = artist.replace(/([a-z])(\S*)/g, function(full_match, firstChar, remainder) {
                                return firstChar.toUpperCase() + remainder.toLowerCase();
                            });
                            song = formatSongTitle(bestMatchAnchor.textContent);
                            var title = artist + " - " + song;
                            callbacks.found({
                                lyrics: lyrics,
                                title: title,
                                url: data.url.replace(/(#\d*)?$/, "#" + bestMatchAnchor.name)
                            });
                        } else callbacks.fail();
                    } else callbacks.fail();
                } else callbacks.fail();
            },
            process_search: function(responseText, callbacks, data) {
                var doc = SourceScraperUtils.toDOM(responseText), as = doc.querySelectorAll('a[href*="lyrics/"][href*=".html#"]'), a = getMostLikelyEntry(as, this.$SEARCHTERMS(data.query)), url = a && a.getAttribute("href").replace(/^(?!http)/i, "http://www.darklyrics.com/");
                /^http:\/\/www\.darklyrics\.com\/lyrics\//i.test(url) ? callbacks.found({
                    redir: url
                }) : callbacks.fail();
            }
        });
    });
    define("sources/metal-archives.com", [ "require", "exports", "module", "LyricsSource", "SourceScraperUtils", "algorithms" ], function(require, exports) {
        function getMostLikelyEntry(list, term, extractTerm) {
            if (list) {
                for (var highestMatchIndex = -1, highestMatchCoefficient = -1 / 0, i = 0; list.length > i; i++) {
                    var needle = extractTerm(list[i]);
                    if (needle) {
                        var coefficient = algorithms.getSimilarityCoefficient(needle, term);
                        if (coefficient > highestMatchCoefficient) {
                            highestMatchIndex = i;
                            highestMatchCoefficient = coefficient;
                            if (1 == coefficient) break;
                        }
                    }
                }
                return highestMatchCoefficient > .3 ? highestMatchIndex : -1;
            }
        }
        var LyricsSource = require("LyricsSource").LyricsSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils, algorithms = require("algorithms"), re_ajax_url = /^https?:\/\/www\.metal-archives\.com\/search\/ajax-advanced\/searching\/songs\/\?songTitle=(.*?)&bandName=(.*)/, re_page_url = /^https?:\/\/www\.metal-archives\.com\/albums\/([^\/]+)\/([^\/]+).*/i, re_resp_url = /"https?:\/\/www\.metal-archives\.com\/albums\/([^\/]+)\/([^\/]+).*?"/i;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "metal-archives.com",
            homepage: "http://www.metal-archives.com/",
            description: "The Metal Archives is an extensive database (90k+ bands) of metal lyrics.",
            r_url_result: re_page_url,
            url_result: function(query) {
                return "http://www.metal-archives.com/search/ajax-advanced/searching/songs/?songTitle=" + encodeURIComponent(this.$SONG(query)) + "&bandName=" + encodeURIComponent(this.$ARTIST(query));
            },
            url_search: function(query) {
                return SourceScraperUtils.search.get_url({
                    site: "metal-archives.com/albums",
                    query: this.$SEARCHTERMS(query)
                });
            },
            process_result: function(responseText, callbacks, data) {
                if (re_ajax_url.test(data.url) || re_page_url.test(data.url)) return this.process_search(responseText, callbacks, data);
                if (/^\s*(<[^>]*>)?\(lyrics not available\)/i.test(responseText)) callbacks.fail(); else {
                    var doc = SourceScraperUtils.toDOM(responseText), toc = doc.querySelectorAll("h3 > a");
                    if (toc) {
                        var lyrics = SourceScraperUtils.toStringArray(doc.body);
                        lyrics.length ? callbacks.found({
                            lyrics: lyrics,
                            title: data.tempData && data.tempData.song_title || "(N/A)",
                            url: data.tempData && data.tempData.song_url || data.url
                        }) : callbacks.fail();
                    } else callbacks.fail();
                }
            },
            process_search: function(responseText, callbacks, data) {
                if (/^https?:\/\/www\.metal-archives\.com\//.test(data.url)) {
                    var artist, song, url_for_user, bestMatchIndex, matched_url, metalArchiveID;
                    if (re_ajax_url.test(data.url)) try {
                        var res = JSON.parse(responseText);
                        artist = this.$ARTIST(data.query);
                        song = this.$SONG(data.query);
                        if (!res || !res.aaData || !res.aaData.length) {
                            callbacks.fail();
                            return;
                        }
                        bestMatchIndex = getMostLikelyEntry(res.aaData, artist + "/" + song, function(item) {
                            var artist_song = item[1] && re_resp_url.exec(item[1]);
                            return artist_song ? artist_song[1] + "/" + artist_song[2] : void 0;
                        });
                        if (-1 === bestMatchIndex) {
                            callbacks.fail();
                            return;
                        }
                        var item = res.aaData[bestMatchIndex];
                        matched_url = re_resp_url.exec(item[1]);
                        url_for_user = matched_url[0];
                        artist = item[0].match(/[^><]+(?=<\/a>)/i);
                        artist = artist && artist[0].trim() || decodeURIComponent(matched_url[1]).replace(/_/, " ");
                        song = item[3];
                        metalArchiveID = /lyricsLink_(\d+)/.exec(item[4]);
                        metalArchiveID = metalArchiveID ? metalArchiveID[1] : 0;
                    } catch (e) {
                        callbacks.fail();
                        return;
                    } else if (re_page_url.test(data.url)) {
                        var doc = SourceScraperUtils.toDOM(responseText), rows = doc.querySelectorAll("tr[id^=song]");
                        artist = doc.querySelector(".band_name");
                        if (artist) artist = artist.textContent.trim(); else {
                            matched_url = re_page_url.match(data.url);
                            artist = decodeURIComponent(matched_url[1]).replace(/_/, " ");
                        }
                        song = data.query.song && this.$SONG(data.query);
                        var prefix = "";
                        if (!song) {
                            song = this.$SEARCHTERMS(data.query);
                            prefix = artist;
                        }
                        song = song.toLowerCase();
                        bestMatchIndex = getMostLikelyEntry(rows, song, function(tr) {
                            if (/\d/.test(tr.id)) {
                                tr = tr.previousElementSibling;
                                return tr && tr.cells && tr.cells[1] ? prefix + " " + tr.cells[1].textContent.trim().toLowerCase() : void 0;
                            }
                        });
                        if (-1 === bestMatchIndex) {
                            callbacks.fail();
                            return;
                        }
                        var tr = rows[bestMatchIndex];
                        url_for_user = data.url;
                        song = tr.previousElementSibling.cells[1].textContent.trim();
                        metalArchiveID = tr.id.replace(/\D+/, "");
                    }
                    callbacks.found({
                        redir: "http://www.metal-archives.com/release/ajax-view-lyrics/id/" + metalArchiveID,
                        tempData: {
                            song_url: url_for_user,
                            song_title: artist + " - " + song
                        }
                    });
                } else SourceScraperUtils.search.getResultsFromResponse(responseText, data, function(a_urls) {
                    for (var i = 0; a_urls.length > i; ++i) {
                        var url = a_urls[i];
                        if (re_page_url.test(url)) {
                            callbacks.found({
                                redir: url
                            });
                            return;
                        }
                    }
                    callbacks.fail();
                });
            }
        });
    });
    define("sources/musica.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "musica.com",
            homepage: "http://www.musica.com/",
            description: "Spanish site with 800k lyrics.",
            searchterms_result: '"Letra de" "$SONG" de "$ARTIST"',
            searchterms_search: '"Letra de" "$SEARCHTERMS',
            r_url_result: /^https?:\/\/www\.musica\.com\/letras\.asp\?.*?letra=\d+/i,
            result_encoding: "iso-8859-1",
            process_result_exclude_pattern: /Letra no disponible/,
            process_result_selector: 'table[width="98%"] font[style*="line-height"][style*=family]',
            process_result_get_title: function(doc) {
                var nav, song = doc.querySelector('h1 a[href*="letras.asp?letra="]'), artist = doc.querySelector('h1 a[href*="letras.asp?musica="]');
                if (song && artist) {
                    artist = artist.textContent.trim();
                    song = song.textContent.replace(/\([^)]*\)\s*$/, "").trim();
                } else if (nav = doc.title.match(/^Letra de (.+) de (.+) - MUSICA\.COM$/)) {
                    artist = nav[1];
                    song = nav[2];
                }
                return artist && song ? artist + " - " + song : void 0;
            },
            process_search_replace_url: [ "version=movil", "", "print=1&", "" ],
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.replace(/([a-z])!([a-z])/gi, "$1i$2");
                value = value.replace(/[":']/g, " ");
                value = value.replace(/ +/, " ");
                return value;
            }
        });
    });
    define("sources/shironet.mako.co.il", [ "require", "exports", "module", "LyricsSource", "SourceScraperUtils" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils, isHebrew = function(string) {
            return /[\u0590-\u05FF]/.test(string);
        };
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "shironet.mako.co.il",
            homepage: "http://shironet.mako.co.il/",
            description: "The best source for Hebrew lyrics.",
            r_url_result: /^https?:\/\/shironet\.mako\.co\.il\/artist\?type=lyrics/,
            url_result: function(query) {
                return this.url_search(query);
            },
            url_search: function(query) {
                query = this.$SEARCHTERMS(query);
                return isHebrew(query) ? "http://shironet.mako.co.il/searchSongs?type=lyrics&q=" + encodeURIComponent(query) : "";
            },
            process_result: function(responseText, callbacks, data) {
                if (/^https?:\/\/shironet\.mako\.co\.il\/searchSongs/.test(data.url)) return this.process_search(responseText, callbacks, data);
                var doc = SourceScraperUtils.toDOM(responseText), lyricbox = doc.querySelector(".artist_lyrics_text"), lyrics = SourceScraperUtils.toStringArray(lyricbox);
                if (lyrics.length) {
                    var artist = doc.querySelector(".artist_singer_title");
                    artist = artist && artist.textContent.trim();
                    var song = doc.querySelector(".artist_song_name_txt");
                    song = song && song.textContent.trim();
                    var title = artist + " - " + song;
                    callbacks.found({
                        lyrics: lyrics,
                        title: title
                    });
                } else callbacks.fail();
            },
            process_search: function(responseText, callbacks) {
                var doc = SourceScraperUtils.toDOM(responseText), a = doc.querySelector('a[href*="/artist?type=lyrics"][class*="search"]'), url = a && a.getAttribute("href").replace(/^\//i, "http://shironet.mako.co.il/");
                url ? callbacks.found({
                    redir: url
                }) : callbacks.fail();
            },
            $ARTIST$SONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.replace(/[^\u0590-\u05FF\d\-]+/g, " ");
                value = value.replace(/^[ \-]+|[ \-]+$/g, "");
                value = value.replace(/ +/g, " ");
                return value;
            },
            $SEARCHTERMS: function(query, options) {
                var s, formatQuery = function(s) {
                    s = s.replace(/[^\u0590-\u05FF\d\-]+/g, " ");
                    s = s.replace(/(מילים לשיר|עם מילים|עם כתוביות|קאבר|אקוסטי|בהופעה)/g, " ");
                    s = s.replace(/^[ \-]+|[ \-]+$/g, "");
                    s = s.replace(/ +/g, " ");
                    return s;
                };
                if (!query.videotitle) {
                    s = query.searchTerms;
                    if (!s) {
                        var artist = this.$ARTIST(query, options), song = this.$SONG(query, options);
                        artist && song && (s = formatQuery(artist + " - " + song));
                    }
                }
                if (!s && query.videotitle) {
                    s = query.videotitle;
                    s = s.replace(/\([^)]*\)/g, " ");
                    s = s.replace(/\[[^\]]*\]/g, " ");
                    s = formatQuery(s);
                    s || (s = formatQuery(query.videotitle));
                }
                return s;
            }
        });
    });
    define("sources/angolotesti.it", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "angolotesti.it",
            homepage: "http://www.angolotesti.it/",
            description: "The largest lyrics provider of Italy, with hundred thousands of lyrics.",
            searchterms_result: "$SONG Testo $ARTIST",
            searchterms_search: "$SEARCHTERMS Testo",
            r_url_result: /^https?:\/\/(?:www\.)?angolotesti\.it\/([0-9a-z])\/[^\/]*\d\/[^\/]*\d/i,
            process_result_selector: ".testo",
            process_result_get_title: function(doc) {
                return doc.title.replace(/^(.+?) Testo (.+?)$/, "$2 - $1");
            }
        });
    });
    define("sources/paroles2chansons.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "paroles2chansons.com",
            homepage: "http://paroles2chansons.lemonde.fr/",
            description: "Lyrics for French and popular foreign songs.",
            searchterms_site: "paroles2chansons.lemonde.fr",
            searchterms_result: "Paroles $SONG - $ARTIST lyrics",
            searchterms_search: "Paroles $SEARCHTERMS lyrics",
            r_url_result: /^https?:\/\/((www|m)\.paroles2chansons\.com|paroles2chansons\.lemonde\.fr)\/paroles-[^\/]+\/paroles-.*?.html.*$/i,
            process_result_selector: "h1 ~ div.text-center",
            process_result_scraper_options: {
                tags: /^([buip]|strong|em)$/i,
                flushBefore: /^(br|p)$/i,
                flushAfter: /^p$/i,
                isEndNode: function(node) {
                    return 1 == node.nodeType ? "H2" === node.tagName.toUpperCase() : void 0;
                }
            },
            process_result_get_title: function(doc) {
                var title = doc.title.replace(/^Paroles /, "").replace(/ \(traduction et lyrics\)$/, "").match(/^(.+) - (.+)$/);
                return title ? title[2] + " - " + title[1] : void 0;
            }
        });
    });
    define("sources/genius.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "genius.com",
            homepage: "http://genius.com/",
            description: "Over 100k of rap, rock and some pop lyrics.",
            searchterms_site: "genius.com",
            searchterms_result: "$ARTIST $SONG Lyrics",
            searchterms_search: "$SEARCHTERMS Lyrics",
            r_url_result: /^https?:\/\/(?:rap\.|rock\.|pop\.)?(?:rap)?genius\.com\/(?:[^\/]+-lyrics\/?|\d+)/,
            process_result_selector: ".lyrics",
            process_result_scraper_options: {
                tags: /^(?:[abuip]|strong|em|table|tbody|tr|td)$/i,
                flushAfter: /^(?:p|td)$/i,
                lineAfterFlush: /^(?:p|table)$/i
            },
            process_result_get_title: function(doc) {
                var title = doc.title.split(/ (?:Lyrics )?\|/, 1)[0].replace("–", "-");
                return title;
            },
            process_search_replace_url: [ /rapgenius\.com/i, "genius.com", /\.com\/\d+\/([^\/]+)/i, ".com/$1-lyrics", /-lyrics\/.*$/, "-lyrics" ]
        });
    });
    define("sources/tekstowo.pl", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "tekstowo.pl",
            homepage: "http://www.tekstowo.pl/",
            description: "The largest Polish lyrics site with 700k+ lyrics (including songs from other languages).",
            searchterms_result: "$ARTIST - $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.tekstowo\.pl\/piosenka,[^,]+,[^,]+.html($|[?#])/i,
            process_result_selector: ".song-text > h2",
            process_result_scraper_options: {
                isFirstChild: !0
            },
            process_result_get_title: function(doc) {
                return doc.title.split(" - tekst piosenki, ", 1)[0];
            }
        });
    });
    define("sources/animelyrics.com", [ "require", "exports", "module", "LyricsSource", "SourceScraperUtils" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils, getSubtree = function(responseText, leading, trailing) {
            var index = responseText.indexOf(leading);
            if (-1 !== index) {
                var lastIndex = responseText.indexOf(trailing, index);
                if (-1 !== lastIndex) {
                    responseText = responseText.substring(index, lastIndex + trailing.length);
                    var doc = SourceScraperUtils.toDOM("<body>" + responseText + "</body>");
                    return doc.body.firstElementChild;
                }
            }
        };
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "animelyrics.com",
            homepage: "http://www.animelyrics.com/",
            description: "Anime, J-Pop / J-Rock - Japanese lyrics (Romaji and Kanji). English translations are often available.",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.animelyrics\.com\/(?:anime|game|jpop|dance|dancecd|doujin)\/[^\/]+\/[^\/]+\.(?:htm|jis)($|[?#])/i,
            process_result: function(responseText, callbacks, data) {
                if (SourceScraperUtils.search.isSearchURL(data.url)) return this.process_search(responseText, callbacks, data);
                var lyrics, node = getSubtree(responseText, "<div id=kanji>", "</div>");
                node && (lyrics = SourceScraperUtils.toStringArray(node, {
                    tags: /^a$/i
                }));
                if (!node && (node = getSubtree(responseText, "<table border=0 cellspacing=0>", "</table>"))) {
                    for (var fragment = document.createDocumentFragment(), lyricParagraphs = node.querySelectorAll(".romaji .lyrics"), i = 0; lyricParagraphs.length > i; ++i) fragment.appendChild(lyricParagraphs[i]);
                    lyrics = SourceScraperUtils.toStringArray(fragment, {
                        tags: /^span$/i,
                        flushAfter: /^span$/i
                    });
                }
                !node && (node = getSubtree(responseText, "<span class=lyrics>", "</span>")) && (lyrics = SourceScraperUtils.toStringArray(node));
                if (lyrics && lyrics.length) {
                    var title, crumbs = getSubtree(responseText, '<ul id="crumbs">', "</ul>").querySelectorAll("li"), artist = crumbs[crumbs.length - 2], song = crumbs[crumbs.length - 1];
                    if (artist && song) {
                        artist = artist.textContent;
                        song = song.textContent.split(" - ", 1)[0];
                        title = artist.length > 30 ? song : artist + " - " + song;
                    } else title = "?";
                    callbacks.found({
                        lyrics: lyrics,
                        title: title
                    });
                } else callbacks.fail();
            }
        });
    });
    define("sources/mojim.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "mojim.com",
            homepage: "https://mojim.com/",
            description: "Millions of Asian (Chinese, Japanese, Korean, ...) and English lyrics.",
            searchengine: "google",
            searchterms_result: "$SONG $ARTIST mojim",
            searchterms_search: "$SEARCHTERMS mojim",
            r_url_result: /^https?:\/\/(?:[^\/]*\.)?mojim\.com\/(?:cn|jp|tw|us)y\d+x\d+x\d(?:\.htm)?($|[?#])/i,
            process_result_selector: "#fsZ > dl > dd",
            process_result_scraper_options: {
                tags: /^a$/i,
                ignoreNode: function(node) {
                    return 1 === node.nodeType && ("A" === node.tagName.toUpperCase() || !!node.querySelector("a"));
                }
            },
            process_result_get_title: function(doc) {
                var title = /^(.+) (?:\u6b4c[\u8bcd\u8a5e]|Lyrics) (.+) \u203b Mojim\.com/.exec(doc.title);
                if (title) {
                    var song = title[1].replace(/\(.*\)/g, "").trim(), artist = title[2].replace(/\(.*\)/g, "").trim();
                    return artist + " - " + song;
                }
            },
            process_search_replace_url: [ /^(https?:\/\/)(?!cn\.|jp\.|tw\.)[^\/]+\.(mojim\.com)/, "$1$2" ]
        });
    });
    define("sources/multi/google.com", [ "require", "exports", "module", "MultiLyricsSource", "SourceScraperUtils" ], function(require, exports) {
        var MultiLyricsSource = require("MultiLyricsSource").MultiLyricsSource, google = require("SourceScraperUtils").SourceScraperUtils.search.engines.google;
        exports.source = new MultiLyricsSource({
            disabled: !0,
            identifier: "google.com",
            searchProviderIdentifier: "google",
            homepage: "https://www.google.com/",
            description: "Search in all known lyrics sites at once using Google.\nIt is recommended to put this source near the top of the list.\nOnly disabled sources are used in the search query.",
            url_search: function(query) {
                var lyricsSources = this.getSources();
                if (!lyricsSources.length) return "";
                for (var search_url = "/search?gws_rd=cr&q=" + encodeURIComponent(this.$SEARCHTERMS(query) + " (site:" + lyricsSources[0].searchterms_site), i = 1; lyricsSources.length > i; ++i) {
                    var queryPart = encodeURIComponent(" OR site:" + lyricsSources[i].searchterms_site);
                    if (queryPart.length + search_url.length >= 2045) break;
                    search_url += queryPart;
                }
                search_url += ")";
                search_url = "https://www.google.com" + search_url;
                return search_url;
            },
            getResultsFromResponse: google.getResultsFromResponse
        });
    });
    define("sources/songmeanings.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "songmeanings.com",
            homepage: "http://songmeanings.com/",
            description: "A few million song lyrics in various languages.",
            searchterms_site: "songmeanings.com/songs/view",
            searchterms_result: "$ARTIST $SONG Lyrics",
            searchterms_search: "$SEARCHTERMS Lyrics",
            r_url_result: /^https?:\/\/songmeanings\.com\/songs\/view\/\d+\//,
            process_result_selector: "#textblock,.lyric-box",
            process_result_get_title: function(doc) {
                var title = doc.title.split(" Lyrics | ", 1)[0];
                return title;
            }
        });
    });
    define("sources/songlyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "songlyrics.com",
            homepage: "http://www.songlyrics.com/",
            description: "Over 750k lyrics.",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.songlyrics\.com\/[^\/]+\/[^\/]+-lyrics\//i,
            url_result: "http://www.songlyrics.com/$ARTIST/$SONG-lyrics/",
            process_result_selector: "#songLyricsDiv",
            process_result_get_title: function(doc) {
                var title = doc.querySelector("h1");
                title = title ? title.textContent : doc.title;
                title = title.replace(/ Lyrics$/i, "");
                return title;
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/([a-z])!([a-z])/g, "$1i$2");
                value = value.replace(/\./g, "-");
                value = value.replace(/[^a-z0-9+\- !]/g, "");
                value = value.replace(/[\- ]+/g, "-");
                return value;
            },
            $SONG: function(query, options) {
                var song = LyricsSource.prototype.$SONG.call(this, query, options);
                song = song.replace(/-$/, "");
                return song;
            }
        });
    });
    define("sources/songteksten.nl", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "songteksten.nl",
            homepage: "http://http://songteksten.nl/",
            description: "Dutch site with over 350k song lyrics.",
            searchterms_site: "songteksten.nl/songteksten",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.songteksten\.nl\/songteksten\/\d+/i,
            process_result_selector: 'span[itemprop="description"]',
            process_result_get_title: function(doc) {
                var title = doc.title.match(/^\u266b (.*) songtekst \|/);
                return title ? title[1] : void 0;
            }
        });
    });
    define("sources/stixoi.info", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "stixoi.info",
            homepage: "http://www.stixoi.info/",
            description: "A Greek website with over 55k Greek lyrics.",
            searchterms_result: '"stixoi.php?info=Lyrics" "song_id" $SONG $ARTIST',
            searchterms_search: '"stixoi.php?info=Lyrics" "song_id" $SEARCHTERMS',
            r_url_result: /^https?:\/\/www\.stixoi.info\/stixoi.php\?info=Lyrics&act=(det2edit|details)&song_id=\d+/i,
            process_result_selector: "div.lyrics",
            process_result_get_title: function(doc) {
                var artist = doc.querySelector('.creators a[href*="singer_id"]');
                artist = artist ? artist.textContent : "";
                var song = doc.title.replace("stixoi.info: ", "");
                return artist + " - " + song;
            },
            process_search_replace_url: [ /\bact=(det2edit|details)\b/i, "act=details", /\binfo=lyrics\b/i, "info=Lyrics" ]
        });
    });
    define("sources/plyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "plyrics.com",
            homepage: "http://www.plyrics.com/",
            description: "Lyrics for punk, indie, hardcore and ska songs.",
            r_url_result: /^https?:\/\/www\.plyrics\.com\/lyrics\/[^\/]+\/[^\/]+\.html($|[?#])/i,
            url_result: "http://www.plyrics.com/lyrics/$ARTIST/$SONG.html",
            searchterms_site: "www.plyrics.com",
            searchterms_search: "$SEARCHTERMS",
            process_result_selector: "h1 + h3",
            process_result_scraper_options: {
                isFirstChild: !0,
                isEndNode: function(node) {
                    return 8 === node.nodeType && " end of lyrics " === node.data;
                }
            },
            process_result_get_title: function(doc) {
                var title = doc.title.split("LYRICS -");
                title[0] = title[0].replace(/([A-Z])(\S*)/g, function(full_match, firstChar, remainder) {
                    return firstChar.toUpperCase() + remainder.toLowerCase();
                });
                title = title.join("-");
                return title;
            },
            $ARTIST$SONG: function(value, options) {
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                value = value.toLowerCase();
                value = value.replace(/([a-z])!([a-z])/g, "$1i$2");
                value = value.replace(/^(the|an?) /, "");
                value = value.replace(/[^a-z0-9]/g, "");
                return value;
            }
        });
    });
    define("sources/guitarparty.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "guitarparty.com",
            homepage: "http://www.guitarparty.com/",
            description: "Icelandic lyrics and guitar chords (guitar chords not displayed by extension, just click on the link to their website).",
            searchterms_result: "song $ARTIST $SONG",
            searchterms_search: "song $SEARCHTERMS",
            r_url_result: /^https?:\/\/[^.]+\.guitarparty.com\/(en|is)?\/?song\/[^\/]+($|[\/?#])/,
            process_result_selector: ".song-no-chords",
            process_result_scraper_options: {
                tags: /^p$/i,
                flushAfter: /^p$/i
            },
            process_result_get_title: function(doc) {
                var title = /^(.+) \(\s*(.*?)\s*\) ‒/.exec(doc.title);
                return title ? title[2] + " - " + title[1] : void 0;
            },
            process_search_replace_url: [ /:\/\/[^.]+\./i, "://www." ],
            $ARTIST$SONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                return LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
            },
            $SEARCHTERMS: function(query, options) {
                (options || (options = {})).keepAccents = !0;
                return LyricsSource.prototype.$SEARCHTERMS.call(this, query, options);
            }
        });
    });
    define("sources/lyrics.my", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "lyrics.my",
            homepage: "http://www.lyrics.my/",
            description: "Lyrics for Malaysian, Indonesian, Nasyid and some English songs (about 20k).",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.lyrics\.my\/artists\/.+\/lyrics\/./i,
            process_result_selector: ".show_lyric",
            process_result_scraper_options: {
                tags: /^(?:[buip]|strong|em)$/i,
                flushBefore: /^(?:br|p)$/i,
                flushAfter: /^p$/i,
                ignoreNode: function(node) {
                    return 1 !== node.nodeType || /^br$/i.test(node.tagName) && (node = node.previousSibling) ? 3 === node.nodeType ? node.nodeValue.lastIndexOf("://lyrics.my") > 0 : void 0 : !1;
                }
            },
            process_result_get_title: function(doc) {
                var title = doc.title.split(" Lyrics | Lyrics.My", 1)[0];
                return title;
            }
        });
    });
    define("sources/lyricsmasti.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "lyricsmasti.com",
            homepage: "http://www.lyricsmasti.com/",
            description: "Lyrics for Hindi movie songs.",
            searchterms_result: "Lyrics of $SONG $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.lyricsmasti\.com\/song\/\d+\/.*lyrics.+$/i,
            process_result_selector: "#lyrics .pre code",
            process_result_scraper_options: {
                tags: /^(?:[bui]|strong|em|span)$/i,
                splitAtLF: !0,
                ignoreLine: function(text) {
                    return /l[ .]*y[ .]*r[ .]*i[ .]*c[ .]*s[ .]*m[ .]*a[ .]*s[ .]*t[ .]*i[ .]*c[ .]*o[ .]*m/i.test(text);
                }
            },
            process_result_get_title: function(doc) {
                var crumbs = doc.querySelectorAll("#breadcrumbs-one a[href]"), lasti = crumbs.length - 1;
                return crumbs.length > 2 && /\/song\//.test(crumbs[lasti].getAttribute("href")) ? crumbs[lasti - 1].textContent + " - " + crumbs[lasti].textContent : void 0;
            },
            process_search_replace_url: [ /\?.+$/, "" ]
        });
    });
    define("sources/hindilyrics.net", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "hindilyrics.net",
            homepage: "http://www.hindilyrics.net/",
            description: "Lyrics for Hindi, Kannada, Marathi and Telugu movie songs and albums.",
            searchterms_site: "myhindilyrics.com",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.(hindilyrics\.net|myhindilyrics\.com)\/([a-z]*-)?lyrics\/of-.+$/i,
            process_result_selector: "pre > font",
            process_result_scraper_options: {
                splitAtLF: !0
            },
            process_result_get_title: function(doc) {
                var title = /^(.+) Lyrics \((.+)\)$/.exec(doc.title);
                if (title) return title[2] + " - " + title[1];
                var movie = doc.querySelector('a[href*="-lyrics/of-"][href$=".html"]');
                if (movie && movie.nextSibling) {
                    var song = movie.nextSibling.textContent.trim();
                    if (">" == song.charAt(0)) {
                        movie = movie.textContent.trim();
                        song = song.replace(/^>\s*/, "");
                        return movie + " - " + song;
                    }
                }
            }
        });
    });
    define("sources/lyricsmint.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource, nobraces = function(s) {
            return s.replace(/\([^)]+\)/g, "").replace(/\s+/g, " ").trim();
        };
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "lyricsmint.com",
            homepage: "http://www.lyricsmint.com/",
            description: "Hindi (movie) song lyrics.",
            searchterms_result: "$SONG Lyrics $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.lyricsmint\.com\/\d{4}\/\d{2}\/.*$/i,
            process_result_selector: "#lyric > h2 + *",
            process_result_scraper_options: {
                tags: /^(?:[buip]|strong|em)$/i,
                isFirstChild: !0
            },
            process_result_get_title: function(doc) {
                var songinfo = doc.querySelector(".songinfo b");
                if (songinfo) {
                    songinfo = /^\s*(.+) Lyrics (?:from|by) (.+?)\s*:\s*$/i.exec(songinfo.textContent);
                    if (songinfo) return nobraces(songinfo[2]) + " - " + nobraces(songinfo[1]);
                }
            }
        });
    });
    define("sources/newreleasetoday.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "newreleasetoday.com",
            homepage: "http://www.newreleasetoday.com/",
            description: "Christian lyrics.",
            searchterms_result: "$SONG Lyrics by $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.newreleasetoday\.com\/lyricsdetail.php?.*lyrics_id=\d+/i,
            process_result_selector: "p.reviews",
            process_result_scraper_options: {
                isFirstChild: !0
            },
            process_result_get_title: function(doc) {
                var title = /^(.+?) Song Lyrics \| (.+?) Lyrics \|/.exec(doc.title);
                return title ? title[2] + " - " + title[1] : void 0;
            }
        });
    });
    define("sources/karaoketexty.cz", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "karaoketexty.cz",
            homepage: "http://www.karaoketexty.cz/",
            description: "Czech lyrics site with a few hundred thousand lyrics (mainly Czech and English, but also some other languages).",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.karaoketexty\.cz\/texty-pisni\/[^\/]*[^\/0-9]\/.+/i,
            process_result_selector: ".text",
            process_result_get_title: function(doc) {
                var title = doc.querySelector('meta[property="og:title"]');
                return title ? title.getAttribute("content") : void 0;
            },
            $ARTISTSONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                return value;
            }
        });
    });
    define("sources/supermusic.sk", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "supermusic.sk",
            homepage: "http://www.supermusic.sk/",
            description: "Slovak lyrics site with almost 100k lyrics in Slovak, English and other languages.",
            searchengine: "google",
            searchterms_result: "skupina $ARTIST $SONG text -intitle:preklad",
            searchterms_search: "skupina $SEARCHTERMS -intitle:preklad",
            r_url_result: /^https?:\/\/www\.supermusic\.(sk|eu|cz)\/skupina\.php\?.*idpiesne=\d+/i,
            process_result_exclude_pattern: /illegally published copyright content/,
            process_result_selector: "td.piesen > font",
            process_result_scraper_options: {
                tags: /^(?:pre|[bui]|strong|em)$/i,
                ignoreNode: function(node) {
                    if (3 === node.nodeType) {
                        var nodeValue = node.nodeValue;
                        if (/^[ehgda]--|^   A  /.test(nodeValue)) return !0;
                        if (nodeValue.lastIndexOf(":") >= 0) {
                            var nextSibling = node.nextSibling;
                            if (nextSibling && 3 === nextSibling.nodeType) return 0 === nextSibling.nodeValue.lastIndexOf("   A  ", 0);
                        }
                    }
                }
            },
            process_result_get_title: function(doc) {
                var title = /^(.+ - .+) \[(?!preklad).*Supermusic[a-z.]{0,3}\]$/.exec(doc.title);
                return title ? title[1] : void 0;
            },
            $ARTISTSONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                return value;
            }
        });
    });
    define("sources/tekstove.info", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "tekstove.info",
            homepage: "http://tekstove.info/",
            description: "Bulgarian song lyrics (and other languages including English, German, French, Italian, Serbian, Greek and Russian).",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/tekstove.info\/(browse.php?.*\bid=\d+|lyric\/view\/\d+)/i,
            process_result_selector: ".panel-body:first-child",
            process_result_get_title: function(doc) {
                var title = doc.title.split(/\s+\|?\s+текст/, 1)[0];
                return title;
            }
        });
    });
    define("sources/paadalvarigal.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "paadalvarigal.com",
            homepage: "http://www.paadalvarigal.com/",
            description: "Tamil (movie) song lyrics.",
            searchterms_result: "$SONG $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.paadalvarigal\.com\/\d+/i,
            process_result_selector: "div.entry",
            process_result_scraper_options: {
                tags: /^(?:[buip]|strong|em)$/i,
                flushAfter: /^p$/i,
                lineAfterFlush: /^p$/i
            },
            process_result_get_title: function(doc) {
                var title = /^(.+) Song Lyrics From (.+)$/.exec(doc.title);
                return title ? title[2] + " - " + title[1] : void 0;
            }
        });
    });
    define("sources/tamillyrics.hosuronline.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "tamillyrics.hosuronline.com",
            homepage: "http://tamillyrics.hosuronline.com/",
            description: "Lyrics for old Tamil (movie) song.",
            searchterms_result: "$SONG $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/tamillyrics\.hosuronline\.com\/index\.php\/[^\/]+\/($|[?#])/i,
            process_result_selector: "#content > h1 + div > a:first-child, #content > h1 + div > p:first-child",
            process_result_scraper_options: {
                isFirstChild: !0,
                tags: /^(?:[buip]|strong|em)$/i,
                flushAfter: /^p$/i,
                lineAfterFlush: /^p$/i,
                isEndNode: function(node) {
                    if (1 == node.nodeType) {
                        var tag = node.tagName.toUpperCase();
                        if ("P" == tag) {
                            var child = node.firstElementChild;
                            return child && "STRONG" == child.tagName.toUpperCase() && node.textContent.indexOf(":") > 0;
                        }
                        if ("A" == tag) return node.href.indexOf("/tag/") > 0;
                    }
                }
            },
            process_result_get_title: function(doc) {
                var movie, song, lyricsBox = doc.querySelector("#content > h1 + div");
                if (lyricsBox) {
                    song = lyricsBox.previousElementSibling.textContent;
                    if (lyricsBox.firstElementChild && lyricsBox.firstElementChild.href) movie = lyricsBox.firstElementChild.textContent; else {
                        for (var children = lyricsBox.children, i = children.length - 1; i >= 0 && !movie; --i) movie = /\bMovie Title:\s*(.+)/i.exec(children[i].textContent);
                        movie = movie && movie[1];
                    }
                    if (movie && song) return movie + " - " + song;
                }
            },
            process_search_replace_url: [ /\/\?.*/, "/" ]
        });
    });
    define("sources/siamzone.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "siamzone.com",
            homepage: "http://www.siamzone.com/music/",
            description: "Thai site with lyrics (Thai and other languages).",
            searchengine: "google",
            searchterms_site: "www.siamzone.com/music/",
            searchterms_result: "$SONG $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.siamzone\.com\/music\/(thai)?lyric\/(\d+|index\.php\?.*mode=view)/i,
            process_result_selector: [ "#lyric_content", "#lyrics-content", "article > div.uk-text-center-medium" ],
            process_result_scraper_options: {
                splitAtLF: !0,
                tags: /^([buip]|strong|em)$/i
            },
            process_result_get_title: function(doc) {
                var title = /^\s*\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e40\u0e1e\u0e25\u0e07\s*(.+) - (.+?)\s*$/.exec(doc.title);
                return title ? title[2] + " - " + title[1] : void 0;
            }
        });
    });
    define("sources/kpoplyrics.net", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource, isHeadingOrFat = function(node) {
            if (1 !== node.nodeType) return !1;
            var tagName = node.nodeName.toUpperCase();
            return "H1" == tagName || "H2" == tagName || "STRONG" == tagName || "B" == tagName;
        };
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "kpoplyrics.net",
            homepage: "http://www.kpoplyrics.net/",
            description: "K-pop lyrics (Korean song lyrics, romanized).",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.kpoplyrics\.net\/.+-lyrics(?:-.*|)\.html/i,
            process_result_selector: [ ".article > h2, .article > h1", ".article > p" ],
            process_result_scraper_options: {
                isFirstChild: !0,
                isEndNode: function(node) {
                    return this.lines.length > 2 && isHeadingOrFat(node) ? /English Translation/i.test(node.textContent) : 3 === node.nodeType ? /Translation Credits/.test(node.nodeValue) : void 0;
                },
                ignoreNode: function(node) {
                    if (isHeadingOrFat(node)) {
                        var textContent = node.textContent;
                        if (/Romanized:/i.test(textContent)) {
                            this.tmpLine = "";
                            this.lines.length = 0;
                            return !0;
                        }
                        return /with individual parts/i.test(textContent);
                    }
                    return !1;
                },
                tags: /^([buip]|strong|em)$/i,
                flushBefore: /^(br|p)$/i,
                flushAfter: /^p$/i,
                lineAfterFlush: /^p$/i
            },
            process_result_get_title: function(doc) {
                var title = doc.querySelector(".posttitle");
                title = title && /^\s*(.+) – (.+) Lyrics\s*$/.exec(title.textContent);
                return title ? title[1] + " - " + title[2] : void 0;
            }
        });
    });
    define("sources/lololyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        function getTextContent(xmlNode) {
            return xmlNode && (xmlNode.textContent || false || "");
        }
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "lololyrics.com",
            homepage: "http://www.lololyrics.com/lyrics",
            description: "20k+ lyrics for mainly electronic dance music.",
            searchterms_site: "www.lololyrics.com/lyrics",
            searchterms_search: "$SEARCHTERMS",
            url_result: "http://api.lololyrics.com/0.5/getLyric?artist=$encARTIST&track=$encSONG&rawutf8=1",
            r_url_result: /^https?:\/\/(api\.lololyrics\.com\/getLyric.*([?&]artist=.*|[?&]track=.*){2}|www\.lololyrics\.com\/lyrics\/[0-9]+\.html)/,
            process_result_selector: ".lyrics_txt",
            process_result_get_title: function(doc) {
                var title = doc.querySelector('meta[property="og:title"]');
                title && (title = title.getAttribute("content"));
                title && (title = title.replace(/\s*(\([^)]+\)\s)? lyrics$/, ""));
                return title;
            },
            process_result_fallback: function(doc, callbacks, data) {
                var artist = /[?&]artist=([^&]+)/.exec(data.url), song = /[?&]track=([^&]+)/.exec(data.url);
                if (artist && song) {
                    artist = decodeURIComponent(artist[1]);
                    song = decodeURIComponent(song[1]);
                    var status = getTextContent(doc.querySelector("status")), response = getTextContent(doc.querySelector("response")), url = getTextContent(doc.querySelector("url"));
                    if ("OK" === status && response) {
                        var result = {
                            lyrics: response.split("\n"),
                            title: artist + " - " + song
                        };
                        /^https?:\/\/www\.lololyrics\.com\//.test(url) && (result.url = url);
                        callbacks.found(result);
                    } else callbacks.fail();
                } else callbacks.fail();
            }
        });
    });
    define("sources/gasazip.com", [ "require", "exports", "module", "LyricsSource", "SourceScraperUtils" ], function(require, exports) {
        function isKorean(str) {
            return /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/.test(str);
        }
        var LyricsSource = require("LyricsSource").LyricsSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "gasazip.com",
            homepage: "http://gasazip.com/",
            description: "Korean site with hundred thousands of lyrics for Korean songs (and many other languages).",
            searchengine: "google",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/(www\.|new\.)?gasazip\.com\/(\d+($|[?#])|(window\/)?view\.html\?.*((singer2=.+|title2=.+){2}|no=\d+))/i,
            url_result: function(query) {
                return isKorean(query.artist) && isKorean(query.song) ? "http://gasazip.com/view.html?singer2=" + this.$encARTIST(query) + "&title2=" + this.$encSONG(query) : SourceScraperUtils.search.get_url({
                    engine: "google",
                    site: "gasazip.com",
                    query: this.$SEARCHTERMS(query)
                });
            },
            process_result_selector: ".col-md-9 > .row > .col-md-4 + .col-md-8",
            process_result_get_title: function(doc) {
                var title = /^(.+)\s-\s(.+?)\s+\| 가사집/.exec(doc.title);
                return title ? title[2] + " - " + title[1] : void 0;
            },
            process_result_replace_url: [ "/window/view.html", "/view.html" ]
        });
    });
    define("sources/versuri.ro", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "versuri.ro",
            homepage: "http://versuri.ro",
            description: "Romanian lyrics site.",
            searchterms_site: "versuri.ro/versuri/",
            searchterms_result: "versuri $ARTIST $SONG",
            searchterms_search: "versuri $SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.versuri\.ro\/versuri\/.+\.html/,
            process_result_selector: "blockquote",
            process_result_get_title: function(doc) {
                var title = doc.title.replace(/^Versuri /, "");
                return title;
            }
        });
    });
    define("sources/coveralia.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        function isNoisyNode(node) {
            return node && 1 === node.nodeType && "SPAN" === node.tagName.toUpperCase() && /https?:/.test(node.textContent);
        }
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "coveralia.com",
            homepage: "http://www.coveralia.com/",
            description: "Spanish site with lots of Spanish and English lyrics.",
            searchterms_result: "$SONG $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.coveralia.com\/letras\//i,
            process_result_selector: "#HOTWordsTxt",
            process_result_scraper_options: {
                ignoreNode: function(node) {
                    if (1 === node.nodeType) {
                        var tagName = node.tagName.toUpperCase();
                        return "BR" === tagName ? isNoisyNode(node.nextSibling) : isNoisyNode(node);
                    }
                }
            },
            process_result_get_title: function(doc) {
                var meta = doc.querySelector('meta[property="og:title"][content]');
                meta = meta && meta.getAttribute("content") || "";
                var meta1 = /^Letra de (.+) - (.+)$/.exec(meta), meta2 = /^Letra de (.+?) - (.+)$/.exec(meta);
                if (meta1 && meta2) {
                    if (meta1[1] === meta2[1]) return meta1[2] + " - " + meta1[1];
                    var title = /^Letra de (.+) de (.+)$/.exec(doc.title);
                    return title ? title[2] + " - " + title[1] : void 0;
                }
            },
            $ARTISTSONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                return value;
            }
        });
    });
    define("sources/sarki.alternatifim.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "sarki.alternatifim.com",
            homepage: "http://sarki.alternatifim.com/",
            description: "Turkish site with Turkish lyrics and other popular (English) songs.",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/sarki\.alternatifim\.com\/(?:data\.asp\?.*ID=\d+|sarkici\/[^\/]+\/[^\/])/i,
            process_result_selector: ".sarkisozu",
            process_result_scraper_options: {
                splitAtLF: !0
            },
            process_result_get_title: function(doc) {
                var title = /^(.+ - .+) Şarkı Sözü/.exec(doc.title);
                return title ? title[1] : void 0;
            }
        });
    });
    define("sources/lirik.kapanlagi.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "lirik.kapanlagi.com",
            homepage: "http://lirik.kapanlagi.com/",
            description: "Indonesian lyrics and some other popular English songs.",
            searchterms_result: "Lirik $ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/lirik\.kapanlagi\.com\/artis\/[^\/]+\/[^\/]+/i,
            process_result_selector: ".lyrics-body",
            process_result_scraper_options: {
                tags: /^([bui]|span|strong|em)$/i,
                flushAfter: /^span$/i
            },
            process_result_get_title: function(doc) {
                var title = /^Lirik (.+ - .+) . KapanLagi\.com$/.exec(doc.title);
                return title ? title[1] : void 0;
            }
        });
    });
    define("sources/sing365.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "sing365.com",
            homepage: "http://www.sing365.com/",
            description: "600k+ lyrics.",
            searchterms_result: "$SONG lyrics $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.sing365\.com\/music\/(?:hotlyrics|lyric)\.nsf\/.+-lyrics-.+\/[0-9a-f]{32}/i,
            process_result_selector: ".content",
            process_result_get_title: function(doc) {
                var title = doc.querySelector(".content > h1"), artist = title && title.firstElementChild, song = title && title.lastChild;
                if (artist && song) {
                    artist = artist.textContent;
                    song = /^\s+(.+) Lyrics\s*$/.exec(song.textContent);
                    if (artist && song) return artist + " - " + song[1];
                }
            }
        });
    });
    define("sources/nashe.com.ua", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "nashe.com.ua",
            homepage: "https://nashe.com.ua/",
            description: "Ukrainian lyrics",
            searchterms_site: "nashe.com.ua/song/",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/nashe\.com\.ua\/song\/\d+/i,
            result_encoding: "windows-1251",
            process_result_selector: "#song2",
            process_result_get_title: function(doc) {
                var title = /^НАШЕ \(тексти пісень\) - (.+)$/.exec(doc.title);
                return title ? title[1] : void 0;
            },
            $ARTISTSONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                return value;
            }
        });
    });
    define("sources/touhouwiki.net", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            banned: !0,
            identifier: "touhouwiki.net",
            homepage: "https://en.touhouwiki.net/",
            description: "Lyrics for Touhou doujinsh music.",
            searchterms_site: "en.touhouwiki.net/wiki/Lyrics",
            searchterms_result: "Lyrics $SONG by $ARTIST",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/en\.touhouwiki\.net\/wiki\/Lyrics:.+/i,
            process_result_selector: ".lyrics_row",
            process_result_scraper_options: {
                isFirstChild: !0,
                tags: /^(tr|td|[buip]|strong|em|span)$/i,
                splitAtLF: !0,
                ignoreNode: function(node) {
                    if (1 === node.nodeType) {
                        var row = node.parentNode;
                        return "TR" !== row.nodeName.toUpperCase() ? !1 : -1 === row.className.indexOf("lyrics_row") || 0 !== node.cellIndex;
                    }
                    return !1;
                }
            },
            process_result_get_title: function(doc) {
                var title = /^Lyrics: (.+) - Touhou Wiki -/.exec(doc.title);
                if (title) {
                    title = title[1];
                    var artist = doc.querySelector('.template_lyrics th a[href^="/wiki/"]');
                    return artist ? artist.textContent + " - " + title : title;
                }
            },
            $ARTIST$SONG: function(value, options) {
                (options || (options = {})).keepAccents = !0;
                value = (value + "").replace(/【.+?】/g, "");
                value = LyricsSource.prototype.$ARTIST$SONG.call(this, value, options);
                return value;
            },
            $SEARCHTERMS: function(query, options) {
                function maybeMatch(pattern, artistI, songI) {
                    var match = pattern.exec(s);
                    return match ? {
                        artist: match[artistI],
                        song: match[songI]
                    } : void 0;
                }
                (options || (options = {})).keepAccents = !0;
                if (query.artist && query.song) return this.expand_vars(this.searchterms_result, query);
                if (!query.videotitle && query.searchTerms) return query.searchTerms;
                var s = query.videotitle + "";
                s = s.replace(/^\s*【.*?】\s*/, "");
                s = s.replace(/【Subbed】/g, "");
                s = s.replace(/^\s+|\s+$/g, "");
                var matchedQuery = maybeMatch(/「(.+)」\s*【(.+)】$/, 2, 1) || maybeMatch(/^(.+?) - 「(.+)」$/, 1, 2) || maybeMatch(/^(.+?) - (.+)$/, 1, 2) || null;
                return matchedQuery ? this.expand_vars(this.searchterms_result, matchedQuery) : LyricsSource.prototype.$SEARCHTERMS.call(this, query, options);
            }
        });
    });
    define("sources/cmtv.com.ar", [ "require", "exports", "module", "LyricsSource", "SourceScraperUtils" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "cmtv.com.ar",
            homepage: "http://cmtv.com.ar/",
            description: "Lyrics for Argentine songs and some other popular global songs.",
            searchterms_site: "cmtv.com.ar/discos_letras",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/(www\.)?cmtv\.com\.ar\/discos_letras\/letra\.php\?/i,
            result_encoding: "iso-8859-1",
            process_result: function(responseText, callbacks, data) {
                if (SourceScraperUtils.search.isSearchURL(data.url)) return this.process_search(responseText, callbacks, data);
                var doc = SourceScraperUtils.toDOM(responseText), song = doc.querySelector("header > .letra"), artist = doc.querySelector("h1.tituloartista"), lyricbox = song && song.parentNode.nextElementSibling;
                if (artist && song && lyricbox && "P" === lyricbox.tagName.toUpperCase()) {
                    var lyrics = SourceScraperUtils.toStringArray(lyricbox);
                    if (lyrics.length) {
                        artist = artist.textContent;
                        song = song.textContent.replace(/^\d+/, "").trim();
                        var title = artist + " - " + song;
                        callbacks.found({
                            lyrics: lyrics,
                            title: title
                        });
                        return;
                    }
                }
                callbacks.fail();
            }
        });
    });
    define("sources/tekstovi.net", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "tekstovi.net",
            homepage: "http://tekstovi.net/",
            description: "Lyrics from ex-Yugoslavia countries.",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/tekstovi\.net\/\d+,\d+,(?!0\.)\d+\.html/i,
            process_result_selector: "p.lyric",
            process_result_scraper_options: {
                isFirstChild: !0,
                tags: /^(?:[buip]|strong|em)$/i,
                flushAfter: /^p$/i,
                lineAfterFlush: /^p$/i,
                ignoreNode: function(node) {
                    return 1 === node.nodeType && "P" === node.nodeName.toUpperCase() && "lyric" !== node.className;
                },
                isEndNode: function(node) {
                    return 1 == node.nodeType ? "lyricFooter" === node.className : void 0;
                }
            },
            process_result_get_title: function(doc) {
                var song = doc.querySelector("h1.lyricCapt"), artist = doc.querySelector("h2.lyricCapt");
                return song && artist ? artist.textContent.trim() + " - " + song.textContent.trim() : void 0;
            }
        });
    });
    define("sources/multi/duckduckgo.com", [ "require", "exports", "module", "MultiLyricsSource", "SourceScraperUtils" ], function(require, exports) {
        var MultiLyricsSource = require("MultiLyricsSource").MultiLyricsSource, duckduckgo = require("SourceScraperUtils").SourceScraperUtils.search.engines.duckduckgo;
        exports.source = new MultiLyricsSource({
            disabled: !0,
            identifier: "duckduckgo.com",
            searchProviderIdentifier: "duckduckgo",
            homepage: "https://duckduckgo.com/",
            description: "Search in all known lyrics sites at once using DuckDuckGo.\nIt is recommended to put this source near the top of the list.\nOnly disabled sources are used in the search query.",
            url_search: function(query) {
                var lyricsSources = this.getSources();
                if (!lyricsSources.length) return "";
                var q = this.$SEARCHTERMS(query) + " site:" + lyricsSources[0].searchterms_site, QUERY_MAX_LEN = 500;
                if (q.length > QUERY_MAX_LEN) return "";
                for (var i = 1; lyricsSources.length > i; ++i) {
                    var queryPart = "," + lyricsSources[i].searchterms_site;
                    if (q.length + queryPart.length > QUERY_MAX_LEN) break;
                    q += queryPart;
                }
                return "https://duckduckgo.com/?q=" + encodeURIComponent(q);
            },
            getResultsFromResponse: duckduckgo.getResultsFromResponse
        });
    });
    define("sources/zeneszoveg.hu", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "zeneszoveg.hu",
            homepage: "http://www.zeneszoveg.hu/",
            description: "Hungarian lyrics.",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.zeneszoveg\.hu\/dalszoveg\/\d+\/.+zeneszoveg\.html/i,
            process_result_selector: ".lyrics-plain-text",
            process_result_get_title: function(doc) {
                var tmp = /^(.+) : (.+) dalszöveg(, videó)? - Zeneszöveg.hu$/.exec(doc.title);
                return tmp ? tmp[1] + " - " + tmp[2] : void 0;
            }
        });
    });
    define("sources/flashlyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "flashlyrics.com",
            homepage: "http://flashlyrics.com/",
            description: 'Over a million lyrics for songs in various languages and genres. Some profane words have been replaced with "***".',
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/www\.flashlyrics\.com\/(lyrics|songtext|letras|testo|paroles|laulusonad)\/[^\/]+\/[^\/]+/i,
            process_result_scraper_options: {
                tags: /^(?:[bui]|strong|em|span)$/i
            },
            process_result_selector: ".main-panel-content",
            process_result_get_title: function(doc) {
                var artist = doc.querySelector(".main-panel-artist-link h2");
                artist = artist && artist.textContent.replace(/\s+Lyrics\s*$/i, "");
                var song = doc.querySelector("h1");
                song = song && song.textContent.replace(/\s+Lyrics\s*$/i, "");
                var title = song && artist ? artist + " - " + song : "";
                return -1 === title.indexOf("***") ? title : void 0;
            }
        });
    });
    define("sources/teksteshqip.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            identifier: "teksteshqip.com",
            homepage: "https://teksteshqip.com/",
            description: "Albanian song lyrics (ans also some popular English songs). Also known as lyrics.al",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/(www\.|sv4\.)?teksteshqip\.com\/[^\/]+\/(hit|lyric)-\d+\.php/i,
            process_result_selector: [ "#tekstdiv div > p:first-child", "#tekstdiv" ],
            process_result_scraper_options: {
                isEndNode: function(node) {
                    return 8 === node.nodeType && " stopprint " === node.data;
                }
            },
            process_result_get_title: function(doc) {
                var title = doc.title;
                return title.indexOf(" - ") > 0 ? title : void 0;
            }
        });
    });
    define("sources/colorcodedlyrics.com", [ "require", "exports", "module", "LyricsSource" ], function(require, exports) {
        var LyricsSource = require("LyricsSource").LyricsSource;
        exports.source = new LyricsSource({
            disabled: !0,
            banned: !0,
            identifier: "colorcodedlyrics.com",
            homepage: "https://colorcodedlyrics.com/",
            description: "K-pop lyrics (Korean song lyrics, romanized) and J-pop lyrics (Japanese song lyrics, romanized).",
            searchterms_result: "$ARTIST $SONG",
            searchterms_search: "$SEARCHTERMS",
            r_url_result: /^https?:\/\/colorcodedlyrics\.com\/20\d\d\/\d\d\/./i,
            process_result_selector: 'table[border="0"] > tbody > tr > td:first-child',
            process_result_scraper_options: {
                tags: /^([buip]|span|strong|em)$/i,
                flushBefore: /^(br|p)$/i,
                flushAfter: /^p$/i,
                lineAfterFlush: /^p$/i
            },
            process_result_get_title: function(doc) {
                var title = doc.querySelector("h1.entry-title");
                title = title && title.textContent.trim().replace(" – ", " - ");
                return title ? title : void 0;
            }
        });
    });
    define("sources/lyrics", [ "require", "exports", "module", "config", "MultiLyricsSource", "sources/shared", "sources/lyrics.wikia.com", "sources/multi/bing.com", "sources/lyrics.com", "sources/metrolyrics.com", "sources/lyricsmania.com", "sources/azlyrics.com", "sources/stlyrics.com", "sources/lyricsmode.com", "sources/songtexte.com", "sources/vagalume.com.br", "sources/letras.mus.br", "sources/darklyrics.com", "sources/metal-archives.com", "sources/musica.com", "sources/shironet.mako.co.il", "sources/angolotesti.it", "sources/paroles2chansons.com", "sources/genius.com", "sources/tekstowo.pl", "sources/animelyrics.com", "sources/mojim.com", "sources/multi/google.com", "sources/songmeanings.com", "sources/songlyrics.com", "sources/songteksten.nl", "sources/stixoi.info", "sources/plyrics.com", "sources/guitarparty.com", "sources/lyrics.my", "sources/lyricsmasti.com", "sources/hindilyrics.net", "sources/lyricsmint.com", "sources/newreleasetoday.com", "sources/karaoketexty.cz", "sources/supermusic.sk", "sources/tekstove.info", "sources/paadalvarigal.com", "sources/tamillyrics.hosuronline.com", "sources/siamzone.com", "sources/kpoplyrics.net", "sources/lololyrics.com", "sources/gasazip.com", "sources/versuri.ro", "sources/coveralia.com", "sources/sarki.alternatifim.com", "sources/lirik.kapanlagi.com", "sources/sing365.com", "sources/nashe.com.ua", "sources/touhouwiki.net", "sources/cmtv.com.ar", "sources/tekstovi.net", "sources/multi/duckduckgo.com", "sources/zeneszoveg.hu", "sources/flashlyrics.com", "sources/teksteshqip.com", "sources/colorcodedlyrics.com" ], function(require, exports) {
        for (var config = require("config"), MultiLyricsSource = require("MultiLyricsSource").MultiLyricsSource, shared = require("sources/shared"), _debug = function(method, type, message) {
            console && console.log(method + ": " + message);
        }, lyricsSources = [ require("sources/lyrics.wikia.com").source, require("sources/multi/bing.com").source, require("sources/lyrics.com").source, require("sources/metrolyrics.com").source, require("sources/lyricsmania.com").source, require("sources/azlyrics.com").source, require("sources/stlyrics.com").source, require("sources/lyricsmode.com").source, require("sources/songtexte.com").source, require("sources/vagalume.com.br").source, require("sources/letras.mus.br").source, require("sources/darklyrics.com").source, require("sources/metal-archives.com").source, require("sources/musica.com").source, require("sources/shironet.mako.co.il").source, require("sources/angolotesti.it").source, require("sources/paroles2chansons.com").source, require("sources/genius.com").source, require("sources/tekstowo.pl").source, require("sources/animelyrics.com").source, require("sources/mojim.com").source, require("sources/multi/google.com").source, require("sources/songmeanings.com").source, require("sources/songlyrics.com").source, require("sources/songteksten.nl").source, require("sources/stixoi.info").source, require("sources/plyrics.com").source, require("sources/guitarparty.com").source, require("sources/lyrics.my").source, require("sources/lyricsmasti.com").source, require("sources/hindilyrics.net").source, require("sources/lyricsmint.com").source, require("sources/newreleasetoday.com").source, require("sources/karaoketexty.cz").source, require("sources/supermusic.sk").source, require("sources/tekstove.info").source, require("sources/paadalvarigal.com").source, require("sources/tamillyrics.hosuronline.com").source, require("sources/siamzone.com").source, require("sources/kpoplyrics.net").source, require("sources/lololyrics.com").source, require("sources/gasazip.com").source, require("sources/versuri.ro").source, require("sources/coveralia.com").source, require("sources/sarki.alternatifim.com").source, require("sources/lirik.kapanlagi.com").source, require("sources/sing365.com").source, require("sources/nashe.com.ua").source, require("sources/touhouwiki.net").source, require("sources/cmtv.com.ar").source, require("sources/tekstovi.net").source, require("sources/multi/duckduckgo.com").source, require("sources/zeneszoveg.hu").source, require("sources/flashlyrics.com").source, require("sources/teksteshqip.com").source, require("sources/colorcodedlyrics.com").source ], schemeVersion = 4, _applySchemeUpdate = function(prefs) {
            var saved_schemeVersion = prefs && prefs.schemeVersion || 0, disableSource = function(identifier) {
                var source = lyricsSources[getIndexById(lyricsSources, identifier)];
                if (source) {
                    source._disabled = source.disabled = !0;
                    var whitelist = prefs && prefs.whitelist || [], index = whitelist.indexOf(identifier);
                    -1 !== index && whitelist.splice(index, 1);
                } else _debug("_applySchemeUpdate", "not_found", "No source found for ID " + identifier);
            }, moveSource = function(identifier, position) {
                var index = getIndexById(lyricsSources, identifier);
                if (-1 !== index) {
                    var source = lyricsSources.splice(index, 1)[0];
                    lyricsSources.splice(position, 0, source);
                } else _debug("_applySchemeUpdate", "not_found", "No listing found for ID " + identifier);
            }, removeSource = function(identifier) {
                renameSource(identifier, "");
            }, renameSource = function(identifier, newIdentifier) {
                function removeFromList(list) {
                    if (list) {
                        var index = list.indexOf(identifier);
                        -1 !== index && (newIdentifier ? list[index] = newIdentifier : list.splice(index, 1));
                    }
                }
                if (prefs) {
                    removeFromList(prefs.banlist);
                    removeFromList(prefs.blacklist);
                    removeFromList(prefs.order);
                    removeFromList(prefs.whitelist);
                }
            };
            1 > saved_schemeVersion && disableSource("lyricsmode.com");
            2 > saved_schemeVersion && moveSource("bing.com", 1);
            if (3 > saved_schemeVersion) {
                removeSource("leoslyrics.com");
                renameSource("rapgenius.com", "genius.com");
            }
            if (4 > saved_schemeVersion) {
                renameSource("newreleasetuesday.com", "newreleasetoday.com");
                removeSource("magistrix.de");
            }
        }, i = 0; lyricsSources.length > i; ++i) lyricsSources[i]._disabled = lyricsSources[i].disabled;
        var _announceSources = function(sources) {
            shared.lyricsSources.length = 0;
            for (var i = 0; sources.length > i; ++i) {
                var lyricsSource = sources[i];
                lyricsSource instanceof MultiLyricsSource || lyricsSource.banned || shared.lyricsSources.push(lyricsSource);
            }
            ++shared.lastAnnouncement;
        }, _announceSearchProviders = function(searchProviders) {
            shared.searchProviders = {};
            searchProviders && Object.keys(searchProviders).forEach(function(searchProviderIdentifier) {
                var val = searchProviders[searchProviderIdentifier];
                "boolean" == typeof val && (shared.searchProviders[searchProviderIdentifier] = val);
            });
        }, getIndexById = function(sources, identifier) {
            for (var i = 0; sources.length > i; i++) if (sources[i].identifier === identifier) return i;
            return -1;
        }, _sortSourcesByPreference = function(pref_order, sources) {
            if (pref_order) for (var i = pref_order.length - 1; i >= 0; --i) {
                var identifier = pref_order[i], sourceIndex = getIndexById(sources, identifier);
                sourceIndex >= 0 ? sources.unshift(sources.splice(sourceIndex, 1)[0]) : _debug("getLyricsSources", "id_unknown", 'Unknown identifier found in the "order" preference.');
            }
        }, _markDisabledSources = function(pref_banlist, pref_blacklist, pref_whitelist, sources) {
            if (pref_blacklist) for (var i = sources.length - 1; i >= 0; --i) {
                var source = sources[i], identifier = source.identifier;
                if (-1 !== pref_blacklist.indexOf(identifier)) source.disabled = !0; else {
                    if (!pref_whitelist || -1 === pref_whitelist.indexOf(identifier)) {
                        source.disabled = source._disabled;
                        continue;
                    }
                    source.disabled = !1;
                }
                source.banned = -1 !== (pref_banlist || []).indexOf(identifier);
            }
        }, _removeDisabledSources = function(sources) {
            for (var i = sources.length - 1; i >= 0; --i) (sources[i].disabled === !0 || sources[i].banned === !0) && sources.splice(i, 1);
        }, _getLyricsSources = function(excludeDisabledSources, callback) {
            config.getItem("lyricsSourcePreferences", function(prefs) {
                _applySchemeUpdate(prefs);
                for (var sources = lyricsSources.slice(0), totalSourceCount = sources.length, savedSourceCount = 0, i = totalSourceCount - 1; i >= 0; --i) sources[i].disabled = sources[i]._disabled;
                if (prefs) {
                    prefs.order && (savedSourceCount = prefs.order.length);
                    _sortSourcesByPreference(prefs.order, sources);
                    _markDisabledSources(prefs.banlist, prefs.blacklist, prefs.whitelist, sources);
                }
                _announceSources(sources.slice(0));
                _announceSearchProviders(prefs && prefs.searchProviders);
                excludeDisabledSources && _removeDisabledSources(sources);
                sources.stats = {
                    Old: savedSourceCount,
                    New: totalSourceCount - savedSourceCount,
                    Total: totalSourceCount
                };
                callback(sources);
            });
        }, permanentlyDisableSource = function(sourceIdentifier) {
            for (var i = 0; lyricsSources.length > i && lyricsSources[i].identifier !== sourceIdentifier; ++i) ;
            lyricsSources[i] && lyricsSources[i].identifier === sourceIdentifier ? config.getItem("lyricsSourcePreferences", function(prefs) {
                prefs = prefs || {};
                var banlist = prefs.banlist || [];
                if (!(banlist.indexOf(sourceIdentifier) >= 0)) {
                    banlist.push(sourceIdentifier);
                    config.setItem("lyricsSourcePreferences", prefs, function() {});
                }
            }) : _debug("permanentlyDisableSource", "not_found", "Cannot disable unknown source " + sourceIdentifier);
        }, getAllLyricsSources = function(callback) {
            _getLyricsSources(!1, callback);
        }, getLyricsSources = function(callback) {
            _getLyricsSources(!0, callback);
        };
        exports.getAllLyricsSources = getAllLyricsSources;
        exports.getLyricsSources = getLyricsSources;
        exports.permanentlyDisableSource = permanentlyDisableSource;
        exports.schemeVersion = schemeVersion;
    });
    define("text", {
        load: function(id) {
            throw Error("Dynamic load not allowed: " + id);
        }
    });
    define("text!style/lyricsPanel.css", [], function() {
        return '.L759-overlay{position:fixed;bottom:0;right:0;width:100%;height:100%;background:transparent !important;z-index:2000000001}\n.L759-overlay,.L759-container,.L759-container *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n.L759-noselect::-moz-selection{background:transparent !important}\n.L759-noselect::selection{background:transparent !important}\n.L759-container{position:fixed;top:2px;right:2px;width:275px;z-index:2000000002;overflow:hidden;background:none;background-color:#fff !important;color:#000 !important;border:1px solid #bbe !important;padding:5px 1px 1px 5px;display:block;border-radius:5px 5px 5px 0;min-height:25px;min-width:67px;-webkit-box-shadow:1px 1px 4px #d3d3d3;box-shadow:1px 1px 4px #d3d3d3;font-size:14px;font-family:arial,sans-serif;font-weight:normal}\n.L759-container.boxsizingbug{min-height:17px;min-width:59px}\n.L759-container *{color:inherit !important;font-size:inherit;font-family:inherit;font-weight:inherit;text-transform:none}\n.L759-container,.L759-container *{line-height:1.1em;text-align:left}\n.L759-container .L759-svg-icon{text-align:center;line-height:1em}\n.L759-container .L759-svg-icon svg{width:1em;height:1em;vertical-align:middle}\n.L759-container button,.L759-container input{display:inline-block;height:20px;margin:0;border:0 #d3d3d3;background:none;background-color:transparent !important;border-radius:0;box-shadow:none;padding:0;line-height:1.2em;font-size:13px;color:#000 !important}\n.L759-container .L759-buttons button{background-color:#ccc !important;cursor:pointer;padding:0 5px;font-size:16px;color:#333 !important}\n.L759-container .L759-chrome-permission-request{font-weight:bold;font-size:1.1em}\n.L759-container .L759-chrome-permission-request,.L759-container .L759-chrome-permission-request .L759-permission-description{text-align:center}\n.L759-container .L759-chrome-permission-request button{height:auto;margin:3px;border:0;padding:5px 8px;line-height:1;font-weight:bold;font-size:inherit}\n.L759-container .L759-chrome-permission-request button.L759-b-yes,.L759-container .L759-chrome-permission-request button.L759-b-always{background-color:#480 !important;color:#fff !important}\n.L759-container .L759-chrome-permission-request button.L759-b-yes:hover,.L759-container .L759-chrome-permission-request button.L759-b-always:hover{background-color:#370 !important}\n.L759-container .L759-chrome-permission-request button.L759-b-no,.L759-container .L759-chrome-permission-request button.L759-b-never{padding:5px;background-color:#d10 !important;color:#eee !important}\n.L759-container .L759-chrome-permission-request button.L759-b-no:hover,.L759-container .L759-chrome-permission-request button.L759-b-never:hover{background-color:#c00 !important}\n.L759-container a,.L759-container .L759-link-style{cursor:pointer;color:#438bc5 !important;text-decoration:none;background:none}\n.L759-container a:hover,.L759-container .L759-link-style:hover{text-decoration:underline;background-color:transparent !important}\n.L759-container .L759-title{position:absolute;top:0;left:5px;right:26px;padding:5px 0 0 0;border-bottom:3px double #99f !important;font-size:17px;line-height:15px;height:27px;overflow:hidden;cursor:move;white-space:nowrap;text-overflow:ellipsis;background:inherit;z-index:4}\n.L759-container .L759-close{position:absolute;height:25px;width:25px;top:0;right:0;z-index:50;cursor:pointer;display:block;background:none;background-color:#f50 !important;fill:#eee !important;font-size:12px}\n.L759-container .L759-close:hover{background-color:#f50 !important;fill:#fff !important}\n.L759-container .L759-top-bar{position:absolute;top:27px;left:5px;right:1px;border:0;border-bottom:1px solid;border-bottom-color:#759 !important;padding:2px 0;background:inherit;z-index:1}\n.L759-container .L759-top-bar .L759-link-container{text-align:center}\n.L759-container .L759-top-bar .L759-toggle-info{display:inline-block;padding:0 3px;border:1px solid transparent;cursor:default;color:#438bc5 !important;background:none;border-color:transparent !important}\n.L759-container .L759-top-bar .L759-toggle-info:not(.L759-info-toggled):hover{border-style:dotted}\n.L759-container .L759-top-bar .L759-toggle-info:hover,.L759-container .L759-top-bar .L759-toggle-info.L759-info-toggled{position:relative;z-index:1;padding-bottom:1px;margin-bottom:-1px;background-color:#fff !important;border-color:#759 !important;border-bottom-color:#fff !important}\n.L759-container .L759-top-bar .L759-toggle-info:hover+.L759-info-wrapper,.L759-container .L759-top-bar .L759-toggle-info.L759-info-toggled+.L759-info-wrapper{display:block}\n.L759-container .L759-top-bar .L759-info-wrapper{display:none;position:relative}\n.L759-container .L759-top-bar .L759-info-wrapper:hover{display:block}\n.L759-container .L759-top-bar .L759-info{position:absolute;border:1px solid;border-color:#759 !important;min-height:40px;width:100%;padding:2px 2px 2px 40px;background:2px 2px no-repeat url("https://robwu.nl/lyricshere/icons/32.png") !important;background-color:#fff !important}\n.L759-container .L759-top-bar .L759-info.L759-http{background-image:url("http://robwu.nl/lyricshere/icons/32.png") !important}\n.L759-container .L759-top-bar .L759-info .L759-song-title{font-style:italic}\n.L759-container .L759-top-bar .L759-info .L759-link-to-found-source{font-weight:bold}\n.L759-container .L759-top-bar .L759-inline-settings-wrapper:hover>.L759-inline-settings,.L759-container .L759-top-bar .L759-inline-settings-wrapper.L759-inline-settings-docked>.L759-inline-settings{display:block}\n.L759-container .L759-top-bar .L759-inline-settings-wrapper:hover>.L759-inline-settings-toggle,.L759-container .L759-top-bar .L759-inline-settings-wrapper.L759-inline-settings-docked>.L759-inline-settings-toggle{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}\n.L759-container .L759-top-bar .L759-inline-settings-wrapper.L759-inline-settings-docked>.L759-inline-settings-toggle{text-decoration:underline}\n.L759-container .L759-top-bar .L759-inline-settings-toggle{cursor:default;display:inline-block;width:1.2em;height:1.2em;vertical-align:middle;text-align:center}\n.L759-container .L759-top-bar .L759-inline-settings{padding:5px 0 2px 2ch;display:none}\n.L759-container .L759-top-bar .L759-inline-settings input{vertical-align:middle}\n.L759-container .L759-content-wrapper{position:absolute;top:27px;right:1px;bottom:21px;left:5px}\n.L759-container .L759-content{position:relative;height:100%;width:100%;overflow:auto;word-wrap:break-word}\n.L759-container .L759-content>div{padding-top:2px}\n.L759-container .L759-content .L759-lyrics-line{min-height:1.1em;padding-left:1em;text-indent:-1em;background:none}\n.L759-container .L759-content .L759-lyrics-line.L759-highlight{background-color:#ff0}\n.L759-container .L759-content .L759-result:focus{outline:0}\n.L759-container .L759-content .L759-result:focus .L759-lyrics-line.L759-highlight{outline:1px solid #d3d3d3}\n.L759-container .L759-content .L759-result[dir=rtl] .L759-lyrics-line{padding-left:0;padding-right:1.2em}\n.L759-container .L759-content-scrollbar-cover{position:absolute;top:0;right:0;height:100%;width:0;pointer-events:none;background-color:transparent !important}\n.L759-container .L759-line-finder{position:absolute;bottom:21px;left:5px;right:1px;height:1.5em;background:none;background-color:#fff;padding-right:60px;border:1px solid #ce8500;-webkit-box-shadow:0 0 3px #ce8500;box-shadow:0 0 3px #ce8500;z-index:3;display:none}\n.L759-container .L759-line-finder.L759-visible{display:block}\n.L759-container .L759-line-finder .L759-finder-searchterms{width:100%;height:100%;line-height:1;font-size:.9em;padding-left:1px;position:relative;z-index:1}\n.L759-container .L759-line-finder.L759-line-notfound .L759-finder-searchterms{outline:1px solid #f33;outline-offset:0}\n.L759-container .L759-line-finder button{position:absolute;top:0;bottom:0;width:20px;height:100%;background-color:#e4e4e4 !important;fill:#666 !important;font-size:10px;padding:4px}\n.L759-container .L759-line-finder button:hover,.L759-container .L759-line-finder button:focus,.L759-container .L759-line-finder button:active{background-color:#d3d3d3 !important;fill:#000 !important}\n.L759-container .L759-line-finder button:active{background-color:#ddd !important}\n.L759-container .L759-line-finder .L759-find-prev{right:40px}\n.L759-container .L759-line-finder .L759-find-next{right:20px}\n.L759-container .L759-line-finder .L759-find-hide{right:0;font-size:12px}\n.L759-container .L759-line-finder .L759-find-hide .L759-svg-disc{fill:transparent !important}\n.L759-container .L759-line-finder .L759-find-hide .L759-svg-cross{fill:#666 !important}\n.L759-container .L759-line-finder .L759-find-hide:hover .L759-svg-disc,.L759-container .L759-line-finder .L759-find-hide:focus .L759-svg-disc,.L759-container .L759-line-finder .L759-find-hide:active .L759-svg-disc{fill:#666 !important}\n.L759-container .L759-line-finder .L759-find-hide:hover .L759-svg-cross,.L759-container .L759-line-finder .L759-find-hide:focus .L759-svg-cross,.L759-container .L759-line-finder .L759-find-hide:active .L759-svg-cross{fill:#e4e4e4 !important}\n.L759-container .L759-searchbox{position:absolute;bottom:1px;right:1px;left:17px;height:20px;width:auto;line-height:16px;background:inherit;z-index:2}\n.L759-container .L759-searchbox .L759-searchterms{width:100%;float:left;margin:0 -30px 0 0;padding:0 30px 0 0;border:1px solid #d3d3d3 !important}\n.L759-container .L759-searchbox .L759-searchterms::-moz-placeholder{color:#cacaca !important}\n.L759-container .L759-searchbox .L759-searchterms::placeholder{color:#cacaca !important}\n.L759-container .L759-searchbox .L759-searchterms::-webkit-input-placeholder{color:#cacaca !important}\n.L759-container .L759-searchbox .L759-searchterms:-ms-input-placeholder{color:#cacaca !important}\n.L759-container .L759-searchbox .L759-searchterms:focus::-moz-placeholder{color:transparent !important}\n.L759-container .L759-searchbox .L759-searchterms:focus::placeholder{color:transparent !important}\n.L759-container .L759-searchbox .L759-searchterms:focus::-webkit-input-placeholder{color:transparent !important}\n.L759-container .L759-searchbox .L759-searchterms:focus:-ms-input-placeholder{color:transparent !important}\n.L759-container .L759-searchbox .L759-dosearch{width:30px;background-color:#fafafa !important;fill:#666 !important;border:1px solid #d3d3d3 !important;font-size:13px;cursor:default}\n.L759-container .L759-searchbox .L759-dosearch:hover,.L759-container .L759-searchbox .L759-dosearch:focus,.L759-container .L759-searchbox .L759-dosearch:active{background-color:#fcfcfc !important;fill:#000 !important}\n.L759-container .L759-searchbox .L759-dosearch:active{background-color:#eee !important}\n.L759-container .L759-searchbox .L759-searchterms,.L759-container .L759-searchbox .L759-dosearch{height:20px;border-bottom-right-radius:5px}\n.L759-container .L759-resizer{position:absolute;left:0;bottom:0;width:17px;height:17px;z-index:4;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAKklEQVQ4jWMIDQ39z0ApABkyahCmRooNwqZppBtEjCaCBhGradSgATAIAGuTiXfwFGCyAAAAAElFTkSuQmCC") !important;cursor:sw-resize;-webkit-transform-origin:0 100%;-webkit-transform:none;-ms-transform-origin:0 100%;-ms-transform:none;transform-origin:0 100%;transform:none;-webkit-transition:ease-in -webkit-transform .2s 0s;transition:ease-in transform .2s 0s}\n.L759-container .L759-resizer:hover{-webkit-transform:scale(2);-ms-transform:scale(2);transform:scale(2)}\n.L759-container.L759-unresizable{top:0 !important;left:0 !important;right:0 !important;bottom:0 !important;width:auto !important;height:auto !important;border-width:3px;border-radius:0;z-index:auto}\n.L759-container.L759-unresizable .L759-title{right:1px;cursor:auto}\n.L759-container.L759-unresizable .L759-close,.L759-container.L759-unresizable .L759-resizer{display:none}\n.L759-container.L759-unresizable .L759-content-wrapper{bottom:23px}\n.L759-container.L759-unresizable .L759-searchbox{left:3px;bottom:3px}\n.L759-container.allow-translate-on-top~.jfk-bubble{z-index:2000000002 !important}\n.L759-skin-dark{background-color:#000 !important;color:#ccc !important;border-color:#888 !important;-webkit-box-shadow:1px 1px 4px #777;box-shadow:1px 1px 4px #777}\n.L759-skin-dark button,.L759-skin-dark input{background-color:transparent !important;color:#ccc !important;border-color:#444}\n.L759-skin-dark .L759-buttons button{background-color:#333 !important;color:#999 !important}\n.L759-skin-dark a,.L759-skin-dark .L759-link-style{color:#8dd !important}\n.L759-skin-dark .L759-title{border-bottom-color:#aaa !important}\n.L759-skin-dark .L759-close{background-color:#555 !important;fill:#bbb !important}\n.L759-skin-dark .L759-close:hover{background-color:#777 !important;fill:#e0e0e0 !important}\n.L759-skin-dark .L759-top-bar{border-bottom-color:#aaa !important}\n.L759-skin-dark .L759-top-bar .L759-toggle-info{color:#8dd !important}\n.L759-skin-dark .L759-top-bar .L759-toggle-info:hover,.L759-skin-dark .L759-top-bar .L759-toggle-info.L759-info-toggled{background-color:#000 !important;border-color:#aaa !important;border-bottom-color:#000 !important}\n.L759-skin-dark .L759-top-bar .L759-info{border-color:#aaa !important;background-color:#000 !important;background-image:url("https://robwu.nl/lyricshere/icons/32-dark.png") !important}\n.L759-skin-dark .L759-top-bar .L759-info.L759-http{background-image:url("http://robwu.nl/lyricshere/icons/32-dark.png") !important}\n.L759-skin-dark .L759-content .L759-lyrics-line.L759-highlight{background-color:#7b2d00}\n.L759-skin-dark .L759-content .L759-result:focus .L759-lyrics-line.L759-highlight{outline-color:#468200}\n.L759-skin-dark .L759-content-scrollbar-cover{background-color:rgba(0,0,0,0.6) !important}\n.L759-skin-dark .L759-line-finder{background-color:#000;border:1px solid #777;-webkit-box-shadow:0 0 3px #777;box-shadow:0 0 3px #777}\n.L759-skin-dark .L759-line-finder button{background-color:#474747 !important;fill:#7a7a7a !important;border-color:#444 !important}\n.L759-skin-dark .L759-line-finder button:hover,.L759-skin-dark .L759-line-finder button:focus,.L759-skin-dark .L759-line-finder button:active{background-color:#777 !important;fill:#cacaca !important}\n.L759-skin-dark .L759-line-finder button:active{background-color:#666 !important}\n.L759-skin-dark .L759-line-finder .L759-find-hide .L759-svg-cross{fill:#7a7a7a !important}\n.L759-skin-dark .L759-line-finder .L759-find-hide:hover .L759-svg-disc,.L759-skin-dark .L759-line-finder .L759-find-hide:focus .L759-svg-disc,.L759-skin-dark .L759-line-finder .L759-find-hide:active .L759-svg-disc{fill:#7a7a7a !important}\n.L759-skin-dark .L759-line-finder .L759-find-hide:hover .L759-svg-cross,.L759-skin-dark .L759-line-finder .L759-find-hide:focus .L759-svg-cross,.L759-skin-dark .L759-line-finder .L759-find-hide:active .L759-svg-cross{fill:#474747 !important}\n.L759-skin-dark .L759-searchbox .L759-searchterms{border-color:#444 !important}\n.L759-skin-dark .L759-searchbox .L759-searchterms::-moz-placeholder{color:#cacaca !important}\n.L759-skin-dark .L759-searchbox .L759-searchterms::placeholder{color:#cacaca !important}\n.L759-skin-dark .L759-searchbox .L759-searchterms::-webkit-input-placeholder{color:#cacaca !important}\n.L759-skin-dark .L759-searchbox .L759-dosearch{background-color:#888 !important;fill:#000 !important;border-color:#444 !important}\n.L759-skin-dark .L759-searchbox .L759-dosearch:hover,.L759-skin-dark .L759-searchbox .L759-dosearch:focus,.L759-skin-dark .L759-searchbox .L759-dosearch:active{background-color:#aaa !important;fill:#000 !important}\n.L759-skin-dark .L759-searchbox .L759-dosearch:active{background-color:#777 !important}';
    });
    define("garbageTracker", [], function() {
        var exports = {};
        exports.willAddToDOM = function(element, displayValue) {};
        return exports;
    });
    define("styleInjector", [ "garbageTracker" ], function(garbageTracker) {
        function hasStyle(name) {
            var style = cachedStyleTags[name];
            return style && documentContains(style) ? !0 : !1;
        }
        function sanitizeName(id) {
            return (randomSessionToken + id).replace(/\W/g, "-");
        }
        var documentContains = function(elem) {
            return document === elem || !!elem && document.documentElement.contains(elem);
        }, cachedStyleTags = {}, randomSessionToken = Math.random().toString(36), exports = {};
        exports.addStyle = function(styleSheetText, id) {
            var name = sanitizeName(id), style = cachedStyleTags[name];
            if (!style) {
                style = document.createElement("style");
                style.appendChild(document.createTextNode(styleSheetText));
                cachedStyleTags[name] = style;
            }
            if (!documentContains(style)) {
                garbageTracker.willAddToDOM(style, "none");
                (document.head || document.documentElement).appendChild(style);
            }
        };
        exports.removeStyle = function(id) {
            var name = sanitizeName(id), style = cachedStyleTags[name];
            style && documentContains(style) && style.parentNode.removeChild(style);
        };
        exports.hasStyle = function(id) {
            return hasStyle(sanitizeName(id));
        };
        return exports;
    });
    define("text!templates/lyricsPanel.html", [], function() {
        return '<div class="L759-title"></div>\n<button class="L759-close L759-svg-icon">\n  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 663 663">\n    <!--[if IE 8]><b>&times;</b><![endif]-->\n    <path d="m663 129q0-22-15-38l-76-76q-16-15-38-15t-38 15l-164 165l-164-165q-16-15-38-15t-38 15l-76 76q-16 16-16 38t16 38l164 164l-164 164q-16 16-16 38t16 38l76 76q16 16 38 16t38-16l164-164l164 164q16 16 38 16t38-16l76-76q15-15 15-38t-15-38l-164-164l164-164q15-15 15-38z"/>\n  </svg>\n</button>\n<div class="L759-top-bar">\n  <div class="L759-link-container">\n    <span class="L759-switch-source L759-link-style">\n      &raquo; Different source (<span class="L759-sourceindex"></span> / <span class="L759-sourcecount"></span>)\n    </span>\n    <div class="L759-toggle-info">&raquo; Info</div>\n    <div class="L759-info-wrapper">\n      <div class="L759-info">\n        <div class="L759-song-info">\n        The lyrics for <span class="L759-song-title"></span> were retrieved from <a class="L759-link-to-found-source" target="_blank" rel="noreferrer"></a>.\n        </div>\n        <br>\n        <div class="L759-inline-settings-wrapper">\n          <span class="L759-inline-settings-toggle" title="Click to lock the visibility of the settings below.">&raquo;</span>\n          <a class="L759-settings-link" href="https://robwu.nl/lyricshere/#config" target="_blank" title="Click to open the settings page">Settings for \'Lyrics Here\'</a>\n          <div class="L759-inline-settings">\n            <label title="Temporarily toggle the dark theme.\nTo permanently change the default theme, visit the settings page.">\n              <input type="checkbox" class="L759-inline-setting-dark-skin"> Dark theme\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="L759-content-wrapper">\n  <div class="L759-content">\n    <div class="L759-fetching">\n      <div class="L759-buttons">\n        <button class="L759-b-abort">Abort</button>\n        <button class="L759-b-retry">Retry</button>\n        <button class="L759-b-next">Next</button>\n      </div>\n      <div class="L759-status">\n      Loading <a class="L759-link-to-fetched-source" target="_blank" rel="noreferrer">nothing</a>.\n      <br><br>\n      <div class="L759-chrome-permission-request"></div>\n      &raquo; <a class="L759-settings-link" href="https://robwu.nl/lyricshere/#config" target="_blank">Settings for \'Lyrics Here\'</a>\n      </div>\n    </div>\n    <div class="L759-done">\n      <div class="L759-result" tabindex="0"></div>\n    </div>\n  </div>\n  <div class="L759-content-scrollbar-cover"></div>\n</div>\n<div class="L759-line-finder">\n  <input type="text" class="L759-finder-searchterms" placeholder=" search within lyrics" title="Search within lyrics">\n  <button class="L759-find-prev L759-svg-icon" title="Find previous (Shift + Enter)">\n    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 869 548">\n      <!--[if IE 8]>&#9650;<![endif]-->\n      <path d="m869 171q0-29-21-50l-42-42q-21-21-50-21q-30 0-51 21l-271 271l-271-271q-20-21-50-21t-50 21l-42 42q-21 20-21 50q0 30 21 51l363 363q21 21 50 21q29 0 51-21l363-363q21-21 21-51z"/>\n    </svg>\n  </button>\n  <button class="L759-find-next L759-svg-icon" title="Find next (Enter)">\n    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 869 548">\n      <!--[if IE 8]>&#9660;<![endif]-->\n      <path d="m869 457q0-29-21-50l-363-363q-21-22-51-22q-30 0-50 22l-363 363q-21 20-21 50q0 30 21 51l41 42q22 20 51 20q29 0 50-20l271-271l271 271q21 20 51 20q29 0 50-20l42-42q21-22 21-51z"/>\n    </svg>\n  </button>\n  </style>\n  <button class="L759-find-hide L759-svg-icon" title="Hide (Esc)">\n    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 840 840">\n      <!--[if IE 8]>&times;<![endif]-->\n      <path class="L759-svg-disc" d="m420 840q174 0 297-123t123-297t-123-297t-297-123t-297 123t-123 297t123 297t297 123z"/>\n      <path class="L759-svg-cross" d="m506 420l154 154l-86 86l-154-152l-152 152l-88-86l154-154l-154-152l88-86l152 152l154-152l86 86z"/>\n    </svg>\n  </button>\n</div>\n<div class="L759-searchbox">\n  <input type="text" class="L759-searchterms" placeholder=" artist - song">\n  <button class="L759-dosearch L759-svg-icon" title="Show lyrics for this search term">\n    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 900 900">\n      <!--[if IE 8]>&raquo;<![endif]-->\n      <path d="m11 475q-23 87 0 173t87 150q48 48 110 74t128 25q65 0 127-25t110-74q52-52 77-119t21-137t-36-132q28-8 49-29l174-173q35-36 35-85t-35-85q-35-35-85-35t-85 35l-173 174q-22 20-30 49q-70-35-149-35q-66 0-128 25t-110 73q-64 64-87 151z m101 86q0-93 65-158q66-65 159-65q92 0 157 65t66 158t-66 158q-66 66-157 66q-92 0-159-66q-65-65-65-158z" transform="rotate(90 450 450)"/>\n    </svg>\n  </button>\n</div>\n<div class="L759-resizer"></div>\n';
    });
    define("text!style/pageAction.css", [], function() {
        return ".LyricsHereByRobWPageActionIcon {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  position: fixed;\n  top: 50px;\n  right: 0;  \n  z-index: 2000000003;\n  display: inline-block;\n  height: 30px;\n  width: 30px;\n  margin: 0;\n  border: 1px solid #999;\n  padding: 0;\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAMHAAADBwBtrwaCQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALgSURBVEjH7ZZJSJtBFMc9iiCINxHxIKIHD15cEFwOgriAy82DKHgVxJuCoriUFmyKVYrUtlGr1UKNrUutGqIGqVaDsRYNibWJSww1Rk0kLlX7L+/BN00EU7XYQu2DgW+GN/Obee/Nfz4v/GHzuj3Ao6PTay0wMrKC9XX71YAbGw4EBt6/FrCsTAm1evX3gSbTHo9Ltri4BYfjmNv4uAmDgwZsbx9gedmGnZ1DN7/eXh0MBhv3yZ98JyfXPAPb2z8iN/eV6AcE1MNmO0BaWicyMl6guHgIc3MW9lEodOxTXq5CcPADlJS8Q0PDNIzGXYSENPB4UdFbz0C7/YghJydnWFqyIjb2CY+npnZApTIKPwlIefT2ruV5krW1zSM9vROHhyeXy2FWVjeHQyabQnX1hEcgjUVHt7jNPz4+5dPSqWtqJn4NHBszcvji459xrjwBKecUEYKct60tJ0JDH3LuBdDHpw75+b2iUfLJaNcJCXIx+SIgGeU1JqYFpaVK1Naq0dOzxCekflCQjIvLSzo6nca1SZVXWPgGHR0LArCw8BW7uz+rkvJrtTpFnwqpq+sTNJpNPllfnx4DAwax3oVK09j4gSsyM7MLZ2ffb17aKMxSWP+L97WBSuUXjI6uuDlUVY2zPN0IkBavrBxzc/DzuwuLZf/vAOm6JCe3892bmlrnMb1+G9nZ3YiKesx3jqy/X4+kpFYUFLyGVmvxDExMlDNUaqSPBKSqJSEmwMyMmeWKjKQvJeU5ayi9HjqdFWFhjVhd3eMURUQ88gykeyeXa0UjBSIgfUdGNouNkIzR7gmYk/NSrFFf/x5xcU+FH0Vobc1+9ZA2N2tY5oaGlkUjJTkPrKtTc9hd/VyV6dJAelB9fe9wfpzObzCbHSKkrsDZWTP8/e/xrwc9S5ub+xeHtLV1nkPnavRa0MNLNjz8mXcfHt6EvDwFj01Pb6CiQuU2h0Sbiob8pIf3lirNPwn8AZ71KOgp+CxGAAAAAElFTkSuQmCC') center no-repeat !important;\n  cursor: pointer;\n}\n.LyricsHereByRobWPageActionIcon:hover {\n  border-color: #000;\n}\n/*YouTube*/\n#container.ytd-video-primary-info-renderer .LyricsHereByRobWPageActionIcon {\n  position: absolute;\n  top: 1px;\n  right: 0;\n}\n/*YouTube fullscreen*/\n.ytp-chrome-controls > .LyricsHereByRobWPageActionIcon {\n  position: static;\n  margin: 13px 9px auto 9px;\n  float: right;\n  opacity: 0.5;\n}\n.ytp-chrome-controls > .LyricsHereByRobWPageActionIcon:hover {\n  opacity: 1;\n}\n\n/*Spotify Web client*/\n.SpotifyPageAction.LyricsHereByRobWPageActionIcon {\n  position: fixed;\n  top: 0;\n  right: 10px;\n  opacity: 0.6;\n}\n.SpotifyPageAction.LyricsHereByRobWPageActionIcon:hover {\n  opacity: 1;\n}\n\n/*Deezer*/\nsection.topbar > .LyricsHereByRobWPageActionIcon {\n  position: static;\n  float: right;\n  margin-right: 8px;\n}\n/*Deezer 2014+ */\n.sidebar-container .player-cover > .LyricsHereByRobWPageActionIcon {\n  position: absolute;\n  top: auto;\n  bottom: 10px;\n  right: 5px;\n}\n\n/*8tracks*/\n.EightTracksPageAction.LyricsHereByRobWPageActionIcon {\n  top: 66px;\n}\n#player_box > .LyricsHereByRobWPageActionIcon {\n  position: fixed;\n  top: auto;\n  bottom: 20px; /*center-align button (as of 8 feb 2014) */\n  right: 10px;\n  outline: 2px solid #222; /* only noticeable in small windows, used to make the button stand out */\n}\n\n/*Google Music*/\n#material-player-right-wrapper ~ .LyricsHereByRobWPageActionIcon {\n  position: absolute;\n  top: auto;\n  bottom: 2px;\n  right: 2px;\n}\n\n/*iHeartRadio*/\n.player-right > .LyricsHereByRobWPageActionIcon {\n  position: static;\n  vertical-align: middle;\n  margin: 0 1.5rem;\n}\n\n/*Superplayer.fm*/\n.SuperplayerPageAction.LyricsHereByRobWPageActionIcon {\n  top: 0;\n  right: 0;\n}\n\n/*Last.fm*/\n.LFMPageAction.LyricsHereByRobWPageActionIcon {\n  top: 9px;\n  right: 9px; \n}\n\n/*Yandex Music*/\n.player-controls__track-container ~ .LyricsHereByRobWPageActionIcon {\n  position: static;\n  margin: 13px;\n}\n\n/*Qobuz*/\n.QobuzPageAction.LyricsHereByRobWPageActionIcon {\n  top: 0;\n  right: 0;\n}\n\n/*SoundCloud*/\n.SoundCloudPageAction.LyricsHereByRobWPageActionIcon {\n  /* height of header */\n  top: 48px;\n}\n/*Saavn*/\n.SaavnPageAction.LyricsHereByRobWPageActionIcon {\n  top: 0;\n}\n\n/*Pandora*/\n.PandoraPageAction.LyricsHereByRobWPageActionIcon {\n  top: 0;\n}\n/*Pandora (old)*/\n#playbackControl > .LyricsHereByRobWPageActionIcon {\n  position: absolute;\n  top: auto;\n  bottom: -30px;\n}\n\n/*Bandcamp*/\n.BandcampPageAction.LyricsHereByRobWPageActionIcon {\n  top: 0;\n}\n";
    });
    define("fullscreen", [], function() {
        function isFullscreen() {
            return !(!fullscreenElement || !document[fullscreenElement]);
        }
        function getBody() {
            return fullscreenElement && document[fullscreenElement] || document.body || document.documentElement;
        }
        function addListener(listener) {
            fullscreenchange && document.addEventListener(fullscreenchange, listener);
        }
        function removeListener(listener) {
            fullscreenchange && document.removeEventListener(fullscreenchange, listener);
        }
        var fullscreenElement, fullscreenchange;
        [ [ "fullscreenElement", "fullscreenchange" ], [ "webkitFullscreenElement", "webkitfullscreenchange" ], [ "webkitCurrentFullScreenElement", "webkitfullscreenchange" ], [ "mozFullScreenElement", "mozfullscreenchange" ], [ "msFullscreenElement", "MSFullscreenChange" ] ].some(function(ids) {
            if (ids[0] in document) {
                fullscreenElement = ids[0];
                fullscreenchange = ids[1];
                return !0;
            }
        });
        return {
            isFullscreen: isFullscreen,
            getBody: getBody,
            addListener: addListener,
            removeListener: removeListener
        };
    });
    define("asyncUtils", [ "require", "exports", "module" ], function(require, exports) {
        function scheduleTaskImpl(taskId, callback, delay) {
            enabledTaskMap[taskId] = -setTimeout(function() {
                if (taskId in enabledTaskMap) if (raf) enabledTaskMap[taskId] = raf(function() {
                    if (taskId in enabledTaskMap) {
                        delete enabledTaskMap[taskId];
                        callback();
                    }
                }) || 0; else {
                    delete enabledTaskMap[taskId];
                    callback();
                }
            }, delay);
        }
        var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame, caf = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
        raf = raf && raf.bind(window);
        caf = caf && caf.bind(window);
        var isRafEnabledInHiddenDocument = !1, deferredCallbacks = {};
        if (raf) {
            var rafReal = raf, cafReal = caf;
            raf = function(callback) {
                var rafHandle = rafReal(function() {
                    clearTimeout(timerHandle);
                    delete deferredCallbacks[timerHandle];
                    callback();
                }), timerHandle = setTimeout(function() {
                    if (isRafEnabledInHiddenDocument) {
                        cafReal(rafHandle);
                        callback();
                    } else deferredCallbacks[timerHandle] = callback;
                }, 1e3);
                return {
                    rafHandle: rafHandle,
                    timerHandle: timerHandle,
                    valueOf: function() {
                        return rafHandle;
                    }
                };
            };
            caf = function(handle) {
                clearTimeout(handle.timerHandle);
                cafReal(handle.rafHandle);
                delete deferredCallbacks[handle.timerHandle];
            };
        }
        var taskIdCounter = 0, enabledTaskMap = {};
        exports.scheduleTask = function(callback, delay) {
            var taskId = ++taskIdCounter;
            delay = +delay || 0;
            scheduleTaskImpl(taskId, callback, delay);
            return taskId;
        };
        exports.schedulePeriodicTask = function(callback, delay) {
            var taskId = ++taskIdCounter;
            delay = +delay || 0;
            scheduleTaskImpl(taskId, function recurse() {
                scheduleTaskImpl(taskId, recurse, delay);
                callback();
            }, delay);
            return taskId;
        };
        exports.unscheduleTask = function(taskId) {
            var taskStage = enabledTaskMap[taskId];
            delete enabledTaskMap[taskId];
            0 > taskStage ? clearTimeout(-taskStage) : taskStage > 0 && caf && caf(taskStage);
        };
        exports.isActiveInHiddenTab = function() {
            return isRafEnabledInHiddenDocument;
        };
        exports.setIsActiveInHiddenTab = function(isActive) {
            if (isRafEnabledInHiddenDocument !== isActive) {
                isRafEnabledInHiddenDocument = isActive;
                var callbacks = deferredCallbacks;
                deferredCallbacks = {};
                Object.keys(callbacks).forEach(function(timerHandle) {
                    var callback = callbacks[timerHandle];
                    callback();
                });
            }
        };
    });
    define("eventBridge", [ "text!style/pageAction.css", "fullscreen", "asyncUtils", "garbageTracker", "styleInjector" ], function(pageActionStylesheet, fullscreen, asyncUtils, garbageTracker, styleInjector) {
        var tinyIcon, tinyIconPoller, ensureRecipient, _lastMessageType, _lastQueryForPopup, _callbacks = {}, stack = [], dispatchEvent = function(method, data) {
            var callbacks = _callbacks[method] ? _callbacks[method].slice(0) : [];
            stack.push({
                data: data,
                callbacks: callbacks
            });
            if (1 === stack.length) for (;stack.length > 0; ) {
                data = stack.shift();
                callbacks = data.callbacks;
                data = data.data;
                for (var i = 0; callbacks.length > i; i++) callbacks[i](data);
            }
        }, listenEvent = function(method, callback) {
            if ("function" != typeof callback) throw Error("Callback must be a function!");
            (_callbacks[method] || (_callbacks[method] = [])).push(callback);
        }, realIconDisabled = !1, tinyIconDisabled = null, tinyIconShown = !1, showTinyIcon = function() {
            if (!realIconDisabled) {
                tinyIconShown = !0;
                if (null !== tinyIconDisabled) {
                    if (!tinyIconDisabled) {
                        styleInjector.addStyle(pageActionStylesheet, "pageAction");
                        if (!tinyIcon) {
                            tinyIcon = document.createElement("div");
                            tinyIcon.className = "LyricsHereByRobWPageActionIcon";
                            tinyIcon.title = "Click to show the Lyrics panel.\nPress CTRL and click to hide this button.";
                            tinyIcon.title += '\n\nTo permanently hide this button, right-click on the extension button in the browser toolbar and toggle the "Show Lyrics Here button in the page" menu item.';
                            tinyIcon.addEventListener("click", function(event) {
                                hideTinyIcon();
                                event.ctrlKey || dispatchEvent("toggle");
                            });
                        }
                        fullscreen.addListener(onFullscreenChange);
                        asyncUtils.unscheduleTask(tinyIconPoller);
                        tinyIconPoller = asyncUtils.schedulePeriodicTask(showTinyIconIfNeeded, 1e3);
                        garbageTracker.willAddToDOM(tinyIcon, "inline-block");
                        dispatchEvent("iconinserted", tinyIcon);
                        document.body.contains(tinyIcon) || document.body.appendChild(tinyIcon);
                    }
                } else chrome.storage.local.get("tinyIconDisabled", function(items) {
                    if (null === tinyIconDisabled) {
                        tinyIconDisabled = !(!items || !items.tinyIconDisabled);
                        tinyIconShown && !tinyIconDisabled && showTinyIcon();
                    }
                });
            }
        }, onFullscreenChange = function() {
            dispatchEvent("iconinserted", tinyIcon);
        }, showTinyIconIfNeeded = function() {
            tinyIcon.style.zIndex && (tinyIcon.style.zIndex = "");
            document.body.contains(tinyIcon) || showTinyIcon();
        }, hideTinyIcon = function() {
            tinyIconShown = !1;
            fullscreen.removeListener(onFullscreenChange);
            asyncUtils.unscheduleTask(tinyIconPoller);
            tinyIcon && tinyIcon.parentNode && tinyIcon.parentNode.removeChild(tinyIcon);
        }, disableIcon = function(isDisabled) {
            isDisabled = !!isDisabled;
            if (realIconDisabled !== isDisabled) {
                realIconDisabled = isDisabled;
                isDisabled && hideTinyIcon();
            }
        }, reset = function() {
            _callbacks = {};
            stack = [];
            hideTinyIcon();
            listenEvent("attached", hideTinyIcon);
            listenEvent("detached", showTinyIcon);
            listenEvent("disableIcon", disableIcon);
        }, lastMessageID = 0, chromeExtensionSendMessage = function(message, retryCount) {
            if (!(retryCount > 50)) {
                var messageID = ++lastMessageID;
                clearTimeout(ensureRecipient);
                if (isValidChromeRuntime()) {
                    ensureRecipient = setTimeout(function() {
                        lastMessageID === messageID && chromeExtensionSendMessage(message, retryCount ? retryCount + 1 : 1);
                    }, 100);
                    chrome.runtime.sendMessage(message, function() {
                        clearTimeout(ensureRecipient);
                    });
                } else console.warn("Cannot send message " + JSON.stringify(message) + " to the background because the extension runtime does " + "not exist any more. Reload this page to fix the issue.");
            }
        }, resetBase = reset;
        reset = function() {
            resetBase();
            clearTimeout(ensureRecipient);
            lastMessageID = 0;
            _lastMessageType && chromeExtensionSendMessage("hideIcon");
            _lastMessageType = void 0;
            _lastQueryForPopup = null;
            listenEvent("attached", function() {
                realIconDisabled || chromeExtensionSendMessage(_lastMessageType = "attached");
            });
            listenEvent("detached", function() {
                realIconDisabled || chromeExtensionSendMessage(_lastMessageType = "detached");
            });
            listenEvent("disableIcon", function(isDisabled) {
                isDisabled && chromeExtensionSendMessage("hideIcon");
            });
            listenEvent("lyricsQueryForPopup", function(lyricsQuery) {
                _lastQueryForPopup = lyricsQuery;
                isValidChromeRuntime() && chrome.runtime.sendMessage({
                    lyricsQuery: lyricsQuery
                });
            });
        };
        window.addEventListener("load", function() {
            _lastMessageType && chromeExtensionSendMessage(_lastMessageType);
        });
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            if ("toggle" === message) dispatchEvent(message); else if ("crbug#231075" === message) _lastMessageType && chromeExtensionSendMessage(_lastMessageType); else if ("getLyricsForPopup" === message) _lastQueryForPopup && sendResponse(_lastQueryForPopup); else if ("disableTinyIcon" === message) {
                tinyIconDisabled = !0;
                tinyIconShown && hideTinyIcon();
            } else if ("enableTinyIcon" === message) {
                tinyIconDisabled = !1;
                tinyIconShown && showTinyIcon();
            } else "startWatchingLyricsForPopup" === message ? asyncUtils.setIsActiveInHiddenTab(!0) : "stopWatchingLyricsForPopup" === message && asyncUtils.setIsActiveInHiddenTab(!1);
        });
        chrome.runtime.sendMessage("checkWatchingLyricsForPopup");
        reset();
        return {
            dispatchEvent: dispatchEvent,
            listenEvent: listenEvent,
            reset: reset
        };
    });
    define("touch2mouse", [], function() {
        function touch2mouseFactory(type) {
            return function(event) {
                var t = event.changedTouches;
                if (t) {
                    t = t[0];
                    event.preventDefault();
                    event = document.createEvent("MouseEvents");
                    event.initMouseEvent(type, !0, !0, document.defaultView, 1, t.screenX, t.screenY, t.clientX, t.clientY, t.ctrlKey, t.altKey, t.shiftKey, t.metaKey, 0, null);
                    t.target.dispatchEvent(event);
                }
            };
        }
        var supportsTouch = "ontouchend" in document, eventNameMap = {}, eventHandlers = {}, defineT2M = function(t, m) {
            eventNameMap[m] = t;
            eventHandlers[t] = touch2mouseFactory(m);
        };
        defineT2M("touchstart", "mousedown");
        defineT2M("touchmove", "mousemove");
        defineT2M("touchend", "mouseup");
        var exports = {
            events: eventHandlers,
            supportsTouch: supportsTouch,
            addTouchListener: function(elem, type) {
                if (exports.supportsTouch) {
                    var touchType = eventNameMap[type];
                    touchType && elem.addEventListener(touchType, eventHandlers[touchType], !1);
                }
            },
            removeTouchListener: function(elem, type) {
                if (exports.supportsTouch) {
                    var touchType = eventNameMap[type];
                    touchType && elem.removeEventListener(touchType, eventHandlers[touchType], !1);
                }
            }
        };
        return exports;
    });
    define("isLeftMouseReleased", [], function() {
        function isLeftMouseReleased(event) {
            return "buttons" in event && isNotIEorIsIE10plus ? !(1 & event.buttons) : isChrome15OrOpera15plus || isSafari6plus ? 0 === event.which : void 0;
        }
        var isNotIEorIsIE10plus = true, isChrome15OrOpera15plus = true, isSafari6plus = true;
        return isLeftMouseReleased;
    });
    define("LineFinder", [ "require", "exports", "module" ], function(require, exports) {
        function LineFinder(nodes) {
            if (!(this instanceof LineFinder)) return new LineFinder(nodes);
            this.update(nodes);
            return void 0;
        }
        function reformat(string) {
            return string.toLocaleLowerCase().replace(/[.,!?'"`:;\[\]()\/\-]/g, "").replace(/\s+/g, " ");
        }
        function createSearchIndex(nodes) {
            for (var index = [], allText = "", i = 0; nodes.length > i; ++i) {
                var node = nodes[i], text = reformat(node.textContent), item = {
                    node: node,
                    start: allText.length
                };
                allText += text;
                item.end = allText.length - 1;
                index.push(item);
            }
            return {
                allText: allText,
                allTextLength: allText.length,
                index: index,
                indexLength: index.length
            };
        }
        function getNodeAtTextIndex(searchIndex, pos) {
            if (0 > pos) return null;
            for (var node = null, i = 0; searchIndex.indexLength > i; ++i) {
                var item = searchIndex.index[i];
                if (item.start > pos) break;
                node = item.node;
            }
            return node;
        }
        function getLastIndex(searchIndex, lastNode) {
            if (!lastNode) return -1;
            for (var i = 0; searchIndex.indexLength > i; ++i) if (searchIndex.index[i].node === lastNode) return i;
            return -1;
        }
        function findNode(searchIndex, keyword, lastNode, bBackwards, bIncludeLastNode) {
            if (!searchIndex.indexLength) return null;
            var lastIndex = getLastIndex(searchIndex, lastNode), nextIndex = bIncludeLastNode ? lastIndex : bBackwards ? lastIndex - 1 : lastIndex + 1;
            nextIndex >= searchIndex.indexLength ? nextIndex = bBackwards || bIncludeLastNode ? searchIndex.indexLength - 1 : 0 : 0 > nextIndex && (nextIndex = !bBackwards || bIncludeLastNode ? 0 : searchIndex.indexLength - 1);
            var lastPos = searchIndex.index[nextIndex][bBackwards ? "end" : "start"], pos = searchIndex.allText[bBackwards ? "lastIndexOf" : "indexOf"](keyword, lastPos);
            -1 === pos && (pos = bBackwards ? searchIndex.allText.lastIndexOf(keyword, searchIndex.allTextLength) : searchIndex.allText.indexOf(keyword));
            var node = getNodeAtTextIndex(searchIndex, pos);
            return node;
        }
        LineFinder.prototype.update = function(nodes) {
            nodes || (nodes = []);
            this.searchIndex = createSearchIndex(nodes);
            this.lastKeyword = "";
            this.lastNode = null;
        };
        LineFinder.prototype.findSmart = function(keyword) {
            return this.find(keyword, !1, !0);
        };
        LineFinder.prototype.next = function(keyword) {
            return this.find(keyword, !1, !1);
        };
        LineFinder.prototype.prev = function(keyword) {
            return this.find(keyword, !0, !1);
        };
        LineFinder.prototype.find = function(keyword, bBackwards, bIncludeLastNode) {
            keyword = reformat(keyword);
            var node = findNode(this.searchIndex, keyword, this.lastNode, !!bBackwards, !!bIncludeLastNode);
            this.lastKeyword = keyword;
            this.lastNode = node;
            return node;
        };
        exports.LineFinder = LineFinder;
    });
    define("LyricsPanel", [ "require", "exports", "module", "InfoProvider", "LyricsSource", "sources/lyrics", "SimpleTemplating", "text!style/lyricsPanel.css", "styleInjector", "text!templates/lyricsPanel.html", "eventBridge", "config", "musicSites", "algorithms", "touch2mouse", "isLeftMouseReleased", "LineFinder", "asyncUtils", "fullscreen", "garbageTracker", "sources/lyrics" ], function(require, exports) {
        var InfoProvider = require("InfoProvider").InfoProvider, LyricsSource = require("LyricsSource").LyricsSource, getLyricsSources = require("sources/lyrics").getLyricsSources, SimpleTemplating = require("SimpleTemplating").SimpleTemplating, styleSheetText = require("text!style/lyricsPanel.css"), styleInjector = require("styleInjector"), template = require("text!templates/lyricsPanel.html"), eventBridge = require("eventBridge"), config = require("config"), musicSites = require("musicSites"), algorithms = require("algorithms"), touch2mouse = require("touch2mouse"), isLeftMouseReleased = require("isLeftMouseReleased"), LineFinder = require("LineFinder").LineFinder, asyncUtils = require("asyncUtils"), fullscreen = require("fullscreen"), garbageTracker = require("garbageTracker"), DOMAIN_SUFFIX = "." + musicSites.getIdentifier(location.href);
        "." === DOMAIN_SUFFIX && (DOMAIN_SUFFIX = "");
        template = {
            className: "L759-container",
            tagName: "div",
            innerHTML: template
        };
        styleSheetText = ".L759-draggable-fix ~ * {position:relative;}" + styleSheetText;
        template.innerHTML = '<iframe class="L759-draggable-fix" style="position:absolute;top:-1px;left:-1px;width:100%;height:100%;z-index:0;display:block;border:1px solid transparent;background:transparent;box-sizing:content-box;" frameBorder="0"></iframe>' + template.innerHTML;
        var _hasOwnProperty = Object.prototype.hasOwnProperty, _debug = function(method, type, message) {
            console && console.log(method + ": " + message);
        }, _error = function(method, type, error) {
            var e = Error(method + ": " + error);
            e.type = type;
            throw e;
        }, _extend = function(target, source) {
            if (source) {
                for (var key in source) _hasOwnProperty.call(source, key) && (target[key] = source[key]);
                return target;
            }
        }, documentContains = function(elem) {
            return document === elem || !!elem && document.documentElement.contains(elem);
        }, sourceStats = {}, LyricsPanel = {};
        LyricsPanel.panelElement = null;
        LyricsPanel.getCurrentStyle = function() {
            return document.defaultView.getComputedStyle(LyricsPanel.panelElement);
        };
        LyricsPanel.infoProvider = null;
        LyricsPanel.runQueuedQuery = null;
        LyricsPanel.minWidth = 0;
        LyricsPanel.minHeight = 0;
        LyricsPanel.boxsizingbug = !1;
        LyricsPanel.boxsizingcomputedstylebug = !1;
        LyricsPanel.runQuery = function(query, sourceIndex) {
            query = _extend({}, query);
            var type = "";
            if (query.song && query.artist) type = "result"; else {
                query.searchTerms || (query.searchTerms = query.videotitle);
                if (!query.searchTerms) return;
                type = "search";
            }
            LyricsPanel.runQueuedQuery = function() {
                LyricsPanel.runQueuedQuery = null;
                LyricsPanel.infoProvider.query(type, query, LyricsPanel.queryCallback, sourceIndex);
            };
            if (LyricsPanel.infoProvider) LyricsPanel.runQueuedQuery(); else {
                if (0 === LyricsPanel.infoProvider) return;
                LyricsPanel.infoProvider = 0;
                getLyricsSources(function(sources) {
                    sourceStats = sources.stats;
                    LyricsPanel.infoProvider = new InfoProvider(sources);
                    LyricsPanel.runQueuedQuery();
                });
            }
        };
        LyricsPanel.abortQuery = function() {
            if (LyricsPanel.runQueuedQuery) {
                _resumeQuery = LyricsPanel.runQueuedQuery;
                LyricsPanel.runQueuedQuery = null;
            }
            LyricsPanel.infoProvider && LyricsPanel.infoProvider.abort();
        };
        var _resumeQuery;
        LyricsPanel.resumeQuery = function() {
            _resumeQuery && _resumeQuery();
        };
        LyricsPanel.queryCallback = function(resultObject) {
            LyricsPanel.attachPanel();
            _resumeQuery = null;
            switch (resultObject.type) {
              case "fetching":
                LyricsPanel.render.fetchingLyrics(resultObject);
                _resumeQuery = resultObject.retry;
                break;

              case "fail":
                resultObject._chrome_only_blocked_identifier && require("sources/lyrics").permanentlyDisableSource(resultObject._chrome_only_blocked_identifier);
                resultObject.next ? resultObject.next() : LyricsPanel.render.notFound(resultObject);
                break;

              case "found":
                if (resultObject.restart) {
                    var nextResultObject = {
                        type: "fail",
                        sourceIndex: resultObject.sourceIndex,
                        sourceCount: resultObject.sourceCount,
                        searchTerms: resultObject.searchTerms,
                        query: resultObject.query,
                        restart: resultObject.restart
                    };
                    resultObject.restart = function() {
                        LyricsPanel.queryCallback(nextResultObject);
                    };
                }
                LyricsPanel.render.foundLyrics(resultObject);
                break;

              case "message":
                LyricsPanel.render.showMessage(resultObject);
                break;

              default:
                _error("YTL:queryCallback", "unknown_type", "Unknown type " + resultObject.type + '. Expected one of "fetching", "fail" or "found"!');
                return;
            }
            var _chrome_only_render_permission_request = resultObject._chrome_only_render_permission_request, _chrome_only_real_source_identifier = resultObject.sourceIdentifier;
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-chrome-permission-request": {
                    textContent: "",
                    _post: _chrome_only_render_permission_request && function(node) {
                        return _chrome_only_render_permission_request(node, _chrome_only_real_source_identifier);
                    }
                }
            });
            LyricsPanel.panelHelpers.dimensions.adaptPanelToResult();
            LyricLineFinder.update();
        };
        var _lastDispatchedDimensions = {
            top: 0,
            right: 0,
            width: 0,
            height: 0
        };
        LyricsPanel.dispatchDimensionChangeIfNeeded = function() {
            if (!LyricsPanel.isFixedPanel()) {
                var top, right, width, height;
                if (LyricsPanel.isVisible()) {
                    var style = LyricsPanel.panelElement.style;
                    top = parseFloat(style.top);
                    right = parseFloat(style.right);
                    width = parseFloat(style.width);
                    height = parseFloat(style.height);
                } else top = right = width = height = 0;
                if (_lastDispatchedDimensions.top !== top || _lastDispatchedDimensions.right !== right || _lastDispatchedDimensions.width !== width || _lastDispatchedDimensions.height !== height) {
                    var dimensions = {
                        top: top,
                        right: right,
                        width: width,
                        height: height
                    };
                    _lastDispatchedDimensions = dimensions;
                    eventBridge.dispatchEvent("panelDimensions", dimensions);
                }
            }
        };
        LyricsPanel.isVisible = function() {
            return documentContains(LyricsPanel.panelElement);
        };
        LyricsPanel.detachPanel = function() {
            LyricsPanel.abortQuery();
            LyricsPanel.theme.isAutoDetectSupported() && fullscreen.removeListener(LyricsPanel.theme.renderFromPreferences);
            fullscreen.removeListener(LyricsPanel.attachPanel);
            if (LyricsPanel.isVisible()) {
                LyricsPanel.render.unbindInitialEvents();
                LyricsPanel.panelElement.parentNode.removeChild(LyricsPanel.panelElement);
            }
            styleInjector.removeStyle("LyricsPanel");
            asyncUtils.unscheduleTask(_pollPanelCSSActivation);
            LyricsPanel.panelHelpers.mover.end();
            LyricsPanel.panelHelpers.resizer.end();
            LyricsPanel.panelHelpers.overlay.detach();
            _debug("YTL:detachPanel", "detached", "Removed Lyrics panel.");
            eventBridge.dispatchEvent("detached");
            LyricsPanel.dispatchDimensionChangeIfNeeded();
        };
        LyricsPanel.attachPanel = function() {
            var isPanelNotExistent = !LyricsPanel.panelElement;
            if (isPanelNotExistent) {
                LyricsPanel.panelElement = SimpleTemplating(template).getElement();
                LyricsPanel.panelElement.dir = "ltr";
                LyricsPanel.panelElement.style.top = LyricsPanel.savedOffsets.top + "px";
                LyricsPanel.panelElement.style.right = LyricsPanel.savedOffsets.right + "px";
                LyricsPanel.panelElement.style.width = LyricsPanel.savedOffsets.width + "px";
                LyricsPanel.setFixedPanel(LyricsPanel.isFixedPanel());
                LyricsPanel.panelElement.querySelector(".L759-inline-setting-dark-skin").checked = LyricsPanel.panelElement.classList.contains("L759-skin-dark");
                LyricsPanel.panelHelpers.dimensions.updateScrollbarCover();
            }
            LyricsPanel.panelElement.style.zIndex = "";
            styleInjector.hasStyle("LyricsPanel") || styleInjector.addStyle(styleSheetText, "LyricsPanel");
            if (LyricsPanel.isVisible()) {
                var body = fullscreen.getBody();
                if (LyricsPanel.panelElement.parentNode !== body) {
                    garbageTracker.willAddToDOM(LyricsPanel.panelElement, "block");
                    body.appendChild(LyricsPanel.panelElement);
                }
            } else {
                LyricsPanel.theme.renderFromPreferences();
                LyricsPanel.theme.isAutoDetectSupported() && fullscreen.addListener(LyricsPanel.theme.renderFromPreferences);
                garbageTracker.willAddToDOM(LyricsPanel.panelElement, "block");
                fullscreen.getBody().appendChild(LyricsPanel.panelElement);
                fullscreen.addListener(LyricsPanel.attachPanel);
                "fixed" != LyricsPanel.getCurrentStyle().position && LyricsPanel.pollPanelCSSActivation();
                LyricsPanel.panelHelpers.dimensions.fixBoxSizing();
                LyricsPanel.render.bindInitialEvents();
                LyricLineFinder.initialize();
                LyricsPanel.panelHelpers.dimensions.enforcePosition();
                isPanelNotExistent ? LyricsPanel.panelHelpers.dimensions.adaptPanelToResult() : LyricsPanel.panelHelpers.dimensions.enforceDimensions();
                LyricsPanel.panelHelpers.dimensions.enforcePosition() && LyricsPanel.panelHelpers.dimensions.enforceDimensions();
                LyricsPanel.resumeQuery();
                eventBridge.dispatchEvent("attached");
                LyricsPanel.dispatchDimensionChangeIfNeeded();
            }
        };
        var _pollPanelCSSActivation;
        LyricsPanel.pollPanelCSSActivation = function() {
            var timeStarted = Date.now(), _pollPanelCSSActivation = asyncUtils.schedulePeriodicTask(function() {
                if ("fixed" == LyricsPanel.getCurrentStyle().position) {
                    asyncUtils.unscheduleTask(_pollPanelCSSActivation);
                    LyricsPanel.panelHelpers.dimensions.adaptPanelToResult();
                } else Date.now() - timeStarted > 2e4 && asyncUtils.unscheduleTask(_pollPanelCSSActivation);
            }, 50);
        };
        LyricsPanel.theme = {};
        LyricsPanel.theme.isAutoDetectSupported = function() {
            return ".youtube" == DOMAIN_SUFFIX || ".spotify" == DOMAIN_SUFFIX;
        };
        LyricsPanel.theme.activateTheme = function(theme) {
            if ("dark" !== theme && "default" !== theme) {
                var isDark = function(elem) {
                    var s = elem && document.defaultView.getComputedStyle(elem);
                    return s && /^rgba?\(\d{1,2},\s*\d{1,2},\s*\d{1,2}(,\s*(?!0)\d*)?\)$/.test(s.backgroundColor);
                };
                theme = LyricsPanel.theme.isAutoDetectSupported() && (isDark(document.body) || isDark(fullscreen.getBody())) ? "dark" : "default";
            }
            var target = LyricsPanel.panelElement || template;
            target.className = target.className.replace(/L759-skin-\S+/, "") + (theme && "default" != theme ? " L759-skin-" + theme : "");
            if (LyricsPanel.panelElement) {
                target.querySelector(".L759-inline-setting-dark-skin").checked = "dark" === theme;
                LyricsPanel.panelHelpers.dimensions.updateScrollbarCover();
            }
        };
        LyricsPanel.theme.renderFromPreferences = function() {
            config.getItem("theme" + DOMAIN_SUFFIX, function(theme) {
                LyricsPanel.theme.activateTheme(theme);
            });
            config.getItem("fontSize" + DOMAIN_SUFFIX, function(fontSize) {
                "string" == typeof fontSize && LyricsPanel.panelElement && (LyricsPanel.panelElement.style.fontSize = fontSize);
            });
        };
        LyricsPanel.theme.renderFromPreferences();
        var PANEL_OFFSETS_PREF_NAME = "panelOffsets" + DOMAIN_SUFFIX;
        LyricsPanel.savedOffsets = {
            top: 2,
            right: 2,
            width: 275,
            maxHeight: 600
        };
        var _saveOffsetsDelayedCall, OFFSETS_POSITION = 1, OFFSETS_DIMENSION = 2;
        LyricsPanel.saveOffsets = function(saveFilter) {
            if (LyricsPanel.isVisible()) {
                var savedOffsets = LyricsPanel.savedOffsets, currentStyle = LyricsPanel.getCurrentStyle(), saveOffsetIfValid = function(keyName, value) {
                    value = parseFloat(value);
                    !isNaN(value) && isFinite(value) && (savedOffsets[keyName] = value);
                };
                if (saveFilter & OFFSETS_POSITION) {
                    saveOffsetIfValid("top", currentStyle.top);
                    saveOffsetIfValid("right", currentStyle.right);
                }
                if (saveFilter & OFFSETS_DIMENSION) if (LyricsPanel.boxsizingcomputedstylebug) {
                    saveOffsetIfValid("width", LyricsPanel.panelElement.style.width);
                    saveOffsetIfValid("maxHeight", LyricsPanel.panelElement.style.height);
                } else {
                    saveOffsetIfValid("width", currentStyle.width);
                    saveOffsetIfValid("maxHeight", currentStyle.height);
                }
                clearTimeout(_saveOffsetsDelayedCall);
                _saveOffsetsDelayedCall = setTimeout(function() {
                    config.setItem(PANEL_OFFSETS_PREF_NAME, savedOffsets, function(success) {
                        success ? _debug("LyricsPanel.saveOffsets", "", "Saved Lyric panel's position and dimensions!") : _debug("LyricsPanel.saveOffsets", "", "Failed to save the Lyric panel's position and dimensions!");
                    });
                }, 200);
            } else _debug("LyricsPanel.saveOffsets", "not_rendered", "Lyric panel cannot be found within the document!");
        };
        var _loadOffsetsLoadStatus = 0, _loadOffsetsCallbackQueue = [];
        LyricsPanel.loadOffsets = function(callback) {
            if (2 == _loadOffsetsLoadStatus) callback(LyricsPanel.savedOffsets); else if (1 == _loadOffsetsLoadStatus) _loadOffsetsCallbackQueue.push(callback); else {
                _loadOffsetsLoadStatus = 1;
                _loadOffsetsCallbackQueue.push(callback);
                config.getItem(PANEL_OFFSETS_PREF_NAME, function(savedOffsets) {
                    if (savedOffsets) {
                        var getKey = function(key) {
                            _hasOwnProperty.call(savedOffsets, key) && (LyricsPanel.savedOffsets[key] = savedOffsets[key]);
                        };
                        getKey("top");
                        getKey("right");
                        getKey("width");
                        getKey("maxHeight");
                    }
                    for (;callback = _loadOffsetsCallbackQueue.shift(); ) callback(LyricsPanel.savedOffsets);
                    _loadOffsetsLoadStatus = 2;
                });
            }
        };
        LyricsPanel.panelHelpers = {};
        LyricsPanel.panelHelpers.show = function(elem) {
            elem.style.display = "";
        };
        LyricsPanel.panelHelpers.hide = function(elem) {
            elem.style.display = "none";
        };
        LyricsPanel.panelHelpers.doSearch = function() {
            var searchTerms = LyricsPanel.panelElement.querySelector(".L759-searchterms").value, artist_song = algorithms.splitSongTitle(searchTerms);
            artist_song ? LyricsPanel.runQuery({
                searchTerms: searchTerms,
                artist: artist_song[0],
                song: artist_song[1]
            }) : LyricsPanel.runQuery({
                searchTerms: searchTerms
            });
        };
        LyricsPanel.panelHelpers.dimensions = {};
        LyricsPanel.panelHelpers.dimensions.getViewportDimensions = function() {
            var wasAttached = LyricsPanel.panelHelpers.overlay.isAttached();
            LyricsPanel.panelHelpers.overlay.attach();
            var rect = LyricsPanel.overlayElement.getBoundingClientRect(), width = rect.right, height = rect.bottom;
            wasAttached || LyricsPanel.panelHelpers.overlay.detach();
            return {
                width: width,
                height: height
            };
        };
        var checkBoxSizingRunOnce;
        LyricsPanel.panelHelpers.dimensions.fixBoxSizing = function() {
            if (!checkBoxSizingRunOnce) {
                checkBoxSizingRunOnce = 1;
                var div = document.createElement("div");
                div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;top:-999px;position:absolute;min-height:6px;padding:1px;border:0;";
                document.documentElement.appendChild(div);
                var currentStyle = LyricsPanel.getCurrentStyle();
                LyricsPanel.minHeight = parseFloat(currentStyle.minHeight) || 25;
                LyricsPanel.minWidth = parseFloat(currentStyle.minWidth) || 25;
                if (8 == div.scrollHeight) {
                    LyricsPanel.boxsizingbug = !0;
                    LyricsPanel.panelElement.className += " boxsizingbug";
                }
                div.style.height = "8px";
                "8px" != window.getComputedStyle(div).height && (LyricsPanel.boxsizingcomputedstylebug = !0);
                div.parentNode.removeChild(div);
                div = null;
            }
        };
        LyricsPanel.panelHelpers.dimensions.enforceDimensions = function() {
            if (LyricsPanel.isFixedPanel()) LyricsPanel.panelHelpers.dimensions.updateScrollbarCover(); else {
                var width, height, currentStyle = LyricsPanel.getCurrentStyle(), currentWidth = LyricsPanel.panelElement.offsetWidth, currentHeight = LyricsPanel.panelElement.offsetHeight, currentTop = parseFloat(currentStyle.top), currentRight = parseFloat(currentStyle.right), minWidth = LyricsPanel.minWidth, minHeight = LyricsPanel.minHeight, dimension = LyricsPanel.panelHelpers.dimensions.getViewportDimensions(), maxWidth = dimension.width - currentRight, maxHeight = dimension.height - currentTop;
                currentWidth > maxWidth && (width = maxWidth);
                minWidth > currentWidth && (width = minWidth);
                currentHeight > maxHeight && (height = maxHeight);
                minHeight > currentHeight && (height = minHeight);
                if (width) {
                    LyricsPanel.panelElement.style.width = width + "px";
                    LyricsPanel.panelHelpers.dimensions.recalcContentTop();
                }
                height && (LyricsPanel.panelElement.style.height = height + "px");
                LyricsPanel.panelHelpers.dimensions.updateScrollbarCover();
            }
        };
        LyricsPanel.panelHelpers.dimensions.enforcePosition = function() {
            if (LyricsPanel.isFixedPanel()) return !1;
            var currentStyle = LyricsPanel.getCurrentStyle(), panelTop = parseFloat(currentStyle.top) || 0, panelRight = parseFloat(currentStyle.right) || 0, dimension = LyricsPanel.panelHelpers.dimensions.getViewportDimensions(), maxTop = dimension.height, maxRight = dimension.width;
            if (LyricsPanel.boxsizingcomputedstylebug) {
                maxTop -= parseFloat(LyricsPanel.panelElement.style.height) || LyricsPanel.minHeight;
                maxRight -= parseFloat(LyricsPanel.panelElement.style.width) || LyricsPanel.minWidth;
            } else {
                maxTop -= parseFloat(currentStyle.height) || LyricsPanel.minHeight;
                maxRight -= parseFloat(currentStyle.width) || LyricsPanel.minWidth;
            }
            var hasChanged = !1;
            if (panelTop > maxTop) {
                hasChanged = !0;
                LyricsPanel.panelElement.style.top = Math.max(0, maxTop) + "px";
            }
            if (0 > panelTop) {
                hasChanged = !0;
                LyricsPanel.panelElement.style.top = "0";
            }
            if (panelRight > maxRight) {
                hasChanged = !0;
                LyricsPanel.panelElement.style.right = Math.max(0, maxRight) + "px";
            }
            if (0 > panelRight) {
                hasChanged = !0;
                LyricsPanel.panelElement.style.right = "0";
            }
            return hasChanged;
        };
        var _fixedNonContentHeight = 0, _originalContentTop = 0;
        LyricsPanel.panelHelpers.dimensions.recalcContentTop = function() {
            var content = LyricsPanel.panelElement.querySelector(".L759-content-wrapper");
            _originalContentTop || (_originalContentTop = parseFloat(document.defaultView.getComputedStyle(content).top) || 0);
            var topbarHeight = LyricsPanel.panelElement.querySelector(".L759-top-bar").offsetHeight;
            content.style.top = _originalContentTop + topbarHeight + "px";
        };
        LyricsPanel.panelHelpers.dimensions.getFixedNonContentHeight = function() {
            var content = LyricsPanel.panelElement.querySelector(".L759-content-wrapper");
            if (!_fixedNonContentHeight) {
                var currentStyle = LyricsPanel.getCurrentStyle();
                _fixedNonContentHeight = parseFloat(currentStyle.borderTopWidth) + parseFloat(currentStyle.borderBottomWidth) + parseFloat(document.defaultView.getComputedStyle(content).bottom) + parseFloat(document.defaultView.getComputedStyle(content.firstElementChild).paddingTop);
            }
            LyricsPanel.panelHelpers.dimensions.recalcContentTop();
            return parseFloat(content.style.top) + _fixedNonContentHeight;
        };
        LyricsPanel.panelHelpers.dimensions.adaptPanelToResult = function() {
            if (LyricsPanel.isFixedPanel()) LyricsPanel.panelHelpers.dimensions.recalcContentTop(); else {
                var resultElement = LyricsPanel.panelElement.querySelector(".L759-result"), scrollableBox = LyricsPanel.panelElement.querySelector(".L759-content"), cssBottom = scrollableBox.style.bottom, cssOverflow = scrollableBox.style.overflow;
                scrollableBox.style.bottom = "auto";
                scrollableBox.style.overflow = "visible";
                var maxResultHeight = resultElement.scrollHeight;
                scrollableBox.style.bottom = cssBottom;
                scrollableBox.style.overflow = cssOverflow;
                scrollableBox = null;
                maxResultHeight || (maxResultHeight = LyricsPanel.panelElement.querySelector(".L759-fetching").scrollHeight);
                var nonContentHeight = LyricsPanel.panelHelpers.dimensions.getFixedNonContentHeight(), height = nonContentHeight + maxResultHeight, minHeight = nonContentHeight;
                height > LyricsPanel.savedOffsets.maxHeight && (height = LyricsPanel.savedOffsets.maxHeight);
                minHeight > height && (height = minHeight);
                LyricsPanel.panelElement.style.height = height + "px";
                LyricsPanel.panelHelpers.dimensions.enforceDimensions();
            }
        };
        var _previousPanelHeightPx;
        LyricsPanel.panelHelpers.dimensions.togglePanelHeight = function() {
            if (!LyricsPanel.isFixedPanel()) {
                var currentHeight = LyricsPanel.panelElement.offsetHeight, minHeight = LyricsPanel.minHeight, delta = 10;
                if (delta > currentHeight - minHeight) {
                    LyricsPanel.resumeQuery();
                    if (_previousPanelHeightPx) {
                        LyricsPanel.panelElement.style.height = _previousPanelHeightPx;
                        LyricsPanel.panelHelpers.dimensions.enforceDimensions();
                    } else LyricsPanel.panelHelpers.dimensions.adaptPanelToResult();
                } else {
                    LyricsPanel.abortQuery();
                    _previousPanelHeightPx = LyricsPanel.panelElement.style.height;
                    LyricsPanel.panelElement.style.height = minHeight + "px";
                    LyricsPanel.panelHelpers.dimensions.enforceDimensions();
                }
            }
        };
        LyricsPanel.panelHelpers.dimensions.updateScrollbarCover = function() {
            if (LyricsPanel.panelElement.classList.contains("L759-skin-dark") && "string" == typeof LyricsPanel.panelElement.style.pointerEvents) {
                var scrollbarCover = LyricsPanel.panelElement.querySelector(".L759-content-scrollbar-cover"), contentEdge = LyricsPanel.panelElement.querySelector(".L759-content > .L759-content-right-edge");
                if (!contentEdge) {
                    contentEdge = document.createElement("div");
                    contentEdge.style.position = "absolute";
                    contentEdge.style.top = "0";
                    contentEdge.style.right = "0";
                    contentEdge.className = "L759-content-right-edge";
                    LyricsPanel.panelElement.querySelector(".L759-content").appendChild(contentEdge);
                }
                var contentRight = contentEdge.getBoundingClientRect().right, scrollbarCoverRight = scrollbarCover.getBoundingClientRect().right, scrollbarWidth = scrollbarCoverRight - contentRight;
                0 > scrollbarWidth ? scrollbarWidth = 0 : scrollbarWidth && (scrollbarWidth = Math.floor(scrollbarWidth) + 1);
                scrollbarCover.style.width = scrollbarWidth + "px";
            }
        };
        LyricsPanel.panelHelpers.overlay = {};
        LyricsPanel.panelHelpers.overlay.isAttached = function() {
            return !(!LyricsPanel.overlayElement || !documentContains(LyricsPanel.overlayElement));
        };
        LyricsPanel.panelHelpers.overlay.attach = function() {
            if (!LyricsPanel.overlayElement) {
                LyricsPanel.overlayElement = document.createElement("div");
                LyricsPanel.overlayElement.className = "L759-overlay";
            }
            var body = fullscreen.getBody();
            if (LyricsPanel.overlayElement.parentNode !== body) {
                garbageTracker.willAddToDOM(LyricsPanel.overlayElement, "block");
                body.appendChild(LyricsPanel.overlayElement);
                fullscreen.addListener(LyricsPanel.panelHelpers.overlay.attach);
                LyricsPanel.panelHelpers.dimensions.getViewportDimensions();
            }
        };
        LyricsPanel.panelHelpers.overlay.detach = function() {
            fullscreen.removeListener(LyricsPanel.panelHelpers.overlay.attach);
            LyricsPanel.panelHelpers.overlay.isAttached() && LyricsPanel.overlayElement.parentNode.removeChild(LyricsPanel.overlayElement);
        };
        LyricsPanel.panelHelpers.mover = {};
        LyricsPanel.panelHelpers.mover.globalMouseMove = null;
        LyricsPanel.panelHelpers.mover.moverMouseDown = function(event) {
            if (!LyricsPanel.isFixedPanel() && 1 === event.which) {
                event.stopPropagation();
                event.preventDefault();
                if (!LyricsPanel.panelHelpers.mover.globalMouseMove) {
                    var currentStyle = LyricsPanel.getCurrentStyle(), panelTop = parseFloat(currentStyle.top) || 0, panelRight = parseFloat(currentStyle.right) || 0, startX = event.clientX, startY = event.clientY, minTop = 0, minRight = 0, dimension = LyricsPanel.panelHelpers.dimensions.getViewportDimensions(), maxTop = dimension.height - LyricsPanel.minHeight, maxRight = dimension.width - LyricsPanel.minWidth;
                    LyricsPanel.panelHelpers.mover.globalMouseMove = function(event) {
                        event.preventDefault();
                        if (LyricsPanel.isVisible() && !isLeftMouseReleased(event)) {
                            var top = panelTop - startY + event.clientY;
                            top > maxTop && (top = maxTop);
                            minTop > top && (top = minTop);
                            var right = panelRight + startX - event.clientX;
                            right > maxRight && (right = maxRight);
                            minRight > right && (right = minRight);
                            LyricsPanel.panelElement.style.top = top + "px";
                            LyricsPanel.panelElement.style.right = right + "px";
                        } else LyricsPanel.panelHelpers.mover.end();
                    };
                    LyricsPanel.panelHelpers.overlay.attach();
                    document.addEventListener("mousemove", LyricsPanel.panelHelpers.mover.globalMouseMove, !0);
                    document.addEventListener("mouseup", LyricsPanel.panelHelpers.mover.globalMouseUp, !0);
                    touch2mouse.addTouchListener(document, "mousemove");
                    touch2mouse.addTouchListener(document, "mouseup");
                }
            }
        };
        LyricsPanel.panelHelpers.mover.globalMouseUp = function(event) {
            event.preventDefault();
            event.stopPropagation();
            LyricsPanel.panelHelpers.dimensions.enforceDimensions();
            LyricsPanel.panelHelpers.mover.end();
            LyricsPanel.dispatchDimensionChangeIfNeeded();
        };
        LyricsPanel.panelHelpers.mover.end = function() {
            if (LyricsPanel.panelHelpers.mover.globalMouseMove) {
                document.removeEventListener("mousemove", LyricsPanel.panelHelpers.mover.globalMouseMove, !0);
                touch2mouse.removeTouchListener(document, "mousemove");
                LyricsPanel.panelHelpers.mover.globalMouseMove = null;
                document.removeEventListener("mouseup", LyricsPanel.panelHelpers.mover.globalMouseUp, !0);
                touch2mouse.removeTouchListener(document, "mouseup");
                LyricsPanel.panelHelpers.overlay.detach();
                LyricsPanel.saveOffsets(OFFSETS_POSITION);
            }
        };
        LyricsPanel.panelHelpers.resizer = {};
        LyricsPanel.panelHelpers.resizer.globalMouseMove = null;
        LyricsPanel.panelHelpers.resizer.resizerMouseDown = function(event) {
            if (!LyricsPanel.isFixedPanel() && !LyricsPanel.panelHelpers.resizer.globalMouseMove && 1 === event.which) {
                event.preventDefault();
                event.stopPropagation();
                var panelWidth = LyricsPanel.panelElement.offsetWidth, panelHeight = LyricsPanel.panelElement.offsetHeight, startX = event.clientX, startY = event.clientY, currentStyle = LyricsPanel.getCurrentStyle(), minWidth = LyricsPanel.minWidth, dimensions = LyricsPanel.panelHelpers.dimensions.getViewportDimensions(), maxWidth = dimensions.width - (parseFloat(currentStyle.right) || 0), minHeight = LyricsPanel.minHeight, maxHeight = dimensions.height - (parseFloat(currentStyle.top) || 0);
                LyricsPanel.panelHelpers.resizer.globalMouseMove = function(event) {
                    event.preventDefault();
                    if (LyricsPanel.isVisible() && !isLeftMouseReleased(event)) {
                        var width = panelWidth + startX - event.clientX;
                        width > maxWidth && (width = maxWidth);
                        minWidth > width && (width = minWidth);
                        var height = panelHeight - startY + event.clientY;
                        height > maxHeight && (height = maxHeight);
                        minHeight > height && (height = minHeight);
                        LyricsPanel.panelElement.style.width = width + "px";
                        LyricsPanel.panelElement.style.height = height + "px";
                        LyricsPanel.panelHelpers.dimensions.recalcContentTop();
                    } else LyricsPanel.panelHelpers.resizer.end();
                };
                document.addEventListener("mousemove", LyricsPanel.panelHelpers.resizer.globalMouseMove, !0);
                document.addEventListener("mouseup", LyricsPanel.panelHelpers.resizer.end, !0);
                touch2mouse.addTouchListener(document, "mousemove");
                touch2mouse.addTouchListener(document, "mouseup");
                LyricsPanel.panelHelpers.overlay.attach();
            }
        };
        LyricsPanel.panelHelpers.resizer.end = function() {
            if (LyricsPanel.panelHelpers.resizer.globalMouseMove) {
                document.removeEventListener("mousemove", LyricsPanel.panelHelpers.resizer.globalMouseMove, !0);
                touch2mouse.removeTouchListener(document, "mousemove");
                LyricsPanel.panelHelpers.resizer.globalMouseMove = null;
                document.removeEventListener("mouseup", LyricsPanel.panelHelpers.resizer.end, !0);
                touch2mouse.removeTouchListener(document, "mouseup");
                LyricsPanel.panelHelpers.overlay.detach();
                LyricsPanel.saveOffsets(OFFSETS_DIMENSION);
                LyricsPanel.dispatchDimensionChangeIfNeeded();
            }
        };
        LyricsPanel.panelHelpers.stayWithinViewport = function() {
            LyricsPanel.panelElement && LyricsPanel.panelHelpers.dimensions.enforcePosition() && LyricsPanel.panelHelpers.dimensions.enforceDimensions();
        };
        var _throttledRendererTimeout, _globalResizeLastTime = 0;
        LyricsPanel.panelHelpers.globalResize = function() {
            if (!LyricsPanel.isFixedPanel()) {
                var throttle_timeout = 333, now = Date.now(), diff = now - _globalResizeLastTime;
                if (diff > throttle_timeout) {
                    setTimeout(LyricsPanel.panelHelpers.stayWithinViewport, 4);
                    _globalResizeLastTime = now;
                } else {
                    _globalResizeLastTime = now;
                    clearTimeout(_throttledRendererTimeout);
                    _throttledRendererTimeout = setTimeout(LyricsPanel.panelHelpers.stayWithinViewport, throttle_timeout);
                }
            }
        };
        var isTranslateExtensionElement = function(node) {
            var selector = "#gtx-trans, .jfk-bubble";
            if (node.closest) return null !== node.closest(selector);
            for (var candidates = document.querySelectorAll(selector), i = 0; candidates.length > i; ++i) if (candidates[i].contains(node)) return !0;
            return !1;
        };
        LyricsPanel.panelHelpers.globalMouseDown = function(event) {
            var target = event.target, shouldAllowTranslateOnTop = LyricsPanel.panelElement.contains(target) || isTranslateExtensionElement(target), hasAllowTranslateOnTop = LyricsPanel.panelElement.classList.contains("allow-translate-on-top");
            hasAllowTranslateOnTop !== shouldAllowTranslateOnTop && LyricsPanel.panelElement.classList.toggle("allow-translate-on-top", shouldAllowTranslateOnTop);
        };
        LyricsPanel.panelHelpers.highlightLyricsLine = function(elem, toggleHighlight) {
            var prev = LyricsPanel.panelElement.querySelector(".L759-highlight");
            prev && prev.classList.remove("L759-highlight");
            elem && elem.classList.contains("L759-lyrics-line") && (toggleHighlight && elem === prev || elem.classList.add("L759-highlight"));
        };
        LyricsPanel.panelHelpers.focusLyricBoxForKeyboardInteraction = function() {
            LyricsPanel.panelElement.querySelector(".L759-result").focus();
        };
        var _scrollEaseHandle;
        LyricsPanel.panelHelpers.scrollLineIntoViewIfNeeded = function(node, alwaysCenter) {
            var scrollableElement = LyricsPanel.panelElement.querySelector(".L759-content"), rectMain = scrollableElement.getBoundingClientRect(), rectNode = node.getBoundingClientRect();
            if (alwaysCenter || rectNode.bottom + 30 > rectMain.bottom || rectNode.top < rectMain.top) {
                var heightNode = rectNode.height || rectNode.bottom - rectNode.top, heightMain = rectMain.height || rectMain.bottom - rectMain.top, deltaY = rectNode.top - rectMain.top - (heightMain - heightNode) / 2;
                if (!window.requestAnimationFrame) {
                    scrollableElement.scrollTop += deltaY;
                    return;
                }
                var startTime, duration = 100, scrollTopStart = scrollableElement.scrollTop;
                _scrollEaseHandle && window.cancelAnimationFrame(_scrollEaseHandle);
                _scrollEaseHandle = window.requestAnimationFrame(function loop(time) {
                    startTime || (startTime = time);
                    var elapsedTime = time - startTime;
                    if (elapsedTime >= duration) scrollableElement.scrollTop = scrollTopStart + deltaY; else {
                        scrollableElement.scrollTop = scrollTopStart + elapsedTime / duration * deltaY;
                        _scrollEaseHandle = window.requestAnimationFrame(loop);
                    }
                });
            }
        };
        var LyricLineFinder = {};
        LyricLineFinder.lineFinder = new LineFinder();
        LyricLineFinder.hasLines = !1;
        LyricLineFinder.initialize = function() {
            LyricLineFinder.inputElement = LyricsPanel.panelElement.querySelector(".L759-finder-searchterms");
            LyricLineFinder.finderContainer = LyricsPanel.panelElement.querySelector(".L759-line-finder");
        };
        LyricLineFinder.update = function() {
            var firstLyricsLine = LyricsPanel.panelElement.querySelector(".L759-lyrics-line"), nodes = firstLyricsLine ? firstLyricsLine.parentNode.childNodes : [];
            LyricLineFinder.hasLines = nodes.length > 0;
            LyricLineFinder.lineFinder.update(nodes);
            LyricLineFinder.lastKeyword = "";
            LyricLineFinder.hasLines || LyricLineFinder.hide();
        };
        LyricLineFinder.onInputChange = function() {
            var keyword = LyricLineFinder.inputElement.value;
            if (LyricLineFinder.lastKeyword !== keyword) {
                LyricLineFinder.lastKeyword = keyword;
                var node = LyricLineFinder.lineFinder.findSmart(keyword);
                LyricLineFinder.highlight(node);
            }
        };
        LyricLineFinder.highlight = function(node) {
            LyricsPanel.panelHelpers.highlightLyricsLine(node);
            if (node) {
                LyricLineFinder.finderContainer.classList.remove("L759-line-notfound");
                LyricsPanel.panelHelpers.scrollLineIntoViewIfNeeded(node, !1);
            } else LyricLineFinder.lastKeyword && LyricLineFinder.finderContainer.classList.add("L759-line-notfound");
        };
        LyricLineFinder.prev = function() {
            var node = LyricLineFinder.lineFinder.prev(LyricLineFinder.inputElement.value);
            LyricLineFinder.highlight(node);
        };
        LyricLineFinder.next = function() {
            var node = LyricLineFinder.lineFinder.next(LyricLineFinder.inputElement.value);
            LyricLineFinder.highlight(node);
        };
        LyricLineFinder.show = function() {
            if (LyricLineFinder.hasLines) {
                LyricLineFinder.finderContainer.classList.add("L759-visible");
                LyricLineFinder.inputElement.focus();
                window.addEventListener("keydown", LyricLineFinder.onkeydown);
            }
        };
        LyricLineFinder.hide = function() {
            LyricLineFinder.finderContainer.classList.remove("L759-visible");
            LyricLineFinder.finderContainer.classList.remove("L759-line-notfound");
            window.removeEventListener("keydown", LyricLineFinder.onkeydown);
        };
        LyricLineFinder.onkeydown = function(event) {
            if (27 === event.keyCode) {
                LyricLineFinder.hide();
                LyricsPanel.panelHelpers.focusLyricBoxForKeyboardInteraction();
            }
        };
        LyricsPanel.render = {};
        LyricsPanel.render.bindInitialEvents = function() {
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-resizer": {
                    onmousedown: LyricsPanel.panelHelpers.resizer.resizerMouseDown,
                    ontouchstart: touch2mouse.events.touchstart
                },
                ".L759-title": {
                    onmousedown: LyricsPanel.panelHelpers.mover.moverMouseDown,
                    ontouchstart: touch2mouse.events.touchstart,
                    ondblclick: LyricsPanel.panelHelpers.dimensions.togglePanelHeight
                },
                ".L759-close": {
                    onclick: function() {
                        LyricsPanel.detachPanel();
                        eventBridge.dispatchEvent("panel-closed-by-user");
                    }
                },
                ".L759-info": {
                    className: "L759-info " + ("https:" === location.protocol ? "" : "L759-http")
                },
                ".L759-toggle-info": {
                    onclick: function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.classList.toggle("L759-info-toggled");
                    }
                },
                ".L759-result": {
                    ondblclick: function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        LyricLineFinder.show();
                    },
                    onkeydown: function(event) {
                        if (!(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) && event.keyCode >= 37 && 40 >= event.keyCode) {
                            event.stopPropagation();
                            var goPrev = 37 === event.keyCode, goNext = 39 === event.keyCode;
                            if (goPrev || goNext) {
                                var highlightedLine = this.querySelector(".L759-highlight");
                                if (highlightedLine) {
                                    event.preventDefault();
                                    var elem = goPrev ? highlightedLine.previousElementSibling : highlightedLine.nextElementSibling;
                                    if (elem) {
                                        LyricsPanel.panelHelpers.highlightLyricsLine(elem);
                                        LyricsPanel.panelHelpers.scrollLineIntoViewIfNeeded(elem, !0);
                                    }
                                }
                            }
                        }
                    },
                    onmousedown: function(event) {
                        var elem = event.target;
                        LyricsPanel.panelHelpers.highlightLyricsLine(elem, !0);
                        if (1 === event.which && elem.classList.contains("L759-lyrics-line")) {
                            elem.classList.add("L759-noselect");
                            setTimeout(function() {
                                elem.classList.remove("L759-noselect");
                            }, 50);
                        }
                    }
                },
                ".L759-finder-searchterms": {
                    onkeydown: function(event) {
                        event.stopPropagation();
                        if (13 === event.keyCode || "Enter" === event.keyIdentifier) {
                            event.preventDefault();
                            event.shiftKey ? LyricLineFinder.prev() : LyricLineFinder.next();
                        } else if (27 === event.keyCode) {
                            LyricLineFinder.hide();
                            LyricsPanel.panelHelpers.focusLyricBoxForKeyboardInteraction();
                        }
                    },
                    oninput: LyricLineFinder.onInputChange
                },
                ".L759-line-finder .L759-find-prev": {
                    onclick: LyricLineFinder.prev
                },
                ".L759-line-finder .L759-find-next": {
                    onclick: LyricLineFinder.next
                },
                ".L759-line-finder .L759-find-hide": {
                    onclick: function() {
                        LyricLineFinder.hide();
                        LyricsPanel.panelHelpers.focusLyricBoxForKeyboardInteraction();
                    }
                },
                ".L759-searchbox .L759-searchterms": {
                    onkeydown: function(event) {
                        event.stopPropagation();
                        if (13 === event.keyCode || "Enter" === event.keyIdentifier) {
                            event.preventDefault();
                            LyricsPanel.panelHelpers.doSearch();
                        }
                    }
                },
                ".L759-searchbox .L759-dosearch": {
                    onclick: LyricsPanel.panelHelpers.doSearch
                },
                "a.L759-settings-link": {
                    _post: function() {
                        if ("robwu.nl" === location.host || "rob.lekensteyn.nl" === location.host || /^(chrome-extension|widget)/.test(location.protocol)) {
                            this.href = "#config";
                            this.target = "";
                        }
                    }
                },
                ".L759-inline-settings-toggle": {
                    onclick: function() {
                        LyricsPanel.panelElement.querySelector(".L759-inline-settings-wrapper").classList.toggle("L759-inline-settings-docked");
                    }
                },
                ".L759-inline-setting-dark-skin": {
                    onclick: function() {
                        LyricsPanel.panelElement.classList.toggle("L759-skin-dark");
                        LyricsPanel.panelHelpers.dimensions.updateScrollbarCover();
                    }
                }
            });
            window.addEventListener("resize", LyricsPanel.panelHelpers.globalResize, !0);
            document.addEventListener("mousedown", LyricsPanel.panelHelpers.globalMouseDown, !0);
        };
        LyricsPanel.render.unbindInitialEvents = function() {
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-resizer": {
                    onmousedown: null,
                    ontouchstart: null
                },
                ".L759-title": {
                    onmousedown: null,
                    ontouchstart: null,
                    ondblclick: null
                },
                ".L759-close": {
                    onclick: null
                },
                ".L759-toggle-info": {
                    onclick: null
                },
                ".L759-result": {
                    ondblclick: null,
                    onkeydown: null,
                    onmousedown: null
                },
                ".L759-finder-searchterms": {
                    onkeydown: null,
                    oninput: null
                },
                ".L759-line-finder .L759-find-prev": {
                    onclick: null
                },
                ".L759-line-finder .L759-find-next": {
                    onclick: null
                },
                ".L759-line-finder .L759-find-hide": {
                    onclick: null
                },
                ".L759-searchbox .L759-searchterms": {
                    onkeydown: null
                },
                ".L759-searchbox .L759-dosearch": {
                    onclick: null
                },
                ".L759-inline-settings-toggle": {
                    onclick: null
                },
                ".L759-inline-setting-dark-skin": {
                    onclick: null
                }
            });
            window.removeEventListener("resize", LyricsPanel.panelHelpers.globalResize, !0);
            document.removeEventListener("mousedown", LyricsPanel.panelHelpers.globalMouseDown, !0);
        };
        LyricsPanel.render.showMessage = function(props) {
            var resultContent = {
                dir: ""
            };
            resultContent[props.html ? "innerHTML" : "textContent"] = props.message;
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-title": {
                    textContent: props.title || "Lyrics Here",
                    title: ""
                },
                ".L759-fetching, .L759-top-bar, .L759-info .L759-song-info": {
                    _post: LyricsPanel.panelHelpers.hide
                },
                ".L759-result": resultContent
            });
        };
        LyricsPanel.render.fetchingLyrics = function(props) {
            var decodedURL = decodeURI(props.url);
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-title": {
                    textContent: "Searching...",
                    title: ""
                },
                ".L759-fetching": {
                    _post: LyricsPanel.panelHelpers.show
                },
                ".L759-fetching .L759-buttons .L759-b-abort": {
                    onclick: props.abort,
                    _post: LyricsPanel.panelHelpers["function" == typeof props.abort ? "show" : "hide"]
                },
                ".L759-fetching .L759-buttons .L759-b-retry": {
                    onclick: props.retry,
                    _post: LyricsPanel.panelHelpers["function" == typeof props.retry ? "show" : "hide"]
                },
                ".L759-fetching .L759-buttons .L759-b-next": {
                    onclick: props.next,
                    _post: LyricsPanel.panelHelpers["function" == typeof props.next ? "show" : "hide"]
                },
                ".L759-content": {
                    scrollTop: 0
                },
                ".L759-done, .L759-top-bar": {
                    _post: LyricsPanel.panelHelpers.hide
                },
                ".L759-link-to-fetched-source": {
                    href: props.url,
                    title: decodedURL,
                    textContent: decodedURL.length > 200 ? decodedURL.substring(0, 200) + "..." : decodedURL
                },
                ".L759-result": {
                    textContent: ""
                }
            });
        };
        LyricsPanel.render.notFound = function(props) {
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-title": {
                    textContent: "Not found",
                    title: ""
                },
                ".L759-fetching": {
                    _post: LyricsPanel.panelHelpers.hide
                },
                ".L759-content": {
                    scrollTop: 0
                },
                ".L759-done, .L759-top-bar": {
                    _post: LyricsPanel.panelHelpers.show
                },
                ".L759-done .L759-result": {
                    dir: "ltr",
                    innerHTML: "Cannot find lyrics (" + (+props.sourceCount || 0) + "x) for:<br>" + '<span class="YTL-notFound"></span>' + '<br>&bull; <a class="YTL-notFound-search-link" target="_blank" rel="noreferrer"></a>' + '<br>&bull; <span title="Enable or disable lyric providers.\n ' + +sourceStats.Total + ' sources are available.">' + '<a href="https://robwu.nl/lyricshere/#config" target="_blank">Edit sources</a>' + (sourceStats.New ? " (" + +sourceStats.New + " new)" : "") + "</span><br>"
                },
                ".L759-info .L759-song-info": {
                    _post: LyricsPanel.panelHelpers.hide
                }
            });
            var searchTerms = LyricsSource.prototype.$SEARCHTERMS(props.query, {
                keepAccents: !0
            });
            /\blyrics\b/i.test(searchTerms) || (searchTerms += " lyrics");
            searchTerms = encodeURIComponent(searchTerms);
            var searchLink = "https://www.google.com/search?q=" + searchTerms;
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".YTL-notFound": {
                    textContent: props.searchTerms
                },
                ".YTL-notFound-search-link": {
                    href: searchLink,
                    textContent: "Try Google (new window)"
                }
            });
            LyricsPanel.render.updateSwitchSourceLink(props);
        };
        LyricsPanel.render.foundLyrics = function(props) {
            var rtlDirPat = /^[^A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF]*[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/, lyrics_unicode_direction = rtlDirPat.test(props.lyrics[0]) ? "rtl" : "ltr";
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-title": {
                    textContent: props.title,
                    title: props.title + "\n\nSource: " + props.sourceIdentifier
                },
                ".L759-fetching": {
                    _post: LyricsPanel.panelHelpers.hide
                },
                ".L759-content": {
                    scrollTop: 0
                },
                ".L759-done, .L759-top-bar": {
                    _post: LyricsPanel.panelHelpers.show
                },
                ".L759-info .L759-song-info": {
                    _post: LyricsPanel.panelHelpers.show
                },
                ".L759-info .L759-song-title": {
                    textContent: props.title,
                    title: props.title
                },
                ".L759-info .L759-link-to-found-source": {
                    href: props.url,
                    textContent: props.sourceIdentifier
                },
                ".L759-done .L759-result": {
                    dir: lyrics_unicode_direction,
                    textContent: ""
                }
            });
            LyricsPanel.render.updateSwitchSourceLink(props);
            var lyricsFragments = document.createDocumentFragment(), lineBase = document.createElement("div");
            lineBase.className = "L759-lyrics-line";
            for (var i = 0; props.lyrics.length > i; i++) {
                var line = lineBase.cloneNode(!1);
                line.textContent = props.lyrics[i];
                lyricsFragments.appendChild(line);
            }
            LyricsPanel.panelElement.querySelector(".L759-done .L759-result").appendChild(lyricsFragments);
        };
        LyricsPanel.render.updateSwitchSourceLink = function(props) {
            SimpleTemplating(LyricsPanel.panelElement).update({
                ".L759-switch-source": {
                    onclick: props.next || props.restart,
                    title: "Click to search for lyrics at a different source.\nCurrent query: " + props.searchTerms
                },
                ".L759-switch-source .L759-sourceindex": {
                    textContent: props.sourceCount && props.sourceIndex + 1
                },
                ".L759-switch-source .L759-sourcecount": {
                    textContent: props.sourceCount
                }
            });
        };
        var _isFixedPanel = !1;
        LyricsPanel.isFixedPanel = function() {
            return _isFixedPanel;
        };
        LyricsPanel.setFixedPanel = function(isFixed) {
            _isFixedPanel = isFixed;
            if (LyricsPanel.panelElement) {
                _isFixedPanel ? LyricsPanel.panelElement.classList.add("L759-unresizable") : LyricsPanel.panelElement.classList.remove("L759-unresizable");
                eventBridge.dispatchEvent("disableIcon", _isFixedPanel);
            }
        };
        var hasRunInit = !1;
        LyricsPanel.reset = function() {
            LyricsPanel.detachPanel();
            LyricsPanel.infoProvider = null;
            _resumeQuery = null;
            LyricsPanel.panelElement = null;
            _isFixedPanel = !1;
            eventBridge.reset();
            hasRunInit = !1;
        };
        LyricsPanel.init = function() {
            if (!hasRunInit) {
                hasRunInit = !0;
                eventBridge.listenEvent("toggle", function() {
                    if (LyricsPanel.panelElement) if (LyricsPanel.isVisible()) {
                        LyricsPanel.detachPanel();
                        eventBridge.dispatchEvent("panel-closed-by-user");
                    } else {
                        LyricsPanel.attachPanel();
                        eventBridge.dispatchEvent("panel-opened-by-user");
                    }
                });
            }
        };
        exports.LyricsPanel = LyricsPanel;
        exports.LyricLineFinder = LyricLineFinder;
    });
    define("callbackLife", [ "require", "exports", "module" ], function(require, exports) {
        function getGeneration(owner) {
            return owner._callbackLifeGeneration || 0;
        }
        function wrapCb(owner, callback) {
            var thisObj = this, generationAtCall = getGeneration(owner);
            return callback && function() {
                getGeneration(owner) === generationAtCall && callback.apply(thisObj, arguments);
            };
        }
        function invalidateCb(owner) {
            owner._callbackLifeGeneration = getGeneration(owner) + 1;
        }
        exports.wrapCb = wrapCb;
        exports.invalidateCb = invalidateCb;
    });
    define("BaseIntegratedLyrics", [ "require", "exports", "module", "LyricsPanel", "eventBridge", "config", "asyncUtils", "callbackLife", "SourceScraperUtils" ], function(require, exports) {
        var LyricsPanel = require("LyricsPanel").LyricsPanel, eventBridge = require("eventBridge"), config = require("config"), asyncUtils = require("asyncUtils"), callbackLife = require("callbackLife"), SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils, _debug = function(method, type, message) {
            console && console.log(method + ": " + message);
        }, _error = function(method, type, error) {
            var e = Error(method + ": " + error);
            e.type = type;
            throw e;
        }, BIL = exports;
        BIL.shouldLoad = function() {
            return !0;
        };
        BIL.LyricsPanel = LyricsPanel;
        BIL.wrapCb = function(callback) {
            return callbackLife.wrapCb(this, callback);
        };
        BIL.getQuery = function() {
            var song = "", artist = "";
            return {
                song: song,
                artist: artist
            };
        };
        BIL.watchNavigationChanges = function() {
            var IL = this;
            asyncUtils.unscheduleTask(IL._poller);
            IL._poller = asyncUtils.schedulePeriodicTask(function() {
                IL.checkContext();
            }, 200);
        };
        BIL.unwatchNavigationChanges = function() {
            var IL = this;
            asyncUtils.unscheduleTask(IL._poller);
        };
        BIL.isQueryChanged = function(lastQuery, query) {
            return query.song || query.artist || query.videotitle ? lastQuery ? lastQuery.song !== query.song || lastQuery.artist !== query.artist || lastQuery.videotitle !== query.videotitle : !0 : !1;
        };
        BIL.checkContext = function() {
            var IL = this, query = IL.getQuery(), lastQuery = IL._lastQuery;
            if (IL.isQueryChanged(lastQuery, query)) {
                IL._lastQuery = query;
                eventBridge.dispatchEvent("lyricsQueryForPopup", {
                    searchProviderIndex: SourceScraperUtils.search.getSearchProviderIndex(),
                    query: query
                });
                IL.LyricsPanel.runQuery(query);
            }
        };
        BIL.putTinyButton = function() {};
        BIL.hasLaunchedPanel = !1;
        BIL.launchPanel = function() {
            var IL = this;
            if (!IL.hasLaunchedPanel) {
                IL.hasLaunchedPanel = !0;
                IL.LyricsPanel.loadOffsets(IL.wrapCb(function() {
                    IL.LyricsPanel.init();
                    IL.launchPanelPlaceholder();
                    IL.checkContext();
                    IL.watchNavigationChanges();
                }));
            }
        };
        BIL.launchPanelPlaceholder = function() {
            var IL = this;
            IL.LyricsPanel.queryCallback({
                type: "message",
                html: !0,
                title: "Lyrics for " + IL.siteFriendlyName,
                message: 'Play a song or use the search box to get lyrics.<br><br>Hit the close button to hide the panel.<br>&raquo; <a href="https://robwu.nl/lyricshere/#config" target="_blank">Preferences</a>'
            });
        };
        BIL.reset = function() {
            var IL = this;
            IL._lastQuery = null;
            IL.hasLaunchedPanel = !1;
            IL.unwatchNavigationChanges();
            IL.LyricsPanel.reset();
            callbackLife.invalidateCb(IL);
        };
        BIL.init = function() {
            var IL = this;
            _debug("BIL:init", "init", "Initializing " + IL.siteFriendlyName + " Lyrics.");
            eventBridge.listenEvent("attached", IL.watchNavigationChanges.bind(IL));
            eventBridge.listenEvent("detached", IL.unwatchNavigationChanges.bind(IL));
            eventBridge.listenEvent("iconinserted", IL.putTinyButton.bind(IL));
            IL.initLaunch();
        };
        BIL.shouldAutoLaunch = function(callback) {
            var IL = this;
            config.getItem(IL.siteIdentifier + "-autolaunch", IL.wrapCb(function(shouldAutoLaunch) {
                function saveAutoLaunchPref(isLaunched) {
                    config.setItem(IL.siteIdentifier + "-autolaunch", isLaunched, function(success) {
                        _debug("BIL:shouldAutoLaunch", "", (success ? "Successfully saved" : "Failed to save") + " autolaunch=" + isLaunched + " pref.");
                    });
                }
                eventBridge.listenEvent("panel-opened-by-user", function() {
                    saveAutoLaunchPref(!0);
                });
                eventBridge.listenEvent("panel-closed-by-user", function() {
                    saveAutoLaunchPref(!1);
                });
                callback(shouldAutoLaunch !== !1);
            }));
        };
        BIL.initLaunch = function() {
            var IL = this;
            IL.shouldAutoLaunch(IL.wrapCb(function(shouldAutoLaunch) {
                eventBridge.dispatchEvent("detached");
                if (shouldAutoLaunch) IL.launchPanel(); else {
                    var hasNotRunOnce = !0;
                    eventBridge.listenEvent("toggle", IL.wrapCb(function() {
                        if (hasNotRunOnce) {
                            IL.launchPanel();
                            hasNotRunOnce = !1;
                        }
                    }));
                    eventBridge.listenEvent("attached", IL.wrapCb(function() {
                        eventBridge.dispatchEvent("panel-opened-by-user");
                    }));
                }
            }));
        };
        exports.extend = function(siteIdentifier, siteFriendlyName, IL) {
            var BIL = this;
            siteIdentifier && siteFriendlyName || _error("BIL:extend", "invalid_args", "Site ID or friendly name not provided!");
            IL || (IL = {});
            IL.siteIdentifier = siteIdentifier;
            IL.siteFriendlyName = siteFriendlyName;
            for (var key in BIL) BIL.hasOwnProperty(key) && !IL.hasOwnProperty(key) && (IL[key] = BIL[key]);
            return IL;
        };
    });
    define("sites/youtube", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils", "eventBridge", "fullscreen", "garbageTracker" ], function(require, exports) {
        function hasVideoAdSoFullscreenTitleMakesNoSense() {
            return !!document.querySelector(".videoAdUi");
        }
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils"), eventBridge = require("eventBridge"), fullscreen = require("fullscreen"), garbageTracker = require("garbageTracker"), _debug = function(method, type, message) {
            console && console.log(method + ": " + message);
        }, artistSongPatterns = {
            Musiek: [ [ 2, /^"(.+)" deur (.+)$/ ] ],
            Musiqi: [ [ 1, /^(.+) t\u0259r\u0259find\u0259n "(.+)"$/ ] ],
            Musik: [ [ 2, /^"(.+)" oleh (.+)$/ ], [ 2, /^"(.+)" med (.+)$/ ], [ 2, /^"(.+)" von (.+)$/ ], [ 2, /^\u201D(.+)\u201D av (.+)$/ ] ],
            Muzik: [ [ 2, /^"(.+)" oleh (.+)$/ ] ],
            "Música": [ [ 2, /^"(.+)", de: (.+)$/ ], [ 2, /^"(.+)", de (.+)$/ ], [ 2, /^"(.+)" de (.+)$/ ], [ 2, /^"(.+)" por (.+)$/ ] ],
            Hudba: [ [ 2, /^(.+) od interpreta (.+)$/ ], [ 2, /^\u201E(.+)\u201C od interpreta (.+)$/ ] ],
            Muusika: [ [ 2, /^\u201E(.+)\u201D esitajalt (.+)$/ ] ],
            Music: [ [ 2, /^"(.+)" by (.+)$/ ] ],
            Musika: [ [ 2, /^"(.+)" - (.+)$/ ], [ 2, /^"(.+)" ni\/ng (.+)$/ ] ],
            Musique: [ [ 2, /^"(.+)" de (.+)$/ ], [ 2, /^\xAB (.+) \xBB par (.+)$/ ] ],
            Glazba: [ [ 2, /^"(.+)" od izvo\u0111a\u010Da (.+)$/ ] ],
            Umculo: [ [ 2, /^" (.+) "ngu-(.+)$/ ] ],
            "Tónlist": [ [ 2, /^\u201E(.+)\u201C me\xF0 (.+)$/ ] ],
            Musica: [ [ 2, /^"(.+)" di (.+)$/ ] ],
            Muziki: [ [ 2, /^" (.+) " ulioimbwa na (.+)$/ ] ],
            "Mūzika": [ [ 2, /^\u201C(.+)\u201D \u2014 izpild\u012Bt\u0101js: (.+)$/ ] ],
            Muzika: [ [ 2, /^\u201E(.+)\u201C \u2013 (.+)$/ ] ],
            Zene: [ [ 2, /^\u201E(.+)\u201D, el\u0151ad\xF3: (.+)$/ ] ],
            Muziek: [ [ 2, /^'(.+)' van (.+)$/ ] ],
            Musikk: [ [ 2, /^\xAB(.+)\xBB av (.+)$/ ], [ 2, /^(.+) av (.+)$/ ] ],
            Musiqa: [ [ 1, /^(.+) \u2013 \u201C(.+)\u201D$/ ] ],
            Muzyka: [ [ 2, /^\u201E(.+)\u201D, wykonawca: (.+)$/ ] ],
            "Muzică": [ [ 2, /^\u201E(.+)\u201D de la (.+)$/ ] ],
            "Muzikë": [ [ 2, /^"(.+)" nga (.+)$/ ] ],
            Glasba: [ [ 2, /^\xBB(.+)\xAB izvajalca (.+)$/ ] ],
            Musiikki: [ [ 2, /^(.+), (.+)$/ ] ],
            "Âm nhạc": [ [ 2, /^"(.+)" c\u1EE7a (.+)$/ ] ],
            "Müzik": [ [ 2, /^"(.+)" - (.+)$/ ] ],
            "Музика": [ [ 2, /^\u201E(.+)\u201C \u043E\u0442 (.+)$/ ], [ 2, /^\u201E(.+)\u201C \u043E\u0434 (.+)$/ ], [ 2, /^\u201E(.+)\u201C, \u0438\u0437\u0432\u043E\u0434\u0438 (.+)$/ ], [ 2, /^"(.+)", (.+)$/ ] ],
            "Музыка": [ [ 1, /^(.+) \u0430\u0442\u043A\u0430\u0440\u0443\u0443\u0441\u0443\u043D\u0434\u0430 "(.+)"$/ ], [ 2, /^"(.+)" \u043E\u0440\u044B\u043D\u0434\u0430\u0493\u0430\u043D: (.+)$/ ], [ 1, /^(.+) \u043E\u0440\u044B\u043D\u0434\u0430\u0493\u0430\u043D "(.+)"$/ ], [ 2, /^"(.+)", \u0438\u0441\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C: (.+)$/ ] ],
            "Хөгжим": [ [ 1, /^(.+)-\u043D "(.+)"$/ ] ],
            "Μουσική": [ [ 2, /^"(.+)" \u03B1\u03C0\u03CC (.+)$/ ] ],
            "Երաժշտություն": [ [ 2, /^\xAB(.+)\xBB (.+)-\u056B \u056F\u0561\u057F\u0561\u0580\u0574\u0561\u0574\u0562$/ ] ],
            "מוזיקה": [ [ 2, /^'(.+)' \u05DE\u05D0\u05EA (.+)$/ ] ],
            "موسیقی": [ [ 2, /^"(.+)" \u0628\u0630\u0631\u06CC\u0639\u06C1 (.+)$/ ], [ 2, /^\xAB(.+)\xBB \u062A\u0648\u0633\u0637 (.+)$/ ] ],
            "موسيقى": [ [ 2, /^"(.+)" \u0628\u0648\u0627\u0633\u0637\u0629 (.+)$/ ] ],
            "संगीत": [ [ 1, /^(.+) \u0926\u094D\u0935\u093E\u0930\u093E "(.+)"$/ ], [ 1, /^(.+) \u091A\u093E "(.+)"$/ ], [ 1, /^(.+) \u0915\u0947 \u0926\u094D\u0935\u093E\u0930\u093E "(.+)"$/ ] ],
            "সংগীত": [ [ 1, /^(.+) \u098F\u09B0 "(.+)"$/ ] ],
            "ਸੰਗੀਤ": [ [ 1, /^(.+) \u0A26\u0A41\u0A06\u0A30\u0A3E "(.+)"$/ ], [ 1, /^(.+) \u0A26\u0A41\u0A06\u0A30\u0A3E "(.+)"$/ ] ],
            "સંગીત": [ [ 1, /^(.+) \u0AA6\u0ACD\u0AB5\u0ABE\u0AB0\u0ABE "(.+)"$/ ] ],
            "இசை": [ [ 2, /^"(.+)" \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BBF\u0BAF\u0BB5\u0BB0\u0BCD (.+)$/ ] ],
            "సంగీతం": [ [ 1, /^(.+) \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E "(.+)"$/ ] ],
            "ಸಂಗೀತ": [ [ 1, /^(.+) \u0C85\u0CB5\u0CB0 "(.+)"$/ ] ],
            "സംഗീതം": [ [ 2, /^"(.+)", (.+) \u0D2E\u0D41\u0D16\u0D47\u0D28$/ ] ],
            "සංගීත": [ [ 1, /^(.+) \u0DC0\u0DD2\u0DC3\u0DD2\u0DB1\u0DCA "(.+)"$/ ] ],
            "เพลง": [ [ 2, /^"(.+)" \u0E42\u0E14\u0E22 (.+)$/ ] ],
            "ດົນຕີ": [ [ 2, /^"(.+)" \u200B\u0EC2\u0E94\u0E8D (.+)$/ ] ],
            "တေးဂီတ": [ [ 2, /^"(.+)" \u1021\u102C\u1038\u1016\u103C\u1004\u1037\u103A (.+)$/ ] ],
            "მუსიკა": [ [ 2, /^\u201E(.+)\u201C (.+)-\u10D8\u10E1 \u10DB\u10D8\u10D4\u10E0$/ ] ],
            "ሙዚቃ": [ [ 2, /^\xAB(.+)\xBB \u1260(.+)$/ ] ],
            "តន្ត្រី": [ [ 2, /^"(.+)" \u178A\u17C4\u1799 (.+)$/ ] ],
            "音乐": [ [ 2, /^(.+) - \u6765\u81EA(.+)$/ ] ],
            "音樂": [ [ 2, /^\u300C(.+)\u300D\uFF0C\u6F14\u51FA\u8005\uFF1A(.+)$/ ] ],
            "音楽": [ [ 1, /^(.+) \u306E\u300C(.+)\u300D$/ ] ],
            "음악": [ [ 1, /^(.+)\uC758 '(.+)'$/ ] ]
        };
        BIL.extend("youtube", "YouTube", exports);
        exports.shouldLoad = function() {
            return !!document.title;
        };
        exports.getQuery = function() {
            var tmp, song = "", artist = "", videotitle = "";
            if (fullscreen.isFullscreen()) {
                tmp = document.querySelector(".ytp-title-link");
                if (tmp) {
                    hasVideoAdSoFullscreenTitleMakesNoSense() || (videotitle = tmp.textContent);
                    return {
                        videotitle: videotitle
                    };
                }
            }
            var pageType = /^\/(watch|channel)\b/.exec(location.pathname);
            pageType = pageType && pageType[1];
            if ("channel" === pageType) {
                tmp = document.querySelector(".video-detail h3 > a, #metadata-container #title > a");
                tmp && (videotitle = tmp.textContent.trim());
            }
            if ("watch" === pageType) {
                tmp = document.querySelector('#content meta[itemprop="name"]');
                tmp ? videotitle = tmp.getAttribute("content") : (tmp = document.querySelector("#main h1")) && (videotitle = tmp.textContent.trim());
                if (!videotitle) {
                    tmp = document.title;
                    tmp = tmp.replace(/^\u25b6/, "");
                    tmp = tmp.replace(/\-\s*YouTube\s*$/, "").trim();
                    videotitle = tmp;
                }
                var metaItems = document.querySelectorAll("h4.title + ul > li, h4 + div > .content");
                metaItemsLoop: for (var i = 0; metaItems.length > i; ++i) {
                    tmp = metaItems[i];
                    var musicLabel = tmp.parentNode.previousElementSibling.textContent.trim();
                    if (artistSongPatterns.hasOwnProperty(musicLabel)) {
                        tmp = tmp.cloneNode(!0);
                        var ytRedAdLink = tmp.querySelector('a[href$="youtube.com/red"],a[href*="youtube.com/red?"],a[href*="youtube.com/red#"],a[href^="/red"]');
                        ytRedAdLink && ytRedAdLink.parentNode.removeChild(ytRedAdLink);
                        tmp = tmp.textContent.replace(/\((Google Play|\u2022|iTunes| )+\)$/, "").replace(/\xA0/g, " ").trim();
                        for (var hardcodedPatterns = artistSongPatterns[musicLabel], j = 0; hardcodedPatterns.length > j; ++j) {
                            tmp = hardcodedPatterns[j][1].exec(tmp);
                            if (tmp) {
                                if (1 === hardcodedPatterns[j][0]) {
                                    artist = tmp[1];
                                    song = tmp[2];
                                } else {
                                    artist = tmp[2];
                                    song = tmp[1];
                                }
                                break metaItemsLoop;
                            }
                        }
                    }
                }
            }
            return {
                song: song,
                artist: artist,
                videotitle: videotitle
            };
        };
        exports.checkFullscreenState = function() {
            var YTL = exports;
            asyncUtils.unscheduleTask(YTL._fullscreenPoller);
            fullscreen.isFullscreen() && (YTL._fullscreenPoller = asyncUtils.schedulePeriodicTask(YTL.checkContext, 200));
        };
        exports.visibilityChange = function() {
            var YTL = exports;
            asyncUtils.unscheduleTask(YTL._lowPrioVisibilityPoller);
            document.hidden && (YTL._lowPrioVisibilityPoller = asyncUtils.schedulePeriodicTask(YTL.checkContext, 200));
        };
        exports.watchNavigationChanges = function() {
            var YTL = this;
            document.addEventListener("spfdone", YTL.checkContext, !0);
            document.body.addEventListener("yt-page-data-updated", YTL.checkContext, !0);
            document.addEventListener("visibilitychange", YTL.checkContext, !0);
            window.addEventListener("focus", YTL.checkContext, !0);
            fullscreen.addListener(YTL.checkFullscreenState);
            YTL.checkFullscreenState();
            document.addEventListener("visibilitychange", YTL.visibilityChange, !0);
            YTL.visibilityChange();
        };
        exports.unwatchNavigationChanges = function() {
            var YTL = this;
            document.removeEventListener("spfdone", YTL.checkContext, !0);
            document.body.removeEventListener("yt-page-data-updated", YTL.checkContext, !0);
            document.removeEventListener("visibilitychange", YTL.checkContext, !0);
            window.removeEventListener("focus", YTL.checkContext, !0);
            fullscreen.removeListener(YTL.checkFullscreenState);
            asyncUtils.unscheduleTask(YTL._fullscreenPoller);
            document.removeEventListener("visibilitychange", YTL.visibilityChange, !0);
            asyncUtils.unscheduleTask(YTL._lowPrioVisibilityPoller);
        };
        exports.isQueryChanged = function(lastQuery, query) {
            var YTL = exports;
            if (fullscreen.isFullscreen()) {
                if (hasVideoAdSoFullscreenTitleMakesNoSense()) return !1;
            } else if (!asyncUtils.isActiveInHiddenTab() && document.hidden === !0) return !1;
            if (!query.videotitle) {
                if (YTL._didInitLaunch) {
                    YTL.reset();
                    YTL.init();
                }
                eventBridge.dispatchEvent("disableIcon", !0);
                return !1;
            }
            eventBridge.dispatchEvent("disableIcon", !1);
            if (YTL._wasClosedByUser) {
                eventBridge.dispatchEvent("detached");
                return !1;
            }
            if (!YTL._didInitLaunch) {
                YTL._didInitLaunch = !0;
                YTL.initLaunch();
                return !1;
            }
            return YTL._waitingForFirstQuery ? !1 : lastQuery ? lastQuery.videotitle !== query.videotitle : !0;
        };
        exports.checkContext = function() {
            var YTL = exports;
            BIL.checkContext.call(YTL);
            var tinyIcon = document.querySelector(".LyricsHereByRobWPageActionIcon");
            tinyIcon && YTL.putTinyButton(tinyIcon);
        };
        exports.shouldAutoLaunch = function(callback) {
            var YTL = this;
            BIL.shouldAutoLaunch.call(YTL, function(shouldAutoLaunch) {
                if (shouldAutoLaunch) {
                    fullscreen.isFullscreen() && callback(!0);
                    for (var watchInfoLinks = document.querySelectorAll('.watch-info-tag-list a[href^="/"], .watch-info-tag-list a[href*="www.youtube.com/"]'), maybeIsMusicVideo = 0 === watchInfoLinks.length, i = 0; watchInfoLinks.length > i; ++i) {
                        var watchInfoLinkUrl = watchInfoLinks[i].href;
                        if (/^https?:\/\/www\.youtube\.com\/(music|channel\/UC-9-kyTW8ZkZNDHQJ6FgpwQ)/.test(watchInfoLinkUrl)) {
                            maybeIsMusicVideo = !0;
                            break;
                        }
                        if (/^https?:\/\/www\.youtube\.com\/(entertainment|channel\/UCi-g4cjqGV7jvU8aeSuj0jQ)/.test(watchInfoLinkUrl)) {
                            var videotitle = YTL.getQuery().videotitle || "";
                            /making of|behind the scenes|prank|fail/i.test(videotitle);
                            /music|song|cover|lyrics/i.test(videotitle) ? maybeIsMusicVideo = !0 : /\s-\s/.test(videotitle.replace(/\([^)]+\)|\[[^\]]+\]/g, "")) && (maybeIsMusicVideo = !/trailer|movie|season|/i.test(videotitle));
                            break;
                        }
                    }
                    callback(maybeIsMusicVideo);
                } else callback(!1);
            });
        };
        var pageActionWrapper = document.createElement("span");
        pageActionWrapper.style.cssText = "position:relative;float:right;top:0;right:0;";
        exports.putTinyButton = function(tinyIcon) {
            if (fullscreen.isFullscreen()) {
                var playerToolbar = fullscreen.getBody().querySelector(".ytp-chrome-controls");
                if (playerToolbar) {
                    playerToolbar.contains(tinyIcon) || playerToolbar.appendChild(tinyIcon);
                    return;
                }
            }
            var titleContainer = document.querySelector("#container.ytd-video-primary-info-renderer,#watch7-content");
            if (titleContainer && !titleContainer.contains(tinyIcon)) {
                garbageTracker.willAddToDOM(pageActionWrapper, "inline");
                titleContainer.insertBefore(pageActionWrapper, titleContainer.firstChild);
                pageActionWrapper.appendChild(tinyIcon);
            }
        };
        exports.launchPanelPlaceholder = function() {
            var YTL = exports;
            YTL._waitingForFirstQuery = !1;
        };
        exports.reset = function() {
            var YTL = exports;
            YTL._didInitLaunch = !1;
            BIL.reset.call(YTL);
        };
        exports.init = function() {
            var YTL = this;
            _debug("YTL:init", "init", "Initializing YouTube Lyrics.");
            YTL._waitingForFirstQuery = !0;
            eventBridge.listenEvent("attached", function() {
                YTL._wasClosedByUser = !1;
            });
            eventBridge.listenEvent("panel-closed-by-user", function() {
                YTL._wasClosedByUser = !0;
            });
            eventBridge.listenEvent("toggle", function() {
                if (YTL._wasClosedByUser && !YTL._didInitLaunch) {
                    YTL._wasClosedByUser = !1;
                    YTL._didInitLaunch = !0;
                    YTL.launchPanel();
                }
            });
            eventBridge.listenEvent("iconinserted", YTL.putTinyButton.bind(YTL));
            YTL.watchNavigationChanges();
            YTL.checkContext();
        };
    });
    define("sites/spotify", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        function isOpenSpotify() {
            return "open.spotify.com" === location.hostname;
        }
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("spotify", "Spotify", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = "", artist = "";
            if (isOpenSpotify()) {
                var nowPlayingBar = document.querySelector(".now-playing-bar");
                if (nowPlayingBar) {
                    var songAndArtist = nowPlayingBar.querySelectorAll(".react-contextmenu-wrapper > a");
                    songAndArtist = 2 > songAndArtist.length ? nowPlayingBar.querySelectorAll(".react-contextmenu-wrapper") : [ songAndArtist[0].parentNode, songAndArtist[1].parentNode ];
                    if (songAndArtist.length >= 2) {
                        song = songAndArtist[0].textContent.trim();
                        artist = songAndArtist[1].textContent.trim();
                    }
                }
                if (!song || !artist) {
                    nowPlayingBar = document.querySelector(".tracklist-row.playing");
                    if (!nowPlayingBar) {
                        nowPlayingBar = document.querySelector(".tracklist-row .icon-pause");
                        for (;nowPlayingBar && !nowPlayingBar.classList.contains("tracklist-row"); ) nowPlayingBar = nowPlayingBar.parentElement;
                    }
                    if (nowPlayingBar) {
                        song = nowPlayingBar.querySelector(".track-name");
                        artist = document.querySelector('.entity-name a[href^="/artist"]') || document.querySelector('a[href^="/artist"]');
                        song = song ? song.textContent.trim() : "";
                        artist = artist ? artist.textContent.trim() : "";
                    }
                }
            } else {
                var title = document.title.replace(/\s*-?\s*Spotify\s*$/i, "").replace(/^[\u25b6\s]+/, ""), split = title.replace(/\([^)]*\)|\[[^\]]*\]/g, " ");
                -1 == split.indexOf(" - ") && (split = title);
                split = split.split(" - ");
                if (2 == split.length) {
                    song = split[0];
                    artist = split[1];
                } else if (split.length > 2) return {
                    videotitle: title
                };
            }
            return {
                song: song,
                artist: artist
            };
        };
        exports.isQueryChanged = function(lastQuery, query) {
            return "Spotify" === query.song && "Spotify" === query.artist ? !1 : BIL.isQueryChanged(lastQuery, query);
        };
        var detectReadyPoller;
        exports.shouldAutoLaunch = function(callback) {
            function isSpotifyReady() {
                return !!document.querySelector("#nav-profile, .tracklist-row");
            }
            var SPL = this;
            BIL.shouldAutoLaunch.call(SPL, function(shouldAutoLaunch) {
                if (shouldAutoLaunch) if (isSpotifyReady()) callback(!0); else {
                    callback(!1);
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                        isSpotifyReady() && SPL.launchPanel();
                        SPL.hasLaunchedPanel && asyncUtils.unscheduleTask(detectReadyPoller);
                    }, 200);
                } else callback(!1);
            });
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("SpotifyPageAction");
        };
    });
    define("sites/jango", [ "require", "exports", "module", "BaseIntegratedLyrics", "eventBridge" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), eventBridge = require("eventBridge");
        BIL.extend("jango", "Jango", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        var getTextContent = function(elem) {
            return elem && elem.textContent.replace(/\([^)]*\)|\[[^\]]*\]/g, " ").trim() || "";
        };
        exports.getQuery = function() {
            var song = getTextContent(document.getElementById("current-song")), artist = getTextContent(document.querySelector("#player_current_artist a"));
            return {
                song: song,
                artist: artist
            };
        };
        exports.init = function() {
            var JAL = this;
            eventBridge.listenEvent("attached", function() {
                var panelElement = JAL.LyricsPanel.panelElement;
                document.documentElement.appendChild(panelElement);
            });
            BIL.init.call(JAL);
        };
    });
    define("sites/accuradio", [ "require", "exports", "module", "BaseIntegratedLyrics" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics");
        BIL.extend("accuradio", "AccuRadio", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        var isAccu2013 = /^https?:\/\/www\.accuradio\.com\/(?!pop_player)/.test(location.href);
        exports.getQuery = function() {
            var song, artist;
            if (isAccu2013) {
                song = document.getElementById("songtitle");
                artist = document.getElementById("songartist");
            } else {
                song = document.getElementById("span_information_title");
                artist = document.getElementById("span_information_artist");
            }
            song = song ? song.textContent.trim() : "";
            artist = artist ? artist.textContent.trim() : "";
            (/^Loading .*\.\.\.$/.test(song) || 0 === artist.lastIndexOf("(Not working", 0)) && (artist = song = "");
            return {
                song: song,
                artist: artist
            };
        };
    });
    define("sites/deezer", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("deezer", "Deezer", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = document.querySelector(".player-track-title > .player-track-link"), artist = document.querySelector('.player-track-link[href*="artist/"]');
            song = song ? song.textContent : "";
            artist = artist ? artist.textContent : "";
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            var container = document.querySelector(".sidebar-container .player-cover");
            container && container.appendChild(tinyIcon);
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (document.querySelector(".control-play,.control-pause")) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/8tracks", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("8tracks", "8tracks", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = document.querySelector("#now_playing .title_artist .t");
            song = song ? song.textContent : "";
            var artist = document.querySelector("#now_playing .title_artist .a");
            artist = artist ? artist.textContent : "";
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            var playerBox = document.getElementById("player_box");
            playerBox && "none" !== playerBox.style.display ? playerBox.appendChild(tinyIcon) : tinyIcon.classList.add("EightTracksPageAction");
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (document.querySelector("#now_playing .title_artist .t")) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/google-music", [ "require", "exports", "module", "BaseIntegratedLyrics" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics");
        BIL.extend("google-music", "Google Music", exports);
        exports.shouldLoad = function() {
            return window.top === window && document.getElementById("player");
        };
        exports.getQuery = function() {
            var song = document.getElementById("currently-playing-title");
            song = song ? song.textContent : "";
            var artist = document.getElementById("player-artist");
            artist = artist ? artist.textContent : "";
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            var footerItem = document.getElementById("material-player-right-wrapper");
            footerItem && tinyIcon.previousSibling !== footerItem && footerItem.parentNode.insertBefore(tinyIcon, footerItem.nextSibling);
        };
    });
    define("sites/iheart", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("iheart", "iHeartRadio", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = document.querySelector(".player-song-text");
            song = song ? song.textContent : "";
            var artist = document.querySelector(".player-artist");
            artist = artist ? artist.textContent : "";
            if (!song || !artist) {
                var title = /^\u266b (.+) - (.+)$/.exec(document.title);
                if (title) {
                    song = title[1];
                    artist = title[2];
                }
            }
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            var container = document.querySelector(".player-right");
            container && container.insertBefore(tinyIcon, container.firstChild);
        };
        exports.launchPanel = function() {
            var IHL = this;
            if (!IHL.hasLaunchedPanel) {
                var bottomElement = document.querySelector("#player > .player");
                bottomElement && (IHL.LyricsPanel.panelHelpers.dimensions.getViewportDimensions = function() {
                    var rect = bottomElement.getBoundingClientRect();
                    return {
                        width: rect.right,
                        height: rect.top
                    };
                });
                BIL.launchPanel.call(IHL);
            }
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (document.querySelector(".player-info")) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/superplayer", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("superplayer", "Superplayer.fm", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = document.querySelector('.main.info span[data-value="name"]');
            song = song ? song.textContent : "";
            var artist = document.querySelector('.main.info strong[data-value="artist"]');
            artist = artist ? artist.textContent : "";
            if (!song || !artist) {
                var title = /^(.+) por (.+)\. Superplayer/.exec(document.title);
                if (title) {
                    song = title[1];
                    artist = title[2];
                }
            }
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("SuperplayerPageAction");
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (document.querySelector(".main.info")) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/last.fm", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("last.fm", "Last.fm", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        var getTextContent = function(elem) {
            return elem && elem.textContent.replace(/\([^)]*\)|\[[^\]]*\]/g, " ").trim() || "";
        }, isMusicPage = function() {
            return 0 === location.pathname.lastIndexOf("/music", 0);
        };
        exports.getQuery = function() {
            var artist = getTextContent(document.querySelector(".player-bar-artist-name")), song = getTextContent(document.querySelector(".player-bar-track-name"));
            if (!artist && !song && isMusicPage() && !song) {
                var title = /^(.+) — (.+) [^a-z0-9\s] .*Last\.fm/.exec(document.title);
                if (title) {
                    artist = title[1];
                    song = title[2];
                }
            }
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("LFMPageAction");
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (isMusicPage() || document.querySelector(".player-bar-now-playing")) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/yandex-music", [ "require", "exports", "module", "BaseIntegratedLyrics" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics");
        BIL.extend("yandex-music", "Yandex Music", exports);
        exports.shouldLoad = function() {
            return window.top === window && document.querySelector(".player-controls");
        };
        exports.getQuery = function() {
            var song = document.querySelector(".player-controls .track__title");
            song = song ? song.textContent : "";
            var artist = document.querySelector(".player-controls .track__artists a");
            artist = artist || document.querySelector(".player-controls .track__artists");
            artist = artist ? artist.textContent : "";
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            var playerControlContainer = document.querySelector(".player-controls__track-container");
            playerControlContainer && tinyIcon.previousSibling !== playerControlContainer && playerControlContainer.parentNode.insertBefore(tinyIcon, playerControlContainer.nextSibling);
        };
    });
    define("sites/qobuz", [ "require", "exports", "module", "BaseIntegratedLyrics" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics");
        BIL.extend("qobuz", "Qobuz", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = document.querySelector("#bottomPlayerContainer .current-track");
            song = song ? song.textContent : "";
            var artist = document.querySelector("#bottomPlayerContainer .link-artist");
            artist = artist ? artist.textContent : "";
            if ("Interprètes Divers" === artist) {
                artist = document.querySelector('.header-album a[href^="/artist/"]');
                artist = artist ? artist.textContent : "";
            }
            if (!artist && !song) {
                song = document.querySelector("#now-playing .track a");
                song = song ? song.textContent : "";
                artist = document.querySelector("#now-playing .artist a");
                artist = artist ? artist.textContent : "";
            }
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("QobuzPageAction");
        };
    });
    define("sites/soundcloud", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("soundcloud", "SoundCloud", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        var titleSelector = ".playbackSoundBadge__titleContextContainer .sc-visuallyhidden";
        exports.getQuery = function() {
            var videotitle = document.querySelector(titleSelector);
            videotitle = /^Current track: (.+)/.exec(videotitle && videotitle.textContent);
            videotitle = videotitle ? videotitle[1] : "";
            return {
                videotitle: videotitle
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("SoundCloudPageAction");
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (document.querySelector(titleSelector)) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/saavn", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("saavn", "Saavn", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = document.getElementById("player-track-name");
            song = song ? song.textContent : "";
            var artist = document.getElementById("player-album-name");
            artist = artist ? artist.textContent : "";
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("SaavnPageAction");
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (document.getElementById("player")) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/pandora", [ "require", "exports", "module", "BaseIntegratedLyrics", "asyncUtils" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics"), asyncUtils = require("asyncUtils");
        BIL.extend("pandora", "Pandora", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        exports.getQuery = function() {
            var song = document.querySelector(".playerBarSong,.nowPlayingTopInfo__current__trackName");
            song = song ? song.textContent : "";
            var artist = document.querySelector(".playerBarArtist,.nowPlayingTopInfo__current__artistName");
            artist = artist ? artist.textContent : "";
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("PandoraPageAction");
            var headerRightBar = document.getElementById("playbackControl");
            headerRightBar && tinyIcon.parentNode !== headerRightBar && headerRightBar.appendChild(tinyIcon);
        };
        var detectReadyPoller;
        exports.init = function() {
            asyncUtils.unscheduleTask(detectReadyPoller);
            detectReadyPoller = asyncUtils.schedulePeriodicTask(function() {
                if (document.querySelector("#playerBar,.nowPlayingTopInfo")) {
                    asyncUtils.unscheduleTask(detectReadyPoller);
                    BIL.init.call(exports);
                }
            }, 200);
        };
    });
    define("sites/bandcamp", [ "require", "exports", "module", "BaseIntegratedLyrics" ], function(require, exports) {
        var BIL = require("BaseIntegratedLyrics");
        BIL.extend("bandcamp", "Bandcamp", exports);
        exports.shouldLoad = function() {
            return window.top === window;
        };
        var getTextContent = function(selector) {
            var elem = document.querySelector(selector);
            return elem ? elem.textContent.replace(/\([^)]*\)|\[[^\]]*\]/g, " ").replace(/^\d+\./, "").trim() : "";
        };
        exports.getQuery = function() {
            var artist = getTextContent('span[itemprop="byArtist"] > a') || getTextContent("p.detail-artist > a"), song = getTextContent(".track_info span.title");
            return {
                song: song,
                artist: artist
            };
        };
        exports.putTinyButton = function(tinyIcon) {
            tinyIcon.classList.add("BandcampPageAction");
        };
    });
    define("musicSites", [ "require", "exports", "module" ], function(require, exports) {
        function loadIntegratedLyrics(identifier) {
            require([ "sites/" + identifier ], function(integratedLyrics) {
                integratedLyrics.shouldLoad() && integratedLyrics.init();
            });
        }
        function getIdentifier(url) {
            for (var i = 0; site_info.length > i; ++i) {
                var info = site_info[i], identifier = info[0], pattern = info[1];
                if (pattern.test(url)) return identifier;
            }
            return "";
        }
        var site_info = [ [ "youtube", /^https?:\/\/www\.youtube\.com\/(?![ve]\/)(?!embed\/)(?!dev(\/|$))/ ], [ "spotify", /^https?:\/\/(?:play(?:er)?|open)\.spotify\.com\// ], [ "jango", /^https?:\/\/[a-z.]+\.jango\.com\// ], [ "accuradio", /^https?:\/\/(www|2012)\.accuradio\.com\// ], [ "deezer", /^https?:\/\/(www|orange)\.deezer\.com\// ], [ "8tracks", /^https?:\/\/8tracks\.com\// ], [ "google-music", /^https?:\/\/(play\.google\.com\/music\/|music\.google\.com\/)/ ], [ "iheart", /^https?:\/\/www\.iheart\.com\// ], [ "superplayer", /^https?:\/\/www\.superplayer\.fm\// ], [ "last.fm", /^https?:\/\/(www|cn)\.last\.fm\// ], [ "yandex-music", /^https?:\/\/music\.yandex\.(ru|by|kz|ua)\// ], [ "qobuz", /^https?:\/\/play(er)?\.qobuz\.com\// ], [ "soundcloud", /^https?:\/\/soundcloud\.com\// ], [ "saavn", /^https?:\/\/www\.saavn\.com\// ], [ "pandora", /^https?:\/\/www\.pandora\.com\// ], [ "bandcamp", /^https?:\/\/([a-z0-9\-]+\.)?bandcamp\.com\// ] ], identifiers = site_info.map(function(info) {
            return info[0];
        });
        exports.loadIntegratedLyrics = loadIntegratedLyrics;
        exports.identifiers = identifiers;
        exports.getIdentifier = getIdentifier;
    });
    define("setwmode", [], function() {
        return function() {
            return;
        };
    });
    define("domready", [], function() {
        function ready() {
            clearInterval(poller);
            for (var fn; fn = stack.shift(); ) fn();
        }
        function waiting() {
            poller = setInterval(function() {
                "complete" === document.readyState && ready();
            }, 50);
            document.addEventListener("DOMContentLoaded", ready, !0);
        }
        var poller, stack = [];
        return function(fn) {
            if (fn) if ("complete" === document.readyState) fn(); else {
                void 0 === poller && waiting();
                stack.push(fn);
            }
        };
    });
    define("LyricsPanel-popup", [ "require", "exports", "module", "LyricsPanel", "SourceScraperUtils", "garbageTracker" ], function(require, exports) {
        function savePopupOffsets() {
            menubar.visible || chrome.storage.local.set({
                popupOffsets: {
                    width: window.outerWidth,
                    height: window.outerHeight,
                    left: window.screenX,
                    top: window.screenY
                }
            });
        }
        function init() {
            document.documentElement.setAttribute("LyricsHerePopoutActivated", "");
            LyricsPanel.init();
            LyricsPanel.setFixedPanel(!0);
            LyricsPanel.queryCallback({
                type: "message",
                html: !0,
                message: message
            });
            var lastQuery, tabOnly, port, _button, reconnectAttempts = 0, connectPort = function() {
                port = chrome.runtime.connect({
                    name: "popout-channel"
                });
                port.onMessage.addListener(function(msg) {
                    reconnectAttempts = 0;
                    if (msg.lyricsQuery) {
                        if (tabOnly && msg.tabId !== tabOnly) return;
                        hideMessageOnTop();
                        processLyricsQuery(msg.lyricsQuery);
                        showGoToTabButton(msg.tabId);
                    } else if ("onNoTab" !== msg) if ("cannotConnectToTab" !== msg.type) ; else {
                        showGoToTabButton(msg.tabId);
                        showMessageOnTop("Cannot connect to the original tab. Go to the tab and (re)load a music site to see lyrics here.\nMake sure that the lyrics panel is visible (click on the Lyrics Here button in the page or the tab's toolbar).");
                    } else showGoToTabButton(null);
                });
                port.onDisconnect.addListener(function() {
                    if (!isValidChromeRuntime() || reconnectAttempts++ > 100) {
                        document.body.innerHTML = 'Lyrics Here was updated or uninstalled.<br>Please <button id="reload-button">reload</button> this window to see lyrics again.';
                        document.getElementById("reload-button").onclick = function() {
                            location.reload();
                        };
                    } else connectPort();
                });
            }, processLyricsQuery = function(lyricsQuery) {
                var serialized = JSON.stringify(lyricsQuery.query);
                if (serialized !== lastQuery) {
                    lastQuery = serialized;
                    try {
                        sessionStorage.lyricsHerePopoutLastQuery = JSON.stringify(lyricsQuery);
                    } catch (e) {}
                    lyricsQuery.searchProviderIndex >= 0 && SourceScraperUtils.search.setSearchProviderIndex(lyricsQuery.searchProviderIndex);
                    LyricsPanel.runQuery(lyricsQuery.query);
                }
            }, showGoToTabButton = function(tabId) {
                function onNoTab() {
                    _button.title = tabOnly ? buttonTitlePrefix + "\nThe tab was closed, this window is not automatically updated any more" : buttonTitlePrefix + "\nThe tab was closed, play another song to see lyrics.";
                    showMessageOnTop(_button.title);
                }
                if (!_button) {
                    _button = document.createElement("button");
                    _button.tabIndex = 1;
                    _button.textContent = "T";
                    _button.style.position = "fixed";
                    _button.style.right = "1px";
                    _button.style.top = "1px";
                    _button.style.width = "25px";
                    _button.style.height = "25px";
                    _button.style.boxSizing = "border-box";
                    _button.style.borderStyle = "solid";
                    _button.style.borderWidth = "1px";
                    _button.style.textAlign = "center";
                    _button.style.zIndex = "2000000007";
                    document.querySelector(".L759-title").style.paddingRight = "27px";
                    LyricsPanel.panelElement.appendChild(_button);
                }
                var buttonTitlePrefix = "";
                if (tabOnly) {
                    buttonTitlePrefix = "This window is listening for songs from a single tab.";
                    _button.title = buttonTitlePrefix + "\nClick here to activate that tab.";
                } else {
                    buttonTitlePrefix = "This window is listening for songs from any tab.";
                    _button.title = buttonTitlePrefix + "\nClick here to active the last tab whose lyrics were displayed here.";
                }
                _button.onclick = function() {
                    port.postMessage({
                        type: "bringWindowAndTabToFront",
                        tabId: tabId
                    });
                };
                if (!tabId || -1 === tabId) {
                    _button.onclick = null;
                    onNoTab();
                }
            }, showMessageOnTop = function(message) {
                hideMessageOnTop();
                var d = document.createElement("div");
                d.style.zIndex = "2000000007";
                d.textContent = message + "\n\n(click to dismiss this message)";
                d.style.position = "fixed";
                d.style.top = "3em";
                d.style.left = d.style.right = "4px";
                d.style.whiteSpace = "pre-wrap";
                d.style.textAlign = "center";
                d.style.padding = "1em";
                d.style.backgroundColor = "white";
                d.style.border = "2px solid #EEE";
                d.style.boxShadow = "1px 1px 10px #000";
                d.onclick = function() {
                    d.remove();
                };
                d.className = "message-on-top";
                garbageTracker.willAddToDOM(d, "block");
                document.body.appendChild(d);
            }, hideMessageOnTop = function() {
                for (var msgs = document.querySelectorAll(".message-on-top"), i = 0; msgs.length > i; ++i) msgs[i].parentNode.removeChild(msgs[i]);
            };
            connectPort();
            window.addEventListener("focus", savePopupOffsets);
            window.addEventListener("blur", savePopupOffsets);
            document.documentElement.addEventListener("mouseenter", savePopupOffsets);
            document.documentElement.addEventListener("mouseleave", savePopupOffsets);
            (function() {
                try {
                    var lyricsQuery = sessionStorage.lyricsHerePopoutLastQuery;
                    lyricsQuery = lyricsQuery && JSON.parse(lyricsQuery);
                    lyricsQuery && processLyricsQuery(lyricsQuery);
                } catch (e) {}
            })();
            var tabId = /[?&]openerTab=(\d+)/.exec(location.search);
            tabId = tabId ? parseInt(tabId[1], 10) : -1;
            if (tabId >= 0) {
                if (/[&?]tabOnly($|&)/.test(location.search)) {
                    tabOnly = tabId;
                    showGoToTabButton(tabId);
                    document.title = "Lyrics Here (one tab)";
                } else document.title = "Lyrics Here (all tabs)";
                port.postMessage({
                    type: "getLyricsForPopup",
                    tabId: tabId
                });
            }
        }
        var LyricsPanel = require("LyricsPanel").LyricsPanel, SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils, garbageTracker = require("garbageTracker"), message = 'To see lyrics, play a song at any of the <a href="https://robwu.nl/lyricshere/#config-sites">supported music sites</a>, or use the search box below.';
        exports.init = init;
    });
    define("LyricsPanel-demo", [ "require", "exports", "module", "LyricsPanel" ], function(require, exports) {
        function init() {
            LyricsPanel.init();
            LyricsPanel.infoProvider = null;
            LyricsPanel.queryCallback({
                type: "message",
                html: !0,
                message: message
            });
        }
        var LyricsPanel = require("LyricsPanel").LyricsPanel, base_url = /^https?:\/\/rob(wu|\.lekensteyn)\.nl\/(lyricshere|youtubelyrics)/i.test(location.href) || /^(chrome-extension|widget):$/.test(location.protocol) ? "" : "https://robwu.nl/lyricshere/", message = 'Hi there,<br><br>Whenever you visit a <b>YouTube</b> video or play a song on <b>Spotify</b>\'s Web Player, <b>Jango</b>, <b>AccuRadio</b>, <b>Deezer</b>, <b>8tracks</b>, <b>Google Music</b>, <b>iHeartRadio</b>, <b>Superplayer.fm</b>, <b>Last.fm</b>, <b>Yandex Music</b>, <b>Qobuz</b>, <b>SoundCloud</b>, <b>Saavn</b>, <b>Pandora</b>, <b>Bandcamp</b>, or any of the other supported music sites, lyrics will be displayed in this box. If you want to see other lyrics, click on "Different source", or use the search box below.<br><br>&raquo; <a href="' + base_url + '#quick-guide">More information</a><br><br>';
        exports.init = init;
    });
    define("dragndrop-nodes", [ "require", "exports", "module" ], function(require, exports) {
        function onDragEnd() {
            if (sourceNode) {
                sourceNode.style.display = originalDisplayStyle;
                var container = targetPlaceholderNode.parentNode;
                container && container.removeChild(targetPlaceholderNode);
                sourceNode = null;
                originalPreviousSibling = null;
                targetPlaceholderNode = null;
            }
        }
        function setListener(elem, eventName, listener) {
            var oldListener = elem[EVENT_NAMESPACE + eventName];
            if (oldListener) {
                elem.removeEventListener(eventName, oldListener, !1);
                elem[EVENT_NAMESPACE + eventName] = null;
            }
            if (listener) {
                elem.addEventListener(eventName, listener, !1);
                elem[EVENT_NAMESPACE + eventName] = listener;
            }
        }
        function bindDnD(elem, dndNode, onMoved) {
            function stopEvent(event) {
                event.stopPropagation();
                event.preventDefault();
            }
            if (dndNode && !dndNode.contains(elem)) throw Error("The dragged node must be the moved node or a child of the moved node!");
            dndNode = dndNode || elem;
            var selectstart = function(e) {
                dndNode.dragDrop();
                stopEvent(e);
            };
            setListener(elem, "mouseover", function() {
                "draggable" in dndNode ? dndNode.draggable = !0 : dndNode.dragDrop && setListener(dndNode, "selectstart", selectstart);
            });
            setListener(elem, "mouseout", function() {
                dndNode.draggable ? dndNode.draggable = !1 : setListener(dndNode, "selectstart");
            });
            setListener(dndNode, "dragstart", function(event) {
                sourceNode = dndNode;
                originalPreviousSibling = sourceNode.previousSibling;
                targetPlaceholderNode = document.createElement(sourceNode.tagName);
                targetPlaceholderNode.draggable = !0;
                targetPlaceholderNode.className = "drag-drop-placeholder";
                targetPlaceholderNode.style.height = sourceNode.offsetHeight + "px";
                setListener(targetPlaceholderNode, "dragover", stopEvent);
                setListener(targetPlaceholderNode, "drop", function(event) {
                    stopEvent(event);
                    targetPlaceholderNode.parentNode.insertBefore(sourceNode, targetPlaceholderNode);
                    onMoved && sourceNode.previousSibling !== originalPreviousSibling && onMoved();
                    onDragEnd();
                });
                try {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", "");
                } catch (e) {}
            });
            setListener(dndNode, "dragenter", function(event) {
                if (sourceNode && event.target === dndNode) {
                    var target = event.target;
                    if ("none" === sourceNode.style.display) {
                        if (target !== targetPlaceholderNode) {
                            var container = target.parentNode;
                            0 === (2 & targetPlaceholderNode.compareDocumentPosition(target)) && (target = target.nextSibling);
                            container.insertBefore(targetPlaceholderNode, target);
                        }
                    } else {
                        sourceNode.parentNode.insertBefore(targetPlaceholderNode, sourceNode);
                        originalDisplayStyle = sourceNode.style.display;
                        sourceNode.style.display = "none";
                    }
                }
            });
            setListener(dndNode, "dragover", stopEvent);
            setListener(dndNode, "drop", stopEvent);
            setListener(dndNode, "dragend", onDragEnd);
        }
        var originalDisplayStyle, originalPreviousSibling, sourceNode, targetPlaceholderNode, EVENT_NAMESPACE = "dndEvent" + Math.random();
        exports.bindDnD = bindDnD;
    });
    define("text!style/config.css", [], function() {
        return ".drag-drop-placeholder {\n    outline: 1px dashed #AAA;\n}\n.pref-sources {\n    min-height: 200px;\n}\n.pref-sources, .pref-item {\n    width: 390px;\n    list-style-type: none;\n    margin: 0;\n    padding: 0;\n}\n.pref-sources {\n    position: relative;\n    margin: 5px 0 0;\n}\n.pref-sources *,\n.config-site-box {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n.pref-item-dropzone {\n    position: fixed;\n    height: 100px;\n    width: 250px;\n    z-index: 2; /* higher than the z-index of the other li */\n    background-color: #eef2f6; /* background-color of #main */\n    outline: 2px dashed #AAA;\n    padding: 20px;\n    text-align: center;\n    display: block;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.pref-item-dropzone.draghover,\n.pref-item-dropzone:hover {\n    outline: 2px solid #888;\n}\n.pref-item {\n    height: 24px;\n    padding: 2px 0;\n    line-height: 20px;\n    font-size: 18px;\n}\n.pref-item.source-disabled,\n.pref-separator-banned ~ .pref-item {\n    opacity: 0.4;\n}\n.pref-item.source-disabled:hover,\n.pref-separator-banned ~ .pref-item:hover {\n    opacity: 0.8;\n}\n.pref-item .anchor {\n    display: inline-block;\n    width: 30px;\n    text-align: center;\n    cursor: move;\n}\n.pref-item .description {\n    padding: 0 10px;\n}\n.pref-item input[type=checkbox] {\n    display: none;\n}\n.pref-item input[type=checkbox] + span {\n    display: inline-block;\n    width: 4ex;\n    height: 20px;\n    border: 1px solid #BBB;\n    background-color: #fff;\n    vertical-align: middle;\n    line-height: 1em;\n    font-size: 16px;\n    text-align: center;\n    cursor: default;\n}\n.pref-item input[type=checkbox] + span:hover {\n    border-color: #000;\n}\n.pref-item input[type=checkbox] + span:before {\n    content: 'Off';\n}\n.pref-item input[type=checkbox]:checked + span:before {\n    content: 'On';\n}\n.pref-separator-banned {\n    height: 22px;\n    line-height: 18px;\n    font-size: 15px;\n}\n.pref-separator-banned .label-banned {\n    color: blue;\n    float: right;\n    margin-right: 3px;\n    cursor: default;\n}\n.pref-separator-banned.hide-banned .label-banned.hide,\n.pref-separator-banned .label-banned.show,\n.pref-separator-banned.hide-banned ~ .pref-item {\n    display: none;\n}\n.pref-separator-banned.hide-banned .label-banned.show {\n    display: inline;\n}\n.pref-separator-banned ~ .pref-item:not(:hover) > .description {\n    text-decoration: line-through;\n}\n.pref-separator-banned ~ .pref-item > label {\n    /* hide the On/off button of hidden items because it is not relevant */\n    visibility: hidden;\n}\n\n/* Description of source */\n.pref-item.sd-highlight:hover,\n.source-item-description:hover ~ .pref-item.sd-highlight {\n    outline: 1px solid #888;\n}\n.source-item-description-sticky,\n.source-item-description {\n    position: absolute;\n    top: 0;\n    left: 400px;\n    display: none;\n    width: 300px;\n    height: 100%;\n    border-left: 3px solid #99C;\n    padding: 7px;\n    font-size: 16px;\n    background-color: #eef2f6; /* background-color of #main */\n}\n.source-item-description-sticky {\n    display: block;\n    pointer-events: none;\n}\n.source-item-description-sticky.need-sticky ~ .source-item-description {\n    position: fixed;\n    /*\n     * left:\n     * +400px (default left offset)\n     * +8px (margin-left without calc)\n     * +5px (#main's border-left-width)\n     * +20px (#main's padding-left)\n     * = 433px\n     */\n    left: 433px;\n    height: auto;\n    z-index: 1;\n}\n@media screen and (min-width: 1024px) {\n.source-item-description-sticky.need-sticky ~ .source-item-description {\n    /*\n     * left:\n     * +400px (default left offset)\n     * +50% - 512px (#main's margin-left with calc)\n     * +5px (#main's border-left-width)\n     * +20px (#main's padding-left)\n     * = 50% - 87px\n     */\n    left: -webkit-calc(50% - 87px);\n    left: -moz-calc(50% - 87px);\n    left: calc(50% - 87px);\n}\n}/*end of @media screen and (min-width: 1024px)*/\n\n.source-item-description.sd-visible {\n    display: block;\n}\n.sd-source-header {\n    font-weight: bold;\n    margin: 0 0 0.5em 0;\n}\n.sd-description {\n    white-space: pre-wrap;\n}\n\n\n.config-site-box {\n    display: inline-block;\n    border: 1px solid transparent;\n    width: 32%;\n    min-height: 2em;\n    padding: 0.5em;\n    background-color: #EEFAEE;\n    border-radius: 3px;\n    vertical-align: top;\n}\n.config-site-box:hover {\n    border-color: #CCF;\n}\n.config-site-box label:hover {\n    background-color: #FED;\n}\n.config-site-box.site-disabled {\n    background-color: #FAEEEE;\n}\n.config-site-box .config-site-items {\n    position: relative;\n}\n.config-site-box .btn-enable-site,\n.config-site-box.site-disabled:hover .btn-disable-site,\n.config-site-box .btn-disable-site {\n    display: none;\n}\n.config-site-box:hover .btn-disable-site,\n.config-site-box.site-disabled .btn-enable-site {\n    display: block;\n}\n.config-site-box .show-site-items .site-item-hidden-by-default {\n    visibility: visible;\n}\n.config-site-box.site-disabled .config-site-items > div,\n.config-site-box .site-item-hidden-by-default {\n    visibility: hidden;\n}\ninput[type=\"button\"].btn-disable-site {\n    position: absolute;\n    right: 0;\n    top: -2em;\n    height: 1.5em;\n    padding-top: 0;\n    opacity: 0.6;\n}\ninput[type=\"button\"].btn-disable-site:hover {\n    opacity: 1;\n}\ninput[type=\"button\"].btn-enable-site {\n    /* Big button */\n    width: 80%;\n    height: 2em;\n    max-height: 100%;\n\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: auto;\n}\n\n/* Compact optionsV2 for embedding at chrome://extensions */\n.optionsV2 .source-item-description-sticky.need-sticky ~ .source-item-description {\n    /*\n     * left:\n     * +400px (default left offset)\n     * +20px (#main's padding-left)\n     * =420px\n     */\n    left: 420px;\n}\n";
    });
    define("versionInfo", {
        version: "3.14.1"
    });
    define("dialogs", [ "require", "exports", "module" ], function(require, exports) {
        function showModalDialogOrFallback(dialogType, msg, initialPromptValue, callback) {
            var result, defaultReturnValue;
            defaultReturnValue = dialogType === DIALOG_TYPE_PROMPT ? null : !1;
            if ("chrome-extension:" === location.protocol && document.documentElement.classList.contains("optionsV2")) result = defaultReturnValue; else {
                var timestart = Date.now();
                result = dialogType === DIALOG_TYPE_PROMPT ? prompt(msg, initialPromptValue) : confirm(msg);
                if (result !== defaultReturnValue || Date.now() - timestart > 10) {
                    callback(result);
                    return;
                }
            }
            var d = document.createElement("dialog");
            d.innerHTML = '<form><div class="dialog-text" style="white-space:pre-wrap;"></div><div style="text-align:center;margin-top:0.5em"><input type="submit" value="OK" autofocus> <button class="dialog-cancel">Cancel</button></div></form>';
            d.querySelector(".dialog-text").textContent = msg;
            if (dialogType === DIALOG_TYPE_PROMPT) {
                d.querySelector("input[autofocus]").removeAttribute("autofocus");
                d.querySelector(".dialog-text").insertAdjacentHTML("afterend", '<input class="prompt-input" style="width:100%" autofocus>');
                d.querySelector(".prompt-input").value = initialPromptValue;
            }
            d.querySelector("form").onsubmit = function(event) {
                event.preventDefault();
                result = dialogType === DIALOG_TYPE_PROMPT ? d.querySelector(".prompt-input").value : !0;
                d.close();
            };
            d.querySelector(".dialog-cancel").onclick = function(event) {
                event.preventDefault();
                d.close();
            };
            var activeElement = document.activeElement;
            d.onclose = function() {
                d.remove();
                activeElement && activeElement.focus();
                callback(result);
            };
            document.body.appendChild(d);
            d.showModal();
        }
        var DIALOG_TYPE_CONFIRM = "confirm", DIALOG_TYPE_PROMPT = "prompt";
        exports.confirm = function(msg, callback) {
            showModalDialogOrFallback(DIALOG_TYPE_CONFIRM, msg, null, callback);
        };
        exports.prompt = function(msg, initialPromptValue, callback) {
            showModalDialogOrFallback(DIALOG_TYPE_PROMPT, msg, initialPromptValue, callback);
        };
    });
    define("options", [ "require", "exports", "module", "LyricsPanel-demo", "sources/lyrics", "musicSites", "MultiLyricsSource", "config", "dragndrop-nodes", "text!style/config.css", "styleInjector", "SourceScraperUtils", "versionInfo", "dialogs" ], function(require, exports) {
        function bindMouseEnterEvent(elem, listener) {
            "onmouseenter" in document.documentElement ? elem.addEventListener("mouseenter", listener) : elem.addEventListener("mouseover", function(event) {
                return this === event.relatedTarget || this.contains(event.relatedTarget) ? void 0 : listener.call(this, event);
            });
        }
        function Option(text, value, defaultSelected, selected) {
            var option = document.createElement("option");
            option.label = text;
            option.text = value;
            option.defaultSelected = !!defaultSelected;
            option.selected = !!selected;
            return option;
        }
        function renderLyricsSourcePrefs(onRendered) {
            function setClassNameTo(elem, className) {
                var previousItem = document.getElementsByClassName(className)[0];
                if (previousItem) {
                    if (previousItem === elem) return;
                    previousItem.classList.remove(className);
                }
                elem.classList.add(className);
            }
            function createListItem() {
                if (!_li) {
                    _li = document.createElement("li");
                    _li.className = "pref-item";
                    _li.innerHTML = '<span class="anchor">::</span><label><input type="checkbox"><span></span></label><span class="description"></span>';
                }
                var li = _li.cloneNode(!0);
                li.querySelector('input[type="checkbox"]').onchange = function() {
                    li.classList[this.checked ? "remove" : "add"]("source-disabled");
                    saveLyricsSourcePrefs();
                };
                return li;
            }
            function createListItemDescription(li) {
                if (!_liDesc) {
                    _liDesc = document.createElement("li");
                    _liDesc.className = "source-item-description";
                    _liDesc.innerHTML = '<h2 class="sd-source-header"><a class="sd-source-link" rel="noreferrer"></a></h2><div><p class="sd-description"></p><span class="sd-alexa">View statistics on <a class="sd-alexa-link" rel="noreferrer" title="Alexa provides public demographics about websites, such as the visitor\'s country. You can use this tool to find out if this source suits your needs.">Alexa</a>.</span></div>';
                }
                var desc = _liDesc.cloneNode(!0);
                bindMouseEnterEvent(desc, function() {
                    _liDragging || setClassNameTo(li, "sd-highlight");
                });
                bindMouseEnterEvent(li, function() {
                    if (!_liDragging) {
                        setClassNameTo(desc, "sd-visible");
                        setClassNameTo(li, "sd-highlight");
                        revealSearchProviderUI(desc);
                    }
                });
                return desc;
            }
            function showDropzoneOnDragstart(event) {
                _liDragging = event.target;
                var rect = _liDragging.getBoundingClientRect(), dropzoneTop = document.querySelector(".pref-item-dropzone-top"), dropzoneBottom = document.querySelector(".pref-item-dropzone-bottom"), separatorItem = document.querySelector(".pref-separator-banned");
                separatorItem !== dropzoneBottom.previousSibling && separatorItem.parentNode.insertBefore(dropzoneBottom, separatorItem.nextSibling);
                dropzoneTop.style.top = rect.top - 100 + "px";
                dropzoneBottom.style.top = rect.bottom + "px";
                dropzoneTop.style.left = dropzoneBottom.style.left = rect.right + 30 + "px";
                dropzoneTop.classList.remove("draghover");
                dropzoneBottom.classList.remove("draghover");
                dropzoneTop.style.display = dropzoneBottom.style.display = "";
                _liDragging.addEventListener("dragend", function ondragend() {
                    _liDragging.removeEventListener("dragend", ondragend);
                    _liDragging = null;
                    dropzoneTop.style.display = dropzoneBottom.style.display = "none";
                });
            }
            function createDropzoneItem(className, textContent) {
                var dropzone = document.createElement("li");
                dropzone.className = "pref-item-dropzone " + className;
                dropzone.style.display = "none";
                dropzone.textContent = textContent;
                dropzone.addEventListener("dragenter", function() {
                    dropzone.classList.add("draghover");
                });
                dropzone.addEventListener("dragleave", function() {
                    dropzone.classList.remove("draghover");
                });
                var dummy = document.createElement("div");
                dropzone.appendChild(dummy);
                bindDnD(dummy, dropzone);
                dropzone.removeChild(dummy);
                dropzone.addEventListener("drop", function() {
                    _liDragging.parentNode.insertBefore(_liDragging, dropzone.nextSibling);
                    saveLyricsSourcePrefs();
                });
                return dropzone;
            }
            function createSeparatorItem() {
                var li = document.createElement("li");
                li.className = "pref-item pref-separator-banned hide-banned";
                li.innerHTML = '<span class="anchor">::</span><span class="description">Completely disabled sources <span class="toggle-banned-visibility"><span class="label-banned show" title="Show the sources listed below this separator.">[ Display all ]</span><span class="label-banned hide" title="Hide the sources listed below this separator.">[ Hide ]</span></span></span>';
                li.querySelector(".toggle-banned-visibility").onclick = function() {
                    li.classList.toggle("hide-banned");
                };
                return li;
            }
            function createSeparatorDescription(separatorItem) {
                var desc = createListItemDescription(separatorItem);
                desc.querySelector(".sd-source-header").textContent = "Completely disabled sources";
                desc.querySelector(".sd-description").innerHTML = "By default, when a source is turned off, it is still used by sources marked (search). Put a lyrics source below this line to completely disable it, as if the extension does not know about the source.";
                desc.querySelector(".sd-alexa").style.display = "none";
                var spholder = createSearchProviderPrefsPlaceholder("");
                spholder.appendChild(createSearchProviderPrefsUI());
                desc.appendChild(spholder);
                return desc;
            }
            function createRestoreDefaultButton() {
                var b = document.createElement("input");
                b.type = "button";
                b.id = "restore-defaults";
                b.value = "Restore defaults";
                b.onclick = function() {
                    dialogs.confirm("Do you want to remove your current Lyrics Source preferences, and restore the defaults?\nWarning: This step cannot be undone!", function(result) {
                        result && restoreLyricsSourcePrefs();
                    });
                };
                return b;
            }
            function createDescriptionSticky() {
                function stickSourceDescription() {
                    if (document.body.contains(dummy)) {
                        var rect = dummy.getBoundingClientRect();
                        if (rect.bottom >= 0 && 0 >= rect.top) {
                            dummy.classList.add("need-sticky");
                            var descriptionElement = dummy.parentNode.querySelector(".sd-visible");
                            descriptionElement.style.top = "";
                            if (lastDescriptionElement && lastDescriptionElement !== descriptionElement) {
                                lastDescriptionElement.style.top = "";
                                lastDescriptionElement = null;
                            }
                            var bottomOverflow = rect.bottom - descriptionElement.getBoundingClientRect().bottom;
                            if (0 > bottomOverflow) {
                                descriptionElement.style.top = bottomOverflow + "px";
                                lastDescriptionElement = descriptionElement;
                            }
                        } else {
                            if (lastDescriptionElement) {
                                lastDescriptionElement.style.top = "";
                                lastDescriptionElement = null;
                            }
                            dummy.classList.remove("need-sticky");
                        }
                    } else {
                        window.removeEventListener("scroll", stickSourceDescription);
                        window.removeEventListener("resize", stickSourceDescription);
                    }
                }
                var dummy = document.createElement("li");
                dummy.className = "source-item-description-sticky";
                window.addEventListener("scroll", stickSourceDescription);
                window.addEventListener("resize", stickSourceDescription);
                var lastDescriptionElement;
                return dummy;
            }
            function revealSearchProviderUI(desc) {
                var spholder = desc.querySelector(".spholder");
                spholder && spholder.appendChild(document.querySelector(".pref-search-provider"));
            }
            function createSearchProviderPrefsUI() {
                var spPrefsUI = document.createElement("div");
                spPrefsUI.className = "pref-search-provider";
                spPrefsUI.textContent = "Click to turn on/off search providers: ";
                var confirmed = !1;
                SourceScraperUtils.search.getSearchProviderDescriptions().forEach(function(item, i) {
                    var confirmDisableMsg = "A search provider is used to find lyrics, when a source does not have a search engine.\nYou should keep multiple search providers enabled, to avoid sending too many search queries to one search provider.\n\nDo you really want to stop using " + item.name + " as a search provider?", label = document.createElement("label");
                    label.style.whiteSpace = "nowrap";
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.setAttribute("data-searchprovideridentifier", item.searchProviderIdentifier);
                    checkbox.setAttribute("data-userdefined", item.isUserDefined ? "1" : "0");
                    checkbox.checked = item.enabled;
                    checkbox.onchange = function() {
                        if (checkbox.checked || confirmed) {
                            this.setAttribute("data-userdefined", "1");
                            saveLyricsSourcePrefs();
                        } else {
                            checkbox.checked = !0;
                            dialogs.confirm(confirmDisableMsg, function(result) {
                                if (result) {
                                    confirmed = !0;
                                    checkbox.checked = !1;
                                    checkbox.onchange();
                                }
                            });
                        }
                    };
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(item.name));
                    i && spPrefsUI.appendChild(document.createTextNode(", "));
                    spPrefsUI.appendChild(label);
                });
                return spPrefsUI;
            }
            function createSearchProviderPrefsPlaceholder(defaultText) {
                var spholder = document.createElement("span");
                spholder.className = "spholder";
                spholder.textContent = defaultText;
                return spholder;
            }
            function createSearchProviderDescription() {
                var li = document.createElement("li");
                li.id = "config-search";
                li.className = "source-item-description";
                li.innerHTML = '<h2 class="sd-source-header">Search providers</h2><p>Search providers are used to find lyrics for a given source.To avoid sending too many queries to a single search provider, multiple search providers should be enabled.</p>';
                li.appendChild(createSearchProviderPrefsPlaceholder(""));
                return li;
            }
            function createSearchProviderPrefsButton() {
                var b = document.createElement("input");
                b.type = "button";
                b.id = "reveal-search-provider-prefs";
                b.value = "Show search providers";
                b.onclick = function() {
                    var desc = document.getElementById("config-search");
                    revealSearchProviderUI(document.getElementById("config-search"));
                    setClassNameTo(desc, "sd-visible");
                };
                return b;
            }
            var output = document.getElementById("config-source");
            output.textContent = "Loading...";
            var _li, _liDesc, _liDragging = null;
            lyricsSources.getAllLyricsSources(function(sources) {
                var descriptionFragments = document.createDocumentFragment();
                descriptionFragments.appendChild(createDescriptionSticky());
                var sourceItems = document.createDocumentFragment(), bannedSourceItems = document.createDocumentFragment(), separatorItem = createSeparatorItem(), separatorDescription = createSeparatorDescription(separatorItem);
                bindDnD(separatorItem.querySelector(".anchor"), separatorItem, saveLyricsSourcePrefs);
                sources.forEach(function(source) {
                    var li = createListItem();
                    source.disabled && li.classList.add("source-disabled");
                    var identifier = source.identifier, checkbox = li.querySelector('input[type="checkbox"]');
                    checkbox.checked = !source.disabled;
                    checkbox.setAttribute("data-source-id", identifier);
                    var shortDescription = identifier;
                    source instanceof MultiLyricsSource && (shortDescription += " (search)");
                    li.querySelector(".description").textContent = shortDescription;
                    bindDnD(li.querySelector(".anchor"), li, saveLyricsSourcePrefs);
                    li.addEventListener("dragstart", showDropzoneOnDragstart);
                    bindPermissionRequestIfNeeded(checkbox, identifier);
                    source.banned ? bannedSourceItems.appendChild(li) : sourceItems.appendChild(li);
                    var lid = createListItemDescription(li), link = lid.querySelector(".sd-source-link");
                    link.textContent = identifier;
                    link.href = source.homepage;
                    link = lid.querySelector(".sd-alexa-link");
                    link.href = "http://www.alexa.com/siteinfo/" + source.homepage;
                    var desc = lid.querySelector(".sd-description");
                    desc.textContent = source.description || "(no description)";
                    desc.appendChild(document.createElement("br"));
                    if (source instanceof MultiLyricsSource) {
                        lid.querySelector(".sd-alexa").style.display = "none";
                        lid.appendChild(createSearchProviderPrefsPlaceholder("This source is also a search provider."));
                    }
                    descriptionFragments.appendChild(lid);
                });
                output.innerHTML = 'Sources on top are used first. Enable a few lyrics sites (at most 10) and at least one search engine (marked "(search)") to get optimal results. Want to (de)activate lyrics for some website? Scroll down to <a href="#config-sites">site config</a>!';
                var ol = document.createElement("ol");
                ol.className = "pref-sources";
                ol.appendChild(descriptionFragments);
                ol.appendChild(separatorDescription);
                ol.appendChild(createDropzoneItem("pref-item-dropzone-top", "Drag here to move to the top"));
                ol.appendChild(sourceItems);
                ol.appendChild(separatorItem);
                ol.appendChild(createDropzoneItem("pref-item-dropzone-bottom", "Drag here to move to the bottom (Completely disable source)"));
                ol.appendChild(bannedSourceItems);
                var li = document.createElement("li");
                li.className = "source-item-description sd-visible";
                li.innerHTML = '<h2 class="sd-source-header">Description</h2>Hover over an item at the left side for brief descriptions.<br><br>Found a source which is not listed here? Send a mail to <a href="mailto:rob@robwu.nl">rob@robwu.nl</a>!';
                ol.appendChild(li);
                ol.appendChild(createSearchProviderDescription());
                output.appendChild(ol);
                output.appendChild(createRestoreDefaultButton());
                output.appendChild(createSearchProviderPrefsButton());
                hasChromePermission(getAllOptionalChromePermissions(), function(result) {
                    var button = createGrantAllOptionalPermissionsButton();
                    result && (button.style.display = "none");
                    output.appendChild(button);
                });
                onRendered && onRendered();
            });
        }
        function saveLyricsSourcePrefs() {
            for (var searchProviderInputs = document.querySelectorAll('.pref-search-provider input[type="checkbox"]'), prefItemBoxes = document.querySelectorAll("ol.pref-sources > li.pref-item"), searchProviders = {}, order = [], banlist = [], blacklist = [], whitelist = [], j = 0; searchProviderInputs.length > j; ++j) {
                var spcheckbox = searchProviderInputs[j], spidentifier = spcheckbox.getAttribute("data-searchprovideridentifier");
                "1" === spcheckbox.getAttribute("data-userdefined") && (searchProviders[spidentifier] = spcheckbox.checked);
            }
            for (var hasSeenSeparator = !1, i = 0; prefItemBoxes.length > i; ++i) {
                var prefItemBox = prefItemBoxes[i];
                if (prefItemBox.classList.contains("pref-separator-banned")) hasSeenSeparator = !0; else {
                    var checkbox = prefItemBox.querySelector('input[type="checkbox"]'), identifier = checkbox.getAttribute("data-source-id"), isEnabled = checkbox.checked;
                    order.push(identifier);
                    (isEnabled ? whitelist : blacklist).push(identifier);
                    hasSeenSeparator && banlist.push(identifier);
                }
            }
            var prefs = {
                searchProviders: searchProviders,
                order: order,
                banlist: banlist,
                blacklist: blacklist,
                whitelist: whitelist
            };
            prefs.schemeVersion = lyricsSources.schemeVersion;
            config.setItem("lyricsSourcePreferences", prefs, function(success) {
                success ? _debug("Successfully saved preferences.") : _debug("Failed to save all preferences.");
            });
        }
        function restoreLyricsSourcePrefs() {
            config.removeItem("lyricsSourcePreferences", function(success) {
                _debug(success ? "Successfully removed prefs." : "Failed to remove all prefs.");
                renderLyricsSourcePrefs();
            });
        }
        function enableDemoButton() {
            var button = document.getElementById("launch-demo"), session = button.getAttribute("data-x");
            session = (session || "_") + "_";
            button.setAttribute("data-x", session);
            button.style.display = "block";
            var launchDemo = function() {
                session == button.getAttribute("data-x") ? demo.init() : button.removeEventListener("click", launchDemo, !1);
            };
            button.addEventListener("click", launchDemo, !1);
        }
        function renderToggleButtons(box, context) {
            function renderActualValue() {
                config.getItem(prefName, function(value) {
                    if (chrome_isOptional(context)) {
                        value = value === !0;
                        internalCheckbox.checked = value;
                    } else value = value !== !1;
                    parbox.classList[value ? "remove" : "add"]("site-disabled");
                });
            }
            var parbox = box.parentNode, siteName = parbox.querySelector("h2").textContent, prefName = "enabled." + context, internalCheckbox = document.createElement("input");
            internalCheckbox.type = "checkbox";
            internalCheckbox.style.display = "none";
            bindPermissionRequestIfNeeded(internalCheckbox, context);
            box.appendChild(internalCheckbox);
            internalCheckbox.onchange = function() {
                parbox.classList[internalCheckbox.checked ? "remove" : "add"]("site-disabled");
                config.setItem(prefName, internalCheckbox.checked, function(success) {
                    _debug((success ? "Successfully saved " : "Failed to save ") + prefName + " pref.");
                });
            };
            var toggleEnabled = function(isEnabled) {
                parbox.classList[isEnabled ? "remove" : "add"]("site-disabled");
                config.setItem(prefName, isEnabled, function(success) {
                    _debug((success ? "Successfully saved " : "Failed to save ") + prefName + " pref.");
                });
                internalCheckbox.checked = isEnabled;
                internalCheckbox.triggerChange();
            }, enableButton = document.createElement("input");
            enableButton.type = "button";
            enableButton.value = "Enable";
            enableButton.className = "btn-enable-site";
            enableButton.title = "Active Lyrics for " + siteName;
            enableButton.onclick = function() {
                toggleEnabled(!0);
            };
            var disableButton = document.createElement("input");
            disableButton.type = "button";
            disableButton.value = "Disable";
            disableButton.className = "btn-disable-site";
            disableButton.title = "Completely disable Lyrics for " + siteName;
            disableButton.onclick = function() {
                toggleEnabled(!1);
            };
            box.appendChild(enableButton);
            box.appendChild(disableButton);
            renderActualValue();
        }
        function renderAutoLaunchPreference(box, context) {
            function renderActualValue() {
                config.getItem(prefName, function(value) {
                    checkbox.checked = value !== !1;
                });
            }
            var prefName = context + "-autolaunch", howToEnableMessage = "The lyrics can be shown by clicking on the 'Lyrics Here' icon near the address bar and/or " + ("youtube" == context ? "after the video's title." : "spotify" == context ? "at the upper-right corner of the player." : "at the upper-right corner of the video page."), output = document.createElement("div");
            output.id = "config-" + context + "-autolaunch";
            output.innerHTML = '<label title="If unchecked, lyrics will not be displayed. \n' + howToEnableMessage + '"><input type="checkbox"> Automatically show Lyrics.</label>';
            box.appendChild(output);
            var checkbox = output.querySelector('input[type="checkbox"]');
            checkbox.checked = !0;
            checkbox.onchange = function() {
                config.setItem(prefName, checkbox.checked, function(success) {
                    _debug((success ? "Successfully saved " : "Failed to save ") + prefName + " pref.");
                    renderActualValue();
                });
            };
            renderActualValue();
        }
        function renderThemePreference(box, context) {
            function renderActualValue() {
                config.getItem(prefName, function(theme) {
                    select.value = theme;
                    -1 == select.selectedIndex && (select.value = "auto");
                });
            }
            var prefName = "theme." + context, output = document.createElement("div");
            output.id = "config-" + context + "-theme";
            output.className = "site-item-hidden-by-default";
            output.innerHTML = '<label>Theme: <select class="pref-select-theme"></select></label>';
            box.appendChild(output);
            var select = output.querySelector("select");
            select.add(new Option("Auto-detect", "auto", !0));
            select.add(new Option("Default", "default"));
            select.add(new Option("Dark", "dark"));
            select.onchange = function() {
                config.setItem(prefName, this.value, function(success) {
                    _debug((success ? "Successfully saved " : "Failed to save ") + prefName + " pref.");
                });
            };
            renderActualValue();
        }
        function renderFontSizePreference(box, context) {
            function commitChange(fontSize) {
                config.setItem(prefName, fontSize, function(success) {
                    _debug((success ? "Successfully saved " : "Failed to save ") + prefName + " pref.");
                    renderActualValue();
                });
            }
            function renderActualValue() {
                config.getItem(prefName, function(fontSize) {
                    if ("string" == typeof fontSize) {
                        currentFontSize = select.value = fontSize;
                        setCustomOption(select.value != fontSize && fontSize);
                    } else setCustomOption();
                });
            }
            var prefName = "fontSize." + context, output = document.createElement("div");
            output.className = "site-item-hidden-by-default";
            output.innerHTML = '<label>Font size: <select class="pref-select-font-size"></select></label>';
            box.appendChild(output);
            for (var select = output.querySelector("select"), defaultValue = "14px", i = 9; 21 > i; ++i) select.add(new Option(i + " px", i + "px", !1, i + "px" == defaultValue));
            var selectOptionsLength = select.options.length, setCustomOption = function(val) {
                select.options.length = selectOptionsLength;
                val && select.add(new Option(val, val, !1, !0));
                select.add(new Option("Custom", "custom"));
            }, currentFontSize = defaultValue;
            select.onchange = function() {
                var fontSize = this.value;
                "custom" === fontSize ? dialogs.prompt("Enter the desired font size (between 1 and 99)", parseFloat(currentFontSize), function(fontSize) {
                    if (fontSize) {
                        fontSize = parseFloat(fontSize);
                        fontSize = fontSize > 0 && 100 > fontSize ? Math.round(100 * fontSize) / 100 + "px" : null;
                    }
                    fontSize ? commitChange(fontSize) : select.value = currentFontSize;
                }) : commitChange(fontSize);
            };
            renderActualValue();
        }
        function showAdvancedControlsOnHover() {
            var box = this, previouslyShownItems = document.querySelector(".show-site-items");
            if (box !== previouslyShownItems) {
                previouslyShownItems && previouslyShownItems.classList.remove("show-site-items");
                box.classList.add("show-site-items");
            }
        }
        function init() {
            if (!(location.href.indexOf("chrome-only") > 0 && window.top !== window)) if (document.getElementById("get-extension")) {
                if (!document.documentElement.hasAttribute("YTLActivated")) {
                    if (document.documentElement.hasAttribute("YTLDemoActivated")) {
                        for (var elems = document.querySelectorAll("#just-a-demo-overlay,.L759-container,.L759-overlay,.LyricsHereByRobWPageActionIcon"), i = 0; elems.length > i; ++i) elems[i].parentNode.removeChild(elems[i]);
                        elems = null;
                    }
                    if ("#optionsV2" === location.hash) {
                        document.documentElement.classList.add("optionsV2");
                        "chrome-extension:" !== location.protocol || !("viewTarget" in SVGViewElement.prototype) && "id" in SVGViewElement.prototype || chrome.tabs.getCurrent(function(currentTab) {
                            currentTab || chrome.tabs.create({
                                url: location.href.split("#")[0] + "#config"
                            }, function() {
                                chrome.runtime.lastError || window.close();
                            });
                        });
                    }
                    document.documentElement.setAttribute("YTLActivated", "");
                    _debug("Options page detected by Lyrics Here.");
                    renderOptionsForRealExtension();
                    var isNavigation = "object" == typeof performance && performance && performance.navigation && 0 === performance.navigation.type, scrollTop = document.documentElement.scrollTop;
                    renderOptions(function() {
                        if (isNavigation) {
                            var elemId = location.hash.slice(1), elem = elemId && document.getElementById(elemId);
                            if (elem) {
                                elem.scrollIntoView({
                                    behavior: "instant",
                                    block: "start"
                                });
                                return;
                            }
                        }
                        document.documentElement.scrollTop = scrollTop;
                    });
                }
            } else _debug("Not an options page!");
        }
        function renderOptionsForRealExtension() {
            function nextNode(fragment, node) {
                var nextSibling = node && node.nextSibling;
                node && fragment.appendChild(node);
                return nextSibling;
            }
            function createExpanderLink(section, fragment, textContent) {
                var a = document.createElement("a");
                a.style.marginTop = "0.5em";
                a.style.display = "block";
                a.href = "#" + section.id;
                a.textContent = "» " + textContent;
                a.addEventListener("click", function(event) {
                    section.appendChild(fragment);
                    event.preventDefault();
                    a.parentNode.removeChild(a);
                });
                return a;
            }
            document.title += " (version " + versionInfo.version + ")";
            for (var extSection = document.getElementById("get-extension"), extFragment = document.createDocumentFragment(), node = extSection.firstChild; node; ) node = "H1" === node.tagName ? node.nextSibling : nextNode(extFragment, node);
            var desc = document.createElement("div");
            desc.innerHTML = 'You are using Lyrics Here <a href="https://robwu.nl/lyricshere/CHANGELOG#' + versionInfo.version + '">' + "version " + versionInfo.version + "</a>.";
            desc.appendChild(createExpanderLink(extSection, extFragment, "Show more information"));
            extSection.appendChild(desc);
            var sourcesSection = document.getElementById("sources"), sourcesFragment = document.createDocumentFragment();
            if (sourcesSection) {
                node = sourcesSection.querySelector("ul");
                for (;node; ) node = nextNode(sourcesFragment, node);
                sourcesSection.appendChild(createExpanderLink(sourcesSection, sourcesFragment, "Show full list of sources"));
            }
        }
        function renderOptions(optionalCallbackOnRendered) {
            styleInjector.addStyle(styleSheetText, "options");
            renderLyricsSourcePrefs(function() {
                optionalCallbackOnRendered && optionalCallbackOnRendered();
            });
            enableDemoButton();
            musicSites.identifiers.some(function(site) {
                var box = document.getElementById("config-" + site);
                if (box) {
                    box = box.querySelector(".config-site-items");
                    if (box) {
                        box.textContent = "";
                        renderToggleButtons(box, site);
                        renderAutoLaunchPreference(box, site);
                        renderThemePreference(box, site);
                        renderFontSizePreference(box, site);
                        bindMouseEnterEvent(box, showAdvancedControlsOnHover);
                    } else _debug("Element #config-" + site + " .config-site-items not found!");
                } else _debug("Element #config-" + site + " not found!");
            });
        }
        var demo = require("LyricsPanel-demo"), lyricsSources = require("sources/lyrics"), musicSites = require("musicSites"), MultiLyricsSource = require("MultiLyricsSource").MultiLyricsSource, config = require("config"), bindDnD = require("dragndrop-nodes").bindDnD, styleSheetText = require("text!style/config.css"), styleInjector = require("styleInjector"), SourceScraperUtils = require("SourceScraperUtils").SourceScraperUtils, versionInfo = require("versionInfo"), dialogs = require("dialogs"), _debug = function(message) {
            console && console.log("Options: " + message);
        }, bindPermissionRequestIfNeeded = function(checkbox, identifier) {
            function userTriggeredChange() {
                if (checkbox.checked) {
                    checkbox.checked = !1;
                    checkbox.onchange();
                    requestPermission(identifier, optionalPermissions, function(isGranted) {
                        checkbox.checked = !!isGranted;
                        checkbox.onchange();
                    });
                }
            }
            var optionalPermissions = getChromePermissions(identifier);
            if (optionalPermissions) {
                checkbox.addEventListener("change", userTriggeredChange);
                checkbox.triggerChange = userTriggeredChange;
            } else checkbox.triggerChange = function() {
                _debug("Not optional: " + identifier + " (ok)");
            };
        }, chrome_isOptional = function(site) {
            return optional_sites.hasOwnProperty(site);
        }, createGrantAllOptionalPermissionsButton = function() {
            var b = document.createElement("input");
            b.type = "button";
            b.id = "grant-all-optional-permissions";
            b.value = "Grant all optional permissions";
            b.title = "Click here to allow the extension to read the data on all supported lyrics and music sites.";
            b.onclick = function() {
                b.disabled = !0;
                requestPermission("all", getAllOptionalChromePermissions(), function(granted) {
                    b.disabled = !1;
                    granted && (b.style.display = "none");
                });
            };
            return b;
        };
        exports.init = init;
    });
    require([ "config", "musicSites", "setwmode", "domready", "LyricsPanel-popup", "options" ], function(config, musicSites, setwmode, domready, LyricsPanelPopup, options) {
        var env = musicSites.getIdentifier(location.href);
        if (env) {
            var envIsEnabled = !1, remainingStepsTillLaunch = 2, launchApp = function() {
                0 === --remainingStepsTillLaunch && envIsEnabled && musicSites.loadIntegratedLyrics(env);
            };
            config.getItem("enabled." + env, function(isEnabled) {
                envIsEnabled = isEnabled !== !1;
                launchApp();
            });
            domready(launchApp);
        } else {
            if ("chrome-extension:" === location.protocol) {
                "/options.html" === location.pathname && options.init();
                "/popup.html" === location.pathname && LyricsPanelPopup.init();
                return;
            }
            if (/^https?:\/\/rob(wu|\.lekensteyn)\.nl\/(lyricshere|youtubelyrics)/.test(location.href)) {
                if ("/lyricshere/popup.html" === location.pathname) {
                    LyricsPanelPopup.init();
                    return;
                }
                domready(function() {
                    options.init();
                });
            }
        }
    });
}();