// (c) Rob Wu <rob@robwu.nl>
// https://robwu.nl/lyricshere/

var popOutPorts = [];

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === 'toggle-tinyIconDisabled') {
        toggleTinyIconDisabled(!info.checked);
        return;
    }
    // Originally, url = chrome.runtime.getURL('popup.html');
    // However, a user complained that they could not use the Google Translate
    // extension in this new window, even though it was possible in the in-page
    // lyrics panel. So I put in the efforts to host the popup window on my website,
    // so that other extensions can run content scripts there too.
    var url = 'https://robwu.nl/lyricshere/popup.html';
    var params = [];
    if (tab) {
        params.push('openerTab=' + tab.id);
    }
    if (info.menuItemId === 'action-popout-local') {
        params.push('tabOnly');
    }
    if (params.length) {
        url += '?' + params.join('&');
    }
    chrome.storage.local.get('popupOffsets', function(items) {
        openPopup(url, items && items.popupOffsets || {});
    });
});

function openPopup(url, popupOffsets) {
    // Slightly bigger than the default lyrics panel width.
    // Also big enough so that the permission dialog is visible.
    // Also big enough so that the Google Translate extension can
    //  show a 400px wide widget upon text selection.
    var windowWidth = 420;
    if (popupOffsets.width > 0) {
        windowWidth = popupOffsets.width;
    }
    windowWidth = Math.min(windowWidth, screen.availWidth);

    var windowHeight = 600;
    if (popupOffsets.height > 0) {
        windowHeight = popupOffsets.height;
    }
    windowHeight = Math.min(windowHeight, screen.availHeight);

    var topOffset = popupOffsets.top;
    if (typeof topOffset !== 'number') {
        // Align to top of the current screen.
        topOffset = screen.top || 0;
    }

    var leftOffset = popupOffsets.left;
    if (typeof leftOffset !== 'number') {
        // Align to right of the current screen.
        leftOffset = screen.availWidth - windowWidth;
        leftOffset = Math.max(0, leftOffset);
        leftOffset += screen.left || 0;
    }

    // No need to validate whether the position is within bounds. If they are
    // out of bounds, then the popup will be shown at the edge of the screen.

    chrome.windows.create({
        url: url,
        type: 'popup',
        width: windowWidth,
        height: windowHeight,
        top: topOffset,
        left: leftOffset,
        // TODO: Use the incognito mode of the caller if I use split incognito
        // mode. Note that the current extension already uses anonymous requests
        // where possible, so even with spanning incognito mode, privacy is
        // mostly respected.
        // incognito: tab.incognito,
    }, function(win) {
        // Work-around for https://bugzil.la/1396881
        chrome.windows.update(win.id, {
            top: topOffset,
            left: leftOffset,
        });
    });
}

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        id: 'action-popout-all',
        title: 'Open new lyrics window (any song)',
        contexts: ['page_action'],
    });
    chrome.contextMenus.create({
        id: 'action-popout-local',
        title: 'Open new lyrics window (songs from this tab only)',
        contexts: ['page_action'],
    });
    chrome.storage.local.get('tinyIconDisabled', function(items) {
        chrome.contextMenus.create({
            type: 'checkbox',
            id: 'toggle-tinyIconDisabled',
            title: 'Show Lyrics Here button in the page',
            checked: !items || !items.tinyIconDisabled,
            contexts: ['page_action'],
        });
    });
});

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== 'popout-channel') {
        return;
    }
    var portCreatorUrl = port.sender.tab.url;
    port.openerTabId = +(/[?&]openerTab=(\d+)/.exec(portCreatorUrl) || [, '-1'])[1];
    port.tabOnly = /[&?]tabOnly($|&|#)/.test(portCreatorUrl);
    port.onDisconnect.addListener(function() {
        var i = popOutPorts.indexOf(port);
        if (i !== -1) {
            popOutPorts.splice(i, 1);
            popOutPortsChanged();
        }
    });
    port.onMessage.addListener(function(msg) {
        if (msg.type === 'getLyricsForPopup') {
            chrome.tabs.sendMessage(msg.tabId, 'getLyricsForPopup', function(lastQuery) {
                if (chrome.runtime.lastError) {
                    chrome.tabs.get(msg.tabId, function(tab) {
                        if (chrome.runtime.lastError || !tab) {
                            port.postMessage('onNoTab');
                        } else {
                            port.postMessage({
                                type: 'cannotConnectToTab',
                                tabId: msg.tabId,
                            });
                        }
                    });
                } else if (lastQuery) {
                    port.postMessage({
                        lyricsQuery: lastQuery,
                        tabId: msg.tabId,
                    });
                }
            });
        }
        if (msg.type === 'bringWindowAndTabToFront') {
            // From popup.
            bringWindowAndTabToFront(msg.tabId, function onNoTab() {
                port.postMessage('onNoTab');
            });
            return;
        }
    });

    popOutPorts.push(port);
    popOutPortsChanged();
});

chrome.runtime.onMessage.addListener(function(message, sender) {
    var tabId = sender.tab && sender.tab.id;
    if (message.lyricsQuery) {
        // From content script.
        message = {
            lyricsQuery: message.lyricsQuery,
            tabId: tabId,
        };
        popOutPorts.forEach(function(port) {
            port.postMessage(message);
        });
    }
    if (message === 'checkWatchingLyricsForPopup' && tabId) {
        sendWatchingLyricsForPopup(tabId);
    }
});

function popOutPortsChanged() {
    chrome.tabs.query({
    }, function(tabs) {
        tabs.forEach(function(tab) {
            sendWatchingLyricsForPopup(tab.id);
        });
    });
}

function countPopupsForTab(tabId) {
    return popOutPorts.filter(function(port) {
        return !port.tabOnly || port.openerTabId === tabId;
    }).length;
}

function sendWatchingLyricsForPopup(tabId) {
    if (countPopupsForTab(tabId)) {
        chrome.tabs.sendMessage(tabId, 'startWatchingLyricsForPopup', ignoreErrors);
    } else {
        chrome.tabs.sendMessage(tabId, 'stopWatchingLyricsForPopup', ignoreErrors);
    }
}

function ignoreErrors() {
    // jshint expr:true
    chrome.runtime.lastError;
}

function bringWindowAndTabToFront(tabId, onNoTab) {
    chrome.tabs.get(tabId, function(tab) {
        if (chrome.runtime.lastError || !tab) {
            onNoTab();
            return;
        }
        chrome.tabs.update(tabId, {
            active: true,
        });
        chrome.windows.get(tab.windowId, function(window) {
            var updateInfo = {
                focused: true,
            };
            if (window.state === 'minimized') {
                updateInfo.state = 'normal';
            }
            chrome.windows.update(tab.windowId, updateInfo);
        });
    });
}

function toggleTinyIconDisabled(tinyIconDisabled) {
    chrome.storage.local.set({
        tinyIconDisabled: tinyIconDisabled,
    });
    var msg = tinyIconDisabled ? 'disableTinyIcon' : 'enableTinyIcon';
    chrome.tabs.query({
    }, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, msg, ignoreErrors);
        });
    });
}
