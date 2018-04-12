'use strict';(function(c){"object"==typeof exports&&"object"==typeof module?c(require("../../lib/codemirror"),require("./searchcursor"),require("../dialog/dialog")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","./searchcursor","../dialog/dialog"],c):c(CodeMirror)})(function(c){function w(a,b){"string"==typeof a?a=new RegExp(a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),b?"gi":"g"):a.global||(a=new RegExp(a.source,a.ignoreCase?"gi":"g"));return{token:function(b){a.lastIndex=
b.pos;var e=a.exec(b.string);if(e&&e.index==b.pos)return b.pos+=e[0].length||1,"searching";e?b.pos=e.index:b.skipToEnd()}}}function y(){this.overlay=this.posFrom=this.posTo=this.lastQuery=this.query=null}function k(a){return a.state.search||(a.state.search=new y)}function m(a){return"string"==typeof a&&a==a.toLowerCase()}function l(a,b,c){return a.getSearchCursor(b,c,m(b))}function z(a,b,c,e,d){a.openDialog(b,e,{value:c,selectValueOnOpen:!0,closeOnEnter:!1,onClose:function(){h(a)},onKeyDown:d})}function r(a,
b,c,e,d){a.openDialog?a.openDialog(b,d,{value:e,selectValueOnOpen:!0}):d(prompt(c,e))}function A(a,b,c,e){if(a.openConfirm)a.openConfirm(b,e);else if(confirm(c))e[0]()}function t(a){var b=a.match(/^\/(.*)\/([a-z]*)$/);if(b)try{a=new RegExp(b[1],-1==b[2].indexOf("i")?"":"i")}catch(c){}if("string"==typeof a?""==a:a.test(""))a=/x^/;return a}function n(a,b,c){b.queryText=c;b.query=t(c);a.removeOverlay(b.overlay,m(b.query));b.overlay=w(b.query,m(b.query));a.addOverlay(b.overlay);a.showMatchesOnScrollbar&&
(b.annotate&&(b.annotate.clear(),b.annotate=null),b.annotate=a.showMatchesOnScrollbar(b.query,m(b.query)))}function g(a,b,x,e){var d=k(a);if(d.query)return p(a,b);var q=a.getSelection()||d.lastQuery||"";if(x&&a.openDialog){var f=null,g=function(b,e){c.e_stop(e);b&&(b!=d.queryText&&(n(a,d,b),d.posFrom=d.posTo=a.getCursor()),f&&(f.style.opacity=1),p(a,e.shiftKey,function(b,d){var c;3>d.line&&document.querySelector&&(c=a.display.wrapper.querySelector(".CodeMirror-dialog"))&&c.getBoundingClientRect().bottom-
4>a.cursorCoords(d,"window").top&&((f=c).style.opacity=.4)}))};z(a,'<span class="CodeMirror-search-label">Search:</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',q,g,function(b,d){var e=c.keyName(b),f=c.keyMap[a.getOption("keyMap")][e];f||(f=a.getOption("extraKeys")[e]);if("findNext"==f||"findPrev"==f||"findPersistentNext"==f||"findPersistentPrev"==f)c.e_stop(b),n(a,
k(a),d),a.execCommand(f);else if("find"==f||"findPersistent"==f)c.e_stop(b),g(d,b)});e&&q&&(n(a,d,q),p(a,b))}else r(a,'<span class="CodeMirror-search-label">Search:</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',c.I18N.getMessage("Search_for")+":",q,function(c){c&&!d.query&&a.operation(function(){n(a,d,c);d.posFrom=d.posTo=a.getCursor();p(a,b)})})}function p(a,b,g){a.operation(function(){var e=
k(a),d=l(a,e.query,b?e.posFrom:e.posTo);if(!d.find(b)&&(d=l(a,e.query,b?c.Pos(a.lastLine()):c.Pos(a.firstLine(),0)),!d.find(b)))return;a.setSelection(d.from(),d.to());a.scrollIntoView({from:d.from(),to:d.to()},20);e.posFrom=d.from();e.posTo=d.to();g&&g(d.from(),d.to())})}function h(a){return a.operation(function(){var b=k(a);if(b.lastQuery=b.query)return b.query=b.queryText=null,a.removeOverlay(b.overlay),b.annotate&&(b.annotate.clear(),b.annotate=null),!0})}function u(a,b,c){a.operation(function(){for(var e=
l(a,b);e.findNext();)if("string"!=typeof b){var d=a.getRange(e.from(),e.to()).match(b);e.replace(c.replace(/\$(\d)/g,function(a,b){return d[b]}))}else e.replace(c)})}function v(a,b){if(!a.getOption("readOnly")){var g=a.getSelection()||k(a).lastQuery||"",e=(b?c.I18N.getMessage("Replace_all"):c.I18N.getMessage("Replace"))+":";r(a,e+' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',
e,g,function(d){d&&(d=t(d),r(a,'<span class="CodeMirror-search-label">With:</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/>',c.I18N.getMessage("Replace_with")+":","",function(e){if(b)u(a,d,e);else{h(a);var f=l(a,d,a.getCursor("from")),g=function(){var b=f.from(),h;if(!(h=f.findNext())&&(f=l(a,d),!(h=f.findNext())||b&&f.from().line==b.line&&f.from().ch==b.ch))return;a.setSelection(f.from(),f.to());a.scrollIntoView({from:f.from(),to:f.to()});window.setTimeout(function(){A(a,
'<span class="CodeMirror-search-label">Replace?</span> <button>Yes</button> <button>No</button> <button>All</button> <button>Stop</button>',c.I18N.getMessage("Replace_"),[function(){k(h)},g,function(){u(a,d,e)}])},1)},k=function(a){f.replace("string"==typeof d?e:e.replace(/\$(\d)/g,function(b,c){return a[c]}));g()};g()}}))})}}c.commands.find=function(a){h(a);g(a)};c.commands.findPersistent=function(a){h(a);g(a,!1,!0)};c.commands.findPersistentNext=function(a){g(a,!1,!0,!0)};c.commands.findPersistentPrev=
function(a){g(a,!0,!0,!0)};c.commands.findNext=g;c.commands.findPrev=function(a){g(a,!0)};c.commands.clearSearch=h;c.commands.replace=v;c.commands.replaceAll=function(a){v(a,!0)}});