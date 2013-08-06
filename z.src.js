/*!
 * Z.js.js v0.1.0
 * @snandy 2013-08-06 17:38:04
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
if(!rwhite.test( '\xA0' )) {
    trimLeft = /^[\s\xA0]+/
    trimRight = /[\s\xA0]+$/
}

// For IE9/Firefox/Safari/Chrome/Opera
var makeArray = function(obj) {
    return slice.call(obj, 0)
}
// For IE6/7/8
try{
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
};
Z.fn = Z.prototype.init.prototype = Z.prototype
Z.extend = function() {
    
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

// 特性检测
var support = function() {
    var div = doc.createElement('div')
    div.className = 'a'
    div.innerHTML = '<p style="color:red;"><a href="#" style="opacity:.45;float:left;">a</a></p>'
    div.setAttribute('class', 't')
    
    var p = div.getElementsByTagName('p')[0]
    var a = p.getElementsByTagName('a')[0]
    
    // http://www.cnblogs.com/snandy/archive/2011/08/27/2155300.html
    var setAttr = div.className === 't'
    // http://www.cnblogs.com/snandy/archive/2011/03/11/1980545.html
    var cssText = /;/.test(p.style.cssText)
    var opacity = /^0.45$/.test(a.style.opacity)
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
        };
        add = function(el, className) {
            var i = 0, c
            if ( check(el, className) ) {
                className = className.split(' ')
                while( c = className[i++] ) {
                    el.classList.add(c)
                }
            }
        };
        remove = function(el, className) {
            var i = 0, c
            if ( check(el, className) ) {
                className = className.split(' ')
                while( c = className[i++] ) {
                    el.classList.remove(c)
                }
            }
        };
        toggle = function(el, className) {
            if ( check(el, className) ) {
                el.classList.toggle(className)
            }
        };
        
    } else {
        has = function(el, className) {
            if ( check(el, className) ) 
                return (' ' + el.className + ' ').indexOf(' ' + className + ' ') != -1
            return false
        };
        add = function(el, className) {
            if ( check(el, className) && !has(el, className) ) {
                el.className += (el.className ? ' ' : '') + className
            }
        };
        remove = function(el, className) {
            if ( check(el, className) ) {
                el.className = el.className.replace(RegExp('\\b' + className + '\\b', 'g'), '')
            }
        };
        toggle = function(el, className) {
            has(el, className) ? remove(el, className) : add(el, className)
        };
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





// Expose IO to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('Z', [], function() { return Z } )
} else {
    window.Z = Z
}

}(this);
