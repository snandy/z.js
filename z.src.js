/*!
 * Z.js v0.1.0
 * @snandy 2014-02-28 15:53:01
 *
 */
~function(window, undefined) {

var OP = Object.prototype
var FP = Function.prototype
var types = ['Array', 'Function', 'Object', 'String', 'Number', 'Boolean']

var toString = OP.toString
var slice  = types.slice
var push   = types.push
var concat = types.concat

var nativeForEach = types.forEach
var nativeMap = types.map
var nativeEvery = types.every
var nativeSome = types.some
var nativeIndexOf = types.indexOf
var nativeFilter = types.filter
var nativeBind = FP.bind

var doc = window.document

function Z(selector, context) {
    return new Z.prototype.init(selector, context)
}

Z.identity = function(val) { return val }


// 特性检测
var support = function() {
    var div = doc.createElement('div')
    div.className = 'a'
    div.innerHTML = '<p style="color:red;"><a href="#" style="opacity:.4;float:left;">a</a></p>'
    div.setAttribute('class', 't')
    
    var p = div.getElementsByTagName('p')[0]
    var a = p.getElementsByTagName('a')[0]
    
    // http://www.cnblogs.com/snandy/archive/2011/08/27/2155300.html
    var setAttr = div.className === 't'
    // http://www.cnblogs.com/snandy/archive/2011/03/11/1980545.html
    var cssText = /;/.test(p.style.cssText)
    var opacity = /^0.4$/.test(a.style.opacity)
    var getComputedStyle = !!(doc.defaultView && doc.defaultView.getComputedStyle)
    
    var sliceOnNodeList = true
    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof doc !== 'undefined') {
            slice.call(doc.getElementsByTagName('body'))
        }
    } catch (e) {
        sliceOnNodeList = false
    }

    return {
        setAttr : setAttr,
        cssText : cssText,
        opacity : opacity,
        classList : !!div.classList,
        cssFloat : !!a.style.cssFloat,
        getComputedStyle : getComputedStyle,
        sliceOnNodeList: sliceOnNodeList

    }
}()
// For IE9/Firefox/Safari/Chrome/Opera
var makeArray = support.sliceOnNodeList ? function(obj) {
    return sliceArgs(obj)
} : function(obj) {
    var res = []
    for (var i = 0, len = obj.length; i < len; i++) {
        res[i] = obj[i]
    }
    return res
}

// Iterator
function forEach(obj, iterator, context) {
    if (obj == null) return
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context)
    } else if ( obj.length === +obj.length ) {
        for (var i = 0; i < obj.length; i++) {
            if (iterator.call(context||obj[i], obj[i], i, obj) === true) return
        }
    } else {
        for (var k in obj) {
            if (iterator.call(context||obj[k], obj[k], k, obj) === true) return
        }
    }
}

// Return the results of applying the iterator to each element
function map(obj, iterator, context) {
    var results = []
    if (obj == null) return results
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context)     
    forEach(obj, function(val, i, coll) {
        results[i] = iterator.call(context, val, i, coll)
    })
    return results
}

function sliceArgs(args, start) {
    return slice.call(args, start || 0)
}

function generateUUID(id) {
    var seed = 0
    return function() {
        return seed++
    }
}

/**
 * Browser Detect
 * Browser.ie(6,7,8,9,10) / browser.firefox / browser.chrome ...
 *
 * 注意：IE11中Browser.ie返回false，把IE11当成标准浏览器吧，别叫它IE
 * IE11 API变化: http://www.cnblogs.com/snandy/p/3174777.html
 */
var Browser = function(ua) {
    var b = {
        sogou: /se/.test(ua),
        opera: /opera/.test(ua),
        chrome: /chrome/.test(ua),
        firefox: /firefox/.test(ua),
        maxthon: /maxthon/.test(ua),
        tt: /TencentTraveler/.test(ua),
        ie: /msie/.test(ua) && !/opera/.test(ua),
        safari: /webkit/.test(ua) && !/chrome/.test(ua)
    }
    var mark = ''
    for (var i in b) {
        if (b[i]) {
            mark = 'safari' == i ? 'version' : i
            break
        }
    }
    var reg = RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)')
    b.version = mark && reg.test(ua) ? RegExp.$1 : '0'

    var iv = parseInt(b.version, 10)
    for (var i = 6; i < 11; i++) {
        b['ie'+i] = iv === i
    }
    
    return b
}(navigator.userAgent.toLowerCase())


/**
 * @class Z.Object
 *
 * A collection of useful static methods to deal with objects.
 * @singleton
 */
 Z.Object = function() {
    // Retrieve the keys of an object's properties.
    var keys = Object.keys || function(obj) {
        obj = Object(obj)
        var result = [], i = 0
        for (var a in obj) result[i++] = a
        return result
    }
    // Retrieve the values of an object's properties.
    var values = function(obj) {
        var result = [], i = 0
        for (var key in obj) result[i++] = obj[key]
        return result
    }
    // Invert the keys and values of an object. The values must be serializable.
    var invert = function(obj) {
        obj = Object(obj)
        var result = {}
        for (var a in obj) result[obj[a]] = a
        return result
    }
    // Convert an object into a list of `[key, value]` pairs.
    var pairs = function(obj) {
        var result = [], i = 0
        for (var a in obj) result[i] = [a, obj[a]]
        return result
    }
    // Return a copy of the object only containing the whitelisted properties.
    var pick = function(obj) {
        var copy = {}
        var keys = sliceArgs(arguments, 1)
        forEach(keys, function(key) {
          if (key in obj) copy[key] = obj[key]
        })
        return copy
    }
    var toQueryString = function(obj) {
        var a = []
        forEach(obj, function(val, key) {
            if ( Z.isArray(val) ) {
                forEach(val, function(v, i) {
                    a.push( key + '=' + encodeURIComponent(v) )
                })
            } else {
                a.push(key + '=' + encodeURIComponent(val))
            }
        })
        return a.join('&')
    }

    return {
        keys: keys,
        values: values,
        pairs: pairs,
        invert: invert,
        pick: pick,
        toQueryString: toQueryString
    }

 }()
/**
 * @class Z.Function
 * 
 * Create a function bound to a given object (assigning `this`, and arguments, optionally)
 * @singleton
 */
