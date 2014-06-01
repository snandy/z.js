~function(Z) {

var rcapital = /[A-Z]/g
var ropa1 = /opacity=/i
var ropa2 = /opacity=([^)]*)/i
var rtagName = /<([\w:]+)/
var rroot = /^(?:body|html)$/i
var rtable = /^t(?:head|body|foot|r|d|h)$/i
var cssWidth = ['Left', 'Right']
var cssHeight = ['Top', 'Bottom']
var displays = {}

function defaultDisplay(tagName) {
    var display = displays[tagName]

    if (!display) {
        var elem = doc.createElement(tagName)
        doc.body.appendChild(elem)
        var display = Z(elem).css('display')
        displays[tagName] = display
        doc.body.removeChild(elem)
    }

    return display
}

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
    return name.replace(rcapital, function(match) {
        return '-' + match.toLowerCase()
    })
}

function firstLetterUpper(name) {
    return name.replace(/^(\w)/, function(match) {
        return match.toUpperCase()
    })
}

function getCSS(el, name) {
    if (name == 'opacity') {
        var opacity, filter, style
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
            return ropa1.test(filter) ? parseFloat(filter.match(ropa2)[1]) / 100 : 1
        }
    } else {
        var cssName = camelFn(name)
        if (window.getComputedStyle) {
            return window.getComputedStyle(el, null).getPropertyValue(cssName)
        }
        if (doc.defaultView && doc.defaultView.getComputedStyle) {
            var computedStyle = doc.defaultView.getComputedStyle(el, null)
            if (computedStyle) {
                return computedStyle.getPropertyValue(cssName)
            }
        }
        if (el.currentStyle) {
            return el.currentStyle[name]
        }
        return el.style[name]
    }
}

function setCSS(el, name, val) {
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
}

// 获取元素宽高
function getWidthOrHeight(el, name, extra) {
    // Start with offset property
    var val = name === 'width' ? el.offsetWidth : el.offsetHeight
    var which = name === 'width' ? cssWidth : cssHeight

    // display is none
    if (val === 0) {
        return 0
    }
    
    if (extra === undefined) { // content
        // 减去borderWidth和padding
        for (var i = 0, a; a = which[i++];) {
            val -= parseFloat( getCSS(el, 'border' + a + 'Width') ) || 0
            val -= parseFloat( getCSS(el, 'padding' + a) ) || 0
        }
        return val
    }

    if (extra === 'inner') { // content+padding
        for (var i = 0, a; a = which[i++];) {
            val -= parseFloat( getCSS(el, 'border' + a + 'Width') ) || 0
        }
        return val

    } else if (extra === 'outer') { // content+padding+border
        return val

    } else if (extra === 'margin') { // content+padding+border+margin
        for (var i = 0, a; a = which[i++];) {
            val += parseFloat( getCSS( el, 'margin' + a ) ) || 0
        }
        return val
    }
}

// 获取文档宽高
function getDocWH(name) {
    name = firstLetterUpper(name)
    var val = Math.max(
        doc.documentElement['client' + name],
        doc.body['scroll' + name], doc.documentElement['scroll' + name],
        doc.body['offset' + name], doc.documentElement['offset' + name]
    )
    return val
}

// 获取window的宽高
function getWinWH(which) {
    var width = window['innerWidth'] || doc.documentElement.clientWidth
    var height = window['innerHeight'] || doc.documentElement.clientHeight
    if (which === 'width') {
        return width
    } else if (which === 'height') {
        return height
    }
    return {
        width: width,
        height: height
    }
}
Z.winSize = getWinWH

var table = ['<table>', '</table>']
var thead = ['<tbody>', '</tbody>']
var tr    = ['<tr>', '</tr>']
var td    = ['<td>', '</td>']
var wrapMap = {
    thead: [ 1, table[0], table[1] ],
    tr: [ 3, table[0] + thead[0], thead[1] + table[1] ],
    td: [ 4, table[0] + thead[0] + tr[0], tr[1] + thead[1] + table[1] ]
}
wrapMap.tbody = wrapMap.tfoot = wrapMap.thead
wrapMap.th = wrapMap.td

