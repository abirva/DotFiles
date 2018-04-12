// (c) Rob Wu <rob@robwu.nl>
// https://robwu.nl/lyricshere/

/* globals processRequest, getChromePermissions, getPermissionIdentifier, isSearchEngine */

// Event page: Show/hide page action
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (!message || !sender.tab) {
        return;
    }
    var tabId = sender.tab.id;
    try {
        switch (message) {
        case 'attached':
            chrome.pageAction.setTitle({
                tabId: tabId,
                title: 'Lyrics Here - click to hide the panel'
            });
            chrome.pageAction.show(tabId);
            break;
        case 'detached':
            chrome.pageAction.setTitle({
                tabId: tabId,
                title: 'Lyrics Here - click to show the panel'
            });
            chrome.pageAction.show(tabId);
            break;
        case 'hideIcon':
            chrome.pageAction.hide(tabId);
            break;
        case 'getAllLyricsPermissions':
            sendResponse(getChromePermissions('all-lyrics'));
            return;
        default:
            if (message.containsPermissions) {
                chrome.permissions.contains(message.containsPermissions, function(result) {
                    sendResponse(result);
                });
                return true;
            }
            break;
        }
    } catch (e) {
        console.error('Error for message.' + message + ' ' + e);
    }
    
    sendResponse({});
});
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, 'toggle');
});

/*
 * @param {string} Source / music site identifier, used to determine which permissions are requested
 * @param {object} openerInfo Metadata about the tab/frame that requested the new permissions.
 * @param {string} openerInfo.url URL of tab/frame that initiated the permission request.
 * @param {string} openerInfo.tabId ID of tab that initiated the permission request
 * @param {function} callback(boolean) Called when the dialog is closed. Boolean states whether
 *                                     permission was granted or not.
 * @return {object} An object with two properties:
 *          @prop {boolean} closed  Whether the permission dialog is closed.
 *          @method {function} Call this method to close the dialog.
 */
function requestPermissionFor(identifier, openerInfo, callback) {
    var chromeVersion = /Chrome\/\d+\.0\.(\d+)\./.exec(navigator.userAgent);
    if (chromeVersion && chromeVersion[1] >= 1957) {
        // chrome.permissions.request gesture preservement in message passing added in
        // 36.0.1957.0 (r266085, crbug.com/361116, April 2014)
        chrome.permissions.request(getChromePermissions(identifier), function(result) {
            callback(!!result);
        });
        return;
    }
    var onComplete = function() {
        chrome.permissions.contains(getChromePermissions(identifier), function(result) {
            callback(!!result);
        });
    };
    var url = chrome.runtime.getURL('grant.html') + '?' + identifier;
    var openerInfoSerialized = JSON.stringify(openerInfo);
    var w = 400;
    var h = 200;
    var t = Math.floor((screen.availHeight - h) / 2);
    var l = Math.floor((screen.availWidth - w) / 2);

    chrome.tabs.query({
        url: url
    }, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            bindToWindow(tab.windowId);
            chrome.tabs.update(tab.id, {
                url: url + '#' + openerInfoSerialized
            });
        } else {
            openPermissionDialog();
        }
    });

    var returnValue = {
        closed: false,
        close: function() {
            returnValue.closed = true;
            // Called prematurely. Newly opened window will be closed asap.
        }
    };
    return returnValue;
    // No code below except for two function declarations

    function openPermissionDialog() {
        try {
            chrome.windows.create({
                url: url + '#' + openerInfoSerialized,
                width: w,
                height: h,
                top: t,
                left: l,
                type: 'popup',
                focused: true
            }, function(window) {
                bindToWindow(window.id);
            });
        } catch (e) {
            console.log('requestPermissionFor failed (using fallback): ' + e);
            var win = window.open(url + '#' + openerInfoSerialized, 'ytl.' + identifier,
                    'width=' + w + ',height=' + h + ',top=' + t + ',left=' + l);
            if (!win) {
                returnValue.closed = true;
                onComplete();
            } else {
                returnValue.close = function() {
                    if (!returnValue.closed) {
                        returnValue.closed = true;
                        if (win) win.close();
                    }
                };
                (function pollWindowState() {
                    if (!win || win.closed) {
                        win = null;
                        returnValue.closed = true;
                        onComplete();
                        return;
                    }
                    setTimeout(pollWindowState, 200);
                })();
            }
        }
    }
    
    function bindToWindow(windowId) {
        // Positioning is occasionally off... http://crbug.com/72980
        chrome.windows.update(windowId, {
            width: w,
            height: h,
            top: t,
            left: l,
            focused: true
        });
        chrome.windows.onRemoved.addListener(function listener(removedWindowId) {
            if (windowId === removedWindowId) {
                chrome.windows.onRemoved.removeListener(listener);
                onComplete();
                returnValue.closed = true;
            }
        });
        returnValue.close = function() {
            if (!returnValue.closed) {
                returnValue.closed = true;
                chrome.windows.remove(windowId);
            }
        };
        // During the asynchronous call, someone might have called close()
        if (returnValue.closed) returnValue.close();
    }
}

