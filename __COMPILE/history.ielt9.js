/*Copyright 2011-2013, Dmitriy Pakhtinov ( spb.piksel@gmail.com ) and github.com/termi */
void function(){"use strict";var m=void 0,r=null,v=!1;function M(a){if(!a.__history_shim__){var d=j();if(N)return O=d.a,N=0;var c=a.oldURL||O;a=O=a.newURL||d.a;var d=c.replace(/^.*?(#|$)/,""),b=a.replace(/^.*?(#|$)/,"");c!=a&&!P&&C(m);A=P=0;d!=b&&C(2,c,a)}}function aa(){if(A&&!(A=0)&&ba.e!==ca)clearInterval(da),setTimeout(C,10)}function ea(a){var d=a||b.event,c=d.target||d.srcElement;a="defaultPrevented"in d?d.defaultPrevented:d.returnValue===v;if(c&&("A"===c.nodeName&&!a)&&(a=j(c.getAttribute("href",2),!0),a.b&&"#"!==a.b&&a.b===a.a.replace(j().a.split("#").shift(),
""))){history.location.hash=a.b;a=a.b.replace(/^#/,"");if((c=document.getElementById(a))&&c.id===a&&"A"===c.nodeName)c=c.getBoundingClientRect(),window.scrollTo(F.scrollLeft||0,c.top+(F.scrollTop||0)-(F.clientTop||0));d.preventDefault?d.preventDefault():d.returnValue=v}}function Q(a){A===f.href&&(a.stopImmediatePropagation?a.stopImmediatePropagation():a.stopPropagation(),A=0);b.removeEventListener("popstate",Q,v);Q=r}function C(a,d,c){var l=new D(2==a?"hashchange":3==a?"pagechange":"popstate");d!=
m&&(l.oldUrl=d);c!=m&&(l.newUrl=c);l.__history_shim__=!0;if(!p&&a==m&&b.onpopstate)b.onpopstate(l);if(b.dispatchEvent)b.dispatchEvent(l);else{var e;if(a=q[l.type])for(var f in a)a.hasOwnProperty(f)&&("function"==typeof(e=a[f])||e&&"object"==typeof e&&(e=e.handleEvent))&&e.call(b,l)}}function R(a){return G?a?G.setItem("__history_shim__",S(a)):fa(G.getItem("__history_shim__"))||{}:{}}function H(a,d,c){if(I)return I(a,d),a;if(c)return a;if(!c&&x){c="StaticClass"+x++;var l=["Class "+c],e;"execVB"in b||
b.execScript("Function execVB(c) ExecuteGlobal(c) End Function","VBScript");"VBCVal"in b||b.execScript("Function VBCVal(o,r) If IsObject(o) Then Set r=o Else r=o End If End Function","VBScript");for(e in a)l.push("Public ["+e+"]");J(a,"toString")&&(a.propertyIsEnumerable("toString")||l.push("Public [toString]"),d["(toString)"]={get:function(){return this.toString.call(this)}});for(e in d)J(d,e)&&(d[e].get&&(a["get "+e]=d[e].get,l.push("Public [get "+e+"]","Public "+("(toString)"===e?"Default ":"")+
"Property Get ["+e+"]","Call VBCVal(me.[get "+e+"].call(me),["+e+"])","End Property")),d[e].set&&(a["set "+e]=d[e].set,l.push("Public [set "+e+"]","Public Property Let ["+e+"](v)","Call me.[set "+e+"].call(me,v)","End Property","Public Property Set ["+e+"](v)","Call me.[set "+e+"].call(me,v)","End Property")));l.push("End Class","Function "+c+"Factory()","Set "+c+"Factory=New "+c,"End Function");b.execVB(l.join("\n"));l=b[c+"Factory"]();for(e in a)l[e]=a[e];J(a,"toString")&&(l.toString=a.toString)}return l}
var b=this,g=b.JSON||{},s=document,F=s.documentElement,D=b.j,w=Function.prototype.bind||function(a,d){var c=this,b=T.call(arguments,1);return function(){return c.apply(a,b.concat(T.call(arguments)))}},T=Array.prototype.slice,U=Function.prototype.call,J=w.call(U,Object.prototype.hasOwnProperty),t=b.history||{},f=b.location,p="pushState"in t,ma=p&&t.state===m,A=f.href,ga=t.pushState,ha=t.replaceState,fa=g.parse,S=g.stringify,G=b.sessionStorage,V=(g=b["ev"+(s.documentMode||s.attachEvent?"":T)+"al"])&&
g("/*@cc_on 1;@*/")&&+((/msie (\d+)/i.exec(navigator.userAgent)||[])[1]||0)||m,I,g={},u=Object.defineProperties;if(u){try{u(g,{"0":{get:function(){return 1}}})}catch(pa){u=r}1!==g["0"]&&(u=m)}!u&&g.__defineGetter__&&(u=function(a,d){var c,b;if(a.__defineGetter__)for(b in d)J(d,b)&&(c=d[b],c.get&&a.__defineGetter__(b,c.get),c.set&&a.__defineSetter__(b,c.set));return a});var g=r,x=(I=u)||8<V||!V?0:(new Date).getTime(),k=x?s.createElement("iframe"):0,q,N=0,na=/[^\/]+$/g,ca=location.pathname.split("#")[0].split("?")[0],
j,h=s.createElement("a"),ia,W,ja,X,K,E,y,oa=/^[^#]*/;j=function(a,d){if(a){if(!p||V){var c=j(),b=c.f,e=c.i,g=a.charAt(0);a=/^(?:[\w0-9]+\:)?\/\//.test(a)?"/"==g?e+a:a:e+"//"+c.h+("/"==g?a:"?"==g?b+a:"#"==g?b+c.g+a:b.replace(na,"")+a)}}else if(a=f.href,!p||d)a=f.protocol+"//"+f.host+(-1!=a.indexOf("#")?"/":ca)+(a.replace(oa,"")||"#").replace(/^#[\/]?(?:\/)?/,"");if(ia!==a){h.href=ia=a;E=h.port;K=h.host;y=h.pathname;if("http:"===h.protocol&&80==E||"https:"===h.protocol&&443==E)K=h.hostname,E="";y="/"==
y.charAt(0)?y:"/"+y;W=y+h.search+h.hash;X=y+h.search;ja=X+h.hash}return{a:h.protocol+"//"+K+W,i:h.protocol,h:K,k:h.hostname||f.hostname,l:E||f.port,f:y,g:h.search,b:h.hash,e:W,c:X,d:ja}};var n=!x&&t||{back:t.back,forward:t.forward,go:t.go,pushState:m,replaceState:m,emulate:!p,toString:function(){return"[object History]"}},g={state:{get:function(){return k&&k.storage||R()[n.location.href]||r}},length:{get:function(){return t.length}},location:{set:function(a){b.location=a},get:function(){return p?
f:Y}}},Y={assign:function(a){f.assign(p||0!==a.indexOf("#")?a:"#"+j().c+a)},reload:f.reload,replace:function(a){f.replace(p||0!==a.indexOf("#")?a:"#"+j().c+a)},toString:function(){return this.href}},u={href:{set:function(a){f.href=a},get:function(){return j().a}},protocol:{set:function(a){f.protocol=a},get:function(){return f.protocol}},host:{set:function(a){f.host=a},get:function(){return f.host}},hostname:{set:function(a){f.hostname=a},get:function(){return f.hostname}},port:{set:function(a){f.port=
a},get:function(){return f.port}},pathname:{set:function(a){f.pathname=a},get:function(){return j().f}},search:{set:function(a){f.search=a},get:function(){return j().g}},hash:{set:function(a){a=0===a.indexOf("#")?a:"#"+a;var b=j();k?a!=b.b&&(n.pushState(r,r,b.c+a),Z({oldURL:b.a})):f.hash="#"+b.c+a},get:function(){return j().b}},origin:{}},Z,ka=b.onpopstate||r,la=b.onhashchange||r,P=0,da=r,ba=j(),O=ba.a;b.addEventListener?b.addEventListener("hashchange",M,v):b.attachEvent("onhashchange",M);b.addEventListener&&
(b.addEventListener("popstate",Q,v),b.addEventListener("popstate",function(){A=0;P=1},v));n=H(n,x?g:t.state===m?{state:g.state,location:g.location}:{location:g.location});Y=H(Y,u);x&&b.execScript("Public history, onhashchange","VBScript");!("onpopstate"in b||H(b,{onhashchange:{get:function(){return la},set:function(a){la=a||r}},onpopstate:{get:function(){return ka},set:function(a){(ka=a||r)&&!p&&aa()}}},!0))&&!p&&(da=setInterval(function(){b.onpopstate&&aa()},100));p||(document.addEventListener?document.addEventListener("click",
ea,v):document.attachEvent("onclick",ea));Z=M;try{new D("click")}catch(qa){D=r}D||(D=function(a){var b;s.createEvent?(b=s.createEvent("Events"),b.initEvent(a,v,v)):(b=s.createEventObject(),b.type=a);return b});b.addEventListener||(q={popstate:{},hashchange:{}},q.onpopstate=q.popstate,q.onhashchange=q.hashchange,q.onpagechange=q.pagechange={},b.attachEvent=w.call(function(a,d,c){if(d in q){d=q[d];if(!(a=c.uuid))a=c.uuid="_"+ +new Date;d[a]||(d[a]=c)}else U.call(a,b,d,c)},b,b.attachEvent),b.detachEvent=
w.call(function(a,d,c){var f;d in q?(a=c.uuid)&&(f=q[d])&&delete f[a]:U.call(a,b,d,c)},b,b.detachEvent));n.pushState=function(a,b,c,g){var e=R(),k=j().a,h=c&&j(c);A=0;c=h?h.a:k;g&&e[k]&&delete e[k];if((!p||ma)&&G&&a)e[c]=a,R(e),a=r;ga&&ha?g?ha.call(n,a,b,c):ga.call(n,a,b,c):h&&h.e!=j().e&&(N=1,g?f.replace("#"+h.d):f.hash=h.d);a=j().c;if(!z||z!=a)C(3,z,a),z=a};n.replaceState=function(a,b,c){n.pushState(a,b,c,1)};if(x){b.history=n;var w=s.cookie.split("__history_shim__="),B=j().a,L,$;if(k&&($=function(){var a=
j().a;B!=a&&Z({oldURL:B,newURL:B=a})},L=setInterval($,100),k.src="javascript:true;",k=F.firstChild.appendChild(k).contentWindow,n.pushState=function(a,b,c,g,e){var h=k.document;if(c=c&&j(c)){e||clearInterval(L);if(g)k.lfirst?(history.back(),n.pushState(a,b,c.a,0,1)):(k.storage=a,f.replace("#/"+c.d));else if(c.a!=B||e)k.lfirst||(k.lfirst=1,n.pushState(k.storage,b,B,0,1)),a=["<script>","lfirst=1;",,"storage="+S(a)+";","\x3c/script>"],a[2]='parent.location.hash="'+c.d.replace(/"/g,'\\"')+'";',h.open(),
h.write(a.join("")),h.close();e||(B=j().a,L=setInterval($,100))}else k.storage=a},b.attachEvent("unload",function(){if(k.storage){var a={};a[j().a]=k.storage;s.cookie="__history_shim__="+escape(S(a))}clearInterval(L)}),1<w.length)){w=unescape(w.pop().split(";").shift());try{k.storage=fa(w)[j().a]}catch(ra){}}}else n.emulate=!p;var z="",g=function(){var a=j().c;if(!z||z!=a)C(3,z,a),z=a};b.addEventListener?(b.addEventListener("popstate",g),b.addEventListener("hashchange",g)):(b.attachEvent("popstate",
g),b.attachEvent("hashchange",g));g=x=H=I=w=g=u=r}.call(window);