function manipulationDOM(elem) {
    if (Z.isElement(elem)) {
        return [elem]
    }
    if (Z.isZ(elem)) {
        return elem.toArray()
    }
    var div, tag, nodes = []
    if (Z.isString(elem)) {
        if (rtagName.test(elem)) {
            tag = rtagName.exec(elem)[1].toLowerCase()
            div = doc.createElement('div')

            if (rtable.test(tag)) {
                var map = wrapMap[tag]
                var deps = map[0]
                elem = map[1] + elem + map[2]
                div.innerHTML = elem
                while (deps--) {
                    div = div.firstChild
                }
                while (div) {
                    nodes.push(div)
                    div = div.nextSibling
                }
                
            } else {
                div.innerHTML = elem
                while (div.firstChild) {
                    nodes.push(div.firstChild)
                    div.removeChild(div.firstChild)
                }         
            }
            div = null
            return nodes

        } else {
            return [doc.createTextNode(elem)]
        }
    }
}

Z.dom = manipulationDOM

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
            if (name) {
                domClass.remove(el, name)    
            } else {
                el.className = ''
            }
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

    removeAttr: function(name) {
        if (Z.isString(name)) {
            this.each( function(el) {
                el.removeAttribute(name)
            })
        }
        return this
    },

    hasAttr: function(name) {
        if (this.attr(name)) return true
        return false
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
            return getCSS(this[0], name)
        } else {
            this.each(function(el) {
                setCSS(el, name, val)
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

    scrollTop: function(top) {
        var isWindow = this[0] == window
        if (top === undefined) {
            if (isWindow) {
                return window.pageXOffset || doc.documentElement.scrollTop || doc.body.scrollTop
            }
            return this[0].scrollTop
        } else {
            if ( isWindow ) {
                window.scrollTo(0, top)
            }
            this.each(function() {
                this.scrollTop = top
            })
            return this
        }
    },

    text: function(val) {
        return this.prop(this[0].innerText === undefined ? 'textContent' : 'innerText', val)
    },

    html: function(val) {
        if (Z.isFunction(val)) {
            val = val()
        }
        try {
            return this.prop('innerHTML', val)
        } catch(e) {
            // IE低版本table,tbody,thead,tfoot,tr,select等innerHTML不能赋值
            return this.empty().append(val)
        }
        
    },

    val: function(val) {
        if (Z.isFunction(val)) {
            val = val()
        }
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
		return this.each(function(el) {
            var displayVal = defaultDisplay(el.tagName)
			el.style.display = displayVal
		})
	},

    hide: function() {
        return this.each(function(el) {
            el.style.display = 'none'
        })        
    },

    toggle: function() {
        this.each(function(el) {
            if (el.style.display !== 'none') {
                $(el).hide()
            } else {
                $(el).show()
            }
        })        
    },

    append: function(elem) {
        return this.each(function(el) {
            var nodes = manipulationDOM(elem)
            forEach(nodes, function(node) {
                el.appendChild(node)
            })
        })
    },

    prepend: function(elem) {
        return this.each(function(el) {
            var nodes = manipulationDOM(elem)
            forEach(nodes, function(node) {
                el.insertBefore(node, el.firstChild)
            })
        })
    },

    before: function(elem) {
        return this.each(function(el) {
            var nodes = manipulationDOM(elem)
            forEach(nodes, function(node) {
                if (el.parentNode) {
                    el.parentNode.insertBefore(node, el)
                }
            })
        })
    },

    after: function(elem) {
        return this.each(function(el) {
            var nodes = manipulationDOM(elem)
            forEach(nodes, function(node) {
                if (el.parentNode) {
                    el.parentNode.insertBefore(node, el.nextSibling)
                }
            })
        })
    }

})

forEach(['width', 'height'], function(name) {
    // width/height content width
    Z.fn[name] = function(val) {
        var obj = this[0]
        if (!this.length) return
        if (val === undefined) {
            if ( Z.isWindow(obj) ) return getWinWH(name)
            if ( Z.isDocument(obj) ) return getDocWH(name)
            return getWidthOrHeight(obj, name)

        } else {
            if (!isNaN(val)) {
                obj.style[name] = val + 'px'
            }
        }
    }

    // innerWidth/innerHeight 包含content + padding
    var cname = firstLetterUpper(name)
    Z.fn['inner' + cname] = function() {
        return getWidthOrHeight(this[0], name, 'inner')
    }

    // outerWidth/outerHeight 包含content + padding + border
    Z.fn['outer' + cname] = function() {
        return getWidthOrHeight(this[0], name, 'outer')
    }

    // marginWidth/marginHeight 包含content + padding + border + margin
    Z.fn['margin' + cname] = function() {
        return getWidthOrHeight(this[0], name, 'margin')    
    }
})


}(Z)