Z.Function = function() {
    function bind(func, context) {
        var args, bound
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, sliceArgs(arguments, 1))
        if (!Z.isFunction(func)) throw new TypeError
        args = sliceArgs(arguments, 2)
        return bound = function() {
            if (!(this instanceof bound)) return func.apply(context, args.concat(sliceArgs(arguments)))
            noop.prototype = func.prototype
            var self = new noop
            noop.prototype = null
            var result = func.apply(self, args.concat(sliceArgs(arguments)))
            if (Object(result) === result) return result
            return self
        }
    }
    function once(func) {
        var run, memo
        return function() {
            if (run) return memo
            run = true
            return memo = func.apply(this, arguments)
        }
    }
    function delay(func, wait) {
        return function() {
            var context = this, args = arguments
            setTimeout(function() {
                func.apply(context, args)
            }, wait)
        }
    }
    function debounce(func, wait, immediate) {
        var timeout
        return function() {
            var context = this, args = arguments
            later = function() {
                timeout = null
                if (!immediate) func.apply(context, args)
            }
            var callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(context, args)
        }
    }
    function throttle(func, wait) {
        var context, args, timeout, throttling, more, result
        var whenDone = debounce(function() {
                more = throttling = false
            }, wait)
        return function() {
            context = this, args = arguments
            var later = function() {
                timeout = null
                if (more) func.apply(context, args)
                whenDone()
            }
            if (!timeout) timeout = setTimeout(later, wait)
            
            if (throttling) {
                more = true
            } else {
                result = func.apply(context, args)
            }
            whenDone()
            throttling = true
            return result
        }
    }

    /**
     * 防止点击太快
     */
    function uniq(func, wait) {
        var canExecute = true
        wait = wait || 1000
        return function() {
            if (canExecute) {
                func.apply(this, arguments)
                canExecute = false
            }
            setTimeout(function() {
                canExecute = true
            }, wait)
        }
    }

    return {
        bind: bind,
        once: once,
        uniq: uniq,
        delay: delay,
        debounce: debounce,
        throttle: throttle
    }
}()
/**
 * @class Z.Array
 *
 * A set of useful static methods to deal with arrays; provide missing methods for older browsers.
 * @singleton
 */
 Z.Array = function() {

    function every(obj, iterator, context) {
        iterator || (iterator = Z.identity)
        var result = true
        if (obj == null) return result
        if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context)
        forEach(obj, function(value, index, list) {
            if ( !(result = result && iterator.call(context, value, index, list)) ) return true
        })
        return !!result
    }

    function some(obj, iterator, context) {
        iterator || (iterator = Z.identity)
        var result = false
        if (obj == null) return result
        if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context)
        forEach(obj, function(value, index, list) {
          if (result || (result = iterator.call(context, value, index, list))) return true
        })
        return !!result
    }

    function contains(obj, target) {
        if (obj == null) return false
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1
        return some(obj, function(value) {
            return value === target
        })
    }

    function filter(obj, iterator, context) {
        var results = []
        if (obj == null) return results
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context)
        forEach(obj, function(value, index, list) {
          if (iterator.call(context, value, index, list)) results[index] = value
        })
        return results
    }

    // Returns a new array with unique items
    function unique(obj) {
        var result = []
        forEach(obj, function(item) {
            if ( !contains(result, item) ) result.push(item)
        })
        return result
    }

    return {
        forEach: forEach,
        map: map,
        every: every,
        some: some,
        contains: contains,
        filter: filter,
        unique: unique
    }

 }()

/**
 * @class Z.String
 *
 * A collection of useful static methods to deal with strings. 
 * @singleton
 */
Z.String = function() {

    var ZO = Z.Object
    var regFormat = /\{(\d+)\}/g
    var regTrim   = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g
    var entityMap = {
        escape: {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        }
    }
    entityMap.unescape = ZO.invert(entityMap.escape)
    var entityReg = {
        escape: RegExp('[' + ZO.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: RegExp('(' + ZO.keys(entityMap.unescape).join('|') + ')', 'g')
    }

    function escape(html) {
        if (typeof html !== 'string') return ''
        return html.replace(entityReg.escape, function(match) {
            return entityMap.escape[match]
        })
    }

    function unescape(str) {
        if (typeof str !== 'string') return ''
        return str.replace(entityReg.unescape, function(match) {
            return entityMap.unescape[match]
        })    
    }

    return {
        htmlEscape: escape,
        htmlUnescape: unescape,

        urlAppend : function(url, str) {
            if (Z.isString(str) && str.length) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + str    
            }
            return url
        },

        trim: function(str) {
            return str.replace(regTrim, '')
        },

        ellipsis: function(val, len, word) {
            if (val && val.length > len) {
                if (word) {
                    var vs = val.substr(0, len - 2)
                    var i = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'))
                    if (i !== -1 && i >= (len - 15)) {
                        return vs.substr(0, i) + '...'
                    }
                }
                return val.substr(0, len - 3) + '...'
            }
            return val
        },

        format: function(str) {
            var args = sliceArgs(arguments, 1)
            return str.replace(regFormat, function(m, i) {
                return args[i]
            })
        }

    }

}()
/**
 * @class Z.Class
 * 
 * JavaScript OOP, Support class, inheritance, namespace, private and more.
 * @Singleton
 */
