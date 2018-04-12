// (c) 2013 Rob Wu <rob@robwu.nl>

/* globals needContentScript, getContentScriptEnv,
           optional_sites, requestPermissionFor,
           optional_sites_match_patterns, optional_sites_url_filters */

// Depends on optional_origins.js

// Add content scripts to optional sites.
// Chrome 23+ does not require the "tabs" permission :)
var insertOptionalContentScriptInTabIfNeeded = function(tabId) {
    // Insert light-weight test.
    // If first time, then "_optHasRun" is undefined, and the URL is returned.
    // On subsequent calls,"!_optHasRun" is false, so the result is 0
    // On failure, the result is null
    chrome.tabs.executeScript(tabId, {
        code: 'if(!window._optHasRun)window._optHasRun=location.href;else{0;}',
        allFrames: true,
        runAt: 'document_start'
    }, function(results) {
        // Don't flood the console with errors in Chrome 36+: http://crbug.com/362625
        if (chrome.runtime && chrome.runtime.lastError || !results) return;
        if (results.some(needContentScript)) {
            // At least one URL matches. Try to insert content script.
            chrome.tabs.executeScript(tabId, {
                file: 'yt_lyrics.js',
                allFrames: true,
                runAt: 'document_start'
            }, function() {
                /* jshint expr:true */
                // Prevent flood of errors in Chrome 36+. Note that this race condition
                // only occurs when the user unloads the tab between the executeScript
                // calls.
                chrome.runtime.lastError;
            });
        } else if (results[0] === 0) {
            // Chrome bug #231075: Page Action disappears for history.pushState / replaceState
            // https://code.google.com/p/chromium/issues/detail?id=231075
            // Ping the page...
            chrome.tabs.sendMessage(tabId, 'crbug#231075');
        }
    });
};
if (chrome.webNavigation) {
    useWebNavigationAPI();
} else {
    useTabsAPI();
}

if (chrome.declarativeContent) {
    registerPageActionHandlerForDeclarativePageAction();
    chrome.runtime.onInstalled.addListener(registerDeclarativeContentRules);
    chrome.permissions.onAdded.addListener(function(permissions) {
        for (var i = 0; i < optional_sites_match_patterns.length; ++i) {
            var match_pattern = optional_sites_match_patterns[i];
            if (permissions.origins.indexOf(match_pattern) >= 0) {
                // The site is no longer optional. Refresh the rules for the optional
                // sites, i.e. remove the no-longer-optional site so that the visibility
                // of the page action is entirely controlled by the content script.
                registerDeclarativeContentRules();
                break;
            }
        }
    });
}

function useWebNavigationAPI() {
    // If available (i.e. if permission has been granted), use the webNavigation API.
    // With this API, the event page doesn't get activated as often as the alternative,
    // using the tabs API.
    chrome.webNavigation.onCommitted.addListener(function(details) {
        var site = getContentScriptEnv(details.url);
        // Name of preference that controls whether a source needs to be activated.
        // This preference is also checked in the content script, but why bother inserting the
        // content script if it's known that the site does not need to be activated?
        var key = 'enabled.' + site;
        chrome.storage.local.get(key, function(items) {
            if (items[key]) {
                insertOptionalContentScriptInTabIfNeeded(details.tabId);
            }
        });
    }, {
        url: optional_sites_url_filters
    });
    chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
        // Deal with http://crbug.com/231075
        chrome.tabs.sendMessage(details.tabId, 'crbug#231075');
    }, {
        url: optional_sites_url_filters
    });
}
function useTabsAPI() {
    // When webNavigation has not been granted, use the inferior but still functional tabs API.

    // Check whether any site was activated before.
    // For new installations, the webNavigation permission will automatically be requested,
    // so the onUpdated event is unnecessary.
    var hasAnyPermission = false;
    optional_sites_match_patterns.forEach(function(match_pattern) {
        chrome.permissions.contains({
            origins: [match_pattern]
        }, function(hasPermission) {
            if (hasPermission && !hasAnyPermission) {
                hasAnyPermission = true;
                chrome.tabs.onUpdated.addListener(insertOptionalContentScriptInTabIfNeeded);
            }
        });
    });
    chrome.permissions.onAdded.addListener(function(permissions) {
        if (permissions.permissions && permissions.permissions.indexOf('webNavigation') >= 0) {
            chrome.tabs.onUpdated.removeListener(insertOptionalContentScriptInTabIfNeeded);
            if (chrome.webNavigation) {
                useWebNavigationAPI();
            } else {
                // This is a bug in Chrome. chrome.webNavigation is somehow unavailable.
                // I found a work-around (https://crbug.com/435141#c6), but in case the work-around
                // does not work, reload the page.
                console.warn('Chrome is too buggy, reloading page to get webNavigation...');
                location.reload();
            }
        } else if (permissions.origins && !hasAnyPermission) {
            for (var i = 0; i < optional_sites_match_patterns.length; ++i) {
                var match_pattern = optional_sites_match_patterns[i];
                if (permissions.origins.indexOf(match_pattern) >= 0) {
                    hasAnyPermission = true;
                    chrome.tabs.onUpdated.addListener(insertOptionalContentScriptInTabIfNeeded);
                    break;
                }
            }
        }
    });
}

