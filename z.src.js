/*!
 * Z.js.js v0.1.0
 * @snandy 2013-08-07 17:53:25
 *
 */
~function(window, undefined) {

var OP = Object.prototype
var types = ['Array', 'Boolean', 'Function', 'Object', 'String', 'Number']

var toString = OP.toString
var slice = types.slice
var push  = types.push
var doc = window.document
var isStrict = doc.compatMode == 'CSS1Compat'
var rwhite = /\s/
var trimLeft = /^\s+/
var trimRight = /\s+$/
var rroot = /^(?:body|html)$/i
    
// IE6/7/8 return false
if (!rwhite.test( '\xA0' )) {
    trimLeft = /^[\s\xA0]+/
    trimRight = /[\s\xA0]+$/
}

// For IE9/Firefox/Safari/Chrome/Opera
var makeArray = function(obj) {
    return slice.call(obj, 0)
}
// For IE6/7/8
try {
    slice.call(doc.documentElement.childNodes, 0)[0].nodeType
} catch(e) {
    makeArray = function(obj) {
        var res = []
        for (var i = 0, len = obj.length; i < len; i++) {
            res[i] = obj[i]
        }
        return res
    }
}

// Iterator
function forEach(obj, iterator, context) {
    if ( obj.length === +obj.length ) {
        for (var i = 0; i < obj.length; i++) {
            if (iterator.call(obj[i] || context, obj[i], i, obj) === true) return
        }
    } else {
        for (var k in obj) {
            if (iterator.call(obj[k] || context, obj[k], k, obj) === true) return
        }
    }
}
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
    return doc.getElementById(id)
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
        
    function query(selector, context) {
        var s = selector, arr = []
        var context = context === undefined ? doc : typeof context === 'string' ?
                byId(context.substr(1, context.length)) : context
                
        if (!selector) return arr
        
        // id 还是用docuemnt.getElementById最快
        if ( rId.test(s) ) {
            arr[0] = byId( s.substr(1, s.length) )
            return arr
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

        // Tag name
        if ( rTag.test(s) ) {
            return makeArray(context.getElementsByTagName(s))
        }

        // Attribute
        if ( rAttr.test(s) ) {
            var result = rAttr.exec(s)
            var all = context.getElementsByTagName(result[1] || '*')
            return filter(all, result[2], result[4])
        }
    }

    return query
}()


function Z(selector, context) {
    return new Z.prototype.init(selector, context)
}
Z.prototype = {
    constructor: Z,
    init: function(selector, context) {
        // for slice
        if (!selector) return

        // for DOM-ready
        if (typeof selector === 'function') {
            Z.ready(selector)
            return
        }

        // for HTMLElement or window
        if (selector.nodeType || selector === window) {
            this[0] = selector
            this.length = 1
            return
        }

        // for CSS selector
        var nodes = query(selector, context)
        push.apply(this, makeArray(nodes))
    },

    length: 0,

    find: function(selector, i) {
        var context = i === undefined ? this[0] : this[i]
        return new Z.prototype.init(selector, context)
    },

    toArray: function() {
        return makeArray(this)
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
    push: push,
    sort: types.sort,
    splice: types.splice
}
Z.fn = Z.prototype.init.prototype = Z.prototype

Z.extend = Z.fn.extend = function(obj) {
    var target, start
    if (arguments.length === 1) {
        target = this
        start = 0
    } else {
        target = obj
        start = 1
    }
    forEach(slice.call(arguments, start), function(source) {
        if (source) {
            for (var prop in source) {
                target[prop] = source[prop]
            }
        }
    })
    return target
}

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

Z.isPlainObject = function(obj) {
    if (!obj || obj === window || obj === doc || obj === doc.body) return false
    return 'isPrototypeOf' in obj && Z.isObject(obj)
}

Z.isWindow = function(obj) {
    return obj != null && obj === obj.window
}

var rroot = /^(?:body|html)$/i
// 特性检测
var support = Z.support = function() {
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
    
    return {
        setAttr : setAttr,
        cssText : cssText,
        opacity : opacity,
        classList : !!div.classList,
        cssFloat : !!a.style.cssFloat,
        getComputedStyle : getComputedStyle
    }
}()

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

Z.contains = function(a, b) {
    try {
        return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16)
    } catch(e) {}
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
            })
            return this
        }
    },

    prop: function(name, val) {
        if (val === undefined) {
            return this[0][name]
        } else {
            this.each( function(el) {
                el[name] = val
            });
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
    }

})