Z.Class = function() {

    function Observer(type, context) {
        this.type = type
        this.scope = context || window
        this.listeners = []
    }
    Observer.prototype = {
        subscribe: function(fn, scope, options) {
            var listeners = this.listeners
            if (!fn || this._find(fn, scope) !== -1) return false

            var listener = {
                fn: fn,
                scope: scope || this.scope,
                opt: options
            }

            if (this.firing) {
                // if we are currently firing this event, don't disturb the listener loop
                listeners = this.listeners = listeners.slice(0)
            }
            listeners.push(listener)

            return true
        },
        unsubscribe: function(fn, scope) {
            if (!fn) {
                return this.clear()
            }

            var index = this._find(fn, scope)
            if (index !== -1) {
                this._delete(index)
                return true
            }

            return false
        },
        publish: function() {
            var listeners = this.listeners
            var count = listeners.length
            var i = 0, xargs, listener

            if (count > 0) {
                this.firing = true
                while (listener = listeners[i++]) {
                    xargs = sliceArgs(arguments)
                    if (listener.opt) {
                        xargs.push(listener.opt)
                    }
                    if (listener && listener.fn.apply(listener.scope, xargs) === false) {
                        return (this.firing = false)
                    }
                }
            }
            this.firing = false

            return true
        },
        clear: function() {
            var l = this.listeners.length, i = l
            while (i--) this._delete(i)
            this.listeners = []
            return l
        },
        _find: function(fn, scope) {
            var listeners = this.listeners
            var i = listeners.length
            var listener, s

            while (i--) {
                if (listener = listeners[i]) {
                    if (listener.fn === fn && (!scope || listener.scope === scope)) return i
                }
            }
            return -1
        },
        _delete: function(index) {
            var listeners = this.listeners
            var o = listeners[index]
            if (o) {
                delete o.fn
                delete o.scope
                delete o.opt
            }
            listeners.splice(index, 1)
        }
    }

    var Event = {
        on: function(type, fn, scope, o) {
            var config, ev
            if (typeof type === 'object') {
                o = type
                for (type in o) {
                    if (!o.hasOwnProperty(type)) continue
                    config = o[type]
                    this.on(type, config.fn || config, config.scope || o.scope, config.fn ? config : o)
                }
            } else {
                this._events = this._events || {}
                ev = this._events[type] || false
                if (!ev) {
                    ev = this._events[type] = new Observer(type, this)
                }
                ev.subscribe(fn, scope, o)
            }
        },
        off: function(type, fn, scope) {
            var config, ev, o, index
            if (typeof type === 'object') {
                o = type
                for (type in o) {
                    if (!o.hasOwnProperty(type)) continue
                    config = o[type]
                    this.un(type, config.fn || config, config.scope || o.scope)
                }
            } else {
                ev = this._events[type]
                if (ev) ev.unsubscribe(fn, scope)
            }
        },
        clearEvent: function(type) {
            var ev = this._events && this._events[type]
            if (ev) ev.clear()
        },
        fire: function(type) {
            var ev
            if (!this._events || !(ev = this._events[type])) {
                return true
            }
            return ev.publish.apply(ev, sliceArgs(arguments, 1))
        }
    }

    // initialize namespace
    function namespace(classPath, globalNamespace) {
        if ( !Z.isString(classPath) ) throw new Error('classPath must be a string')
        globalNamespace = Z.isObject(globalNamespace) ? globalNamespace : window
        var arr = classPath.split('.')
        var namespace = globalNamespace
        var className = arr.pop()

        while (arr.length) {
            var name = arr.shift()
            var obj = namespace[name]
            if (!obj) {
                namespace[name] = obj = {}
            }
            namespace = obj
        }

        var clazz = namespace[className]
        if ( Z.isFunction(clazz) ) throw new Error(className + ' is already defined')
        namespace[className] = undefined
        return {
            namespace: namespace,
            className: className
        }
    }

    var create = Object.create ? 
            function(o) { return Object.create(o) } : 
            (function() { // Reusable constructor function for the Object.create() shim.
                function F() {}
                return function(o) {
                    F.prototype = o
                    return new F
                }
            }())

    // define a class
    function Class(name, superClass, factory) {
        if (!factory) {
            if (!superClass) {
                throw new Error('class create failed, verify definitions')
            }
            factory = superClass
            superClass = Object
        }

        function Constructor() {
            if ( Z.isFunction(this.init) ) {
                this.init.apply(this, arguments)
            }
        }
        Constructor.toString = function() { return name }

        var supr = superClass.prototype
        // var proto = Constructor.prototype = new superClass
        var proto = Constructor.prototype = create(supr)
        proto.constructor = factory
        factory.call(proto, supr)
        
        Z.extend(proto, Event)

        if (Class.amd) return Constructor
        var obj = namespace(name, Class.globalNamespace)
        obj.namespace[obj.className] = Constructor
    }

    Class.statics = function(clazz, obj) {
        Z.extend(clazz, obj)
    }

    Class.methods = function(clazz, obj, override) {
        var proto = clazz.prototype
        for (var m in obj) {
            if ( !Z.isFunction(obj[m]) ) throw new Error(m + ' is not a function')
            if (override) {
                proto[m] = obj[m]
            } else {
                if (!proto[m]) {
                    proto[m] = obj[m]
                }
            }
        }
    }

    return Class
}()
/**
 * CSS Selector
 * 
 * @param {Object} selector
 * @param {Object} context
 * 
 * 1, 通过id获取,该元素是唯一的
 *    query('#id')
 * 
 * 2, 通过className获取
 *    query('.cls') 获取文档中所有className为cls的元素
 *    query('.cls', el)
 *    query('.cls', '#id')
 *    query('span.cls') 获取文档中所有className为cls的span元素
 *    query('span.cls', el) 获取指定元素中className为cls的元素, el为HTMLElement (不推荐)
 *    query('span.cls', '#id') 获取指定id的元素中className为cls的元素
 *    
 * 3, 通过tagName获取
 *    query('span') 获取文档中所有的span元素
 *    query('span', el) 获取指定元素中的span元素, el为HTMLElement (不推荐)
 *    query('span', '#id') 获取指定id的元素中的span元素
 * 
 * 4, 通过attribute获取
 *    query('[name]') 获取文档中具有属性name的元素
 *    query('[name]', el)
 *    query('[name]', '#id')
 *    query('[name=uname]') 获取文档中所有属性name=uname的元素
 *    query('[name=uname]', el)
 *    query('[name=uname]', '#id')
 *    query('input[name=uname]') 获取文档中所有属性name=uname的input元素
 *    query('input[name=uname]', el)
 *    query('input[name=uname]', '#id')
 *
 */

function byId(id) {
    return document.getElementById(id)
}
var query = function() {
    // selector regular expression
    var rId = /^#[\w\-]+/
    var rTag = /^([\w\*]+)$/
    var rCls = /^([\w\-]+)?\.([\w\-]+)/
    var rAttr = /^([\w]+)?\[([\w]+-?[\w]+?)(=(\w+))?\]/

    function check(attr, val, node) {
        var reg = RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)')
        var attribute = attr === 'className' ? node.className : node.getAttribute(attr)
        if (attribute) {
            if (val) {
                if (reg.test(attribute)) return true
            } else {
                return true
            }
        }
        return false
    }    
    function filter(all, attr, val) {
        var el, result = []
        var i = 0, r = 0
        while ( (el = all[i++]) ) {
            if ( check(attr, val, el) ) {
                result[r++] = el
            }
        }
        return result
    }
        
    return function(selector, context) {
        var s = selector, arr = []
        var context = context === undefined ? doc : 
                typeof context === 'string' ? query(context)[0] : context
                
        if (!selector) return arr
        
        // id和tagName 直接使用 getElementById 和 getElementsByTagName

        // id
        if ( rId.test(s) ) {
            arr[0] = byId( s.substr(1, s.length) )
            return arr
        }

        // Tag name
        if ( rTag.test(s) ) {
            return makeArray(context.getElementsByTagName(s))
        }

        // 优先使用querySelector，现代浏览器都实现它了
        if (context.querySelectorAll) {
            if (context.nodeType === 1) {
                var old = context.id, id = context.id = '__Z__'
                try {
                    return context.querySelectorAll('#' + id + ' ' + s)
                } catch(e){
                    throw new Error('querySelectorAll: ' + e)
                } finally {
                    old ? context.id = old : context.removeAttribute('id')
                }
            }
            return makeArray(context.querySelectorAll(s))
        }

        // ClassName
        if ( rCls.test(s) ) {
            var ary = s.split('.')
            var tag = ary[0] 
            var cls = ary[1]
            if (context.getElementsByClassName) {
                var elems = context.getElementsByClassName(cls)
                if (tag) {
                    for (var i = 0, len = elems.length; i < len; i++) {
                        var el = elems[i]
                        el.tagName.toLowerCase() === tag && arr.push(el)
                    }
                    return arr
                } else {
                    return makeArray(elems)
                }
            } else {
                var all = context.getElementsByTagName(tag || '*')
                return filter(all, 'className', cls)
            }
        }

        // Attribute
        if ( rAttr.test(s) ) {
            var result = rAttr.exec(s)
            var all = context.getElementsByTagName(result[1] || '*')
            return filter(all, result[2], result[4])
        }
    }

}()