// Show page action icon on sites without permission.
// This method can be called multiple times, previous rules will be cleared.
function registerDeclarativeContentRules() {
    var conditions = [];
    var sites = Object.keys(optional_sites);
    var i = 0;
    sites.forEach(function(site) {
        var match_pattern = optional_sites[site][1];
        var url_filters = optional_sites[site][2];
        var key = 'enabled.' + site;
        chrome.permissions.contains({
            origins: Array.isArray(match_pattern) ? match_pattern : [match_pattern]
        }, function(hasPermission) {
            if (hasPermission) {
                done();
                return;
            }
            chrome.storage.local.get(key, function(items) {
                if (items[key] === false) {
                    done();
                    return;
                }
                url_filters.forEach(function(url_filter) {
                    conditions.push(new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: url_filter
                    }));
                });
                done();
            });
        });
    });
    function done() {
        if (++i < sites.length)
            return;

        chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            if (conditions.length === 0)
                return;

            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: conditions,
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);

        });
    }
}
function registerPageActionHandlerForDeclarativePageAction() {
    chrome.pageAction.onClicked.addListener(function(tab) {
        if (!needContentScript(tab.url))
            return;
        var site = getContentScriptEnv(tab.url);
        var site_name = optional_sites[site][0];
        var match_pattern = optional_sites[site][1];
        chrome.permissions.contains({
            origins: Array.isArray(match_pattern) ? match_pattern : [match_pattern]
        }, function(hasPermission) {
            if (hasPermission)
                return;
            requestPermissionFor(site, {
                tabId: tab.id,
                url: tab.url
            }, function(isGranted) {
                if (!isGranted)
                    return;
                var pref = {};
                pref['enabled.' + site] = true;
                pref[site + '-autolaunch'] = true;
                chrome.storage.local.set(pref, function() {
                    // Insert the content script. The panel should automatically be shown
                    // because if the user has not approved nor denied access to the site,
                    // then the default action is taken (i.e. showing the panel if possible).
                    chrome.tabs.executeScript(tab.id, {
                        file: 'yt_lyrics.js',
                        allFrames: true,
                        runAt: 'document_start'
                    }, function() {
                        if (chrome.runtime.lastError)
                            return;
                        chrome.tabs.executeScript({
                            code: '(' + contentscript_on_approved + ')(' + JSON.stringify(site_name) +  ')',
                            runAt: 'document_start'
                        });
                    });
                    registerDeclarativeContentRules();
                });
            });
        });
    });

    // To be inserted as a content script when a permission has been approved for the first time.
    var contentscript_on_approved = function(site_name) {
        var div = document.createElement('div');
        div.style.cssText =
            'position:fixed;top:0;left:0;right:0;padding:30px;text-align:center;' +
            'z-index:2000000002;pointer-events:none;font-size:16px;font-family:sans-serif;' +
            'opacity:1;transition:opacity 1s ease-out;';
        div.innerHTML =
            '<div style="display:inline-block;pointer-events:auto;white-space:pre-wrap;' +
            'padding:1.5em;border:1px solid black;background-color:#FFF;color:#000;"></div>';
        div.firstChild.textContent =
            'Lyrics Here is now active on ' + site_name + '!\n' +
            'Play some music and the lyrics will automatically be shown.';
        div.addEventListener('transitionend', function() {
            if (div.style.opacity == '0')
                div.remove();
        });
        document.body.appendChild(div);
        var timer = setTimeout(setOpacityTo0, 5000);
        div.onmouseenter = function() {
            div.style.transitionProperty = 'none';
            div.style.opacity = '1';
            div.style.transitionProperty = 'opacity';
            clearTimeout(timer);
        };
        div.onmouseleave = function() {
            clearTimeout(timer);
            timer = setTimeout(setOpacityTo0, 3000);
        };
        function setOpacityTo0() {
            div.style.opacity = '0';
        }
    };
}
