/** @license Copyright 2011-2013, github.com/termi/HTML5-History-API, original by Dmitriy Pakhtinov ( spb.piksel@gmail.com ) */
/*
 * history API JavaScript Library v3.0.1 beta
 *
 * Support: IE6+, FF3+, Opera 9+, Safari, Chrome
 *
 * http://spb-piksel.ru/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * Forked https://github.com/termi | 19-05-2012
 * Updated to https://github.com/devote/HTML5-History-API/ v3.1.1 beta
 * Last update: 05.02.2013
 *
 * TODO:
 *  1. Optional es and dom shims for IE < 9
 *  2. first onpopstate after page load fix in Chome and Safary (addEventListener already fixed)
 */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name history.js
// @check_types
// ==/ClosureCompiler==

// [[[|||---=== GCC DEFINES START ===---|||]]]
/*
<GCC_OUTPUT>
{
  "history.ielt8.js":{
  	"description":"Supports all browsers (w3c + IE6+)"
  	"defines": {
 		__GCC__SUPPORT_IELT9__: true
 		, __GCC__SUPPORT_IELT8__: true
  	}
  }
  , "history.ielt9.js":{
  	"description":"Supports modern w3c browsers and IE8+"
  	"defines": {
 		__GCC__SUPPORT_IELT9__: true
 		, __GCC__SUPPORT_IELT8__: false
  	}
  }
  , "history.js":{
  	"description":"Supports modern w3c browsers and IE9+"
  	"defines": {
 		__GCC__SUPPORT_IELT9__: false
 		, __GCC__SUPPORT_IELT8__: false
  	}
  }
}
</GCC_OUTPUT>
*/
/** @define {boolean} */
var __GCC__LIBRARY_INTERNAL_SETTINGS__ = false;
/** @define {boolean} */
var __GCC__SUPPORT_IELT9__ = true;
/** @define {boolean} */
var __GCC__SUPPORT_IELT8__ = true;
/** @define {boolean} */
var __GCC__SUPPORT_OLD_W3C_BROWSERS__ = true;
	/** @define {boolean} */
	var __GCC__FIX_OPERA_LT_13_HREF_BUG__ = true;
/** @define {boolean} */
var __GCC__ECMA_SCRIPT_BIND_SHIM__ = false;
	/** @define {boolean} */
	var __GCC__JSON_POLLIFIL__ = false;
/** @define {string} */
var __GCC__CUSTOM_PAGE_CHANGE_EVENT__ = "pagechange";
// [[[|||---=== GCC DEFINES END ===---|||]]]
/*
if __GCC__SUPPORT_IELT9__ == TRUE
	@output_file_name = history.ielt8.js
*/

// CONFIG
if(__GCC__LIBRARY_INTERNAL_SETTINGS__) {
	/** @type {string} @conts */
	var HISTORY_JS_ELEMENT_ID = "history_uuid_8vhax7l";
}
/** @type {string} @conts */
var HISTORY_API_KEY_NAME = '__history_shim__';
// END CONFIG