var tempParent = document.createElement('div')
function matches(el, selector) {
    if (!el || el.nodeType !== 1) return false
    var matchesSelector = el.webkitMatchesSelector || el.mozMatchesSelector ||
                          el.oMatchesSelector || el.matchesSelector
    if (matchesSelector) return matchesSelector.call(el, selector)
    // fall back to performing a selector:
    var match, parent = el.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(el)
    match = query(selector, parent)
    temp && tempParent.removeChild(el)
    return !!match.length
}

Z.matches = matches

Z.prototype = {
    constructor: Z,
    init: function(selector, context) {
        // For slice
        if (!selector) return

        // For DOM-ready
        if (typeof selector === 'function') return Z.ready(selector)

        // For Z() object
        if ( Z.isZ(selector) ) return selector

        // For Array or nodes
        if ( Z.isArrayLike(selector) && !Z.isString(selector) ) return this.pushStack(selector)

        // For HTMLElement or window
        if (selector.nodeType || selector === window) {
            this[0] = selector
            this.length = 1
            return
        }

        // For CSS selector
        var nodes = query(selector, context)
        this.pushStack(nodes)
    },

    length: 0,

    find: function(selector, i) {
        var context = i === undefined ? this[0] : this[i]
        return new Z.prototype.init(selector, context)
    },

    toArray: function() {
        return sliceArgs(this)
    },

    pushStack: function(arr) {
        push.apply(this, makeArray(arr))
    },

    slice: function() {
        var ret = Z()
        var arr = slice.apply(this, arguments)
        push.apply(ret, arr)
        return ret
    },

    eq: function(i) {
        return i === -1 ?
            this.slice(i) :
            this.slice(i, +i + 1)
    },

    first: function() {
        return this.eq(0)
    },

    last: function() {
        return this.eq(-1)
    },

    get: function(i) {
        return i == null ?
            this.toArray() :
            (i < 0 ? this.slice(i)[0] : this[i])
    },

    each: function(iterator) {
        forEach(this, iterator)
        return this
    },

    map: function(iterator) {
        return Z(map(this, function(el, i) {
            return iterator.call(el, el, i)
        }))
    },

    remove: function() {
        return this.each(function() {
            if (this.parentNode != null)
            this.parentNode.removeChild(this)
        })
    },

    closest: function(selector, context) {
        var node = this[0], collection = false
        while ( node && !matches(node, selector) )
            node = node !== context && !Z.isDocument(node) && node.parentNode
        return Z(node)
    },

    push: push,
    sort: types.sort,
    splice: types.splice
}

Z.fn = Z.prototype.init.prototype = Z.prototype

Z.extend = Z.fn.extend = function() {
    var src, copyIsArray, copy, name, options, clone
    var i = 1
    var deep = false
    var length = arguments.length
    var target = arguments[0] || {}

    // 深复制
    if (target === true) {
        deep = target
        target = arguments[1] || {}
        i = 2
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !Z.isFunction(target) ) {
        target = {}
    }

    // 拷贝到Z对象自身
    if ( length === i ) {
        target = this
        --i
    }

    for ( options = arguments[i]; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( options != null ) {
            for (name in options) {
                src = target[name]
                copy = options[name]

                // Prevent never-ending loop
                if (target === copy) continue

                // 递归 objects or arrays
                if ( deep && copy && ( Z.isObject(copy) || (copyIsArray = Z.isArray(copy)) ) ) {
                    if (copyIsArray) {
                        copyIsArray = false
                        clone = src && Z.isArray(src) ? src : []
                    } else {
                        clone = src && Z.isObject(src) ? src : {}
                    }

                    target[name] = Z.extend(deep, clone, copy)

                } else if (copy !== undefined) {
                    target[ name ] = copy
                }
            }
        }
    }

    return target
}

Z.each = forEach

Z.map = map

// Z.firefox, Z.chrome, Z.safari, Z.opera, Z.ie, Z.ie6, Z.ie7, Z.ie8, Z.ie9, Z.ie10, Z.sogou, Z.maxthon
Z.extend(Browser)

// data, removeData
Z.fn.extend({
    data: function(key, value) {
        var el = this[0]
        var cache = Z.cache
        if (key === undefined) {
            return cache.get(el)
        }
        
        if (value === undefined) {
            return cache.get(el, key)
        } else {
            this.each(function() {
                cache.set(this, key, value)
            })
        }
    },
    removeData: function(key) {
        return this.each(function() {
            Z.cache.remove(this, key)
        });        
    }
})


// Z.isArray, Z.isBoolean, ...
forEach(types, function(name) {
    Z['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})

Z.isPrimitive = function(obj) {
    var a = typeof obj
    return !!(obj === undefined || obj === null || a === 'boolean' || a === 'number' || a === 'string')
}

Z.isEmptyObject = function(obj) {
    for (var prop in obj) return false
    return true
}

Z.isEmpty = function(obj) {
    if (obj == null) return true
    if (Z.isArray(obj) || Z.isString(obj)) return obj.length === 0
    for (var key in obj) return false
    return true
}

// Z.isPlainObject = function(obj) {
//     if (Z.isObject(obj) && 'isPrototypeOf' in obj) return true
//     return false
// }

Z.isArrayLike = function(obj) {
    return obj.length === +obj.length && !Z.isString(obj)
}

Z.isWindow = function(obj) {
    return obj != null && obj === obj.window
}

Z.isDocument = function(obj) { 
    return obj != null && obj.nodeType === obj.DOCUMENT_NODE 
}

Z.isElement = function(obj) {
    return obj ? obj.nodeType === 1 : false
}

Z.isTextNode = function(obj) {
    return obj ? obj.nodeName === "#text" : false
}

Z.isZ = function(obj) {
    return obj.constructor === Z
}


var rroot = /^(?:body|html)$/i

// 元素class属性操作
var domClass = function() {
    var supportClassList = support.classList
    var has, add, remove, toggle, replace
    
    function check(el, className) {
        if ( el.nodeType !== 1 || !Z.isString(className) ) return false
        return true
    }
    if (supportClassList) {
        has = function(el, className) {
            if ( check(el, className) ) 
                return el.classList.contains(className)
            return false
        }
        add = function(el, className) {
            var i = 0, c
            if ( check(el, className) ) {
                className = className.split(' ')
                while( c = className[i++] ) {
                    el.classList.add(c)
                }
            }
        }
        remove = function(el, className) {
            var i = 0, c
            if ( check(el, className) ) {
                className = className.split(' ')
                while( c = className[i++] ) {
                    el.classList.remove(c)
                }
            }
        }
        toggle = function(el, className) {
            if ( check(el, className) ) {
                el.classList.toggle(className)
            }
        }
        
    } else {
        has = function(el, className) {
            if ( check(el, className) ) 
                return (' ' + el.className + ' ').indexOf(' ' + className + ' ') != -1
            return false
        }
        add = function(el, className) {
            if ( check(el, className) && !has(el, className) ) {
                el.className += (el.className ? ' ' : '') + className
            }
        }
        remove = function(el, className) {
            if ( check(el, className) ) {
                el.className = el.className.replace(RegExp('\\b' + className + '\\b', 'g'), '')
            }
        }
        toggle = function(el, className) {
            has(el, className) ? remove(el, className) : add(el, className)
        }
    }
    
    replace = function(el, oldCls, newCls) {
        remove(el, oldCls)
        add(el, newCls)
    }
    
    return {
        has : has,
        add : add,
        remove : remove,
        toggle : toggle,
        replace : replace
    }
}()

function getWindow(el) {
    return Z.isWindow(el) ? el :
        el.nodeType === 9 ?
        el.defaultView || el.parentWindow : false
}

function getOffset(el, doc, docElem, box) {
    try {
        box = el.getBoundingClientRect()
    } catch(e) {}

    if ( !box || !Z.contains(docElem, el) ) {
        return box ? {top: box.top, left: box.left} : {top: 0, left: 0}
    }

    var body = doc.body
    var win = getWindow(doc)
    var clientTop  = docElem.clientTop  || body.clientTop  || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0
    var scrollTop  = win.pageYOffset || docElem.scrollTop  || body.scrollTop
    var scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft
    var top  = box.top  + scrollTop  - clientTop
    var left = box.left + scrollLeft - clientLeft

    return {top: top, left: left}
}

function setOffset(el, options) {
    var curElem = Z(el)
    var posi = curElem.css('position')
    
    if (posi === 'static') el.style.position = 'relative'
    
    var top = 'top'
    var left = 'left'
    var curOffset = curElem.offset()
    var curCSSTop = curElem.css('top')
    var curCSSLeft = curElem.css('left')
    var calculatePosition = (posi === 'absolute' || posi === 'fixed') && ([curCSSTop, curCSSLeft].join(',')).indexOf('auto') > -1
    var props = {}, curPosition = {}, curTop, curLeft
        
    if (calculatePosition) {
        curPosition = curElem.pos()
        curTop = curPosition.top
        curLeft = curPosition.left
    } else {
        curTop = parseFloat(curCSSTop) || 0
        curLeft = parseFloat(curCSSLeft) || 0
    }

    if (options.top != null) {
        props.top = (options.top - curOffset.top) + curTop
    }
    if (options.left != null) {
        props.left = (options.left - curOffset.left) + curLeft
    }
    
    curElem.css(props)
}

function camelFn(name) {
    return name.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase()
    })
}

Z.support = support
Z.contains = function(a, b) {
    try {
        return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16)
    } catch(e) {}
}

