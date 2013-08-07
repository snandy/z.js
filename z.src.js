/*!
 * Z.js.js v0.1.0
 * @snandy 2013-08-07 10:32:42
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



// Expose IO to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('Z', [], function() { return Z } )
} else {
    window.Z = Z
}

}(this);