void function( ){
	"use strict";

	var global = this;

	//__GCC__SUPPORT_IELT9__ == true
	/*TODO::
	if(__GCC__SUPPORT_IELT9__) {
		var _window_addEventListener = global.addEventListener
		  , _Object_defineProperties = Object.defineProperties
		  , _Event = global.Event
		  , _window_dispatchEvent = global.dispatchEvent
		  , eventsList = {
				"onpopstate" : [],
				"onhashchange" : []
			}
		;

		if(!_window_addEventListener)global.addEventListener = function(_type, _handler) {
			_type = "on" + _type;
			global.attachEvent(_type, _handler);
		}
		function(a,b,c,d){a=a||document;d=a[b="on"+b];b=a[b]=function(e){d=d&&d(e=e||a.event);return(c=c&&b(e))?b:d};a=this}
	}*/
	//end __GCC__SUPPORT_IELT9__ == true

	var	tmp = global["JSON"] || {}

		, JSONParse = tmp["parse"]//tmp == JSON || {}
		, JSONStringify = tmp["stringify"]//tmp == JSON || {}

		, _document = document

		// HTML tag
		, _documentElement = _document.documentElement

		, _Event_constructor_ = global.Event

		/** @const */
		, _Array_slice = __GCC__ECMA_SCRIPT_BIND_SHIM__ ? Array.prototype.slice : void 0

		/** Use native "bind" or unsafe bind for service and performance needs
		 * @param {Object} object
		 * @param {...} var_args
		 * @return {Function} */
 		, _unSafeBind = Function.prototype.bind || __GCC__ECMA_SCRIPT_BIND_SHIM__ && function(object, var_args) {
			var __method = this,
				args = _Array_slice.call(arguments, 1);
			return function () {
				return __method.apply(object, args.concat(_Array_slice.call(arguments)));
			}
		}

		/** @const */
		, _Function_call_ = Function.prototype.call

		/** @const */
		, _hasOwnProperty = _unSafeBind.call(_Function_call_, Object.prototype.hasOwnProperty)

		// preserve original object of History
		, windowHistory = global.history || {}

		, windowHistoryPrototype = (tmp = global.history) && (tmp = (tmp.__proto__ || (tmp = tmp.constructor) && tmp.prototype)) && (tmp && tmp != Object.prototype && tmp) || global.history

		// obtain a reference to the Location object
		, windowLocation = global.location

		// Check support HTML5 History API
		, historyAPISupports = "pushState" in windowHistory

		// If the first event is triggered when the page loads
		// This behavior is obvious for Chrome and Safari
		, initialState = historyAPISupports && windowHistory.state === void 0

		, initialFire = windowLocation.href

		// Just a reference to the methods
		, historyPushState = windowHistory.pushState
		, historyReplaceState = windowHistory.replaceState

		, sessionStorage = global.sessionStorage

		// feature detection
		, _Object_defineProperties = (function() {
			var result = Object.defineProperty && function(obj, properties) {
					var prop;
					for(var propName in properties) if(_hasOwnProperty(properties, propName)) {
						prop = properties[propName];
						if( !(typeof prop == "object") )prop = {"value": prop};
						if( !("configurable" in prop) )prop["configurable"] = true;//default - true
						Object.defineProperty(obj, propName, prop);
					}
				}
			;

			if( result ) {
				try {
					result(windowHistoryPrototype, {"_": {"get" : function(){ return 1 }, "configurable": true}});
				}
				catch( _e_ ) {
					result = null;
				}

				if( windowHistoryPrototype["_"] !== 1 ) {
					result = null;
				}
				if( "_" in windowHistoryPrototype ) {
					delete windowHistoryPrototype["_"];
				}
			}

			if( !result && windowHistoryPrototype.__defineGetter__ ) {
				result = function(obj, props) {
					var prop
						, propName
					;

					if( obj.__defineGetter__ ) {//Safary thinks that he has "state" and "location" properties in 'history' object
						for(propName in props) if( _hasOwnProperty(props, propName) ) {
							prop = props[propName];
							if( prop["get"] ) {
								obj.__defineGetter__(propName, prop["get"]);
							}
							if( prop["set"] ) {
								obj.__defineSetter__(propName, prop["set"]);
							}
						}
					}

					return obj;
				}
			}

			return result;
		})()

		/** if we are in Internet Explorer 6-10
		 * @type {number}
		 */
		, msie = _document["documentMode"] && /msie (\d+)/i.test(navigator.userAgent) // IE 10 doesnt work correctly in relative link

		// counter of created classes in VBScript
		, VBInc = __GCC__SUPPORT_IELT8__
					&& !_Object_defineProperties
					&& global["execScript"]//Only IE has this function. I hope so :)
					&& ( new Date() ).getTime()// unique ID of the library needed to run VBScript in IE
					|| void 0

		, IElt8_iframe = __GCC__SUPPORT_IELT8__ ? (VBInc ? _document.createElement( 'iframe' ) : 0) : void 0

		, IElt9_events

		, skipHashChange = 0

		// Internal settings for this library
		, libraryInternalSettings = __GCC__LIBRARY_INTERNAL_SETTINGS__ && (function(config, history_js_el) {
			// parse GET parameters for internal settings.
			if(history_js_el) {
				(history_js_el.src.split( "?" )[1] || "").split('&').reduce(function(result, value){
					var pair = value.split('=');
					result[pair[0] || ""] = pair[1] || "";
					return result
				}, config);
				config["basepath"] = config["basepath"] || "/";
				history_js_el.id = "";//no need any more
			}
			return config;
		}) ({
			"basepath": '/',
			"redirect": 0,
			"type": '/'
		}, _document.getElementById(HISTORY_JS_ELEMENT_ID))

		, RE_PATH_FILE_NAME_REPLACER = /[^\/]+$/g

		, default_basePath = __GCC__LIBRARY_INTERNAL_SETTINGS__ ? void 0 : location.pathname.split("#")[0].split("?")[0]
		//, default_basePath = '/'

		/**
		 * function for the preparation of URL-links for further work
		 * link parsing
		 * @param {string=} url
		 * @return {Object}
		 */
		, normalizeUrl = (function( aElement ) {

			var _href
				, relative
				, special
				, nohash
				, host
				, port
				, pathname
				, RE_PATH_REPLACER = new RegExp( "^" + __GCC__LIBRARY_INTERNAL_SETTINGS__ ? libraryInternalSettings["basepath"] : default_basePath, "i" )
				, RE_NOT_HASH_REPLACER = /^[^#]*/
			;

			return function( href, test ) {

				if ( !href ) {

					href = windowLocation.href;

					if ( !historyAPISupports || test ) {
						// form the absolute link from the hash
						href =
							windowLocation.protocol
							+ "//"
							+ windowLocation.host
							+ (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? libraryInternalSettings["basepath"] : href.indexOf("#") != -1 ? '/'/*TODO::default_basePath.replace(RE_PATH_FILE_NAME_REPLACER, "")*/ : default_basePath)
							+ (
								href.replace( RE_NOT_HASH_REPLACER, '' ) || "#"
								).replace( __GCC__LIBRARY_INTERNAL_SETTINGS__ ? new RegExp( "^#[\/]?(?:" + libraryInternalSettings["type"] + ")?" ) : /^#[\/]?(?:\/)?/, "" )
						;
					}
				}
				else if (
					!historyAPISupports // legacy w3c browsers | MSIE 8/9
					|| VBInc // MSIE 6/7
					|| msie // MSIE 10 | IE 10 doesnt work correctly in relative link
				) {

					var current = normalizeUrl()
						, _pathname = current._pathname
						, _protocol = current._protocol
						, char_at_0 = href.charAt(0)
					;

					// convert relative link to the absolute
					href = /^(?:[\w0-9]+\:)?\/\//.test( href ) ?
						char_at_0 == "/" ?
							_protocol + href
							:
							href
						:
						_protocol + "//" + current._host + (
							char_at_0 == "/" ? href :
								char_at_0 == "?" ? _pathname + href :
									char_at_0 == "#" ? _pathname + current._search + href :
										_pathname.replace( RE_PATH_FILE_NAME_REPLACER, '' ) + href
						)
					;
				}

				// no need to transform what is already converted the last time
				if ( _href !== href ) {

					// parse to part with a browser
					aElement.href = _href = href;

					port = aElement.port;
					host = aElement.host;
					pathname = aElement.pathname;

					// Internet Explorer adds the port number to standard protocols
					if ( ( aElement.protocol === "http:" && port == 80 ) ||
						( aElement.protocol === "https:" && port == 443 ) ) {
						host = aElement.hostname;
						port = "";
					}

					// Internet Explorer removes the slash at the beginning the way, we need to add it back
					pathname = pathname.charAt(0) == "/" ? pathname : "/" + pathname;
					// relative link, no protocol, no host
					relative = pathname + aElement.search + aElement.hash;
					// special links for set to hash-link, if browser not support History API
					nohash = (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? pathname.replace( RE_PATH_REPLACER, sets["type"] ) : pathname) + aElement.search;
					special = nohash + aElement.hash;
				}

				// added first symbol for Closure Compiler to advanced optimization
				return {
					_href: aElement.protocol + "//" + host + relative,
					_protocol: aElement.protocol,
					_host: host,
					_hostname: aElement.hostname || windowLocation.hostname,
					_port: port || windowLocation.port,
					_pathname: pathname,
					_search: aElement.search,
					_hash: aElement.hash,
					_relative: relative,
					_nohash: nohash,
					_special: special
				}
			}
		})( _document.createElement("a") )

		// modifiable object of History
		, HistoryPrototype = !VBInc && windowHistoryPrototype

		, _legacyBrowsers_History = __GCC__SUPPORT_IELT8__ && !HistoryPrototype && {
			// properties to create an object in IE
			"back": windowHistory.back,

			"forward": windowHistory.forward,

			"go": windowHistory.go,

			"pushState": _pushState,

			"replaceState": _replaceState,

			"emulate": !historyAPISupports,

			"toString": function() {
				return "[object History]";
			}
		}

		, originalWindowLocationDescriptor

		// Accessors for the object History
		, _legacyBrowsers_HistoryAccessors = {
			"state": {
				get: function() {
					return IElt8_iframe && IElt8_iframe["storage"] || historyStorage()[ this.location.href ] || null;
				}
			},

			"length": {
				get: function() {
					return windowHistory.length;
				}
			},

			"location": {
				set: function( val ) {
					(originalWindowLocationDescriptor || global.location).href = val;
				},
				get: function() {
					return historyAPISupports ? windowLocation : Location;
				}
			}
		}

		// The new Location object to add it to the object of History
		, Location = {
			"assign": function( url ) {
				windowLocation.assign( historyAPISupports || url.indexOf( "#" ) !== 0 ? url : "#" + normalizeUrl()._nohash + url );
			},

			"reload": windowLocation.reload,

			"replace": function( url ) {
				windowLocation.replace( historyAPISupports || url.indexOf( "#" ) !== 0 ? url : "#" + normalizeUrl()._nohash + url );
			},

			"toString": function() {
				return this.href;
			}
		}

		// Accessors for the object Location
		, LocationAccessors = {
			"href": {
				set: function( val ) {
					windowLocation.href = val;
				},
				get: function() {
					return normalizeUrl()._href;
				}
			},

			"protocol": {
				set: function( val ) {
					windowLocation.protocol = val;
				},
				get: function() {
					return windowLocation.protocol;
				}
			},

			"host": {
				set: function( val ) {
					windowLocation.host = val;
				},
				get: function() {
					return windowLocation.host;
				}
			},

			"hostname": {
				set: function( val ) {
					windowLocation.hostname = val;
				},
				get: function() {
					return windowLocation.hostname;
				}
			},

			"port": {
				set: function( val ) {
					windowLocation.port = val;
				},
				get: function() {
					return windowLocation.port;
				}
			},

			"pathname": {
				set: function( val ) {
					windowLocation.pathname = val;
				},
				get: function() {
					return normalizeUrl()._pathname;
				}
			},

			"search": {
				set: function( val ) {
					windowLocation.search = val;
				},
				get: function() {
					return normalizeUrl()._search;
				}
			},

			"hash": {
				set: function( val ) {
					var hash = ( val.indexOf( "#" ) === 0 ? val : "#" + val )
						, urlObject = normalizeUrl()
					;

					if ( !historyAPISupports ) {
						if ( hash != urlObject._hash ) {
							(_legacyBrowsers_History || windowHistory).pushState( null, null, urlObject._nohash + hash );

							hashChanged({
								oldURL: urlObject._href
							});
						}
					}
					else {
						windowLocation.hash = "#" + urlObject._nohash + hash;
					}
				},
				get: function() {
					return normalizeUrl()._hash;
				}
			},

			origin: {
				//
			}
		}

		, createMutableObjectForIE8 = __GCC__SUPPORT_IELT9__ ? function(defaultResult) {
			if( !Object.defineProperty ) {
				return defaultResult;
			}

			try {
				Object.defineProperty(defaultResult, "_", {"get": function(){ return 1 }, "configurable": true});
				if( defaultResult["_"] === 1 ) {
					delete defaultResult["_"];
					return defaultResult;
				}
			}
			catch(e){}

			var result = document.createElement("a")
				, i
			;
			for(i in result){ try{ delete result[i]; if( (i in result) && result[i] )result[i] = null}catch(e){} }
			for(i in defaultResult)result[i] = defaultResult[i];

			return result;
		} : void 0

		/**
		 * defineProperties for static objects
		 * @param {!Object} obj
		 * @param {!Object} props
		 * @param {boolean=} novb
		 */
		, createStaticObject = function( obj, props, novb ) {
			if( _Object_defineProperties ) {
				_Object_defineProperties(obj, props);
				return obj;
			}
			else if( novb ) {
				return obj;
			}

			if ( __GCC__SUPPORT_IELT8__ && !novb && VBInc ) {

				var staticClass = "StaticClass" + VBInc++
					, parts = [ "Class " + staticClass ]
					, tmp
					, key
				;

				// functions for VBScript
				if ( !( "execVB" in global ) ) {
					global["execScript"]( 'Function execVB(c) ExecuteGlobal(c) End Function', 'VBScript' );
				}
				if ( !( "VBCVal" in global ) ) {
					global["execScript"]( 'Function VBCVal(o,r) If IsObject(o) Then Set r=o Else r=o End If End Function', 'VBScript' );
				}

				for( key in obj ) if( _hasOwnProperty( obj, key ) ) {
					parts.push("Public [" + key + "]");
				};

				if ( _hasOwnProperty( obj, "toString" ) ) {
					if ( !obj.propertyIsEnumerable( 'toString' ) ) {
						parts.push("Public [toString]");
					}
					props["(toString)"] = {
						get: function() {
							return this.toString.call( this );
						}
					}
				}

				for( key in props ) if( _hasOwnProperty( props, key ) ) {
					if ( props[ key ].get ) {
						obj["get " + key] = props[ key ].get;
						parts.push(
							"Public [get " + key + "]",
							"Public " + ( key === "(toString)" ? "Default " : "" ) + "Property Get [" + key + "]",
							"Call VBCVal(me.[get " + key + "].call(me),[" + key + "])",
							"End Property"
						);

					}
					if ( props[ key ].set ) {
						obj["set " + key] = props[ key ].set;
						parts.push(
							"Public [set " + key + "]",
							"Public Property Let [" + key + "](v)",
						"Call me.[set " + key + "].call(me,v)",
						"End Property",
							"Public Property Set [" + key + "](v)",
						"Call me.[set " + key + "].call(me,v)",
						"End Property"
						);
					}
				}

				parts.push(
					"End Class",
					"Function " + staticClass + "Factory()",
					"Set " + staticClass + "Factory=New " + staticClass,
					"End Function"
				);

				global["execVB"]( parts.join( "\n" ) );

				tmp = global[ staticClass + "Factory" ]();

				for( key in obj ) {
					tmp[ key ] = obj[ key ];
				}
				if ( _hasOwnProperty( obj, "toString" ) ) {
					tmp.toString = obj.toString;
				}
			}// END if(__GCC__SUPPORT_IELT9__)

			return tmp;
		}

		/**
		 * @param {Object=} state
		 */
		, historyStorage = function( state ) {
			return sessionStorage ? state ? sessionStorage.setItem( HISTORY_API_KEY_NAME, JSONStringify( state ) ) :
					JSONParse( sessionStorage.getItem( HISTORY_API_KEY_NAME ) ) || {} : {};
		}

		, fireStateChange = function( type, oldURL, newURL ) {
			var newEvent = new _Event_constructor_(
				type == 2 ?
					'hashchange'
					:
					__GCC__CUSTOM_PAGE_CHANGE_EVENT__ && type == 3 ? __GCC__CUSTOM_PAGE_CHANGE_EVENT__ :
					'popstate'
			);

			if( oldURL != void 0 ) {
				newEvent["oldUrl"] = oldURL;
			}
			if( newURL != void 0) {
				newEvent["newUrl"] = newURL;
			}
			newEvent[ HISTORY_API_KEY_NAME ] = true;

			if( !historyAPISupports && type == void 0 && global.onpopstate) {
				global.onpopstate(newEvent);
			}

			if( __GCC__SUPPORT_IELT9__ ) {
				if( global.dispatchEvent ) {
					global.dispatchEvent(newEvent);
				}
				else {
					var _func
						, handlers = IElt9_events[newEvent.type]
					;
					if( handlers ) for(var i in handlers) {
						if( handlers.hasOwnProperty(i)
							&& (
								typeof (_func = handlers[i]) == "function"
								|| (_func && (typeof _func == "object") && (_func = _func.handleEvent))
							)
						) {
							_func.call(global, newEvent);
						}
					}

				}
			}
			else {
				global.dispatchEvent(newEvent);
			}
		}

		, hashChanged = (function() {

			var windowPopState = global.onpopstate || null
				, windowHashChange = global.onhashchange// 'indefined' if browser unsupported hashchange
				, popstateFired = 0
				, initialStateHandler = null
				, urlObject = normalizeUrl()
				, oldURL = urlObject._href

				, fireInitialState = function() {
					if ( initialFire && !( initialFire = 0 ) && urlObject._relative !== (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? libraryInternalSettings["basepath"] : default_basePath) ) {
						clearInterval( initialStateHandler );
						setTimeout( fireStateChange , 10);
					}
				},

				change = function( event ) {
					if( event[ HISTORY_API_KEY_NAME ] ) {
						return;
					}

/*					//TODO::// Chrome(webkit?) fire popstate for hashchange

					if( historyPushState ) {
						return;
					}

					var hash = windowLocation.hash + "";

					if( hash.substr(0, 2) != "/" + (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? libraryInternalSettings["type"] : '/') )return;
*/
					var urlObject = normalizeUrl();

					if ( skipHashChange ) {
						oldURL = urlObject._href;
						return skipHashChange = 0;
					}

					var oldUrl = event.oldURL || oldURL
						, newUrl = oldURL = event.newURL || urlObject._href
						, oldHash = oldUrl.replace( /^.*?(#|$)/, "" )
						, newHash = newUrl.replace( /^.*?(#|$)/, "" )
					;

					if ( oldUrl != newUrl && !popstateFired ) {
						// fire popstate
						fireStateChange(
							void 0
							/*, oldUrl//TODO:: need oldUrl ?
							, newUrl//TODO:: need newUrl ?*/
						)
					}

					popstateFired = 0;
					initialFire = 0;

					if ( oldHash != newHash ) {
						// fire hashchange
						fireStateChange(2, oldUrl, newUrl)
					}
				}
			;

			if( __GCC__SUPPORT_IELT9__ ) {
				if( global.addEventListener ) {
					global.addEventListener( "hashchange", change, false );
				}
				else {
					global.attachEvent( "onhashchange", change );
				}
			}
			else {
				global.addEventListener( "hashchange", change, false );
			}

			if( windowHashChange === void 0 ) { // TOO old browser, not supported hashchange
				setInterval(function() {
					change({});
				}, 100);
			}

			if( !windowHashChange ) {
				windowHashChange = null;
			}

			function fistPopStateChange_bug(e) {
				// popstate ignore the event when the document is loaded
				if ( initialFire === windowLocation.href ) {
					if(e.stopImmediatePropagation) {
						e.stopImmediatePropagation();
					}
					else {
						e.stopPropagation();
					}
					initialFire = 0;
				}
				global.removeEventListener( "popstate", fistPopStateChange_bug, false );
				fistPopStateChange_bug = null;
			}
			if( global.addEventListener && historyAPISupports ) {
				global.addEventListener( "popstate", fistPopStateChange_bug, false );
				global.addEventListener( "popstate", function(e) {
					initialFire = 0;
					popstateFired = 1;
				}, false );
			}

			if( HistoryPrototype ) {
				createStaticObject( HistoryPrototype, windowHistory.state === void 0 ?
					{
						// Safari does not support the built-in object state
						state: _legacyBrowsers_HistoryAccessors.state,

						// add a location object inside the object History
						location: _legacyBrowsers_HistoryAccessors.location
					}
						:
					{
						// for all other browsers that work correctly with the history
						location: _legacyBrowsers_HistoryAccessors.location
					}
				);
			}
			else if( __GCC__SUPPORT_IELT8__ && VBInc) {
				_legacyBrowsers_History = createStaticObject( _legacyBrowsers_History, _legacyBrowsers_HistoryAccessors );
			}

			Location = createStaticObject( __GCC__SUPPORT_IELT9__ ? createMutableObjectForIE8(Location) : Location, LocationAccessors );

			/*TODO:: Make this working in IE8
			if( Location != global["location"] && Object.getOwnPropertyDescriptor ) {
				originalWindowLocationDescriptor = Object.getOwnPropertyDescriptor(global, "location").value;
				Object.defineProperty(global, "location", {"get": function(){return Location}, "configurable": true});
			}
			*/

			if ( __GCC__SUPPORT_IELT8__ && VBInc ) {
				// override global History object and onhashchange property in window
				global["execScript"]( 'Public history, onhashchange', 'VBScript' );
			}

			var succsess = "onpopstate" in global || createStaticObject( global, {
					"onhashchange": {
						get: function() {
							return windowHashChange;
						},
						set: function( val ) {
							windowHashChange = val || null;
						}
					},
					"onpopstate": {
						get: function() {
							return windowPopState;
						},
						set: function( val ) {
							if ( windowPopState = ( val || null ) ) {
								!historyAPISupports && fireInitialState();
							}
						}
					}
				}, true );

			if ( __GCC__SUPPORT_IELT9__ && !succsess && !historyAPISupports ) {
				initialStateHandler = setInterval(function() {
					if ( global.onpopstate ) {
						fireInitialState();
					}
				}, 100);
			}

			if ( __GCC__LIBRARY_INTERNAL_SETTINGS__ && libraryInternalSettings["redirect"] && global.top == global.self ) {

				if ( window.top == window.self ) {

					var relative = normalizeUrl( null, true )._relative
						, search = windowLocation.search
						, path = windowLocation.pathname
						, basepath = libraryInternalSettings["basepath"]
					;

					if ( historyAPISupports ) {

						if ( relative != basepath && (new RegExp( "^" + basepath + "$", "i" )).test( path ) ) {
							windowLocation.href = relative;
						}

						if ( ( new RegExp( "^" + basepath + "$", "i" ) ).test( path + '/' ) ) {
							windowLocation.href = basepath;
						} else if ( !(new RegExp( "^" + basepath, "i" )).test( path ) ) {
							windowLocation.href = path.replace(/^\//, basepath ) + search;
						}
					}
					else if ( path != basepath ) {
						windowLocation.href = basepath + '#' + path.
							replace( new RegExp( "^" + basepath, "i" ), libraryInternalSettings["type"] ) + search + windowLocation.hash;
					}
				}
			}

			function documentClickHandler( e ) {
				var event = e || __GCC__SUPPORT_IELT9__ && global["event"]
					, target = event.target || __GCC__SUPPORT_IELT9__ && event.srcElement
					, defaultPrevented =
						__GCC__SUPPORT_IELT9__ ? ("defaultPrevented" in event ? event["defaultPrevented"] : event.returnValue === false)
						:
						event["defaultPrevented"]
				;

				if ( target && target.nodeName === "A" && !defaultPrevented ) {

					e = normalizeUrl( target.getAttribute( "href", 2 ), true );

					if ( e._hash && e._hash !== "#" && e._hash === e._href.replace( normalizeUrl()._href.split( "#" ).shift(), "" ) ) {

						history.location.hash = e._hash;

						e = e._hash.replace( /^#/, '' );

						if ( ( target = document.getElementById( e ) ) && target.id === e && target.nodeName === "A" ) {
							var rect = target.getBoundingClientRect();
							window.scrollTo( ( _documentElement.scrollLeft || 0 ),
								rect.top + ( _documentElement.scrollTop || 0 ) - ( _documentElement.clientTop || 0 ) );
						}

						if( __GCC__SUPPORT_IELT9__ ) {
							if ( event.preventDefault ) {
								event.preventDefault();
							}
							else {
								event.returnValue = false;
							}
						}
						else {
							event.preventDefault();
						}
					}
				}
			}

			if ( !historyAPISupports ) {
				if( __GCC__SUPPORT_IELT9__ ) {
					if( document.addEventListener ) {
						document.addEventListener("click", documentClickHandler, false);
					}
					else {
						document.attachEvent("onclick", documentClickHandler)
					}
				}
				else {
					document.addEventListener("click", documentClickHandler, false);
				}
			}

			return change;
		})()
	;

	if( __GCC__SUPPORT_OLD_W3C_BROWSERS__ ) {
		try {
			new _Event_constructor_("click");
		}
		catch(e) {
			_Event_constructor_ = null;
		}

		if( !_Event_constructor_ ) {
			_Event_constructor_ = function(name) {
				var event;

				if( __GCC__SUPPORT_IELT9__ ) {
					if( _document.createEvent ) {
						event = _document.createEvent("Events");
						event.initEvent( name, false, false );
					}
					else {
						event = _document.createEventObject();
						event.type = name;
					}
				}
				else {
					event = _document.createEvent("Events");
					event.initEvent( name, false, false );
				}

				return event;
			}
		}
	}

	if( __GCC__SUPPORT_IELT9__ && !global.addEventListener ) {
		IElt9_events = {
			"popstate": {}
			, "hashchange": {}
		};
		IElt9_events["onpopstate"] = IElt9_events["popstate"];
		IElt9_events["onhashchange"] = IElt9_events["hashchange"];
		if( __GCC__CUSTOM_PAGE_CHANGE_EVENT__ ) {
			IElt9_events["on" + __GCC__CUSTOM_PAGE_CHANGE_EVENT__] = IElt9_events[__GCC__CUSTOM_PAGE_CHANGE_EVENT__] = {};
		}

		global.attachEvent = _unSafeBind.call(function(originalAttachEvent, eventName, handler) {
			var uuid
				, handlers
			;

			if( eventName in IElt9_events ) {
				handlers = IElt9_events[eventName];

				if( !(uuid = handler["uuid"]) ) {
					uuid = handler["uuid"] = "_" + +new Date();
				}
				if( !handlers[uuid] ) {
					handlers[uuid] = handler;
				}
			}
			else {
				_Function_call_.call(originalAttachEvent, global, eventName, handler);
			}
		}, global, global.attachEvent);

		global.detachEvent = _unSafeBind.call(function(originalDetachEvent, eventName, handler) {
			var uuid
				, handlers
			;

			if( eventName in IElt9_events ) {
				uuid = handler["uuid"];

				if( uuid
					&& (handlers = IElt9_events[eventName])
				) {
					delete handlers[uuid];
				}
			}
			else {
				_Function_call_.call(originalDetachEvent, global, eventName, handler);
			}
		}, global, global.detachEvent);
	}

	if( __GCC__SUPPORT_IELT8__ && VBInc) {
		// In _legacyBrowsers_History
	}
	else {
		HistoryPrototype.pushState = _pushState;
		HistoryPrototype.replaceState = _replaceState;
	}

	function _pushState( state, title, url, replace ) {
		var stateObject = historyStorage()
			, currentHref = normalizeUrl()._href
			, urlObject = url && normalizeUrl( url )
		;

		initialFire = 0;
		url = urlObject ? urlObject._href : currentHref;

		if ( replace && stateObject[ currentHref ] ) {
			delete stateObject[ currentHref ];
		}

		if ( ( !historyAPISupports || initialState ) && sessionStorage && state ) {
			stateObject[ url ] = state;
			historyStorage( stateObject );
			state = null;
		}

		if ( historyPushState && historyReplaceState ) {
			if ( replace ) {
				historyReplaceState.call( this, state, title, url );
			}
			else {
				historyPushState.call( this, state, title, url );
			}
		}
		else if ( urlObject && urlObject._relative != normalizeUrl()._relative ) {
			skipHashChange = 1;
			if ( replace ) {
				windowLocation.replace( "#" + urlObject._special );
			}
			else {
				windowLocation.hash = urlObject._special;
			}
		}

		if( __GCC__CUSTOM_PAGE_CHANGE_EVENT__ ) {
			var currentUrl = normalizeUrl()._nohash;

			if( !_lastPageUrlWithoutHash || (_lastPageUrlWithoutHash != currentUrl) ) {
				fireStateChange(3, _lastPageUrlWithoutHash, currentUrl);

				_lastPageUrlWithoutHash = currentUrl;
			}
		}
	}

	function _replaceState( state, title, url ) {
		this.pushState( state, title, url, 1 );
	}

	if ( __GCC__SUPPORT_IELT8__ && VBInc ) {
		// replace the original History object in IE
		global["history"] = _legacyBrowsers_History;

		// If IE version 7 or lower to the enable iframe navigation
		(function( cookie, currentHref ) {
			var hashCheckerHandler
				, checker
			;

			if ( !IElt8_iframe ) return;

			checker = function() {
				var href = normalizeUrl()._href;
				if ( currentHref != href ) {
					hashChanged({
						oldURL: currentHref,
						newURL: currentHref = href
					});
				}
			};

			// starting interval for check hash
			hashCheckerHandler = setInterval( checker, 100 );

			IElt8_iframe.src = "javascript:true;";
			IElt8_iframe = _documentElement.firstChild.appendChild( IElt8_iframe ).contentWindow;

			HistoryPrototype.pushState = function( state, title, url, replace, lfirst ) {

				var i = IElt8_iframe.document,
					content,
					urlObject = url && normalizeUrl( url );

				if ( !urlObject /*|| !urlObject._relative//TODO::need this?*/ ) {
					IElt8_iframe["storage"] = state;
					return;
				}

				if ( !lfirst ) {
					clearInterval( hashCheckerHandler );
				}

				if ( replace ) {
					if ( IElt8_iframe["lfirst"] ) {
						history.back();
						this.pushState( state, title, urlObject._href, 0, 1 );
					}
					else {
						IElt8_iframe["storage"] = state;
						windowLocation.replace( "#" + (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? libraryInternalSettings["type"] : '/') + urlObject._special );
					}
				}
				else if ( urlObject._href != currentHref || lfirst ) {
					if ( !IElt8_iframe["lfirst"] ) {
						IElt8_iframe["lfirst"] = 1;
						this.pushState( IElt8_iframe["storage"], title, currentHref, 0, 1 );
					}
					content = [ '<scr' + 'ipt>', 'lfirst=1;', ,'storage=' + JSONStringify( state ) + ';', '</scr' + 'ipt>' ];
					content[ 2 ] = 'parent.location.hash="' + urlObject._special.replace( /"/g, '\\"' ) + '";';
					i.open();
					i.write( content.join("") );
					i.close();
				}

				if ( !lfirst ) {
					currentHref = normalizeUrl()._href;
					hashCheckerHandler = setInterval( checker, 100 );
				}
			};

			global.attachEvent( "onunload", function() {
				if ( IElt8_iframe["storage"] ) {
					var state = {};
					state[ normalizeUrl()._href ] = IElt8_iframe["storage"];
					_document.cookie = HISTORY_API_KEY_NAME + "=" + escape( JSONStringify( state ) );
				}
				clearInterval( hashCheckerHandler );
			} );

			if ( cookie.length > 1 ) {
				cookie = unescape( cookie.pop().split( ";" ).shift() );
				try {
					IElt8_iframe["storage"] = JSONParse( cookie )[ normalizeUrl()._href ];
				} catch( _e_ ) {}
			}

		})( _document.cookie.split( HISTORY_API_KEY_NAME + "=" ), normalizeUrl()._href );
	} //end if(__GCC__SUPPORT_IELT8__)
	else {
		// Add other browsers to emulate variable
		// The object of History, thus, we can learn
		// If the browser has native support for working with history
		HistoryPrototype["emulate"] = !historyAPISupports;
	}

	if( __GCC__CUSTOM_PAGE_CHANGE_EVENT__ ) {
		var _lastPageUrlWithoutHash = "";

		tmp = function() {
			var currentUrl = normalizeUrl()._nohash;

			if( !_lastPageUrlWithoutHash || (_lastPageUrlWithoutHash != currentUrl) ) {
				_lastPageUrlWithoutHash = currentUrl;

				fireStateChange(3, _lastPageUrlWithoutHash, currentUrl);
			}
		};

		if( __GCC__SUPPORT_IELT9__ ) {
			if( global.addEventListener ) {
				if( historyAPISupports ) {
					global.addEventListener("popstate", tmp);
				}
				global.addEventListener("hashchange", tmp);
			}
			else {
				if( historyAPISupports ) {
					global.attachEvent("popstate", tmp);
				}
				global.attachEvent("hashchange", tmp);
			}
		}
		else {
			if( historyAPISupports ) {
				global.addEventListener("popstate", tmp);
			}
			global.addEventListener("hashchange", tmp);
		}
	}

	if( __GCC__JSON_POLLIFIL__ ) {
		//https://gist.github.com/1087317
		if( !JSONStringify ) {
			JSONStringify = function(a,b,c){for(b in(c=a==""+{}&&[])&&a)c.push(JSONStringify(b)+":"+JSONStringify(a[b]));return""+a===a?'"'+a+'"':a&&a.map?"["+a.map(JSONStringify)+"]":c?"{"+c+"}":a};
		}

		if( !JSONParse ) {
			JSONParse = function( source ) {
				return source ? (new Function( "return " + source ))() : null;
			}
		}
	}

	if( __GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__FIX_OPERA_LT_13_HREF_BUG__ && global["opera"] && historyAPISupports ) {
		// Opera < 13 has a strange bug in href property then you using History API
		//  description:
		//  in html: <a id=testlink href='/page1'>page1</a>
		//  After history.pushState(null, "", "other_page");
		//  testlink.href != ( location.protocol + "//" + location.host + testlink.getAttribute("href") )

		tmp = document.createElement("a");
		if( (HistoryPrototype = tmp["__proto__"]) ) {//"HistoryPrototype" here just a free variable
			if( (tmp = Object.getOwnPropertyDescriptor(tmp, "href")) && ("get" in tmp) ) {
				Object.defineProperty(HistoryPrototype, "href", (function(originalHrefGet) {
					this["get"] = function() {
						var hrefAttrValue = this.getAttribute("href")
							, _locationHref
						;

						if( hrefAttrValue && hrefAttrValue[0] == "/" ) {
							_locationHref = global["location"];
							_locationHref = _locationHref["protocol"] + "//" + _locationHref["host"];

							return _locationHref + hrefAttrValue;
						}
						else {
							return originalHrefGet.call(this);
						}
					};

					return this
				}).call(tmp, tmp["get"]));
			}
		}
	}

	//cleanup
	tmp = VBInc = createStaticObject = _Object_defineProperties = _unSafeBind = _legacyBrowsers_History =
		_legacyBrowsers_HistoryAccessors = LocationAccessors = windowHistoryPrototype = HistoryPrototype =
			_pushState = _replaceState =
			null;
}.call( window );