Z.ready = function(callback) {
    var done = false, top = true

    var root = doc.documentElement
    var add = doc.addEventListener ? 'addEventListener' : 'attachEvent'
    var rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent'
    var pre = doc.addEventListener ? '' : 'on'

    function init(e) {
        if (e.type == 'readystatechange' && doc.readyState != 'complete') return
        (e.type == 'load' ? window : doc)[rem](pre + e.type, init, false)
        if (!done && (done = true)) callback(Z)
    }

    function poll() {
        try { 
            root.doScroll('left') 
        } catch(e) { 
            setTimeout(poll, 50)
            return
        }
        init('poll')
    }

    if (doc.readyState == 'complete') {
        callback(Z)
    } else {
        if (doc.createEventObject && root.doScroll) {
            try {
                top = !window.frameElement
            } catch(e) { }
            if (top) poll()
        }
        doc[add](pre + 'DOMContentLoaded', init, false)
        doc[add](pre + 'readystatechange', init, false)
        window[add](pre + 'load', init, false)
    }
}

Z.fn.extend({
    hasClass: function(name) {
        return domClass.has(this[0], name)
    },

    addClass: function(name) {
        return this.each( function(el) {
            domClass.add(el, name)
        })
    },

    removeClass: function(name) {
        return this.each( function(el) {
            domClass.remove(el, name)
        })
    },

    toggleClass: function(name) {
        return this.each( function(el) {
            domClass.toggle(el, name)
        })
    },

    replaceClass: function(oCls, nCls) {
        return this.each( function(el) {
            domClass.replace(el, oCls, nCls)
        })
    },

    attr: function(name, val) {
        if ( Z.isObject(name) && !Z.isEmptyObject(name) ) {
            for (var ar in name) {
                this.attr(ar, name[ar])
            }
            return this
        }
        if (val === undefined) {
            var el = this[0]
            switch (name) {
                case 'class':
                    return el.className
                case 'style':
                    return el.style.cssText
                default:
                    return el.getAttribute(name)
            }
        } else {
            this.each( function(el) {
                if (val === null) {
                    el.removeAttribute(name)
                } else {
                    switch (name) {
                        case 'class':
                            el.className = val
                            break
                        case 'style':
                            el.style.cssText = val
                            break
                        default:
                            el.setAttribute(name, val)
                    }
                }
            })
            return this
        }
    },

    prop: function(name, val) {
        if ( Z.isObject(name) && !Z.isEmptyObject(name) ) {
            for (var ar in name) {
                this.prop(ar, name[ar])
            }
            return this
        }
        if (val === undefined) {
            return this[0][name]
        } else {
            this.each( function(el) {
                el[name] = val
            })
            return this
        }
    },

    css: function(name, val) {
        if ( Z.isObject(name) ) {
            for (var k in name) this.css(k, name[k])
            return
        }
        if (val === undefined) {
            var el = this[0], style
            if (name == 'opacity') {
                var opacity, filter
                var reg = /opacity=/i
                if (support.opacity) {
                    style = window.getComputedStyle(el, null)
                    opacity = style.opacity
                    // http://www.cnblogs.com/snandy/archive/2011/07/27/2118441.html
                    if (opacity.length > 1) {
                        opacity = opacity.substr(0, 3)
                    }
                    return parseFloat(opacity)
                } else {
                    style = el.currentStyle
                    filter = style.filter
                    return reg.test(filter) ? parseFloat(filter.match(/opacity=([^)]*)/i)[1]) / 100 : 1
                }
            } else {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(el, null).getPropertyValue(camelFn(name))
                }
                if (doc.defaultView && doc.defaultView.getComputedStyle) {
                    var computedStyle = doc.defaultView.getComputedStyle(el, null)
                    if (computedStyle) {
                        return computedStyle.getPropertyValue(camelFn(name))
                    }
                }
                if (el.currentStyle) {
                    return el.currentStyle[name]
                }
                return el.style[name]
            }
        } else {
            this.each(function(el) {
                if (name == 'opacity') {
                    if (support.opacity) {
                        el.style.opacity = (val == 1 ? '' : '' + val)
                    } else {
                        el.style.filter = 'alpha(opacity=' + val * 100 + ');'
                        el.style.zoom = 1
                    }
                } else {
                    if ( Z.isNumber(val) ) val += 'px'
                    el.style[name] = val
                }
            })
            return this
        }

    },

    offsetParent: function() {
        var parent = this[0].offsetParent || doc.body
        while ( parent && (!rroot.test(parent.nodeName) && Z(parent).css('position') === 'static') ) {
            parent = parent.offsetParent
        }
        return Z(parent)
    },

    offset: function(options) {
        if (arguments.length) {
            return options === undefined ? this :
                this.each(function(i) {
                    setOffset(this, options)
                })
        }
        var el = this[0]
        var doc = el && el.ownerDocument
        if (!doc) return null
        return getOffset(el, doc, doc.documentElement)
    },

    position: function() {
        if (!this[0]) return
        
        var $parent = this.offsetParent()
        var offset  = this.offset()
        var parentOffset = rroot.test($parent[0].nodeName) ? {top: 0, left: 0} : $parent.offset()

        offset.top  -= parseFloat( this.css('marginTop') ) || 0
        offset.left -= parseFloat( this.css('marginLeft') ) || 0
        parentOffset.top  += parseFloat( $parent.css('borderTopWidth') ) || 0
        parentOffset.left += parseFloat( $parent.css('borderLeftWidth') ) || 0

        return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
        }
    },

    text: function(val) {
        return this.prop(this[0].innerText === undefined ? 'textContent' : 'innerText', val)
    },

    html: function(val) {
        return this.prop('innerHTML', val)
    },
    
    val: function(val) {
        if (val === undefined) {
            var el = this[0]
            if (el.tagName == 'INPUT' && /checkbox|radio/.test(el.type)) {
                return el.checked
            }
            return el.value
        } else {
            return this.prop('value', val)
        }
    },
	
	show: function() {
		this.each(function(el) {
			el.style.display = ''
		})
	}
})



