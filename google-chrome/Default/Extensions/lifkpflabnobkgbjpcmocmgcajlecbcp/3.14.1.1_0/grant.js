// (c) 2013 Rob Wu <rob@robwu.nl>

/* globals optional_origins, optional_sites, getChromePermissions */

var identifier = location.search.slice(1);
if (identifier != 'all' && identifier != 'all-lyrics' && !optional_origins[identifier])
    throw new Error('Cannot find the permissions for ' + identifier);

var $ = document.querySelector.bind(document);

// Optional source or site?
var siteName = optional_sites[identifier] && optional_sites[identifier][0];
if (siteName) {
    // Site
    document.title = 'Enable Lyrics for  ' + siteName;
    $('#hint-site .identifier').textContent = siteName;
    $('#hint').classList.add('type-site');
} else if (identifier == 'all-lyrics' || identifier == 'all') {
    // All known sources
    document.title = 'Allow access to all known lyrics/music sites';
    $('#hint-source .identifier').textContent = 'all known lyrics/music sites';
    $('#hint').classList.add('type-source');
} else {
    // Source
    document.title = 'Add source: ' + identifier;
    $('#hint-source .identifier').textContent = identifier;
    $('#hint').classList.add('type-source');
}

var optionalPermissions = getChromePermissions(identifier);
function requestPermissions(optionalPermissions) {
    chrome.permissions.request(optionalPermissions, function(granted) {
        if (granted) {
            window.close();
        } else {
            $('#hint').innerHTML = 'The permission was not granted.<br>Do you want to try again?';
            $('#yes').textContent = 'Retry';
        }
    });
}
$('#yes').onclick = function() {
    requestPermissions(optionalPermissions);
};
$('#yes').title = 'Allow the extension to access\n' +
          optionalPermissions.origins.map(function(origin) {
              return '    ' + origin.replace(/^[^:]+:\/\/|\/\*$/g, '');
          }).join('\n') + '.\n\nThis is asked only once.';
$('#no').onclick = function() {
    window.close();
};
$('#allow-all').onclick = function() {
    requestPermissions({
        permissions: optionalPermissions.permissions,
        origins: ['*://*/*']
    });
};
$('#yes').focus();
window.onkeydown = function(event) {
    if (event.keyCode === 27/*Esc*/ && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        window.close();
    }
};

(function() {
    // Not really functional, just to be fully transparent to the user
    // Shows where and by whom the permission was requested.
    var openerInfo = location.hash.slice(1);
    if (!openerInfo) return;
    openerInfo = JSON.parse(openerInfo);
    if (!openerInfo.url) return;

    var pathPosition = openerInfo.url.search(/\b\/(?!\/)/);
    if (pathPosition === -1) pathPosition = openerInfo.url.length;
    $('#opener-origin').textContent = openerInfo.url.slice(0, pathPosition);
    $('#opener-pathname').textContent = openerInfo.url.slice(pathPosition);

    $('#opener').title = '\nThis permission request was initiated at\n  ' +
                         openerInfo.url + '.\n' +
                         '\nClick to show this tab.';
    $('#opener').onclick = function() {
        chrome.tabs.update(openerInfo.tabId, {
            active: true
        }, function(tab) {
            if (!tab) {
                alert('The tab was not found. Did you close it?');
                return;
            }
            chrome.windows.update(tab.windowId, {
                focused: true
            });
        });
    };
    // Hide link to options page if initiated from options page
    $('#visit-options').hidden = /^https?:\/\/rob(wu|\.lekensteyn)\.nl\/(lyricshere|youtubelyrics)/.test(openerInfo.url);
})();
window.onhashchange = function() {
    location.reload();
};

document.body.classList.add('draw-attention');
