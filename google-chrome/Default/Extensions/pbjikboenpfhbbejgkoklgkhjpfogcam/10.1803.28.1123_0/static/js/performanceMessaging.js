(function(e){var t,n;if(typeof chrome!="undefined")n=chrome.runtime;else{if(typeof browser=="undefined")return;n=browser.runtime}t=function(e){return e&&typeof e.performanceType=="number"},n&&typeof n.sendMessage=="function"&&e&&typeof e.addEventListener=="function"&&e.addEventListener("message",function(e){if(!t(e.data))return;try{n.sendMessage(e.data)}catch(r){r.toString&&console.error("performanceMessaging.js runtime.sendMessage error: "+r.toString())}})})(window);