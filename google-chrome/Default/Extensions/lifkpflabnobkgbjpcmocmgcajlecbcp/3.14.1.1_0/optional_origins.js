/* exported needContentScript, getContentScriptEnv, getChromePermissions, getPermissionIdentifier, isSearchEngine */
// Keep values in sync with manifest file
var optional_origins = {
    // 'source identifier': ['<match pattern>', 'permission']
    'letras.mus.br': '*://*.letras.mus.br/*',
    'vagalume.com.br': '*://www.vagalume.com.br/*',
    'lyricsmania.com': '*://www.lyricsmania.com/*',
    'darklyrics.com': '*://www.darklyrics.com/*',
    'metal-archives.com': '*://www.metal-archives.com/*',
    'musica.com': '*://www.musica.com/*',
    'shironet.mako.co.il': '*://shironet.mako.co.il/*',
    'angolotesti.it': '*://*.angolotesti.it/*',
    'paroles2chansons.com': ['*://*.paroles2chansons.com/*', '*://paroles2chansons.lemonde.fr/*'],
    'lyricsmode.com': '*://www.lyricsmode.com/*', // m.lyricsmode.com -> www.lyricsmode.com
    'genius.com': ['*://*.rapgenius.com/*', '*://*.genius.com/*'],
    'tekstowo.pl': '*://www.tekstowo.pl/*',
    'animelyrics.com': '*://www.animelyrics.com/*',
    'mojim.com': '*://*.mojim.com/*',
    'songmeanings.com': '*://songmeanings.com/*',
    'metrolyrics.com': '*://www.metrolyrics.com/*', // m.metrolyrics.com -> www.metrolyrics.com
    'songlyrics.com': '*://www.songlyrics.com/*',
    'songteksten.nl': '*://www.songteksten.nl/*',
    'stixoi.info': '*://www.stixoi.info/*',
    'plyrics.com': ['*://www.plyrics.com/*', '*://search.plyrics.com/*'],
    'guitarparty.com': '*://*.guitarparty.com/*',
    'lyrics.my': '*://www.lyrics.my/*',
    'lyricsmasti.com': '*://www.lyricsmasti.com/*',
    'hindilyrics.net': ['*://www.hindilyrics.net/*', '*://www.myhindilyrics.com/*'],
    'lyricsmint.com': '*://www.lyricsmint.com/*',
    'stlyrics.com': '*://www.stlyrics.com/*',
    'newreleasetuesday.com': ['*://www.newreleasetuesday.com/*', '*://www.newreleasetoday.com/*'],
    'karaoketexty.cz': '*://www.karaoketexty.cz/*',
    'supermusic.sk': ['*://www.supermusic.sk/*', '*://www.supermusic.eu/*', '*://www.supermusic.cz/*'],
    'tekstove.info': '*://tekstove.info/*',
    'paadalvarigal.com': '*://www.paadalvarigal.com/*',
    'tamillyrics.hosuronline.com': '*://tamillyrics.hosuronline.com/*',
    'siamzone.com': '*://www.siamzone.com/*',
    'songtexte.com': '*://www.songtexte.com/*',
    'kpoplyrics.net': '*://www.kpoplyrics.net/*',
    'lololyrics.com': ['*://api.lololyrics.com/*', '*://www.lololyrics.com/*'],
    'gasazip.com': ['*://gasazip.com/*', '*://new.gasazip.com/*', '*://www.gasazip.com/*'],
    'versuri.ro': '*://www.versuri.ro/*',
    'coveralia.com': '*://www.coveralia.com/*',
    'sarki.alternatifim.com': '*://sarki.alternatifim.com/*',
    'lirik.kapanlagi.com': '*://lirik.kapanlagi.com/*',
    'sing365.com': '*://www.sing365.com/*',
    'nashe.com.ua': '*://nashe.com.ua/*',
    'touhouwiki.net': '*://*.touhouwiki.net/*',
    'cmtv.com.ar': '*://*.cmtv.com.ar/*',
    'tekstovi.net': '*://tekstovi.net/*',
    'zeneszoveg.hu': '*://www.zeneszoveg.hu/*',
    'flashlyrics.com': '*://www.flashlyrics.com/*',
    'teksteshqip.com': '*://*.teksteshqip.com/*',
    'colorcodedlyrics.com': '*://colorcodedlyrics.com/*',
}; // end of optional_origins

