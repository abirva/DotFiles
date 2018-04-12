Registry.require(["crcrc","helper","layout/default/layout_helper"],function(){var l=Registry.get("crcrc").cr,k=Registry.get("crcrc").crc,p=Registry.get("helper"),r=Registry.get("layout/default/layout_helper").images,m=function(b,a,c,f,d,e){b=k("i","far fa-"+b,a,c,f,!0);b.alt=d?b.title=d:a||f||c;b.key=c;b.name=a;e&&(a=b.getAttribute("class")||"",b.setAttribute("class",a+" clickable"),b.addEventListener("click",e),b.href="#");return b},q=function(b,a,c){var f=(a.uuid?a.uuid:"")+a.id,d=l("div",a.name,
f,"input");d.key=a.id;var e=l("input",a.name,f,"input",!0);b=b.split("##");e.name=a.name;e.uuid=a.uuid;e.key=a.id;e.oldvalue=a.value;e.value=void 0!=a.value?a.value:"";e.type="text";e.setAttribute("spellcheck","false");c&&!e.inserted&&e.addEventListener("change",c);c=k("span","optiondesc",a.name,f,"s1");f=l("span",a.name,f,"s2");c.textContent=b[0]+":";1<b.length&&(f.textContent=b[1]);d.appendChild(c);d.appendChild(e);d.appendChild(f);a.enabledBy&&d.setAttribute("name","enabled_by_"+a.enabledBy);return{elem:d,
input:e}},u=function(b,a,c){b=null;b=k("input","button",a.name,(a.uuid?a.uuid:"")+a.id,"bu",!0);b.name=a.name;b.uuid=a.uuid;b.key=a.id;b.type="button";b.value=a.name;b.data=a.data;b.reload=a.reload;b.ignore=a.ignore||a.reload;b.warning=a.warning;a.enabledBy&&b.setAttribute("name","enabled_by_"+a.enabledBy);!b.inserted&&c&&b.addEventListener("click",c);return b},v=function(b,a,c,f){var d=null,d=k("input","button",b,a,"bu",!0);d.name=b;d.key=a;d.type="button";d.value=c;!d.inserted&&f&&d.addEventListener("click",
f);return d},t=function(b,a){var c=(b.uuid?b.uuid:"")+b.id,f,d;if(d=b.after||b.validation){f=b.validation?"validation":"help";a&&(f+=" clickable");f=k("span",f,b.name,c,f,!0);if(d.image){var c=m(r.get(d.image),c,"after_icon"),e=[];d.opacity&&e.push("opacity: "+d.opacity);c.setAttribute("style",e.join(";"));f.appendChild(c)}f&&(a&&f.addEventListener("click",a),d.msg&&f.setAttribute("title",d.msg))}return f},w=function(b){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[b]||b},n=function(b,a,c,f){var d=(f.uuid?
f.uuid:"")+f.id;a.title=b;(b=t({after:{image:"help"},name:f.name,id:d}))&&c.appendChild(b)};Registry.register("layout/default/htmlutil","5665",{getInfoFromUrl:function(b){if(-1!=b.search(/\/\^?(http(s|s\?|\.\+)?|\.\*):\/\/(\.\*)*\$?\/?$/)||-1!=b.search(/htt(ps|p):\/\/(\*\/\*|\*)*$/)||-1!=b.search(/\*:\/\/(\*\/\*|\*)*$/)||"*"==b)return{dom:"*",tld:"*"};0==b.search(/\//)&&(b=b.replace(/\([^\)]*\)[\?|\+|\*|\{[^\}]*]*/g,""),b=b.replace(/\[[^\]]*\][\?|\+|\*|\{[^\}]*]*/g,""),b=b.replace(/^\/|\/$|\^|\$|\\\?.*|#.*|\?|\(|\)|\+|\\|\.\*|/g,
""));b=b.replace(/^\*:\/\//,"http://");0!=b.search("http")&&(b="http://"+b);b=b.split("/");if(3>b.length)return null;b=b[2].split(".");if(2>b.length)return null;var a=b[b.length-1],c=b[b.length-2];"*"!==c&&(c=c.replace(/\*/g,""));for(var f=[],d=b.length-3;0<=d&&-1==b[d].search("\\*");d--)f.push(b[d]);return{tld:a,dom:c,subdom:f.reverse()}},getValue:function(b){var a=b.value;if("native"===b.valtype)if("undefined"===a)a=void 0;else if("null"===a)a=null;else try{a=JSON.parse(a)}catch(c){}return a},safeTagsReplace:function(b){return b.replace(/[&<>]/g,
w)},addClass:function(b,a){var c=b.getAttribute("class")||"";-1==c.search(new RegExp("[ \t]*"+a+"[ \t]*"))&&(c=(c?c+" ":"")+a);b.setAttribute("class",c)},toggleClass:function(b,a){var c=b.getAttribute("class")||"",f=new RegExp("[ \t]*"+a+"[ \t]*"),c=-1!=c.search(f)?c.replace(f,""):(c?c+" ":"")+a;b.setAttribute("class",c)},setHelp:n,createAfterIcon:t,createEnabler:function(b,a,c,f,d){var e=f.disabled,h=f.title,g=k("div","enabler "+b,a,c+"_enabler",f.append,"wrap",!0);b=k("i","far fa-toggle-on on green",
a,c+"toggle-on");f=k("i","far fa-toggle-on fa-flip-horizontal off greyed",a,c+"toggle-off");g.appendChild([b,f]);h&&(g.title=h);g.key=c;g.uuid=a;e||g.addEventListener("click",function(){$(g).hasClass("enabler_enabled")?$(g).removeClass("enabler_enabled"):$(g).addClass("enabler_enabled");d&&window.setTimeout(function(){d.call(g)},100)});return g},createImage:function(b,a,c,f,d,e){var h=k("img","icon16",a,c,f,!0);h.setAttribute("src",b);e&&(b=h.getAttribute("class")||"",h.setAttribute("class",b+" clickable"));
h.alt=d?h.title=d:a||f||c;h.key=c;h.name=a;e&&(h.addEventListener("click",e),h.href="#");return h},createIcon:m,createFavicon:function(b,a,c,f){var d=k("img","icon16",a,c,p.filter(f,/[a-zA-Z0-9]/g));if(d.inserted)return d;"Array"!==p.toType(b)&&(b=[b]);var e=function(){if(0!=b.length){var e=b.shift();"function"==typeof e?window.setTimeout(function(){d.parentNode&&(d.parentNode.insertBefore(m(e(),a+"_ico",c,f),d),d.parentNode.removeChild(d))},1):(d.setAttribute("src",e),d.setAttribute("async","true"))}};
d.addEventListener("error",e);e();d.alt=f?d.title=f:a;return d},createFileInput:function(b,a,c){b=k("input","import","file",null,null,!0);b.inserted||(b.type="file",c&&b.addEventListener("change",c));return b},createNamedSettings:function(b,a,c){var f=(a.uuid?a.uuid:"")+a.id,d=k("div","settingsta",a.name,f,"named_wrapper"),e=k("div","named",a.name,f,"named_settings"),h=[],g=l("span",a.name,f,"s1");b&&(g.textContent=b+":");a.desc&&n(a.desc,g,g,a);d.appendChild(g);d.appendChild(e);d.key=a.id;a.value.forEach(function(b){var d=
k("div","",a.name+b.name,f,"named",!0),g=k("div","",a.name+b.name,f,"named_label",!0);g.textContent=b.name;d.appendChild(g);g=l("textarea",a.name+b.name,f,"textarea",!0);g.setAttribute("spellcheck","false");g.name=a.name;g.key=a.id;g.named_name=b.name;g.uuid=a.uuid;g.named=!0;g.oldvalue=b.value||"";g.value=b.value||"";c&&!g.inserted&&g.addEventListener("change",c);d.appendChild(g);e.appendChild(d);h.push(g)});return{elem:d,textareas:h,label:g}},createTextarea:function(b,a,c){var f=(a.uuid?a.uuid:
"")+a.id,d=l("div",a.name,f,"textarea");d.key=a.id;var e=k("textarea","settingsta",a.name,f,"textarea",!0);e.setAttribute("spellcheck","false");e.name=a.name;e.key=a.id;e.uuid=a.uuid;e.array=a.array;e.oldvalue=a.value;e.value=void 0!=a.value?a.array?a.value.join("\n"):a.value:"";c&&!e.inserted&&e.addEventListener("change",c);c=l("span",a.name,f,"s1");b&&(c.textContent=b+":");a.desc&&n(a.desc,c,c,a);d.appendChild(c);d.appendChild(e);return{elem:d,textarea:e,label:c}},createFileSelect:function(b,a,
c){var f=(a.uuid?a.uuid:"")+a.id,d=l("input",a.name,f,"file"),e=function(a){c(a.target.files)};d.inserted||(d.type="file",d.addEventListener("change",e,!1));return b?(e=l("div",a.name,f,"input"),a=l("span",a.name,f,"s1"),a.textContent=b+":",e.appendChild(a),e.appendChild(d),{elem:e,input:d}):{elem:d}},createInput:q,createColorChooser:function(b,a,c){var f=(a.uuid?a.uuid:"")+a.id;b=q(b,a,c);var d=function(){c&&c.apply(this,arguments);var a=(this.value.match(/[a-fA-F0-9]+/)||"")[0];a&&-1!=[3,6].indexOf(a.length)&&
e.setAttribute("style","background-color: #"+a+";")};b.input.inserted||b.input.addEventListener("keyup",d);var e=k("span","color_choosed",a.name,f,"col");b.col=e;b.elem.appendChild(b.col);d.call(b.input);return b},createPassword:function(b,a,c){b=q(b,a,c);b.input.setAttribute("type","password");return b},createCheckbox:function(b,a,c){var f=(a.uuid?a.uuid:"")+a.id,d=k("div","checkbox",a.name,f,"cb1");d.key=a.id;var e=l("input",a.name,f,"cb",!0);e.title=a.desc?a.desc:"";e.name=a.name;e.uuid=a.uuid;
e.key=a.id;e.reload=a.reload;e.warning=a.warning;e.oldvalue=a.enabled;e.checked=a.enabled;e.type="checkbox";e.valtype="boolean";c&&!e.inserted&&e.addEventListener("click",c);c=k("span","checkbox_desc",a.name,f,"cb2");c.textContent=b;a.desc&&n(a.desc,d,c,a);d.appendChild(e);d.appendChild(c);return{elem:d,input:e}},createDropDown:function(b,a,c,f,d){var e=(a.uuid?a.uuid:"")+a.id,h=l("div",a.name,e,"outer_dd");h.key=a.id;var g=l("select",a.name,e,"dd",!0),m=!1;c&&Object.keys(c).forEach(function(b){var d=
l("option",a.name,c[b].name,"dd"+e,!0);d.textContent=p.decodeHtml(c[b].name);d.value=c[b].value;d.warning=c[b].warning;m|=!!c[b].warning;c[b].enabledBy&&d.setAttribute("name","enabled_by_"+c[b].enabledBy);a.enabler&&c[b].enable&&d.setAttribute("enables",JSON.stringify(c[b].enable));c[b].value==a.value&&(d.selected=!0);g.appendChild(d)});g.key=a.id;g.name=a.name;g.uuid=a.uuid;g.reload=a.reload;g.warning=a.warning;g.oldvalue=a.value;g.valtype="native";g.inserted||(f&&g.addEventListener("change",f),
m&&d&&g.addEventListener("change",d));null!==b&&(f=k("span","optiondesc",a.name,e,"inner_dd"),f.textContent=b+": ",h.appendChild(f));h.appendChild(g);a.desc&&n(a.desc,h,h,a);a.enabledBy&&h.setAttribute("name","enabled_by_"+a.enabledBy);return{elem:h,select:g}},createImageButton:function(b,a,c,f,d){var e=null,h=null,g=null,e=k("button","imgbutton button",b,a,"bu",!0),h=k("div","imgbutton_container",b,a,"bu_container");h.appendChild(e);e.uuid=b;e.key=a;g=k("i","imgbutton_image far fa-"+f,b,a,"bu_img",
!0);e.appendChild(g);e.title=g.title=g.alt=c;!e.inserted&&d&&e.addEventListener("click",d);return h},createImageTextButton:function(b,a,c,f,d){var e=k("button","button imgtextbutton",b,a+c,"itb",!0);e.key=a;e.uuid=b;f&&(f=m(r.get(f),b,a+c+"itb",f),e.appendChild(f));b=l("span",b,a+c,"itb");b.textContent=c;e.appendChild(b);d&&e.addEventListener("click",d);return e},createButton:function(b,a,c,f){return"Object"===p.toType(a)?u.apply(this,arguments):v.apply(this,arguments)},createPosition:function(b,
a,c){for(var f=(a.uuid?a.uuid:"")+a.id,d=l("div",a.name,f,"pos1"),e=l("select",a.name,f,"pos",!0),h=1;h<=a.posof;h++){var g=l("option",a.name,f,"opt"+h);g.textContent=h;h==a.pos&&(g.selected=!0);e.appendChild(g)}e.key=a.id;e.uuid=a.uuid;e.name=a.name;c&&!e.inserted&&e.addEventListener("change",c);a=k("span","optiondesc",a.name,f,"pos2");a.textContent=b;d.appendChild(a);d.appendChild(e);return d},createSearchBox:function(b){var a=k("div","searchbox","search_inner"),c=k("div","searchbox_mv","search_inner_mv"),
f=k("input","searchbox_input","search_input"),d=k("input","searchbox_button","search_button");f.type="text";f.setAttribute("spellcheck","false");f.value=b;d.type="button";d.value="Go";var e=function(){window.location=window.location.origin+window.location.pathname+"?url="+encodeURIComponent(f.value)};d.addEventListener("click",e);f.addEventListener("keyup",function(a){a&&13==a.keyCode&&e()});c.appendChild(f);c.appendChild(d);a.appendChild(c);return a},isScrolledIntoView:function(b,a){var c=$(b),f=
$(window),d=a&&a.padding||0,e=f.scrollTop(),f=e+f.height(),h=c.offset().top;return h+c.height()<=f-d&&h>=e+d}})});