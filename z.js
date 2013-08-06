/*!
 * Z.js.js v0.1.0
 * @snandy 2013-08-06 15:39:00
 *
 */
~function(t){var e={},n=Object.prototype;String.prototype;var r=Array.prototype;n.toString;var o=r.slice;r.push;var c=t.document;"CSS1Compat"==c.compatMode;var a=/\s/,i=/^\s+/,p=/\s+$/;a.test(" ")||(i=/^[\s\xA0]+/,p=/[\s\xA0]+$/);var u=function(t){return o.call(t,0)};try{o.call(c.documentElement.childNodes,0)[0].nodeType}catch(d){u=function(t){for(var e=[],n=0,r=t.length;r>n;n++)e[n]=t[n];return e}}"function"==typeof define&&define.amd?define("Z",[],function(){return e}):t.Z=e}(this);