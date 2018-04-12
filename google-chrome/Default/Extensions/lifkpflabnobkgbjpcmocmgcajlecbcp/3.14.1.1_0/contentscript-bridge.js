var accepted_origins = ['https://robwu.nl', 'http://robwu.nl'];
var callbacks = {};
var ports = {};
var _funcId = -1;
var funcToId = function(func) {
    var functionId = --_funcId;
    callbacks[functionId] = func;
    return functionId;
};

addEventListener('message', function(event) {
    if (!~accepted_origins.indexOf(event.origin)) return;
    var data = event.data;
    if (!data || !data.toRobWsContentScript) return;
    if (data.type == 'api_call') {
        api_call(data.message);
    } else {
        console.log('Unexpected message to content script: ' + data.type);
    }
});


function parent_postMessage(type, message) {
    // Extension is only supported in Chrome 20+.
    // Coincidentally, location.ancestorOrigins is only supported since Chrome 20
    var origin = (location.ancestorOrigins||[])[0];
    if (!~accepted_origins.indexOf(origin)) return;
    parent.postMessage({
        type: type,
        message: message,
        fromRobWsContentScript: true
    }, origin);
}
function json_replacer(key, value) {
    if (typeof value === 'function') return 'f_' + funcToId(value);
    if (typeof value === 'string')   return 's_' + value;
    if (typeof value === 'object' && value && value.constructor !== Object && !Array.isArray(value) && !value.toJSON) {
        // Avoid unexpected circular references to cause errors.
        return {__nojson__: true};
    }
    return value;
}
function unpack_args(args, extraArgs) {
    return JSON.parse(args, function(key, value) {
        if (typeof value == 'string') {
            var type = value.charAt(0);
            value = value.slice(2);
            if (type == 'f') {
                return function() {
                    var args = [].slice.call(arguments);
                    parent_postMessage('callback', {
                        functionId: value,
                        deleteCallback: !!extraArgs.once,
                        serialized_args: JSON.stringify(args, json_replacer)
                    });
                    // `return true` solely for onMessage events:
                    // (no side effects in other methods)
                    return true;
                };
            }
        }
        return value;
    });
}
function api_call(data) {
    var api_name = data.api_name;
    var extraArgs = data.extraArgs || {};
    var args = data.serialized_args;
    // unpack args, which may include a function
    args = unpack_args(args, extraArgs);
    
    var target, methodName;
    switch (api_name) {
    case 'callback':
        target = callbacks;
        methodName = extraArgs.functionId;
        if (!target[methodName]) {
            console.log('Unknown callback ID: ' + methodName);
            return;
        }
        break;
    case 'storage':
        target = chrome.storage.local;
        methodName = extraArgs.name;
        break;
    case 'sendMessage':
        target = chrome.runtime;
        methodName = 'sendMessage';
        break;
    case 'onMessage':
        target = chrome.runtime.onMessage;
        methodName = 'addListener';
        break;
    case 'port.create':
        target = chrome.runtime;
        ports[extraArgs.portId] = target.connect.apply(target, args);
        return;
    case 'port.on':
        target = ports[extraArgs.portId][extraArgs.event];
        methodName = 'addListener';
        break;
    case 'port.postMessage':
        target = ports[extraArgs.portId];
        methodName = 'postMessage';
        break;
    }
    if (target) {
        target[methodName].apply(target, args);
    }
}


// Send latest version of extension to the UI
(function() {
    function load(contentScriptFile, callback) {
        var x = new XMLHttpRequest();
        x.open('GET', chrome.runtime.getURL(contentScriptFile));
        x.onload = function() {
            callback(x.responseText);
            x.onload = callback = null;
            x = null;
        };
        x.send();
    }
    parent_postMessage('ContentScriptLoaded');
    load('optional_origins.js', function(code_part1) {
        load('yt_lyrics.js', function(code_part2) {
            var chrome_api_factory_serialized = '(' + chrome_api_factory + ').bind(null,{' +
                'getManifest:function(){return ' + JSON.stringify(chrome.runtime.getManifest()) + ';}' + 
                '})';
            parent_postMessage('bootstrap-code', {
                // Parentheses are important: Turns decl in expr
                chrome_api_factory: chrome_api_factory_serialized,
                code: code_part1 + ';\n' + code_part2
            });
        });
    });
})();

// __impl__ is provided by this script, but runs in the context of the parent (options) page.
// To be executed in the context of the parent (options) page
function chrome_api_factory(__impl__, __args__, iframe, iframeSrc) {
    // Strip the first non-consecutive slash and anything after it
    var iframeOrigin = (iframeSrc || iframe.src).replace(/([^\/])\/(?!\/).*$/, '$1');
    var postMessage = function(type, message) {
        iframe.contentWindow.postMessage({
            type: type,
            message: message,
            toRobWsContentScript: true
        }, iframeOrigin);
    };
    var callbacks = {};
    var _funcId = 1;
    var funcToId = function(func) {
        var functionId = ++_funcId;
        callbacks[functionId] = func;
        return functionId;
    };
    var json_replacer = function(key, value) {
        if (typeof value === 'function') return 'f_' + funcToId(value);
        if (typeof value === 'string')   return 's_' + value;
        return value;
    };
    var unpack_args = function(args) {
        return JSON.parse(args, function(key, value) {
            if (typeof value == 'string') {
                var type = value.charAt(0);
                value = value.slice(2);
                if (type == 'f') {
                    return API('callback', {functionId: value});
                }
            }
            return value;
        });
    };
    window.addEventListener('message', function(event) {
        if (!~__args__.accepted_origins.indexOf(event.origin)) return;
        var data = event.data;
        if (!data || !data.fromRobWsContentScript) return;
        if (data.type == 'callback') {
            data = data.message;
            var callback = callbacks[data.functionId];
            if (!callback) {
                console.log('Unknown callback: ' + data.functionId);
                return;
            }
            if (data.deleteCallback) delete callbacks[data.functionId];
            var args = unpack_args(data.serialized_args);
            callback.apply(null, args);
        } else {
            console.log('Unexpected message from content script: ' + data.type);
        }
    });
    // extraArgs:
    // - once: If true, delete function after calling
    var API = function(api_name, extraArgs) {
        return function() {
            var args = [].slice.call(arguments); // Convert to array
            postMessage('api_call', {
                api_name: api_name,
                extraArgs: extraArgs,
                serialized_args: JSON.stringify(args, json_replacer)
            });
        };
    };
    
    
    var chrome = {};
    chrome.runtime = {};
    //chrome.runtime.lastError = undefined; // Not implemented
    chrome.runtime.connect = function() {
        var port = {};
        var portId = port.portId_ = 0|(Math.random()*1e9);
        port.onDisconnect = {};
        port.onDisconnect.addListener = API('port.on', {event:'onDisconnect', portId:portId, once:false});
        port.onMessage = {};
        port.onMessage.addListener = API('port.on', {event:'onMessage', portId:portId, once:false});
        port.postMessage = API('port.postMessage', {portId:portId, once:true});
        API('port.create', {portId:portId}).apply(null, arguments);
        return port;
    };
    chrome.runtime.sendMessage = API('sendMessage', {once:true});
    
    chrome.runtime.onMessage = {};
    chrome.runtime.onMessage.addListener = API('onMessage', {once:false});
    chrome.storage = {};
    chrome.storage.local = {};
    ['get','set','remove','clear'].forEach(function(name) {
        chrome.storage.local[name] = API('storage', {name:name,once:true});
    });

    chrome.runtime.getManifest = function() {
        return __impl__.getManifest();
    };

    return chrome;
}
