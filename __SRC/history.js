/** @license Copyright 2011-2013, github.com/termi/HTML5-History-API, original by Dmitriy Pakhtinov ( spb.piksel@gmail.com ) */
/*
 * history API JavaScript Library v3.5
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
 		, __GCC__SUPPORT_OPERALT10__: true
  	}
  }
  , "history.ielt9.js":{
  	"description":"Supports almost modern w3c browsers and IE8+"
  	"defines": {
 		__GCC__SUPPORT_IELT9__: true
 		, __GCC__SUPPORT_IELT8__: false
 		, __GCC__SUPPORT_OPERALT10__: false
  	}
  }
  , "history.js":{
  	"description":"Supports modern w3c browsers and IE9+"
  	"defines": {
 		__GCC__SUPPORT_IELT9__: false
 		, __GCC__SUPPORT_IELT8__: false
 		, __GCC__SUPPORT_OPERALT10__: false
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
	var __GCC__SUPPORT_OPERALT10__ = true;
/** @define {boolean} */
var __GCC__ECMA_SCRIPT_BIND_SHIM__ = false;
	/** @define {boolean} */
	var __GCC__JSON_POLLIFIL__ = false;
/** @define {string} */
var __GCC__CUSTOM_PAGE_CHANGE_EVENT__ = "pagechange";
/** @define {boolean} */
var __GCC__FIX_OPERA_AND_WEBKIT_LOCATION__ = true;
/** @define {boolean} */
var __GCC__FIX_CHROME_FULLSCREEN_BUG__ = true;
// [[[|||---=== GCC DEFINES END ===---|||]]]

// CONFIG
if(__GCC__LIBRARY_INTERNAL_SETTINGS__) {
	/** @type {string} @conts */
	var HISTORY_JS_ELEMENT_ID = "history_uuid_8vhax7l";
}
/** @type {string} @conts */
var HISTORY_API_KEY_NAME = '__history_shim__';
// END CONFIG