var guid = 1
var guidStr = '__guid__'
        
// 存放所有事件handler, 以guid为key, cache[1] = {}
// cache[1] = {handle: evnetHandle, events: {}}, events = {click: [handler1, handler2, ..]}
var cache = {}

// 优先使用标准API
var w3c = !!window.addEventListener

var ZFunc = Z.Function
var onceFunc = ZFunc.once
var delayFunc = ZFunc.delay
var debounceFunc = ZFunc.debounce
var throttleFunc = ZFunc.throttle

// Utility functions ---------------------------------------------------------------------------
function each(arr, callback) {
    for (var i=0; i<arr.length; i++) {
        if ( callback(arr[i], i) === true ) return
    }
}

var addListener = function() {
    if (w3c) {
        return function(el, type, handler) { el.addEventListener(type, handler, false) } 
    } else {
        return function(el, type, handler) { el.attachEvent('on' + type, handler) }
    }
}()
var removeListener = function() {
    if (w3c) {
        return function(el, type, handler) { el.removeEventListener(type, handler, false) }
    } else {
        return function(el, type, handler) { el.detachEvent('on' + type, handler) }
    }
}()


// Private functions ---------------------------------------------------------------------------

function returnFalse() {
    return false
}
function returnTrue() {
    return true
}
function now() {
    return (new Date).getTime()
}
function excuteHandler(elem, e, args /*only for trigger*/) {
    if (!elem || !e) return
    
    var e = fix(e, elem)
    var type = e.type
    var id = elem[guidStr]
    var elData = cache[id]
    var events = elData.events
    var handlers = events[type]
    
    var ret = null
    for (var i = 0, handlerObj; handlerObj = handlers[i++];) {
        if (args) handlerObj.args = handlerObj.args.concat(args)
        if (e.namespace) {
            if (e.namespace === handlerObj.namespace) {
                ret = callback(elem, type, e, handlerObj)
            }
        } else {
            ret = callback(elem, type, e, handlerObj)
        }

        if (ret === false) {
            e.preventDefault()
            e.stopPropagation()
        }
    }
}
function callback(elem, type, e, handlerObj) {
    var args      = handlerObj.args
    var stop      = handlerObj.stop
    var data      = handlerObj.data
    var handler   = handlerObj.handler
    var prevent   = handlerObj.prevent
    var context   = handlerObj.context || elem
    var stopBubble = handlerObj.stopBubble
    
    // 如果数组第一个元素不是事件对象，将事件对象插入到数组第一个位置; 如果是则用新的事件对象替换
    if (args[0] && args[0].type === e.type) {
        args.shift()
        args.unshift(e)
    } else {
        args.unshift(e)
    }
    
    if (stop) {
        e.preventDefault()
        e.stopPropagation()
    }
    
    if (prevent) e.preventDefault()
    
    if (data) e.data = data
    
    if (stopBubble) e.stopPropagation()
    
    return handler.apply(context, args)
}
// handlerObj class
function Handler(config) {
    this.handler   = config.handler
    this.one       = config.one
    this.delay     = config.delay
    this.debounce  = config.debounce
    this.immediate = config.immediate
    this.throttle  = config.throttle
    this.context   = config.context
    this.stop      = config.stop
    this.prevent   = config.prevent
    this.stopBubble = config.stopBubble
    this.data       = config.data
    if (config.args) {
        this.args = config.args.length ? config.args : [config.args]
    } else {
        this.args = []
    }
}
// 删除事件的注册，从缓存中去除
function remove(elem, type, guid) {
    var elData = cache[guid]
    var handle = elData.handle
    var events = elData.events
    
    // 从缓存中删除指定类型事件相关数据
    delete events[type]
    delete elData.elem
    delete elData.handle
    
    // DOM中事件取消注册
    removeListener(elem, type, handle)
    // events是空对象时，从cache中删除
    if ( Z.isEmptyObject(events) ) {
        delete elData.events
        delete cache[guid]
    }
}
// Custom event class
function Event(event) {
    var namespace
    if (event.type) {
        this.originalEvent = event
        this.type = event.type
    } else {
        if (event.indexOf('.') > -1) {
            namespace = event.split('.')
            this.type = namespace[0]
            this.namespace = namespace[1]
        } else {
            this.type = event
            this.namespace = ''
        }
    }
    this.timeStamp = now()
}
Event.prototype = {
    preventDefault: function() {
        this.isDefaultPrevented = returnTrue
        var e = this.originalEvent
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false
    },
    stopPropagation: function() {
        this.isPropagationStopped = returnTrue
        var e = this.originalEvent
        if (e.stopPropagation) {
            e.stopPropagation()
        }
        e.cancelBubble = true
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = returnTrue
        this.stopPropagation()
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
}

// Fix evnet object
function fix(e, elem) {
    var i, prop, props = [], originalEvent = e
    
    props = props.concat('altKey bubbles button cancelable charCode clientX clientY ctrlKey currentTarget'.split(' '))
    props = props.concat('data detail eventPhase fromElement handler keyCode layerX layerY metaKey'.split(' '))
    props = props.concat('newValue offsetX offsetY originalTarget pageX pageY prevValue relatedTarget'.split(' '))
    props = props.concat('screenX screenY shiftKey target toElement view wheelDelta which'.split(' '))
    
    e = new Event(originalEvent)
    for (i=props.length; i;) {
        prop = props[--i]
        e[prop] = originalEvent[prop]
    }
    
    if (!e.target) {
        e.target = originalEvent.srcElement || elem // elem for trigger event
    }
    if (e.target.nodeType === 3) {
        e.target = e.target.parentNode
    }
    if (!e.relatedTarget && e.fromElement) {
        e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement
    }
    if (e.pageX == null && e.clientX != null) {
        var docElem = document.documentElement
        var body = document.body
        e.pageX = e.clientX + 
            (docElem && docElem.scrollLeft || body && body.scrollLeft || 0) -
            (docElem && docElem.clientLeft || body && body.clientLeft || 0)
        e.pageY = e.clientY + 
            (docElem && docElem.scrollTop  || body && body.scrollTop  || 0) -
            (docElem && docElem.clientTop  || body && body.clientTop  || 0)
    }
    if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode)) {
        e.which = e.charCode || e.keyCode
    }
    if (!e.metaKey && e.ctrlKey) {
        e.metaKey = e.ctrlKey
    }
    if (!e.which && e.button !== undefined) {
        e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ))
    }
    
    return e
}

