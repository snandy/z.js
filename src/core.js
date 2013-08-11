
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
        return slice.call(this)
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

Z.each = forEach

Z.map = map