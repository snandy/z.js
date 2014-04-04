/*!
 * Z.js v0.1.0
 * @snandy 2014-04-04 14:27:44
 *
 */
~function(t,e){function n(t,e){return new n.prototype.init(t,e)}function r(t,e,n){if(null!=t)if(q&&t.forEach===q)t.forEach(e,n);else if(t.length===+t.length){for(var r=0;t.length>r;r++)if(e.call(n||t[r],t[r],r,t)===!0)return}else for(var i in t)if(e.call(n||t[i],t[i],i,t)===!0)return}function i(t,e,n){var i=[];return null==t?i:I&&t.map===I?t.map(e,n):(r(t,function(t,r,o){i[r]=e.call(n,t,r,o)}),i)}function o(t,e){return X.call(t,e||0)}function s(){return(new Date).getTime()}function a(t,e){for(var n;t&&(n=t[e])&&(1!==n.nodeType||"BR"===n.tagName);)t=n;return n}function u(t){return document.getElementById(t)}function c(t,e){if(!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var r,i=t.parentNode,o=!i;return o&&(i=J).appendChild(t),r=G(e,i),o&&J.removeChild(t),!!r.length}function l(t){return n.isWindow(t)?t:9===t.nodeType?t.defaultView||t.parentWindow:!1}function f(t,e,r,i){try{i=t.getBoundingClientRect()}catch(o){}if(!i||!n.contains(r,t))return i?{top:i.top,left:i.left}:{top:0,left:0};var s=e.body,a=l(e),u=r.clientTop||s.clientTop||0,c=r.clientLeft||s.clientLeft||0,f=a.pageYOffset||r.scrollTop||s.scrollTop,p=a.pageXOffset||r.scrollLeft||s.scrollLeft,h=i.top+f-u,d=i.left+p-c;return{top:h,left:d}}function p(t,e){var r=n(t),i=r.css("position");"static"===i&&(t.style.position="relative");var o,s,a=r.offset(),u=r.css("top"),c=r.css("left"),l=("absolute"===i||"fixed"===i)&&[u,c].join(",").indexOf("auto")>-1,f={},p={};l?(p=r.pos(),o=p.top,s=p.left):(o=parseFloat(u)||0,s=parseFloat(c)||0),null!=e.top&&(f.top=e.top-a.top+o),null!=e.left&&(f.left=e.left-a.left+s),r.css(f)}function h(t){return t.replace(/[A-Z]/g,function(t){return"-"+t.toLowerCase()})}function d(t,e){for(var n=0;t.length>n;n++)if(e(t[n],n)===!0)return}function m(){return!1}function v(){return!0}function y(t,e,n){if(t&&e)for(var r,e=E(e,t),i=e.type,o=t[ne],s=re[o],a=s.events,u=a[i],c=null,l=0;r=u[l++];)n&&(r.args=r.args.concat(n)),e.namespace?e.namespace===r.namespace&&(c=g(t,i,e,r)):c=g(t,i,e,r),c===!1&&(e.preventDefault(),e.stopPropagation())}function g(t,e,n,r){var i=r.args,o=r.stop,s=r.data,a=r.handler,u=r.prevent,c=r.context||t,l=r.stopBubble;return i[0]&&i[0].type===n.type?(i.shift(),i.unshift(n)):i.unshift(n),o&&(n.preventDefault(),n.stopPropagation()),u&&n.preventDefault(),s&&(n.data=s),l&&n.stopPropagation(),a.apply(c,i)}function b(t){this.handler=t.handler,this.one=t.one,this.delay=t.delay,this.debounce=t.debounce,this.immediate=t.immediate,this.throttle=t.throttle,this.context=t.context,this.stop=t.stop,this.prevent=t.prevent,this.stopBubble=t.stopBubble,this.data=t.data,this.args=t.args?t.args.length?t.args:[t.args]:[]}function T(t,e,r){var i=re[r],o=i.handle,s=i.events;delete s[e],fe(t,e,o),n.isEmptyObject(s)&&(delete i.elem,delete i.handle,delete i.events,delete re[r])}function x(t){var e;t.type?(this.originalEvent=t,this.type=t.type):t.indexOf(".")>-1?(e=t.split("."),this.type=e[0],this.namespace=e[1]):(this.type=t,this.namespace=""),this.timeStamp=s()}function E(t,n){var r,i,o=[],s=t;for(o=o.concat("altKey bubbles button cancelable charCode clientX clientY ctrlKey currentTarget".split(" ")),o=o.concat("data detail eventPhase fromElement handler keyCode layerX layerY metaKey".split(" ")),o=o.concat("newValue offsetX offsetY originalTarget pageX pageY prevValue relatedTarget".split(" ")),o=o.concat("screenX screenY shiftKey target toElement view wheelDelta which".split(" ")),t=new x(s),r=o.length;r;)i=o[--r],t[i]=s[i];if(t.target||(t.target=s.srcElement||n),3===t.target.nodeType&&(t.target=t.target.parentNode),!t.relatedTarget&&t.fromElement&&(t.relatedTarget=t.fromElement===t.target?t.toElement:t.fromElement),null==t.pageX&&null!=t.clientX){var a=document.documentElement,u=document.body;t.pageX=t.clientX+(a&&a.scrollLeft||u&&u.scrollLeft||0)-(a&&a.clientLeft||u&&u.clientLeft||0),t.pageY=t.clientY+(a&&a.scrollTop||u&&u.scrollTop||0)-(a&&a.clientTop||u&&u.clientTop||0)}return!t.which&&(t.charCode||0===t.charCode?t.charCode:t.keyCode)&&(t.which=t.charCode||t.keyCode),!t.metaKey&&t.ctrlKey&&(t.metaKey=t.ctrlKey),t.which||t.button===e||(t.which=1&t.button?1:2&t.button?3:4&t.button?2:0),t}function w(t,e,r){if(t&&3!==t.nodeType&&8!==t.nodeType&&e){var i,o,s,a,u=t[ne]=t[ne]||ee++,c=re[u]=re[u]||{},l=c.events,f=c.handle,p=0;if(n.isObject(e))for(o in e)w(t,o,e[o]);else{if(s=e.split(" "),n.isFunction(r))i=new b({handler:r});else{if(!n.isFunction(r.handler))return;i=new b(r)}for(r=i.handler,i.one&&(i.special=r,i.handler=se(r)),i.delay&&(i.special=r,i.handler=ae(r,i.delay)),i.debounce&&(i.special=r,i.handler=ue(r,i.debounce)),i.immediate&&(i.special=r,i.handler=ue(r,i.immediate,!0)),i.throttle&&(i.special=r,i.handler=ce(r,i.throttle)),l||(c.events=l={}),f||(c.handle=f=function(t){return y(c.elem,t)}),c.elem=t;o=s[p++];)o.indexOf(".")>-1?(a=e.split("."),o=a[0],i.namespace=a[1]):i.namespace="",handlers=l[o],handlers||(handlers=l[o]=[],le(t,o,f)),handlers.push(i);t=null}}}function O(t,n,r){if(t&&3!==t.nodeType&&8!==t.nodeType){var i=t[ne],o=i&&re[i],s=o&&o.events,a=s&&s[n];if(r)d(a,function(t,n){return t.handler===r||t.special===r?(a.splice(n,1),!0):e}),0===a.length&&T(t,n,i);else if(n)T(t,n,i);else for(var n in s)T(t,n,i)}}function j(t,e){if(t&&3!==t.nodeType&&8!==t.nodeType){var n=t[ne],r=n&&re[n],i=r&&r.events;i&&i[e];var s=o(arguments,2),a=arguments.length;if(1===a&&1===t.nodeType)for(var e in i)y(t,e,s);else y(t,e,s)}}function S(t){try{return JSON.parse(t)}catch(e){try{return Function("return "+t)()}catch(e){}}}function N(){}function C(t,r){n.isObject(t)&&(r=t,t=r.url),n.isFunction(r)&&(r={success:r});var i,o,s,r=r||{},a=r.async!==!1,u=r.method||"GET",c=r.type||"json",l=r.encode||"UTF-8",f=r.timeout||0,p=r.credential,h=r.data,d=r.scope,m=r.success||N,v=r.failure||N;return u=u.toUpperCase(),n.isObject(h)&&(h=n.param(h)),"GET"===u&&h&&(t+=(-1===t.indexOf("?")?"?":"&")+h),(i=pe())?(o=!1,a&&f>0&&(s=setTimeout(function(){o=!0,i.abort()},f)),i.onreadystatechange=function(){4===i.readyState&&(o?v(i,"request timeout"):(L(i,c,m,v,d),clearTimeout(s)))},i.open(u,t,a),p&&(i.withCredentials=!0),"POST"==u&&i.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset="+l),i.send(h),i):e}function L(t,n,r,i,o){var s,a=t.status;if(a>=200&&300>a){switch(n){case"text":s=t.responseText;break;case"json":s=S(t.responseText);break;case"xml":s=t.responseXML}s!==e&&r.call(o,s,a,t)}else i(t,a);t=null}function F(){var t="",e=[],n=0,r="0123456789ABCDEF";for(n=0;32>n;n++)e[n]=r.substr(Math.floor(16*Math.random()),1);return e[12]="4",e[16]=r.substr(8|3&e[16],1),t="jsonp_"+e.join("")}function P(r,i){function o(n){n?ye=!0:p.call(h),y.onload=y.onerror=y.onreadystatechange=null,ve&&y.parentNode&&(ve.removeChild(y),y=null,t[v]=e)}function a(){setTimeout(function(){ye||o()},u)}n.isObject(r)&&(i=r,r=i.url);var i=i||{},u=3e3,r=r+"?",c=i.data,l=i.charset,f=i.success||N,p=i.failure||N,h=i.scope||t,d=i.timestamp,m=i.jsonpName||"callback",v=i.jsonpCallback||F();n.isObject(c)&&(c=n.param(c));var y=H.createElement("script");de?y.onreadystatechange=function(){var t=this.readyState;ye||"loaded"!=t&&"complete"!=t||o(!0)}:(y.onload=function(){o(!0)},y.onerror=function(){o()},me&&a()),r+=m+"="+v,l&&(y.charset=l),c&&(r+="&"+c),d&&(r+="&ts=",r+=s()),t[v]=function(t){f.call(h,t)},y.src=r,ve.insertBefore(y,ve.firstChild)}function k(t,e,i,o){var s=n.isArray(e),a=n.isPlainObject(e);r(e,function(e,r){o&&(r=i?o:o+"["+(a||n.isObject(e)||n.isArray(e)?r:"")+"]"),!o&&s?t.add(e.name,e.value):n.isArray(e)||!i&&n.isObject(e)?k(t,e,i,r):t.add(r,e)})}var A=Object.prototype,_=Function.prototype,B=["Array","Function","Object","String","Number","Boolean"],D=A.toString,X=B.slice,M=B.push;B.concat;var q=B.forEach,I=B.map,R=B.every,V=B.some,K=B.indexOf,Y=B.filter,$=_.bind,H=t.document;n.identity=function(t){return t};var Z=function(){var t=H.createElement("div");t.className="a",t.innerHTML='<p style="color:red;"><a href="#" style="opacity:.4;float:left;">a</a></p>',t.setAttribute("class","t");var n=t.getElementsByTagName("p")[0],r=n.getElementsByTagName("a")[0],i="t"===t.className,o=/;/.test(n.style.cssText),s=/^0.4$/.test(r.style.opacity),a=!(!H.defaultView||!H.defaultView.getComputedStyle),u=!0;try{H!==e&&X.call(H.getElementsByTagName("body"))}catch(c){u=!1}return{setAttr:i,cssText:o,opacity:s,classList:!!t.classList,cssFloat:!!r.style.cssFloat,getComputedStyle:a,sliceOnNodeList:u}}(),W=Z.sliceOnNodeList?function(t){return o(t)}:function(t){for(var e=[],n=0,r=t.length;r>n;n++)e[n]=t[n];return e},z=function(t){var e={sogou:/se/.test(t),opera:/opera/.test(t),chrome:/chrome/.test(t),firefox:/firefox/.test(t),maxthon:/maxthon/.test(t),tt:/TencentTraveler/.test(t),ie:/msie/.test(t)&&!/opera/.test(t),safari:/webkit/.test(t)&&!/chrome/.test(t)},n="";for(var r in e)if(e[r]){n="safari"==r?"version":r;break}var i=RegExp("(?:"+n+")[\\/: ]([\\d.]+)");e.version=n&&i.test(t)?RegExp.$1:"0";for(var o=parseInt(e.version,10),r=6;11>r;r++)e["ie"+r]=o===r;return e}(navigator.userAgent.toLowerCase());n.Object=function(){var t=Object.keys||function(t){t=Object(t);var e=[],n=0;for(var r in t)e[n++]=r;return e},e=function(t){var e=[],n=0;for(var r in t)e[n++]=t[r];return e},n=function(t){t=Object(t);var e={};for(var n in t)e[t[n]]=n;return e},i=function(t){var e=[],n=0;for(var r in t)e[n]=[r,t[r]];return e},s=function(t){var e={},n=o(arguments,1);return r(n,function(n){n in t&&(e[n]=t[n])}),e};return{keys:t,values:e,pairs:i,invert:n,pick:s}}(),n.Function=function(){function t(t,e){var r,i;if(t.bind===$&&$)return $.apply(t,o(arguments,1));if(!n.isFunction(t))throw new TypeError;return r=o(arguments,2),i=function(){if(!(this instanceof i))return t.apply(e,r.concat(o(arguments)));N.prototype=t.prototype;var n=new N;N.prototype=null;var s=t.apply(n,r.concat(o(arguments)));return Object(s)===s?s:n}}function e(t){var e,n;return function(){return e?n:(e=!0,n=t.apply(this,arguments))}}function r(t,e){return function(){var n=this,r=arguments;setTimeout(function(){t.apply(n,r)},e)}}function i(t,e,n){var r;return function(){var i=this,o=arguments;later=function(){r=null,n||t.apply(i,o)};var s=n&&!r;clearTimeout(r),r=setTimeout(later,e),s&&t.apply(i,o)}}function s(t,e){var n,r,o,s,a,u,c=i(function(){a=s=!1},e);return function(){n=this,r=arguments;var i=function(){o=null,a&&t.apply(n,r),c()};return o||(o=setTimeout(i,e)),s?a=!0:u=t.apply(n,r),c(),s=!0,u}}function a(t,e){var n=!0;return e=e||1e3,function(){n&&(t.apply(this,arguments),n=!1),setTimeout(function(){n=!0},e)}}return{bind:t,once:e,uniq:a,delay:r,debounce:i,throttle:s}}(),n.Array=function(){function t(t,i,o){i||(i=n.identity);var s=!0;return null==t?s:R&&t.every===R?t.every(i,o):(r(t,function(t,n,r){return(s=s&&i.call(o,t,n,r))?e:!0}),!!s)}function o(t,i,o){i||(i=n.identity);var s=!1;return null==t?s:V&&t.some===V?t.some(i,o):(r(t,function(t,n,r){return s||(s=i.call(o,t,n,r))?!0:e}),!!s)}function s(t,e){return null==t?!1:K&&t.indexOf===K?-1!=t.indexOf(e):o(t,function(t){return t===e})}function a(t,e,n){var i=[];return null==t?i:Y&&t.filter===Y?t.filter(e,n):(r(t,function(t,r,o){e.call(n,t,r,o)&&(i[r]=t)}),i)}function u(t){var e=[];return r(t,function(t){s(e,t)||e.push(t)}),e}return{forEach:r,map:i,every:t,some:o,contains:s,filter:a,unique:u}}(),n.String=function(){function t(t){return"string"!=typeof t?"":t.replace(l.escape,function(t){return c.escape[t]})}function e(t){return"string"!=typeof t?"":t.replace(l.unescape,function(t){return c.unescape[t]})}var r=n.Object,i=/\{(\d+)\}/g,s=/^\d+$/,a=/<script[^>]*>([\s\S]*?)<\/script>/gi,u=/^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,c={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};c.unescape=r.invert(c.escape);var l={escape:RegExp("["+r.keys(c.escape).join("")+"]","g"),unescape:RegExp("("+r.keys(c.unescape).join("|")+")","g")};return{escape:t,unescape:e,trim:function(t){return t.replace(u,"")},isNumberStr:function(t){return s.test(t)},toInt:function(t,e){if(this.isNumberStr(t))return parseInt(t,e||10);throw Error("not a number")},toFloat:function(t){if(this.isNumberStr(t))return parseFloat(t);throw Error("not a number")},urlAppend:function(t,e){return n.isString(e)&&e.length?t+(-1===t.indexOf("?")?"?":"&")+e:t},stripScript:function(t){return t.replace(a,function(){return""})},ellipsis:function(t,e,n){if(t&&t.length>e){if(n){var r=t.substr(0,e-2),i=Math.max(r.lastIndexOf(" "),r.lastIndexOf("."),r.lastIndexOf("!"),r.lastIndexOf("?"));if(-1!==i&&i>=e-15)return r.substr(0,i)+"..."}return t.substr(0,e-3)+"..."}return t},format:function(t){var e=o(arguments,1);return t.replace(i,function(t,n){return e[n]})}}}(),n.Class=function(){function i(e,n){this.type=e,this.scope=n||t,this.listeners=[]}function s(r,i){if(!n.isString(r))throw Error("classPath must be a string");i=n.isObject(i)?i:t;for(var o=r.split("."),s=i,a=o.pop();o.length;){var u=o.shift(),c=s[u];c||(s[u]=c={}),s=c}var l=s[a];if(n.isFunction(l))throw Error(a+" is already defined");return s[a]=e,{namespace:s,className:a}}function a(t,e,r){function i(){n.isFunction(this.init)&&this.init.apply(this,arguments)}if(!r){if(!e)throw Error("class create failed, verify definitions");r=e,e=Object}i.toString=function(){return t};var o=e.prototype,l=i.prototype=c(o);l.constructor=r,r.call(l,o),n.extend(l,u);var f=s(t,a.globalNamespace);return f.namespace[f.className]=i,i}i.prototype={subscribe:function(t,e,n){var r=this.listeners;if(!t||-1!==this._find(t,e))return!1;var i={fn:t,scope:e||this.scope,opt:n};return this.firing&&(r=this.listeners=r.slice(0)),r.push(i),!0},unsubscribe:function(t,e){if(!t)return this.clear();var n=this._find(t,e);return-1!==n?(this._delete(n),!0):!1},publish:function(){var t,e,n=this.listeners,r=n.length,i=0;if(r>0)for(this.firing=!0;e=n[i++];)if(t=o(arguments),e.opt&&t.push(e.opt),e&&e.fn.apply(e.scope,t)===!1)return this.firing=!1;return this.firing=!1,!0},clear:function(){for(var t=this.listeners.length,e=t;e--;)this._delete(e);return this.listeners=[],t},_find:function(t,e){for(var n,r=this.listeners,i=r.length;i--;)if((n=r[i])&&n.fn===t&&(!e||n.scope===e))return i;return-1},_delete:function(t){var e=this.listeners,n=e[t];n&&(delete n.fn,delete n.scope,delete n.opt),e.splice(t,1)}};var u={on:function(t,e,n,r){var o,s;if("object"==typeof t){r=t;for(t in r)r.hasOwnProperty(t)&&(o=r[t],this.on(t,o.fn||o,o.scope||r.scope,o.fn?o:r))}else this._events=this._events||{},s=this._events[t]||!1,s||(s=this._events[t]=new i(t,this)),s.subscribe(e,n,r)},off:function(t,e,n){var r,i,o;if("object"==typeof t){o=t;for(t in o)o.hasOwnProperty(t)&&(r=o[t],this.un(t,r.fn||r,r.scope||o.scope))}else i=this._events[t],i&&i.unsubscribe(e,n)},clearEvent:function(t){var e=this._events&&this._events[t];e&&e.clear()},fire:function(t){var e;return this._events&&(e=this._events[t])?e.publish.apply(e,o(arguments,1)):!0}},c=Object.create?function(t){return Object.create(t)}:function(){function t(){}return function(e){return t.prototype=e,new t}}();return n.statics=function(t,e){return n.extend(t,e),t},n.methods=function(t,e,r){var i=t.prototype;for(var o in e){if(!n.isFunction(e[o]))throw Error(o+" is not a function");r?i[o]=e[o]:i[o]||(i[o]=e[o])}return t},n.agument=function(t){var e=!1,i=X.call(arguments,1);return U.isBoolean(t)&&(e=!0,t=arguments[1],i=X.call(arguments,2)),r(i,function(r){n.isFunction(r)&&(r=r.prototype),a.methods(t,r,e)}),t},a}();var G=function(){function t(t,e,n){var r=RegExp("(?:^|\\s+)"+e+"(?:\\s+|$)"),i="className"===t?n.className:n.getAttribute(t);if(i){if(!e)return!0;if(r.test(i))return!0}return!1}function n(e,n,r){for(var i,o=[],s=0,a=0;i=e[s++];)t(n,r,i)&&(o[a++]=i);return o}var r=/^#[\w\-]+/,i=/^([\w\*]+)$/,o=/^([\w\-]+)?\.([\w\-]+)/,s=/^([\w]+)?\[([\w]+-?[\w]+?)(=(\w+))?\]/;return function(t,a){var c=t,l=[],a=a===e?H:"string"==typeof a?G(a)[0]:a;if(!t)return l;if(r.test(c))return l[0]=u(c.substr(1,c.length)),l;if(i.test(c))return W(a.getElementsByTagName(c));if(a.querySelectorAll){if(1===a.nodeType){var f=a.id,p=a.id="__Z__";try{return a.querySelectorAll("#"+p+" "+c)}catch(h){throw Error("querySelectorAll: "+h)}finally{f?a.id=f:a.removeAttribute("id")}}return W(a.querySelectorAll(c))}if(o.test(c)){var d=c.split("."),m=d[0],v=d[1];if(a.getElementsByClassName){var y=a.getElementsByClassName(v);if(m){for(var g=0,b=y.length;b>g;g++){var T=y[g];T.tagName.toLowerCase()===m&&l.push(T)}return l}return W(y)}var x=a.getElementsByTagName(m||"*");return n(x,"className",v)}if(s.test(c)){var E=s.exec(c),x=a.getElementsByTagName(E[1]||"*");return n(x,E[2],E[4])}}}(),J=document.createElement("div");n.matches=c,n.prototype={constructor:n,init:function(r,i){if(r){if("function"==typeof r)return n.ready(r);if(n.isZ(r))return r;if(r.nodeType||r===t)return this[0]=r,this.length=1,e;if(n.isArrayLike(r))return this.pushStack(r);var o=G(r,i);this.pushStack(o)}},length:0,find:function(t,r){var i=r===e?this[0]:this[r];return new n.prototype.init(t,i)},toArray:function(){return o(this)},pushStack:function(t){M.apply(this,W(t))},slice:function(){var t=n(),e=X.apply(this,arguments);return M.apply(t,e),t},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},get:function(t){return null==t?this.toArray():0>t?this.slice(t)[0]:this[t]},parent:function(){return n(this[0].parentNode)},next:function(){return n(a(this[0],"nextSibling"))},prev:function(){return n(a(this[0],"previousSibling"))},each:function(t){return r(this,t),this},map:function(t){return n(i(this,function(e,n){return t.call(e,e,n)}))},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},closest:function(t,e){for(var r=this[0];r&&!c(r,t);)r=r!==e&&!n.isDocument(r)&&r.parentNode;return n(r)},push:M,sort:B.sort,splice:B.splice},n.fn=n.prototype.init.prototype=n.prototype,n.extend=n.fn.extend=function(){var t,r,i,o,s,a,u=1,c=!1,l=arguments.length,f=arguments[0]||{};for(f===!0&&(c=f,f=arguments[1]||{},u=2),"object"==typeof f||n.isFunction(f)||(f={}),l===u&&(f=this,--u),s=arguments[u];l>u;u++)if(null!=s)for(o in s)t=f[o],i=s[o],f!==i&&(c&&i&&(n.isObject(i)||(r=n.isArray(i)))?(r?(r=!1,a=t&&n.isArray(t)?t:[]):a=t&&n.isObject(t)?t:{},f[o]=n.extend(c,a,i)):i!==e&&(f[o]=i));return f},n.each=r,n.map=i,n.now=s,n.extend(z),n.fn.extend({data:function(t,r){var i=this[0],o=n.cache;return t===e?o.get(i):r===e?o.get(i,t):(this.each(function(){o.set(this,t,r)}),e)},removeData:function(t){return this.each(function(){n.cache.remove(this,t)})}}),r(B,function(t){n["is"+t]=function(e){return D.call(e)==="[object "+t+"]"}}),n.isPrimitive=function(t){var n=typeof t;return!(t!==e&&null!==t&&"boolean"!==n&&"number"!==n&&"string"!==n)},n.isEmptyObject=function(t){for(var e in t)return!1;return!0},n.isEmpty=function(t){if(null==t)return!0;if(n.isArray(t)||n.isString(t))return 0===t.length;for(var e in t)return!1;return!0},n.isPlainObject=function(t){return n.isObject(t)&&"isPrototypeOf"in t?!0:!1},n.isArrayLike=function(t){return t.length===+t.length&&!n.isString(t)},n.isWindow=function(t){return null!=t&&t===t.window},n.isDocument=function(t){return null!=t&&t.nodeType===t.DOCUMENT_NODE},n.isElement=function(t){return t?1===t.nodeType:!1},n.isTextNode=function(t){return t?"#text"===t.nodeName:!1},n.isZ=function(t){return t.constructor===n},n.isURL=function(t){var e=/^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;return e.test(t)},n.isEmail=function(t){var e=/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;return e.test(t)};var Q=/^(?:body|html)$/i,te=function(){function t(t,e){return 1===t.nodeType&&n.isString(e)?!0:!1}var e,r,i,o,s,a=Z.classList;return a?(e=function(e,n){return t(e,n)?e.classList.contains(n):!1},r=function(e,n){var r,i=0;if(t(e,n))for(n=n.split(" ");r=n[i++];)e.classList.add(r)},i=function(e,n){var r,i=0;if(t(e,n))for(n=n.split(" ");r=n[i++];)e.classList.remove(r)},o=function(e,n){t(e,n)&&e.classList.toggle(n)}):(e=function(e,n){return t(e,n)?-1!=(" "+e.className+" ").indexOf(" "+n+" "):!1},r=function(n,r){t(n,r)&&!e(n,r)&&(n.className+=(n.className?" ":"")+r)},i=function(e,n){t(e,n)&&(e.className=e.className.replace(RegExp("\\b"+n+"\\b","g"),""))},o=function(t,n){e(t,n)?i(t,n):r(t,n)}),s=function(t,e,n){i(t,e),r(t,n)},{has:e,add:r,remove:i,toggle:o,replace:s}}();n.support=Z,n.contains=function(t,e){try{return t.contains?t!=e&&t.contains(e):!!(16&t.compareDocumentPosition(e))}catch(n){}},n.ready=function(r){function i(e){("readystatechange"!=e.type||"complete"==H.readyState)&&(("load"==e.type?t:H)[l](f+e.type,i,!1),!s&&(s=!0)&&r(n))}function o(){try{u.doScroll("left")}catch(t){return setTimeout(o,50),e}i("poll")}var s=!1,a=!0,u=H.documentElement,c=H.addEventListener?"addEventListener":"attachEvent",l=H.addEventListener?"removeEventListener":"detachEvent",f=H.addEventListener?"":"on";if("complete"==H.readyState)r(n);else{if(H.createEventObject&&u.doScroll){try{a=!t.frameElement}catch(p){}a&&o()}H[c](f+"DOMContentLoaded",i,!1),H[c](f+"readystatechange",i,!1),t[c](f+"load",i,!1)}},n.fn.extend({hasClass:function(t){return te.has(this[0],t)},addClass:function(t){return this.each(function(e){te.add(e,t)})},removeClass:function(t){return this.each(function(e){te.remove(e,t)})},toggleClass:function(t){return this.each(function(e){te.toggle(e,t)})},replaceClass:function(t,e){return this.each(function(n){te.replace(n,t,e)})},attr:function(t,r){if(n.isObject(t)&&!n.isEmptyObject(t)){for(var i in t)this.attr(i,t[i]);return this}if(r!==e)return this.each(function(e){switch(t){case"class":e.className=r;break;case"style":e.style.cssText=r;break;default:e.setAttribute(t,r)}}),this;var o=this[0];switch(t){case"class":return o.className;case"style":return o.style.cssText;default:return o.getAttribute(t)}},removeAttr:function(t){return n.isString(t)&&this.each(function(e){e.removeAttribute(t)}),this},hasAttr:function(t){return this.attr(t)?!0:!1},prop:function(t,r){if(n.isObject(t)&&!n.isEmptyObject(t)){for(var i in t)this.prop(i,t[i]);return this}return r===e?this[0][t]:(this.each(function(e){e[t]=r}),this)},css:function(r,i){if(!n.isObject(r)){if(i===e){var o,s=this[0];if("opacity"==r){var a,u,c=/opacity=/i;return Z.opacity?(o=t.getComputedStyle(s,null),a=o.opacity,a.length>1&&(a=a.substr(0,3)),parseFloat(a)):(o=s.currentStyle,u=o.filter,c.test(u)?parseFloat(u.match(/opacity=([^)]*)/i)[1])/100:1)}if(t.getComputedStyle)return t.getComputedStyle(s,null).getPropertyValue(h(r));if(H.defaultView&&H.defaultView.getComputedStyle){var l=H.defaultView.getComputedStyle(s,null);if(l)return l.getPropertyValue(h(r))}return s.currentStyle?s.currentStyle[r]:s.style[r]}return this.each(function(t){"opacity"==r?Z.opacity?t.style.opacity=1==i?"":""+i:(t.style.filter="alpha(opacity="+100*i+");",t.style.zoom=1):(n.isNumber(i)&&(i+="px"),t.style[r]=i)}),this}for(var f in r)this.css(f,r[f])},offsetParent:function(){for(var t=this[0].offsetParent||H.body;t&&!Q.test(t.nodeName)&&"static"===n(t).css("position");)t=t.offsetParent;return n(t)},offset:function(t){if(arguments.length)return t===e?this:this.each(function(){p(this,t)});var n=this[0],r=n&&n.ownerDocument;return r?f(n,r,r.documentElement):null},position:function(){if(this[0]){var t=this.offsetParent(),e=this.offset(),n=Q.test(t[0].nodeName)?{top:0,left:0}:t.offset();return e.top-=parseFloat(this.css("marginTop"))||0,e.left-=parseFloat(this.css("marginLeft"))||0,n.top+=parseFloat(t.css("borderTopWidth"))||0,n.left+=parseFloat(t.css("borderLeftWidth"))||0,{top:e.top-n.top,left:e.left-n.left}}},scrollTop:function(n){var r=this[0]==t;return n===e?r?t.pageXOffset||H.documentElement.scrollTop||H.body.scrollTop:this[0].scrollTop:(r&&t.scrollTo(0,n),this.each(function(){this.scrollTop=n}),this)},text:function(t){return this.prop(this[0].innerText===e?"textContent":"innerText",t)},html:function(t){return n.isFunction(t)&&(t=t()),this.prop("innerHTML",t)},val:function(t){if(n.isFunction(t)&&(t=t()),t===e){var r=this[0];return"INPUT"==r.tagName&&/checkbox|radio/.test(r.type)?r.checked:r.value}return this.prop("value",t)},show:function(){this.each(function(t){t.style.display=""})},hide:function(){this.each(function(t){t.style.display="none"})},toggle:function(){this.each(function(t){t.style.display="none"!==t.style.display?"none":""})}});var ee=1,ne="__guid__",re={},ie=!!t.addEventListener,oe=n.Function,se=oe.once,ae=oe.delay,ue=oe.debounce,ce=oe.throttle,le=function(){return ie?function(t,e,n){t.addEventListener(e,n,!1)}:function(t,e,n){t.attachEvent("on"+e,n)}}(),fe=function(){return ie?function(t,e,n){t.removeEventListener(e,n,!1)}:function(t,e,n){t.detachEvent("on"+e,n)}}();x.prototype={preventDefault:function(){this.isDefaultPrevented=v;var t=this.originalEvent;t.preventDefault&&t.preventDefault(),t.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=v;var t=this.originalEvent;t.stopPropagation&&t.stopPropagation(),t.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=v,this.stopPropagation()},isDefaultPrevented:m,isPropagationStopped:m,isImmediatePropagationStopped:m},r({on:w,off:O},function(t,e){n.fn[e]=function(e,n){return this.each(function(r){t(r,e,n)})}}),r(["one","delay","throttle","debounce","immediate"],function(t){n.fn[t]=function(e,n,r){return this.each(function(i){var o={handler:n};o[t]="one"===t?!0:r,w(i,e,o)})}}),n.fn.fire=function(t){return this.each(function(e){j(e,t)})},r("click,dblclick,mouseover,mouseout,mouseenter,mouseleave,mousedown,mouseup,keydown,keyup,keypress,focus,blur".split(","),function(t){n.fn[t]=function(e){return 0===arguments.length?this.fire(t):this.on(t,e),this}}),n.fn.delegate=function(t,e,r){return 2===arguments.length&&n.isFunction(e)&&(fn=e,e="click"),this.each(function(i){n(i).on(e,function(e){var i=e.target;n(t,this).each(function(t){(i==t||n.contains(t,i))&&r.call(t,e)})})})},n.fn.undelegate=function(t,e){return this.each(function(r){n(r).off(t,e)})},n.parseJSON=S;var pe=t.XMLHttpRequest?function(){return new XMLHttpRequest}:function(){return new t.ActiveXObject("Microsoft.XMLHTTP")},he={method:["get","post"],type:["text","json","xml"],async:["sync","async"]};n.ajax=C,r(he,function(t,e){r(t,function(t){n[t]=function(t,e){return function(r,i,o){return n.isObject(r)&&(i=r),n.isFunction(i)&&(i={success:i}),n.isFunction(o)&&(i={data:i},i.success=o),"async"===t&&(e="async"===e?!0:!1),i=i||{},i[t]=e,C(r,i)}}(e,t)})});var de=!-[1],me=t.opera,ve=H.head||H.getElementsByTagName("head")[0],ye=!1;n.jsonp=function(t,e,r){return n.isObject(t)&&(e=t),n.isFunction(e)&&(e={success:e}),n.isFunction(r)&&(e={data:e},e.success=r),P(t,e)},n.param=function(t,e){var n=[];return n.add=function(t,e){this.push(escape(t)+"="+escape(e))},k(n,t,e),n.join("&").replace(/%20/g,"+")},n.cache=function(){function t(t){return t[i]||(t[i]=++n)}var n=0,r={},i="_uuid_";return{set:function(e,n,i){if(!e)throw Error("setting failed, invalid element");var o=t(e),s=r[o]||(r[o]={});return n&&(s[n]=i),s},get:function(n,i,o){if(!n)throw Error("getting failed, invalid element");var s=t(n),a=r[s]||o&&(r[s]={});return a?i!==e?a[i]||null:a:null},has:function(t,e){return null!==this.get(t,e)},remove:function(n,i){var o="object"==typeof n?t(n):n,s=r[o];return s?(i!==e?delete s[i]:delete r[o],!0):!1}}}(),"function"==typeof define&&define.amd?define("Z",[],function(){return n}):t.Z=n}(this);