var guid = 1
var guidStr = '__guid__'
        
// 存放所有事件handler, 以guid为key, cache[1] = {}
// cache[1] = {handle: evnetHandle, events: {}}, events = {click: [handler1, handler2, ..]}
var cache = {}

// 优先使用标准API
var w3c = !!window.addEventListener

// Utility functions -----------------------------------------------------------------------------
function each(arr, callback) {
    for (var i=0; i<arr.length; i++) {
        if ( callback(arr[i], i) === true ) return
    }
}

var util = {
    once: function(func) {
        var run, memo
        return function() {
            if (run) return memo
            run = true
            return memo = func.apply(this, arguments)
        }
    },
    delay: function(func, wait) {
        return function() {
            var context = this, args = arguments
            setTimeout(function() {
                func.apply(context, args)
            }, wait)
        }
    },
    debounce: function(func, wait, immediate) {
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
    },
    throttle: function(func, wait) {
        var context, args, timeout, throttling, more, result
        var whenDone = util.debounce(function() {
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
    },
    addListener: function() {
        if (w3c) {
            return function(el, type, handler) { el.addEventListener(type, handler, false) } 
        } else {
            return function(el, type, handler) { el.attachEvent('on' + type, handler) }
        }
    }(),
    removeListener: function() {
        if (w3c) {
            return function(el, type, handler) { el.removeEventListener(type, handler, false) }
        } else {
            return function(el, type, handler) { el.detachEvent('on' + type, handler) }
        }
    }()
}

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
    
    for (var i = 0, handlerObj; handlerObj = handlers[i++];) {
        if (args) handlerObj.args = handlerObj.args.concat(args)
        if (e.namespace) {
            if (e.namespace===handlerObj.namespace) {
                callback(elem, type, e, handlerObj)
            }
        } else {
            callback(elem, type, e, handlerObj)
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
    
    handler.apply(context, args)
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
    util.removeListener(elem, type, handle)
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
        var doc = document.documentElement, body = document.body
        e.pageX = e.clientX + 
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0)
        e.pageY = e.clientY + 
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0)
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
        handlerObj.handler = util.once(handler)
    }
    
    // delay延迟执行
    if (handlerObj.delay) {
        handlerObj.special = handler
        handlerObj.handler = util.delay(handler, handlerObj.delay)
    }
    
    // debounce防弹跳
    if (handlerObj.debounce) {
        handlerObj.special = handler
        handlerObj.handler = util.debounce(handler, handlerObj.debounce)
    }
    
    // immediate 执行后立即延迟指定时间，如避免重复提交
    if (handlerObj.immediate) {
        handlerObj.special = handler
        handlerObj.handler = util.debounce(handler, handlerObj.immediate, true)
    }
    
    // throttle 事件节流
    if (handlerObj.throttle) {
        handlerObj.special = handler
        handlerObj.handler = util.throttle(handler, handlerObj.throttle)
    }
    
    // 初始化events
    if (!events) {
        elData.events = events = {}
    }
    
    // 初始化handle
    if (!handle) {
        elData.handle = handle = function(e) {
            excuteHandler(elData.elem, e)
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
            util.addListener(elem, eventType, handle)
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
    var args     = slice.call(arguments, 2)
    var length   = arguments.length
    
    if (length===1 && elem.nodeType===1) {
        for (var type in events) excuteHandler(elem, type, args)
    } else {
        excuteHandler(elem, type, args)
    }
}

// var E = {
//     viewCache: function() {
//         if (window.console) {
//             console.log(cache)
//         }
//     },
//     destroy: function() {
//         for (var num in cache) {
//             var elData = cache[num], elem = elData.elem
//             unbind(elem)
//         }
//         guid = 1
//     }
// }

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
    };
});

// object to queryString
function serialize(obj) {
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
        data = serialize(data)
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
    var uuid = '', s = [], i = 0, hexDigits = '0123456789ABCDEF';
    for (i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[12] = '4';
    // bits 6-7 of the clock_seq_hi_and_reserved to 01    
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
    uuid = 'jsonp_' + s.join('');
    return uuid;
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



// Expose IO to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('Z', [], function() { return Z } )
} else {
    window.Z = Z
}

}(this);