// Process requests from content scripts
// (delegated to the background page to avoid mixed content warnings)
chrome.runtime.onConnect.addListener(function(port) {
    switch (port.name) {
    case 'processRequest':
        onProcessRequestConnect(port);
        break;
    case 'requestPermission':
        onPermissionRequestConnect(port);
        break;
    case 'popout-channel':
        // Handled by bg-contextmenu.js
        break;
    default:
        console.warn('Destroying unknown port: ' + port.name);
        port.disconnect();
    }
});
function onProcessRequestConnect(port) {
    var x;
    // Optionally set when a permission request is created. Used to detect when
    // the same permission was requested and approved in another window
    var onPermissionsAdded;
    // Should ALWAYS be called exactly once per cycle
    var onDisconnect = function() {
        port = null;
        if (x) x.abort();
        x = null;
        if (onPermissionsAdded) {
            chrome.permissions.onAdded.removeListener(onPermissionsAdded);
            onPermissionsAdded = null;
        }
    };
    
    var disconnectPort = function() {
        if (port) {
            port.disconnect();
            // disconnect() only triggers an event at the other side of the channel
            // Manually call the listener at this page
            onDisconnect();
        }
    };
    port.onDisconnect.addListener(onDisconnect);
    port.onMessage.addListener(function port_onMessage(message) {
        if (message.type == 'request') {
            console.assert(!x, 'request may be called only once per connect');
            
            var requestObject = message.requestObject;
            console.assert(!!requestObject, 'message.requestObject must exist');

            requestObject.afterSend = function(returnValue) {
                x = returnValue;
                port.postMessage({ type: 'afterSend' });
            };
            requestObject.fail = function(response) {
                port.postMessage({ type: 'fail', data: response });
                disconnectPort();
            };
            requestObject.found = function(response) {
                port.postMessage({ type: 'found', data: response });
                disconnectPort();
            };

            var identifier = getPermissionIdentifier(requestObject.url);
            if (identifier) {
                var chromePermissions = getChromePermissions(identifier);
                chrome.permissions.contains(chromePermissions, function(result) {
                    if (!port) {
                        x = null;
                        return;
                    }
                    if (result) {
                        // Since the extension has the permission to access the URL,
                        // the following call cannot fail.
                        processRequest(requestObject);
                    } else {
                        if (onPermissionsAdded) {
                            // Rebind listener in case chromePermissions has changed.
                            // Only the last request of this port is relevant to
                            // the permission request system.
                            chrome.permissions.onAdded.removeListener(onPermissionsAdded);
                        }
                        onPermissionsAdded = function() {
                            chrome.permissions.contains(chromePermissions, function(result) {
                                if (!result) {
                                    return;
                                }
                                chrome.permissions.onAdded.removeListener(onPermissionsAdded);
                                onPermissionsAdded = null;
                                // The permission request for this session
                                // was approved, so let's continue.
                                port.postMessage({
                                    type: 'requestPermissionEarlyGrant'
                                });
                            });
                        };
                        chrome.permissions.onAdded.addListener(onPermissionsAdded);
                        port.postMessage({
                            type: 'requestPermission',
                            sourceIdentifier: identifier,
                            // Don't show the "Never ask" button for the given source.
                            cannotBeDisabled: isSearchEngine(identifier),
                            chromePermissions: getChromePermissions(identifier)
                        });
                    }
                });
                return;
            }

            // Unknown permission identifier. Try to send the request anyway.
            processRequest(requestObject);
        }
    });
}
function onPermissionRequestConnect(port) {
    var permissionDialog;
    // Should ALWAYS be called exactly once per cycle
    var onDisconnect = function() {
        port = null;
        if (permissionDialog) permissionDialog.close();
        permissionDialog = null;
    };

    var disconnectPort = function() {
        if (port) {
            port.disconnect();
            // disconnect() only triggers an event at the other side of the channel
            // Manually call the listener at this page
            onDisconnect();
        }
    };
    port.onDisconnect.addListener(onDisconnect);
    port.onMessage.addListener(function port_onMessage(identifier) {
        var chromePermissions = getChromePermissions(identifier);
        if (!chromePermissions) {
            console.warn('Permissions not defined for "' + identifier + '"');
            port.postMessage(false);
            disconnectPort();
            return;
        }
        chrome.permissions.contains(chromePermissions, function(hasPermissions) {
            if (!port) {
                return;
            }
            if (hasPermissions) {
                port.postMessage(true);
                disconnectPort();
                return;
            }
            var sender = port.sender;
            permissionDialog = requestPermissionFor(identifier, {
                tabId: sender && sender.tab && sender.tab.id,
                url: sender && sender.url
            }, function(isGranted) {
                if (port) {
                    port.postMessage(isGranted);
                    disconnectPort();
                }
            });
        });
    });
}