// Public functions -----------------------------------------------------------------------------

// Add event handler
function bind(elem, type, handler) {
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !type) return
    
    var id = elem[guidStr] = elem[guidStr] || guid++
    var elData = cache[id] = cache[id] || {}
    var events = elData.events
    var handle = elData.handle
    var handlerObj, eventType, i = 0, arrType, namespace
    
    // 批量添加, 递归
    if ( Z.isObject(type) ) {
        for (eventType in type) {
            bind(elem, eventType, type[eventType])
        }
        return
    } else {
        arrType = type.split(' ')
    }
    
    // handle parameter handler
    if ( Z.isFunction(handler) ) {
        handlerObj = new Handler({handler: handler})
    } else {
        if ( !Z.isFunction(handler.handler) ) return
        handlerObj = new Handler(handler)
    }
    
    handler = handlerObj.handler
    
    // one 仅执行一次
    if (handlerObj.one) {
        handlerObj.special = handler
        handlerObj.handler = onceFunc(handler)
    }
    
    // delay延迟执行
    if (handlerObj.delay) {
        handlerObj.special = handler
        handlerObj.handler = delayFunc(handler, handlerObj.delay)
    }
    
    // debounce防弹跳
    if (handlerObj.debounce) {
        handlerObj.special = handler
        handlerObj.handler = debounceFunc(handler, handlerObj.debounce)
    }
    
    // immediate 执行后立即延迟指定时间，如避免重复提交
    if (handlerObj.immediate) {
        handlerObj.special = handler
        handlerObj.handler = debounceFunc(handler, handlerObj.immediate, true)
    }
    
    // throttle 事件节流
    if (handlerObj.throttle) {
        handlerObj.special = handler
        handlerObj.handler = throttleFunc(handler, handlerObj.throttle)
    }
    
    // 初始化events
    if (!events) {
        elData.events = events = {}
    }
    
    // 初始化handle
    if (!handle) {
        elData.handle = handle = function(e) {
            return excuteHandler(elData.elem, e)
        }
    }
    
    // elem暂存到handle
    elData.elem = elem
    
    while ( eventType=arrType[i++] ) {
        // Namespaced event handlers
        if ( eventType.indexOf('.') > -1 ) {
            namespace = type.split('.')
            eventType = namespace[0]
            handlerObj.namespace = namespace[1]
        } else {
            handlerObj.namespace = ''
        }
        
        // 取指定类型事件(如click)的所有handlers, 如果有则是一个数组, 第一次是undefined则初始化为空数组
        // 也仅在handlers为undefined时注册事件, 即每种类型事件仅注册一次, 再次添加handler只是push到数组handlers中
        handlers  = events[eventType]
        if (!handlers) {
            handlers = events[eventType] = []
            addListener(elem, eventType, handle)
        }
        // 添加到数组
        handlers.push(handlerObj)
    }
    
    // 避免IE低版本内存泄露
    elem = null
}

// Remove event handler
function unbind(elem, type, handler) {
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8) return
    
    var id       = elem[guidStr]
    var elData   = id && cache[id]
    var events   = elData && elData.events
    var handlers = events && events[type]
    var length   = arguments.length
    
    switch (length) {
        case 1:
            for (var type in events) remove(elem, type, id)
            break
        case 2:
            remove(elem, type, id)
            break
        case 3:
            each(handlers, function(handlerObj, i) {
                if (handlerObj.handler === handler || handlerObj.special === handler) {
                    handlers.splice(i, 1)
                    return true
                }
            })
            if (handlers.length === 0) remove(elem, type, id)
            break
    }
}

// Fire event
function trigger(elem, type) {
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8) return

    var id       = elem[guidStr]
    var elData   = id && cache[id]
    var events   = elData && elData.events
    var handlers = events && events[type]
    var args     = sliceArgs(arguments, 2)
    var length   = arguments.length
    
    if (length===1 && elem.nodeType===1) {
        for (var type in events) excuteHandler(elem, type, args)
    } else {
        excuteHandler(elem, type, args)
    }
}

// on / off
forEach({on: bind, off: unbind}, function(callback, name) {
    Z.fn[name] = function(type, handler) {
        return this.each(function(el) {
            callback(el, type, handler)
        })
    }
})

// one / delay / throttle / debounce / immediate
forEach(['one', 'delay', 'throttle', 'debounce', 'immediate'], function(name) {
    Z.fn[name] = function(type, handler, wait) {
        return this.each(function(el) {
            var option = {handler: handler}
            option[name] = name === 'one' ? true : wait
            bind(el, type, option)
        })
    }
})

// fire
Z.fn.fire = function(type) {
    return this.each(function(el) {
        trigger(el, type)
    })
}

// Shorthand Methods
forEach('click,dblclick,mouseover,mouseout,mouseenter,mouseleave,mousedown,mouseup,keydown,keyup,keypress,focus,blur'.split(','), function(name) {
    Z.fn[name] = function(handler) {
        if (arguments.length === 0) {
            this.fire(name)
        } else {
            this.on(name, handler)
        }
        return this
    }
})

// Event delegate
Z.fn.delegate = function(selector, type, handler) {
    if (arguments.length === 2 && Z.isFunction(type)) {
        fn = type
        type = 'click'
    }
    return this.each(function(el) {
        Z(el).on(type, function(e) {
            var tar = e.tar
            Z(selector, this).each( function(el) {
                if (tar == el || Z.contains(el, tar)) handler.call(el, e)
            })
        })
    })
}
Z.fn.undelegate = function(type, fn) {
    return this.each(function(el) {
        Z(el).off(type, fn)
    })
}



// parse json string
function parseJSON(str) {
    try {
        return JSON.parse(str)
    } catch(e) {
        try {
            return (new Function('return ' + str))()
        } catch(e) {
        }
    }
}

// exports 
Z.parseJSON = parseJSON
    
// empty function
function noop() {}


/**
 *  Ajax API
 *     Z.ajax, Z.get, Z.post, Z.text, Z.json, Z.xml
 *  
 */
var createXHR = window.XMLHttpRequest ?
    function() {
        try{
            return new XMLHttpRequest()
        } catch(e){}
    } :
    function() {
        try{
            return new window.ActiveXObject('Microsoft.XMLHTTP')
        } catch(e){}
    }
    
