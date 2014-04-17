Z.prototype = {
    constructor: Z,
    init: function(selector, context) {
        // For slice
        if (!selector) return

        // For DOM-ready
        if (typeof selector === 'function') return Z.ready(selector)

        // For Z() object
        if ( Z.isZ(selector) ) return selector

        // For HTMLElement or window
        if (selector.nodeType || selector === window) {
            this[0] = selector
            this.length = 1
            return
        }

        // For Array or nodes
        if ( Z.isArrayLike(selector) ) return this.pushStack(selector)

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

    index: function(obj) {
        var elem = obj, index = false
        if (Z.isZ(obj)) {
            elem = obj[0]
        }
        this.each(function(el, i) {
            if (el == elem) {
                index = i
                return true
            }
        })
        return index
    },

    parent: function() {
        return Z( this[0].parentNode )
    },
    
    next: function() {
        return Z( nextOrPrev(this[0], 'nextSibling') )
    },

    prev: function() {
        return Z( nextOrPrev(this[0], 'previousSibling') )
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
        while ( node && !matches(node, selector) ) {
            node = node !== context && !Z.isDocument(node) && node.parentNode
        }
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

Z.now = now

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
        })
    }
})
