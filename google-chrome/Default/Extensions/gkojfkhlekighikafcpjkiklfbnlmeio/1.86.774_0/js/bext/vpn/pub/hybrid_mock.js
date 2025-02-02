// LICENSE_CODE ZON
'use strict'; /*jslint browser:true*/
define(['/util/zerr.js', '/bext/pub/browser.js', '/bext/pub/lib.js'],
    function(zerr, B, be_lib){
B.assert_bg('hybrid_mock');
zerr.set_exception_handler('be', be_lib.err);
var chrome = !window.is_tpopup && window.chrome, conf = window.conf;
var noop = function(){};
var E = {};

function unimplemented_cb(name){
    return function(){
        console.error('proxy.settings.'+name, 'unimplemented',
            arguments, zerr.e2s(new Error()));
    };
}

function init_hybrid(){
    var port, cbs = {}, last_seq = 0;
    var on_end = function(seq, err, res){
        var o;
        if (!(o = cbs[seq]))
            return;
        o.cb(err, res);
        clearTimeout(o.timer);
        delete cbs[seq];
    };
    var msg_timeout = function(seq){
        return setTimeout(function(){ on_end(seq, 'timeout'); }, 10*1000); };
    var on_msg = function(msg){ on_end(msg.seq); };
    var post_msg = function(msg, cb){
        if (cb)
        {
            var seq = ++last_seq;
            cbs[seq] = {cb: cb, timer: msg_timeout(seq)};
            msg.seq = seq;
        }
        port.postMessage(msg);
    };
    port = chrome.runtime.connect({name: 'ff_hybrid_mock'});
    port.onMessage.addListener(on_msg);
    chrome.proxy = {
        settings: {
            get: unimplemented_cb('get'),
            set: function(opt, cb){
                if (opt.value.mode!='pac_script')
                    return unimplemented_cb('set')(opt);
                post_msg({id: 'pac_script_set',
                    content: opt.value.pacScript.data}, cb);
            },
            clear: function(opt, cb){
                post_msg({id: 'pac_script_set', content: ''}, cb); },
            onChange: {
                addListener: unimplemented_cb('onChange.addListener'),
                removeListener: unimplemented_cb('onChange.removeListener'),
            },
        },
        uninstall_mock: function(){
            chrome.proxy.settings.clear();
            port.disconnect();
            chrome.proxy = undefined;
        },
    };
}

function init_webext(){
    var browser = window.browser;
    var pac_path = '/lib/pac.js', pac_url = browser.extension.getURL(pac_path);
    var on_msg = function(msg, sender){
        if (sender.url!=pac_url)
            return;
        switch (msg.id)
        {
        case 'log': console.log('pac.js:', msg.s); break;
        case 'init':
            browser.runtime.sendMessage(
                {id: 'init', json: E.pac_json, options: E.pac_options},
                {toProxyScript: true});
            break;
        }
    };
    chrome.proxy = {
        settings: {
            get: unimplemented_cb('get'),
            set: function(opt, cb){
                cb = cb||noop;
                if (!browser.runtime.onMessage.hasListener(on_msg))
                    browser.runtime.onMessage.addListener(on_msg);
                browser.proxy.register(pac_path).then(cb, cb);
            },
            clear: function(opt, cb){
                cb = cb||noop;
                if (browser.runtime.onMessage.hasListener(on_msg))
                    browser.runtime.onMessage.removeListener(on_msg);
                browser.proxy.unregister().then(cb, cb);
            },
            onChange: {
                addListener: unimplemented_cb('onChange.addListener'),
                removeListener: unimplemented_cb('onChange.removeListener'),
            },
        },
        uninstall_mock: function(){
            chrome.proxy.settings.clear();
            chrome.proxy = undefined;
        },

    };
}

E.set_pac_opt = function(json, options){
    E.pac_json = json;
    E.pac_options = options;
};

E.init = function(){
    E.uninit();
    if (conf.firefox_web_ext2)
        init_webext();
    else if (conf.firefox_web_ext)
        init_hybrid();
    else
        return;
    E.initialized = true;
};

E.uninit = function(){
    (chrome && chrome.proxy && chrome.proxy.uninstall_mock || noop)();
    E.initialized = false;
};

return E; });