(function( ){
	"use strict";

	var global = this

		// preserve original object of History
		, windowHistory = global.history || {}
	;

	if( windowHistory[HISTORY_API_KEY_NAME] === true ) {
		// avoid polyfilling twice
		return;
	}

	var tmp

		, _document = document

		// HTML tag
		, _documentElement = _document.documentElement

		/** @const */
		, _Function_call_ = Function.prototype.call

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

		/** if we are in Internet Explorer 6-10
		 * @type {number}
		 */
		, msie = _document["documentMode"] && /msie (\d+)/i.test(navigator.userAgent) // IE 10 doesnt work correctly in relative link

		/** if we are in Opera
		 * @type {number}
		 */
		, _opera = (tmp = global["opera"]) && (typeof (tmp = tmp["version"]) == "function") && +tmp()

		, IElt9_operalt10_events
	;


	if( (__GCC__SUPPORT_IELT9__ && !global.addEventListener)
		|| (__GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__SUPPORT_OPERALT10__ && _opera < 10 )
	) {
		IElt9_operalt10_events = {
			"popstate": {}
			, "hashchange": {}
		};
		IElt9_operalt10_events["onpopstate"] = IElt9_operalt10_events["popstate"];
		IElt9_operalt10_events["onhashchange"] = IElt9_operalt10_events["hashchange"];
		if( __GCC__CUSTOM_PAGE_CHANGE_EVENT__ ) {
			IElt9_operalt10_events["on" + __GCC__CUSTOM_PAGE_CHANGE_EVENT__] = IElt9_operalt10_events[__GCC__CUSTOM_PAGE_CHANGE_EVENT__] = {};
		}

		if( __GCC__SUPPORT_IELT9__ && !(__GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__SUPPORT_OPERALT10__) ) {
			tmp = "attachEvent";
		}
		else if( !__GCC__SUPPORT_IELT9__ && __GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__SUPPORT_OPERALT10__ ) {
			tmp = "addEventListener";
		}
		else {
			tmp = global.addEventListener ? "addEventListener" : "attachEvent";
		}

		global[tmp] = _unSafeBind.call(function(originalAttachEvent, eventName, handler) {
			var uuid
				, handlers
			;

			if( eventName in IElt9_operalt10_events ) {
				handlers = IElt9_operalt10_events[eventName];

				if( !(uuid = handler["uuid"]) ) {
					uuid = handler["uuid"] = "_" + +new Date();
				}
				if( !handlers[uuid] ) {
					handlers[uuid] = handler;
				}
			}

			_Function_call_.call(originalAttachEvent, global, eventName, handler, false);
		}, global, global[tmp]);

		if( __GCC__SUPPORT_IELT9__ && !(__GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__SUPPORT_OPERALT10__) ) {
			tmp = "detachEvent";
		}
		else if( !__GCC__SUPPORT_IELT9__ && __GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__SUPPORT_OPERALT10__ ) {
			tmp = "removeEventListener";
		}
		else {
			tmp = global.addEventListener ? "removeEventListener" : "detachEvent";
		}

		global[tmp] = _unSafeBind.call(function(originalDetachEvent, eventName, handler) {
			var uuid
				, handlers
			;

			if( eventName in IElt9_operalt10_events ) {
				uuid = handler["uuid"];

				if( uuid
					&& (handlers = IElt9_operalt10_events[eventName])
					) {
					delete handlers[uuid];
				}
			}

			_Function_call_.call(originalDetachEvent, global, eventName, handler, false);
		}, global, global[tmp]);
	}

	tmp = global["JSON"] || {};

	var	JSONParse = tmp["parse"]//tmp == JSON || {}
		, JSONStringify = tmp["stringify"]//tmp == JSON || {}

		, _Event_constructor_ = global["Event"]

		/** @const */
		, _hasOwnProperty = _unSafeBind.call(_Function_call_, Object.prototype.hasOwnProperty)

		, windowHistoryPrototype = (tmp = global.history) && (tmp = (tmp.__proto__ || (tmp = tmp.constructor) && tmp.prototype)) && (tmp && tmp != Object.prototype && tmp) || global.history

		// obtain a reference to the Location object
		, windowLocation = global.location

		, initialFire = !_opera && !msie && windowLocation.href

		// Just a reference to the methods
		, historyPushState = windowHistory.pushState
		, historyReplaceState = windowHistory.replaceState

		// Check support HTML5 History API
		, historyAPISupports = !!(historyPushState && historyReplaceState)

		// Safari does not support the built-in object state
		, hasStateSupport = historyAPISupports && "state" in windowHistory

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

		// counter of created classes in VBScript
		, VBInc = __GCC__SUPPORT_IELT8__
					&& !_Object_defineProperties
					&& global["execScript"]//Only IE has this function. I hope so :)
					&& ( new Date() ).getTime()// unique ID of the library needed to run VBScript in IE
					|| void 0

		, IElt8_iframe = __GCC__SUPPORT_IELT8__ ? (VBInc ? _document.createElement( 'iframe' ) : void 0) : void 0

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
								( // url in hash
									href.replace( RE_NOT_HASH_REPLACER, '' ) || "#"
								).replace( __GCC__LIBRARY_INTERNAL_SETTINGS__ ? new RegExp( "^#[\/]?(?:" + libraryInternalSettings["type"] + ")?" ) : /^#[\/]?(?:\/)?/, "" )
								|| windowLocation.search//TODO check it in IE8+
							)
						;
					}
				}
				else if (
					!historyAPISupports // legacy w3c browsers + MSIE 8/9
					|| VBInc // MSIE 6/7
					|| msie // MSIE 10 - IE 10 doesnt work correctly in relative link
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
					nohash = (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? pathname.replace( RE_PATH_REPLACER, libraryInternalSettings["type"] ) : pathname) + aElement.search;
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
					return IElt8_iframe && IElt8_iframe["storage"] || historyStorage()[ this.location.href ];
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

		, createMutableObjectForIE8 = __GCC__SUPPORT_IELT9__ || __GCC__FIX_OPERA_AND_WEBKIT_LOCATION__ ? function(defaultResult) {
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
			for(i in result){ try{ delete result[i]; }catch(e){} }
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
			if( state ) {
				try {
					sessionStorage.setItem( HISTORY_API_KEY_NAME, JSONStringify( state ) )
				}
				catch(e){}
			}
			else {
				return sessionStorage && JSONParse( sessionStorage.getItem( HISTORY_API_KEY_NAME ) ) || {};
			}
		}

		, fireStateChange = function( type, oldURL, newURL, statePushed ) {
			var newEvent = new _Event_constructor_(
				type === 2 ?
					'hashchange'
					:
					__GCC__CUSTOM_PAGE_CHANGE_EVENT__ && type === 3 ? __GCC__CUSTOM_PAGE_CHANGE_EVENT__ :
					'popstate'
			);
			var tmp;

			if( oldURL !== void 0 ) {
				newEvent["oldUrl"] = oldURL;
			}
			if( newURL !== void 0) {
				newEvent["newUrl"] = newURL;
			}
			newEvent[ HISTORY_API_KEY_NAME ] = true;

			if( !historyAPISupports && type == void 0 && global.onpopstate) {
				global.onpopstate(newEvent);
			}
			else if( __GCC__CUSTOM_PAGE_CHANGE_EVENT__ && type === 3 ) {
				newEvent["popstate"] = !statePushed;
				if( !_callOnPageChangeOnDispatchEvent && typeof (tmp = global["on" + __GCC__CUSTOM_PAGE_CHANGE_EVENT__]) === "function" ) {
					tmp.call(global, newEvent);
				}
			}

			if( __GCC__SUPPORT_IELT9__
				|| __GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__SUPPORT_OPERALT10__
			) {
				if( global.dispatchEvent
					&& !(__GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__SUPPORT_OPERALT10__ && _opera < 10)
				) {
					global.dispatchEvent(newEvent);
				}
				else {
					var handlers = IElt9_operalt10_events[newEvent.type];

					if( handlers ) for(var i in handlers) {
						if( handlers.hasOwnProperty(i)
							&& (
								typeof (tmp = handlers[i]) === "function"
								|| (tmp && (typeof tmp === "object") && (tmp = tmp.handleEvent))
							)
						) {
							tmp.call(global, newEvent);
						}
					}

				}
			}
			else {
				global.dispatchEvent(newEvent);
			}
		}

		, hashChanged

		, skipHashChange = false

		, _callOnPageChangeOnDispatchEvent
	;

	(function() {

		var windowPopState = global.onpopstate || null
			, windowHashChange = global.onhashchange// 'indefined' if browser unsupported hashchange
			, popstateFired = false
			, initialStateHandler = null
			, urlObject = normalizeUrl()
			, oldURL = urlObject._href

			, fireInitialState = function() {
				if ( initialFire && !( initialFire = false ) && urlObject._relative !== (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? libraryInternalSettings["basepath"] : default_basePath) ) {
					clearInterval( initialStateHandler );
					setTimeout( fireStateChange , 10);
				}
			}
		;

		hashChanged = function( event ) {
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
				return skipHashChange = false;
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

			popstateFired = false;
			initialFire = false;

			if ( oldHash != newHash ) {
				// fire hashchange
				fireStateChange(2, oldUrl, newUrl)
			}
		};

		if( !historyAPISupports ) {
			if( __GCC__SUPPORT_IELT9__ ) {
				if( global.addEventListener ) {
					global.addEventListener( "hashchange", hashChanged, false );
				}
				else {
					global.attachEvent( "onhashchange", hashChanged );
				}
			}
			else {
				global.addEventListener( "hashchange", hashChanged, false );
			}

			if( windowHashChange === void 0 ) { // TOO old browser, not supported hashchange
				setInterval(function() {
					hashChanged({});
				}, 100);
			}

			if( !windowHashChange ) {
				windowHashChange = null;
			}
		}
		else if( global.addEventListener ) {
			if( _document.readyState !== "complite" ) {
				if( initialFire ) {
					global.addEventListener( "popstate", firstPopStateChange_bug, false );
					global.addEventListener( "load", function() {
						setTimeout(firstPopStateChange_bug, 0);
					}, false );
				}
				else {
					firstPopStateChange_bug = null;
				}
				global.addEventListener( "popstate", function(e) {
					initialFire = false;
					popstateFired = true;
					if( __GCC__FIX_OPERA_LT_13_HREF_BUG__ && _opera ) {
						// Opera has a bug with relative links
						// Opera < 13 has a strange bug in href property then you using History API
						//  description:
						//  in html: <a id=testlink href='?action'>page1</a>
						//  After history.pushState(null, "", "other_page");
						//  testlink.href != ( location.protocol + "//" + location.host + location.pathname + testlink.getAttribute("href") )
						historyReplaceState.call(
							windowHistory
							, e.state
							//FIXME Сделать что-нибудь с document.title, сейчас он не изменяется при pushState и при popstate
							//  Например можно сделать "свой" state в объекте event[PopStateEvent]
							, document.title
							, location.href
						);
					}
				}, false );
			}
			else {
				initialFire = false;
			}
		}

		function firstPopStateChange_bug(e) {
			// popstate ignore the event when the document is loaded
			if ( e && initialFire === windowLocation.href ) {
				if(e.stopImmediatePropagation) {
					e.stopImmediatePropagation();
				}
				else {
					e.stopPropagation();
				}
			}
			initialFire = false;
			global.removeEventListener( "popstate", firstPopStateChange_bug, false );
			firstPopStateChange_bug = null;
		}

		// avoid polyfilling twice
		_legacyBrowsers_HistoryAccessors[ HISTORY_API_KEY_NAME ] = {
			get: function() {
				return true;
			}
		};

		if( HistoryPrototype ) {
			if( __GCC__FIX_OPERA_AND_WEBKIT_LOCATION__
				// For Safari and old Chrome
				//  fix for Opera in the bottom of this file
				&& (tmp = _document.createElement("a"), tmp.href = "http://g.g/%25", tmp.pathname === "/%")
				&& "URL" in _document
			) {
				_legacyBrowsers_HistoryAccessors.location["get"] = function() {
					return Location;
				};
				LocationAccessors["href"]["get"] = function() {
					// document.URL return undecoded href
					return _document["URL"];
				};
				LocationAccessors["pathname"]["get"] = function() {
					var _href = this.href
						, _search = this.search
						, _hash = this.hash
						, _host = this.host
						, index = _href.indexOf(_host)
					;

					return _href.substr(index + _host.length).replace(_search, "").replace(_hash, "");
				};

				if( !hasStateSupport ) {
					_legacyBrowsers_HistoryAccessors.state["get"] = function() {
						return historyStorage()[ global.location.href ];
					}
				}
			}

			tmp = {};
			// add a location object inside the object History
			tmp["location"] = _legacyBrowsers_HistoryAccessors.location;
			if( !hasStateSupport ) {
				// Safari does not support the built-in object state
				tmp["state"] = _legacyBrowsers_HistoryAccessors.state;
			}
			tmp[ HISTORY_API_KEY_NAME ] = _legacyBrowsers_HistoryAccessors[HISTORY_API_KEY_NAME];

			createStaticObject(HistoryPrototype, tmp);
		}
		else if( __GCC__SUPPORT_IELT8__ && VBInc) {
			_legacyBrowsers_History = createStaticObject( _legacyBrowsers_History, _legacyBrowsers_HistoryAccessors );
		}

		Location = createStaticObject(
			( __GCC__SUPPORT_IELT9__ )
				&& _Object_defineProperties
				?
				createMutableObjectForIE8(Location)
				:
				Location
			, LocationAccessors
		);

		/*TODO:: Make this working in IE8
		 if( Location != global["location"] && Object.getOwnPropertyDescriptor ) {
		 	//originalWindowLocationDescriptor = Object.getOwnPropertyDescriptor(global, "location").value;
		 	execScript( 'Public location', 'VBScript');
		 	Object.defineProperty(window, "location", {value: Location})
		 	eval("var location = A")
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
	})();

	function documentClickHandler( e ) {
		var event = e || __GCC__SUPPORT_IELT9__ && global["event"]
			, target = event.target || __GCC__SUPPORT_IELT9__ && event.srcElement
			, defaultPrevented =
				__GCC__SUPPORT_IELT9__ ? ("defaultPrevented" in event ? event["defaultPrevented"] : event["returnValue"] === false)
					:
					event["defaultPrevented"]
			;

		if ( target && target.nodeName === "A" && !defaultPrevented ) {

			e = normalizeUrl( target.getAttribute( "href", 2 ), true );

			if ( e._hash && e._hash !== "#" && e._hash === e._href.replace( normalizeUrl()._href.split( "#" ).shift(), "" ) ) {

				skipHashChange = true;
				history.location.hash = e._hash;

				e = e._hash.replace( /^#/, '' );

				if ( ( target = document.getElementById( e ) ) && target.id === e ) {
					target.scrollIntoView();
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

	_callOnPageChangeOnDispatchEvent = _documentElement.dispatchEvent !== void 0 && (!_opera || _opera > 10) && (function(testElement) {
		// Opera call onpagechange on window.dispatchEvent(new Event("pagechange"))
		var result = false;
		if( testElement.dispatchEvent ) {
			testElement["on" + __GCC__CUSTOM_PAGE_CHANGE_EVENT__] = function() {
				result = true;
			};
			testElement.dispatchEvent(new _Event_constructor_(__GCC__CUSTOM_PAGE_CHANGE_EVENT__));
		}
		return result;
	})(document.createElement("_"));

	if( __GCC__SUPPORT_IELT8__ && VBInc) {
		// In _legacyBrowsers_History
	}
	else {
		HistoryPrototype.pushState = _pushState;
		HistoryPrototype.replaceState = _replaceState;
	}

	function _pushState( state, title, url, replace ) {
		var urlObject = url && normalizeUrl( url );

		if ( historyAPISupports ) {
			if ( replace
				// Если урл не поменялся, то вызываем history.replaceState
				// TODO:: В нативном History API мы можем запушить новый state без изменения урла
				|| (
					urlObject
					&& urlObject._href == normalizeUrl()._href
				)
			) {
				historyReplaceState.call( this, state, title, url );
			}
			else {
				if( __GCC__SUPPORT_OLD_W3C_BROWSERS__ && __GCC__FIX_OPERA_LT_13_HREF_BUG__ && _opera && urlObject && urlObject._pathname == "/" ) {
					// Opera has a bug with relative links
					// Opera < 13 has a strange bug in href property then you using History API
					//  description:
					//  in html: <a id=testlink href='?action'>page1</a>
					//  After history.pushState(null, "", "other_page");
					//  testlink.href != ( location.protocol + "//" + location.host + location.pathname + testlink.getAttribute("href") )
					historyPushState.call( this, state, title, url + "?" );
					historyReplaceState.call( this, state, title, url );
				}
				else {
					historyPushState.call( this, state, title, url );
				}
			}
		}

		if( !hasStateSupport ) {// browsers without History API support or Safari
			var stateObject = historyStorage()
				, currentHref = normalizeUrl()._href
			;

			urlObject = url && normalizeUrl( url );

			initialFire = false;
			url = urlObject ? urlObject._href : currentHref;

			if ( replace && stateObject[ currentHref ] ) {
				delete stateObject[ currentHref ];
			}

			if ( sessionStorage ) {
				stateObject[ url ] = state;
				historyStorage( stateObject );
				state = null;
			}
		}

		if( !historyAPISupports ) {
			if ( urlObject && urlObject._relative != normalizeUrl()._relative ) {
				skipHashChange = true;
				if ( replace ) {
					windowLocation.replace( "#" + urlObject._special );
				}
				else {
					windowLocation.hash = urlObject._special;
				}
			}
		}

		if( __GCC__CUSTOM_PAGE_CHANGE_EVENT__ ) {
			var currentUrl = normalizeUrl()._nohash;

			if( !_lastPageUrlWithoutHash || (_lastPageUrlWithoutHash != currentUrl) ) {
				fireStateChange(3, _lastPageUrlWithoutHash, _lastPageUrlWithoutHash = currentUrl, true);
			}
		}
	}


	function _replaceState( state, title, url ) {
		_pushState.call( this, state, title, url, true );
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

			_legacyBrowsers_History.pushState = function( state, title, url, replace, lfirst ) {

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
						_legacyBrowsers_History.pushState( state, title, urlObject._href, 0, 1 );
					}
					else {
						IElt8_iframe["storage"] = state;
						windowLocation.replace( "#" + (__GCC__LIBRARY_INTERNAL_SETTINGS__ ? libraryInternalSettings["type"] : '/') + urlObject._special );
					}
				}
				else if ( urlObject._href != currentHref || lfirst ) {
					if ( !IElt8_iframe["lfirst"] ) {
						IElt8_iframe["lfirst"] = 1;
						_legacyBrowsers_History.pushState( IElt8_iframe["storage"], title, currentHref, 0, 1 );
					}
					content = [ '\x3cscript\x3e', 'lfirst=1;', 0,'storage=' + JSONStringify( state ) + ';', '\x3c/script\x3e' ];
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

	if( __GCC__FIX_OPERA_AND_WEBKIT_LOCATION__ ) {
		// Opera pathname bug
		// if location.href is "http://example.com/search/%25"
		// location.pathname is "/search/%" but should be "/search/%25"
		if( historyAPISupports
			&& _opera
			&& Object.defineProperty
			&& Object.getOwnPropertyDescriptor
		) {
			tmp = Object.getOwnPropertyDescriptor(global["location"], "pathname");

			if( tmp ) {
				tmp["get"] = function() {
					var _href = this.href
						, _search = this.search
						, _hash = this.hash
						, _host = this.host
						, index = _href.indexOf(_host)
					;
					return _href.substr(index + _host.length).replace(_search, "").replace(_hash, "");
				};
			}

			if( tmp ) {
				if( global["Location"] && global["Location"].prototype ) {
					Object.defineProperty(global["Location"].prototype, "pathname", tmp)
				}
				Object.defineProperty(global["location"], "pathname", tmp)
			}
		}
	}

	if( __GCC__FIX_CHROME_FULLSCREEN_BUG__ ) {
		var statesList = [], fullScreenExitPopState = false, fullScreenExitHashChange = false;

		if( historyAPISupports && global["chrome"] ) {
			tmp = function(e) {
				var tmp, stopProp;

				if( historyAPISupports === false ) {//in Fullscreen mode
					if( skipHashChange === true ) {
						stopProp = true;

						if( e.type === "hashchange" ) {
							// hashChanged not added to window.addEventListener("hashchange", hashChanged)
							//  so we need to write this string again
							skipHashChange = false;
						}
					}
					else if( e.type === "popstate" ) {
						statesList.pop();
					}
				}
				else if( fullScreenExitPopState === true ) {
					fullScreenExitPopState = false;
					stopProp = true;

					while(tmp = statesList.shift()) {
						historyPushState.call(windowHistory, tmp._state, tmp._title, tmp._url);
					}
				}
				else if( fullScreenExitHashChange === true ) {
					fullScreenExitHashChange = false;
					stopProp = true;
				}

				if( stopProp ) {
					e.stopPropagation();
					if( e.stopImmediatePropagation ) {
						e.stopImmediatePropagation()
					}
				}
			};
			global.addEventListener("popstate", tmp, true);
			global.addEventListener("hashchange", tmp, true);

			tmp = function() {
				var fullscreenEnabled = "fullscreenEnabled" in _document ? _document["fullscreenEnabled"] : _document["webkitIsFullScreen"]
					, tmp
				;

				if( fullscreenEnabled && historyAPISupports ) {
					// switch to hash navigation

					historyAPISupports = false;
					document.addEventListener("click", documentClickHandler, true);

//					windowHistory.replaceState(windowHistory.state, _document.title, windowHistory.location.href);

					tmp = function pushState(state, title) {
						var result;
						historyPushState.call(this, state, title, window.location.href);
						result = this.replaceState["__origin"].apply(this, arguments);
						statesList.push({_url: this.location.href, _state: state, _title: title});
						return result;
					};
					tmp["__origin"] = windowHistory.pushState;
					windowHistory.pushState = tmp;
					tmp = function replaceState(state, title) {
						var result;
						historyReplaceState.call(this, state, title, window.location.href);
						result = replaceState["__origin"].apply(this, arguments);
						statesList[statesList.length - 1] = {_url: this.location.href, _state: state, _title: title};
						return result;
					};
					tmp["__origin"] = windowHistory.replaceState;
					windowHistory.replaceState = tmp;

					statesList = [];
				}
				else if( !fullscreenEnabled && !historyAPISupports ) {
					if( tmp = windowHistory.pushState["__origin"] ) {//If something goes wrong do not touche windowHistory
						// switch back to native History API
						windowHistory.pushState = tmp;
						windowHistory.replaceState = windowHistory.replaceState["__origin"];

						if( tmp = statesList.length ) {
							fullScreenExitPopState = true;
							fullScreenExitHashChange = true;
							windowHistory.go(-1 * tmp);
						}
					}

					historyAPISupports = true;
					document.removeEventListener("click", documentClickHandler, true);
				}
			};
			_document.addEventListener("webkitfullscreenchange", tmp);
			_document.addEventListener("webkitfullscreenerror", tmp);
		}
	}

	if( __GCC__CUSTOM_PAGE_CHANGE_EVENT__ ) {
		// NOTE: __GCC__CUSTOM_PAGE_CHANGE_EVENT__ should be after __GCC__FIX_CHROME_FULLSCREEN_BUG__

		var _lastPageUrlWithoutHash = normalizeUrl()._nohash;

		tmp = function(e) {
			var currentUrl = normalizeUrl()._nohash;

			if( !_lastPageUrlWithoutHash || (_lastPageUrlWithoutHash != currentUrl) ) {
				fireStateChange(3, _lastPageUrlWithoutHash, _lastPageUrlWithoutHash = currentUrl);
			}
		};

		if( __GCC__SUPPORT_IELT9__ && !global.addEventListener ) {
			global.attachEvent("popstate", tmp);
			global.attachEvent("hashchange", tmp);
		}
		else {
			global.addEventListener("popstate", tmp, false);
			global.addEventListener("hashchange", tmp, false);
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

	//cleanup
	tmp = VBInc = createStaticObject = _Object_defineProperties = _unSafeBind =
		_legacyBrowsers_HistoryAccessors = LocationAccessors = windowHistoryPrototype = HistoryPrototype =
			_replaceState =
			null;
}).call( window );
