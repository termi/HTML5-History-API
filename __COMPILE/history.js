/*Copyright 2011-2013, Dmitriy Pakhtinov ( spb.piksel@gmail.com ) and github.com/termi */
void function(){"use strict";var k=void 0,n=null,p=!1;function S(a){var q=a||p,d=q.target||p;a=q.defaultPrevented;if(d&&("A"===d.nodeName&&!a)&&(a=e(d.getAttribute("href",2),!0),a.b&&"#"!==a.b&&a.b===a.a.replace(e().a.split("#").shift(),""))){history.location.hash=a.b;a=a.b.replace(/^#/,"");if((d=document.getElementById(a))&&d.id===a&&"A"===d.nodeName)d=d.getBoundingClientRect(),window.scrollTo(B.scrollLeft||0,d.top+(B.scrollTop||0)-(B.clientTop||0));q.preventDefault()}}function J(a){s===b.href&&(a.stopImmediatePropagation?a.stopImmediatePropagation():
a.stopPropagation(),s=0);c.removeEventListener("popstate",J,p)}function t(a,q,d){var b=new u(2==a?"hashchange":3==a?"pagechange":"popstate");q!=k&&(b.oldUrl=q);d!=k&&(b.newUrl=d);b.__history_shim__=!0;if(!m&&a==k&&c.onpopstate)c.onpopstate(b);c.dispatchEvent(b)}function C(a){return x?a?x.setItem("__hitoryapi__",T(a)):U(x.getItem("__hitoryapi__"))||{}:{}}function y(a,b,d){try{if(1!==Object.defineProperty({},"t",{get:function(){return 1}}).t)throw Error;Object.defineProperties(a,b)}catch(c){if(a.__defineGetter__)for(var e in b)V(b,
e)&&(a.__defineGetter__(e,b[e].get),b[e].set&&a.__defineSetter__(e,b[e].set));if(d)return p}return a}var c=this,g=c.JSON||{},v=document,B=v.documentElement,u=c.j,z=Array.prototype.slice,V=(Function.prototype.bind||p).call(Function.prototype.call,Object.prototype.hasOwnProperty),j=c.history||{},b=c.location,m="pushState"in j,W=m&&j.state===k,s=b.href,K=j.pushState,L=j.replaceState,U=g.parse,T=g.stringify,x=c.sessionStorage,X=(g=c["ev"+(v.documentMode||v.attachEvent?"":z)+"al"])&&g("/*@cc_on 1;@*/")&&
+((/msie (\d+)/i.exec(navigator.userAgent)||[])[1]||0)||k,g=k,D=0,Y=/[^\/]+$/g,M=location.pathname.split("#")[0].split("?")[0],e,f=v.createElement("a"),N,E,O,F,A,w,l,Z=/^[^#]*/;e=function(a,q){if(a){if(!m||X){var d=e(),c=d.e,g=d.i,h=a.charAt(0);a=/^(?:[\w0-9]+\:)?\/\//.test(a)?"/"==h?g+a:a:g+"//"+d.h+("/"==h?a:"?"==h?c+a:"#"==h?c+d.f+a:c.replace(Y,"")+a)}}else if(a=b.href,!m||q)a=b.protocol+"//"+b.host+(-1!=a.indexOf("#")?"/":M)+(a.replace(Z,"")||"#").replace(/^#[\/]?(?:\/)?/,"");if(N!==a){f.href=
N=a;w=f.port;A=f.host;l=f.pathname;if("http:"===f.protocol&&80==w||"https:"===f.protocol&&443==w)A=f.hostname,w="";l="/"==l.charAt(0)?l:"/"+l;E=l+f.search+f.hash;F=l+f.search;O=F+f.hash}return{a:f.protocol+"//"+A+E,i:f.protocol,h:A,k:f.hostname||b.hostname,l:w||b.port,e:l,f:f.search,b:f.hash,d:E,c:F,g:O}};var h=!g&&j||p,g={get:function(){return C()[h.location.href]||n}},z={set:function(a){c.location=a},get:function(){return m?b:G}},G={assign:function(a){b.assign(m||0!==a.indexOf("#")?a:"#"+e().c+
a)},reload:b.reload,replace:function(a){b.replace(m||0!==a.indexOf("#")?a:"#"+e().c+a)},toString:function(){return this.href}},P=c.onpopstate||n,Q=c.onhashchange||n,H=0,R=e(),I=R.a;c.addEventListener("hashchange",function(a){if(!a.__history_shim__){var b=e();if(D)return I=b.a,D=0;var d=a.oldURL||I;a=I=a.newURL||b.a;var b=d.replace(/^.*?(#|$)/,""),c=a.replace(/^.*?(#|$)/,"");d!=a&&!H&&t(k);s=H=0;b!=c&&t(2,d,a)}},p);c.addEventListener&&(c.addEventListener("popstate",J,p),c.addEventListener("popstate",
function(){s=0;H=1},p));h=y(h,j.state===k?{state:g,location:z}:{location:z});G=y(G,{href:{set:function(a){b.href=a},get:function(){return e().a}},protocol:{set:function(a){b.protocol=a},get:function(){return b.protocol}},host:{set:function(a){b.host=a},get:function(){return b.host}},hostname:{set:function(a){b.hostname=a},get:function(){return b.hostname}},port:{set:function(a){b.port=a},get:function(){return b.port}},pathname:{set:function(a){b.pathname=a},get:function(){return e().e}},search:{set:function(a){b.search=
a},get:function(){return e().f}},hash:{set:function(a){a=0===a.indexOf("#")?a:"#"+a;var c=e();b.hash="#"+c.c+a},get:function(){return e().b}},origin:{}});"onpopstate"in c||y(c,{onhashchange:{get:function(){return Q},set:function(a){Q=a||n}},onpopstate:{get:function(){return P},set:function(a){if(P=a||n)if(!m&&s&&!(s=0)&&R.d!==M)clearInterval(n),setTimeout(t,10)}}},!0);m||document.addEventListener("click",S,p);try{new u("click")}catch($){u=n}u||(u=function(a){var b;b=v.createEvent("Events");b.initEvent(a,
p,p);return b});h.pushState=function(a,c,d,g){var f=C(),l=e().a,j=d&&e(d);s=0;d=j?j.a:l;g&&f[l]&&delete f[l];if((!m||W)&&x&&a)f[d]=a,C(f),a=n;K&&L?g?L.call(h,a,c,d):K.call(h,a,c,d):j&&j.d!=e().d&&(D=1,g?b.replace("#"+j.g):b.hash=j.g);a=e().c;if(!r||r!=a)t(3,r,a),r=a};h.replaceState=function(a,b,c){h.pushState(a,b,c,1)};h.emulate=!m;var r="",g=function(){var a=e().c;if(!r||r!=a)t(3,r,a),r=a};c.addEventListener("popstate",g);c.addEventListener("hashchange",g);g=g=y=k}.call(window);