// Well, at least one of them is not optional, or else most searches will fail ;)
var optional_search_engines = {
    'google.com': '*://www.google.com/*',
    'bing.com': '*://*.bing.com/*', // m.bing.com -> www.bing.com
    'yahoo.com': '*://search.yahoo.com/*', // search-only
    'duckduckgo.com': '*://duckduckgo.com/*',
    'qwant.com': '*://api.qwant.com/*', // search-only
    'startpage.com': '*://*.startpage.com/*', // search-only
    'ixquick.com': '*://*.ixquick.com/*', // Search-only
    'ixquick.eu': '*://*.ixquick.eu/*', // Search-only
};

// Where should the extension run?
var optional_sites = {
    // 'site identifier': ['Friendly display name', '<match pattern>', ['<events.UrlFilter>'*]]
    // '<match pattern>' is also allowed to be an array of match patterns.
    // UrlFilter is allowed to be stricter than the match pattern, because it can easily be
    // changed without any hassle (permission change = source must be disabled and new permissions
    // need to be requested).
    'spotify': ['Spotify', '*://*.spotify.com/*', [
        {hostEquals: 'play.spotify.com'},
        {hostEquals: 'player.spotify.com'},
        {hostEquals: 'open.spotify.com'},
    ]],
    'jango': ['Jango', '*://*.jango.com/*', [{hostSuffix: '.jango.com'}]],
    'accuradio': ['AccuRadio', '*://*.accuradio.com/*', [
        {hostEquals: 'www.accuradio.com'},
        {hostEquals: '2012.accuradio.com'},
    ]],
    'deezer': ['Deezer', '*://*.deezer.com/*', [
        {hostEquals: 'www.deezer.com'},
        {hostEquals: 'orange.deezer.com'},
    ]],
    '8tracks': ['8tracks', '*://*.8tracks.com/*', [{hostEquals: '8tracks.com'}]],
    'google-music': ['Google Music', ['*://play.google.com/*', '*://music.google.com/*'], [
        {hostEquals: 'play.google.com', pathPrefix: '/music'},
        // music.google.com currently redirects to play.google.com.
        // However, since it's a 302 redirect, it's conceivable that Google decides to
        // market Music.google.com instead of play.google.com/music, so add the pattern:
        {hostEquals: 'music.google.com'},
    ]],
    'iheart': ['iHeartRadio', '*://*.iheart.com/*', [{hostEquals: 'www.iheart.com'}]],
    'superplayer': ['Superplayer.fm', '*://*.superplayer.fm/*', [{hostEquals: 'www.superplayer.fm'}]],
    'last.fm': ['Last.fm', '*://*.last.fm/*', [
        {hostEquals: 'www.last.fm'},
        {hostEquals: 'cn.last.fm'},
    ]],
    'yandex-music': ['Yandex Music', [
        '*://music.yandex.ru/*',
        '*://music.yandex.by/*',
        '*://music.yandex.kz/*',
        '*://music.yandex.ua/*',
    ], [
        {hostEquals: 'music.yandex.ru'},
        {hostEquals: 'music.yandex.by'},
        {hostEquals: 'music.yandex.kz'},
        {hostEquals: 'music.yandex.ua'},
    ]],
    'qobuz': ['Qobuz', ['*://player.qobuz.com/*', '*://play.qobuz.com/*'], [
        {hostEquals: 'player.qobuz.com'},
        {hostEquals: 'play.qobuz.com'},
    ]],
    'soundcloud': ['SoundCloud', '*://soundcloud.com/*', [{hostEquals: 'soundcloud.com'}]],
    'saavn': ['Saavn', '*://www.saavn.com/*', [{hostEquals: 'www.saavn.com'}]],
    'pandora': ['Pandora', '*://www.pandora.com/*', [{hostEquals: 'www.pandora.com'}]],
    'bandcamp': ['Bandcamp', '*://*.bandcamp.com/*', [{hostSuffix: '.bandcamp.com'}]],
};
var optional_sites_match_patterns = [];
var optional_sites_url_filters = [];

