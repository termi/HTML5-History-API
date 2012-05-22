/*

 history API JavaScript Library v3.0.1 beta

 Support: IE6+, FF3+, Opera 9+, Safari, Chrome

 Copyright 2011-2012, Dmitriy Pakhtinov ( spb.piksel@gmail.com )

 http://spb-piksel.ru/

 Dual licensed under the MIT and GPL licenses:
   http://www.opensource.org/licenses/mit-license.php
   http://www.gnu.org/licenses/gpl.html

 Update: 18-05-2012

 Forked https://github.com/termi | 19-05-2012

 TODO:
  1. Optional shims for IE < 9
  2. first onpopstate after page load fix in Chome and Safary (addEventListener already fixed)
*/
;(function(c){"use strict";var p=null;function u(a){return t?a?t.setItem("__hitoryapi__",E(a)):F(t.getItem("__hitoryapi__"))||{}:{}}function v(a,b,d){try{Object.defineProperties(a,b)}catch(h){if(a.__defineGetter__)for(var e in b)G(b,e)&&(a.__defineGetter__(e,b[e].get),b[e].set&&a.__defineSetter__(e,b[e].set));if(d)return 0}return a}function f(a){var l,d,h=b.href.split("#");l=(h.shift(),"#"+h.join("#"));var h=(l||"#").replace(RegExp("^#[/]?(?:"+k.type+")?"),""),e=(l=h.split("#")).shift(),c=k.basepath+h,g=(d=(k.basepath+e).split("?")).shift(),
f=d.join("?");d=a&&a.substring(0,1);var i=b.protocol+"//"+b.host,r=i;l=(0<l.length?"#":"")+l.join("#");a&&(g=j?b.pathname:g,r=/[a-z]+\:\/\//.test(a)?a:"/"===d?r+a:"?"===d?r+((0===g.indexOf("/")?"":"/")+g+a):"#"===d?(j?b.href:i+c).split("#").shift()+a:r+((0===g.indexOf("/")?"":"/")+g.replace(/[^\/]+$/g,"")+a));d=RegExp("^"+i+k.basepath+"(.*)","i").exec(a?r:i+c);return{e:h,c:k.type+e,href:c,pathname:g,search:f?"?"+f:"",hash:l,b:i+c,d:r,a:d&&d[1]||""}}"use 1strict";var A=Function.prototype.bind||function(a,
b){var d=this,c=z.call(arguments,1);return function(){return _Function_apply.call(d,a,c.concat(z.call(arguments)))}},z=Array.prototype.slice,G=A.call(Function.prototype.call,Object.prototype.hasOwnProperty),n=c.history||{},b=c.location,j="pushState"in n,H=j&&void 0===n.state,q=b.href,B=n.pushState,C=n.replaceState,F=JSON.parse,E=JSON.stringify,t=c.sessionStorage,w=0,k=function(a,b){if(b){if(m=b.src.split("?")[1])for(var d=0,c=m.split("&");c[d];)m=c[d++].split("="),a[m[0]]="true"==m[1]?1:"false"==
m[1]?0:m[1]||"";b.id=""}return a}({basepath:"/",redirect:0,type:"/"},document.getElementById("history_uuid_8vhax7l")),o=n||!1,I={get:function(){return u()[o.location.href]||p}},D={set:function(a){c.location=a},get:function(){return j?b:x}},x={assign:function(a){b.assign(j||0!==a.indexOf("#")?a:"#"+f().c+a)},reload:b.reload,replace:function(a){b.replace(j||0!==a.indexOf("#")?a:"#"+f().c+a)},toString:function(){return this.href}},J={href:{set:function(a){b.href=a},get:function(){return f().b}},protocol:{set:function(a){b.protocol=
a},get:function(){return b.protocol}},host:{set:function(a){b.host=a},get:function(){return b.host}},hostname:{set:function(a){b.hostname=a},get:function(){return b.hostname}},port:{set:function(a){b.port=a},get:function(){return b.port}},pathname:{set:function(a){b.pathname=a},get:function(){return f().pathname}},search:{set:function(a){b.search=a},get:function(){return f().search}},hash:{set:function(a){var a=0===a.indexOf("#")?a:"#"+a,c=f();b.hash="#"+c.c+a},get:function(){return f().hash}}};(function(){function a(a){if(w)return e=
f().b,w=0;var b=a.oldURL||e,a=e=a.newURL||o.location.href;b.replace(/^.*?(#|$)/,"");a.replace(/^.*?(#|$)/,"");b!=a&&!h&&c.dispatchEvent(new Event("popstate"));q=h=0}var l=c.onpopstate||p,d=c.onhashchange||p,h=0,e=j?b.href:f().b;(j?b.hash:f().hash).replace(/^#/,"");c.addEventListener("hashchange",a);c.addEventListener("popstate",function(a){if(q===b.href)return a.stopImmediatePropagation(),q=0;q=0;h=1});o=v(o,void 0===n.state?{state:I,location:D}:{location:D});x=v(x,J);"onpopstate"in c||v(c,{onhashchange:{get:function(){return d},
set:function(a){d=a||p}},onpopstate:{get:function(){return l},set:function(a){if(l=a||p)if(!j&&q&&!(q=0)&&f().href!==k.basepath)clearInterval(p),setTimeout(A.call(c.dispatchEvent,c,new Event("popstate")),10)}}},!0);if(k.redirect&&0===c.parent.frames.length){var y=f(),g=b.search,s=b.pathname,i=k.basepath;if(j){if(y.href!=i&&RegExp("^"+i+"$","i").test(s)&&(b.href=y.href),!RegExp("^"+i,"i").test(s))b.href=s.replace(/^\//,i)+g}else s!=i&&(b.href=i+"#"+s.replace(RegExp("^"+i,"i"),k.type)+g+b.hash)}return a})();
o.pushState=function(a,c,d,h){var e=u(),n=o.location.href,g=d&&f(d);q=0;d=g?g.d:n;h&&e[n]&&delete e[n];if((!j||H)&&t&&a)e[d]=a,u(e),a=p;B&&C?h?C.call(o,a,c,d):B.call(o,a,c,d):g&&g.a!=f().a&&(w=1,h?b.replace("#"+k.type+g.a):b.hash=k.type+g.a)};o.replaceState=function(a,b,c){o.pushState(a,b,c,1)};c.history.emulate=!j})(window);