function ajax(url, options) {
    if ( Z.isObject(url) ) {
        options = url
        url = options.url
    }
    if ( Z.isFunction(options) ) {
        options = {success: options}
    }
    var xhr, isTimeout, timer, options = options || {}

    var async      = options.async !== false
    var method     = options.method  || 'GET'
    var type       = options.type    || 'json'
    var encode     = options.encode  || 'UTF-8'
    var timeout    = options.timeout || 0
    var credential = options.credential
    var data       = options.data
    var scope      = options.scope
    var success    = options.success || noop
    var failure    = options.failure || noop
    
    // 大小写都行，但大写是匹配HTTP协议习惯
    method  = method.toUpperCase()
    
    // 对象转换成字符串键值对
    if ( Z.isObject(data) ) {
        data = Z.Object.toQueryString(data)
    }
    if (method === 'GET' && data) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + data
    }
    
    xhr = createXHR()
    if (!xhr) return
    
    isTimeout = false
    if (async && timeout>0) {
        timer = setTimeout(function() {
            // 先给isTimeout赋值，不能先调用abort
            isTimeout = true
            xhr.abort()
        }, timeout)
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (isTimeout) {
                failure(xhr, 'request timeout')
            } else {
                onStateChange(xhr, type, success, failure, scope)
                clearTimeout(timer)
            }
        }
    }
    xhr.open(method, url, async)
    if (credential) {
        xhr.withCredentials = true
    }
    if (method == 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode)
    }
    xhr.send(data)
    return xhr
}

function onStateChange(xhr, type, success, failure, scope) {
    var s = xhr.status, result
    if (s>= 200 && s < 300) {
        switch (type) {
            case 'text':
                result = xhr.responseText
                break
            case 'json':
                result = parseJSON(xhr.responseText)
                break
            case 'xml':
                result = xhr.responseXML
                break
        }
        // text, 返回空字符时执行success
        // json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
        result !== undefined && success.call(scope, result)
        
    } else {
        failure(xhr, xhr.status)
    }
    xhr = null
}

// exports to Z
var ajaxOptions = {
    method: ['get', 'post'],
    type: ['text','json','xml'],
    async: ['sync', 'async']
}

// Low-level Interface: Z.ajax
Z.ajax = ajax

// Shorthand Methods: Z.get, Z.post, Z.text, Z.json, Z.xml
forEach(ajaxOptions, function(val, key) {
    forEach(val, function(item, index) {
        Z[item] = function(key, item) {
            return function(url, opt, success) {
                if ( Z.isObject(url) ) {
                    opt = url
                }
                if ( Z.isFunction(opt) ) {
                    opt = {success: opt}
                }
                if ( Z.isFunction(success) ) {
                    opt = {data: opt}
                    opt.success = success
                }
                if (key === 'async') {
                    item = item==='async' ? true : false
                }
                opt = opt || {}
                opt[key] = item
                return ajax(url, opt)
            }
        }(key, item)
    })
})


/**
 *  JSONP API
 *  Z.jsonp
 *  
 */    
var ie678 = !-[1,]
var opera = window.opera
var head = doc.head || doc.getElementsByTagName('head')[0]
var jsonpDone = false

//Thanks to Kevin Hakanson
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/873856#873856
function generateRandomName() {
    var uuid = ''
    var s = []
    var i = 0
    var hexDigits = '0123456789ABCDEF'
    for (i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[12] = '4'
    // bits 6-7 of the clock_seq_hi_and_reserved to 01    
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1)
    uuid = 'jsonp_' + s.join('')
    return uuid
}

function jsonp(url, options) {
    if ( Z.isObject(url) ) {
        options = url;
        url = options.url;
    }
    var options = options || {}
    var me      = this
    var timeout = 3000
    var url     = url + '?'
    var data    = options.data
    var charset = options.charset
    var success = options.success || noop
    var failure = options.failure || noop
    var scope   = options.scope || window
    var timestamp = options.timestamp
    var jsonpName = options.jsonpName || 'callback'
    var callbackName = options.jsonpCallback || generateRandomName()
    
    if ( Z.isObject(data) ) {
        data = serialize(data)
    }
    var script = doc.createElement('script')
    
    function callback(isSucc) {
        if (isSucc) {
            jsonpDone = true
        } else {
            failure.call(scope)
        }
        // Handle memory leak in IE
        script.onload = script.onerror = script.onreadystatechange = null
        if ( head && script.parentNode ) {
            head.removeChild(script)
            script = null
            window[callbackName] = undefined
        }
    }
    function fixOnerror() {
        setTimeout(function() {
            if (!jsonpDone) {
                callback()
            }
        }, timeout)
    }
    if (ie678) {
        script.onreadystatechange = function() {
            var readyState = this.readyState
            if (!jsonpDone && (readyState == 'loaded' || readyState == 'complete')) {
                callback(true)
            }
        };
        
    } else {
        script.onload = function() {
            callback(true)
        }
        script.onerror = function() {
            callback()
        }
        if (opera) {
            fixOnerror()
        }
    }
    
    url += jsonpName + '=' + callbackName
    
    if (charset) {
        script.charset = charset
    }
    if (data) {
        url += '&' + data
    }
    if (timestamp) {
        url += '&ts='
        url += (new Date).getTime()
    }
    
    window[callbackName] = function(json) {
        success.call(scope, json)
    };
    
    script.src = url
    head.insertBefore(script, head.firstChild)
}

// exports to Z
Z.jsonp = function(url, opt, success) {
    if ( Z.isObject(url) ) {
        opt = url
    }
    if ( Z.isFunction(opt) ) {
        opt = {success: opt}
    }
    if ( Z.isFunction(success) ) {
        opt = {data: opt}
        opt.success = success
    }
    
    return jsonp(url, opt)
}


Z.cache = function() {
    var seed = 0
    var cache = {}
    var id = '_uuid_'

    // @private
    function uuid(el) {
        return el[id] || (el[id] = ++seed)
    }

    return {
        set: function(el, key, val) {
            if (!el) {
                throw new Error('setting failed, invalid element')
            }

            var id = uuid(el)
            var c = cache[id] || (cache[id] = {})
            if (key) c[key] = val

            return c
        },
        get: function(el, key, create) {
            if (!el) {
                throw new Error('getting failed, invalid element')
            }

            var id = uuid(el)
            var elCache = cache[id] || (create && (cache[id] = {}))

            if (!elCache) return null
            return key !== undefined ? elCache[key] || null : elCache
        },
        has: function(el, key) {
            return this.get(el, key) !== null
        },
        remove: function(el, key) {
            var id = typeof el === 'object' ? uuid(el) : el
            var elCache = cache[id]

            if (!elCache) return false

            if (key !== undefined) {
                delete elCache[key]
            } else {
                delete cache[id]
            }

            return true
        }
    }

}()

// Expose Z to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('Z', [], function() { return Z } )
} else {
    window.Z = Z
}

}(this);