function needContentScript(url) {
    var env = getContentScriptEnv(url);
    // Exclude YouTube because it is already declared in the manifest file.
    return env !== '' && env !== 'youtube';
}

function getContentScriptEnv(url) {
    // Keep in sync with musicSites.js
    var env = 
        /^https?:\/\/www\.youtube\.com\/(?![ve]\/)(?!embed\/)(?!dev(\/|$))/.test(url) ? 'youtube' :
        /^https?:\/\/(?:play(?:er)?|open)\.spotify\.com\//.test(url) ? 'spotify' :
        /^https?:\/\/[a-z.]+\.jango\.com\//.test(url) ? 'jango' :
        /^https?:\/\/(www|2012)\.accuradio\.com\//.test(url) ? 'accuradio' :
        /^https?:\/\/(www|orange)\.deezer\.com\//.test(url) ? 'deezer' :
        /^https?:\/\/8tracks\.com\//.test(url) ? '8tracks' :
        /^https?:\/\/(play\.google\.com\/music\/|music\.google\.com\/)/.test(url) ? 'google-music' :
        /^https?:\/\/www\.iheart\.com\//.test(url) ? 'iheart' :
        /^https?:\/\/www\.superplayer\.fm\//.test(url) ? 'superplayer' :
        /^https?:\/\/(www|cn)\.last\.fm\//.test(url) ? 'last.fm' :
        /^https?:\/\/music\.yandex\.(ru|by|kz|ua)\//.test(url) ? 'yandex-music' :
        /^https?:\/\/play(er)?\.qobuz\.com\//.test(url) ? 'qobuz' :
        /^https?:\/\/soundcloud\.com\//.test(url) ? 'soundcloud' :
        /^https?:\/\/www\.saavn\.com\//.test(url) ? 'saavn' :
        /^https?:\/\/www\.pandora\.com\//.test(url) ? 'pandora' :
        /^https?:\/\/([a-z0-9\-]+\.)?bandcamp\.com\//.test(url) ? 'bandcamp' :
        '';
    return env;
}

// optional_origins is used for permission requests. Merge optional_search_engines and optional_sites
// with optional_origins, to ease the permission request implementation.
Object.keys(optional_search_engines).forEach(function(se_id) {
    optional_origins[se_id] = optional_search_engines[se_id];
});
Object.keys(optional_sites).forEach(function(site) {
    var match_pattern = optional_sites[site][1];
    var url_filters = optional_sites[site][2];
    if (Array.isArray(match_pattern)) {
        optional_sites_match_patterns.push.apply(optional_sites_match_patterns, match_pattern);
        optional_origins[site] = match_pattern.concat('webNavigation');
    } else { // typeof match_pattern === 'string'
        optional_sites_match_patterns.push(match_pattern);
        optional_origins[site] = [match_pattern, 'webNavigation'];
    }
    optional_sites_url_filters.push.apply(optional_sites_url_filters, url_filters);
});

function isSearchEngine(identifier) {
    return !!optional_search_engines[identifier];
}

// Get a chrome.permissions#Permissions object for a given identifier
function getChromePermissions(identifier) {
    if (identifier == 'all' || identifier == 'all-lyrics') {
        return getAllOptionalChromePermissions(identifier);
    }
    var optional_permissions = optional_origins[identifier];
    if (!optional_permissions) return;
    if (!Array.isArray(optional_permissions)) {
        optional_permissions = [optional_permissions];
    }
    var permissions = {
        origins: [],
        permissions: []
    };
    for (var i = 0; i < optional_permissions.length; ++i) {
        var permission = optional_permissions[i];
        if (permission.indexOf('://') > 0) {
            permissions.origins.push(permission);
        } else {
            permissions.permissions.push(permission);
        }
    }
    return permissions;
}

// Get a chrome.permissions#Permissions object for all known optional permissions.
function getAllOptionalChromePermissions(identifier) {
    var excludeNonLyricSites = identifier == 'all-lyrics';
    var permissions = {
        origins: [],
        permissions: []
    };
    Object.keys(optional_origins).forEach(function(identifier) {
        if (excludeNonLyricSites && optional_sites[identifier]) {
            // if identifier != 'all', only return permissions that are
            // needed to access lyrics.
            return;
        }
        var optional_permissions = optional_origins[identifier];
        if (!Array.isArray(optional_permissions)) {
            optional_permissions = [optional_permissions];
        }
        for (var i = 0; i < optional_permissions.length; ++i) {
            var permission = optional_permissions[i];
            if (permission.indexOf('://') > 0) {
                if (permissions.origins.indexOf(permission) == -1) {
                    permissions.origins.push(permission);
                }
            } else {
                if (permissions.permissions.indexOf(permission) == -1) {
                    permissions.permissions.push(permission);
                }
            }
        }
    });
    return permissions;
}

function getPermissionIdentifier(url) {
    for (var se_id in optional_search_engines) {
        if (matchesPattern(se_id, optional_search_engines[se_id])) {
            return se_id;
        }
    }
    for (var identifier in optional_origins) {
        if (matchesPattern(identifier, optional_origins[identifier])) {
            return identifier;
        }
    }
    function matchesPattern(identifier, patterns) {
        if (!Array.isArray(patterns)) {
            patterns = [patterns];
        }
        for (var i = 0; i < patterns.length; ++i) {
            var pattern = patterns[i];
            if (matches_match_pattern(pattern, url)) {
                return true;
            }
        }
        return false;
    }
}

function matches_match_pattern(match_pattern, url) {
    var regexp = match_pattern_to_RegExp(match_pattern);
    return regexp.test(url);
}

function match_pattern_to_RegExp(match_pattern) {
    var R_INVALID = /.^/; // Non-matching regexp
    var regexp = '(?:^';
    var regEscape = function(s) {return s.replace(/[[^$.|?*+(){}\\]/g, '\\$&');};
    var result = /^(\*|https?|file|ftp|chrome-extension):\/\//.exec(match_pattern);

    // Parse scheme
    if (!result) {
        if (/:/.test(match_pattern)) console.warn('Invalid scheme in ' + match_pattern);
        return R_INVALID;
    }
    var match_pattern_part = match_pattern.substr(result[0].length);
    regexp += result[1] === '*' ? 'https?://' : result[1] + '://';

    // Parse host if scheme is not `file`
    if (result[1] !== 'file') {
        result = /^(?:\*|(\*\.)?([^\/*]+))(?=\/)/.exec(match_pattern_part);
        if (!result) {
            console.warn('Invalid host in ' + match_pattern);
            return R_INVALID;
        }
        match_pattern_part = match_pattern_part.substr(result[0].length);
        if (result[0] === '*') {    // host is '*'
            regexp += '[^/]+';
        } else {
            if (result[1]) {        // Subdomain wildcard exists
                regexp += '(?:[^/]+\\.)?';
            }
            // Append host (escape special regex characters)
            regexp += regEscape(result[2]);
        }
    }
    // Add remainder (path)
    regexp += match_pattern_part.split('*').map(regEscape).join('.*');
    regexp += '$)';
    return new RegExp(regexp, 'i');
}
