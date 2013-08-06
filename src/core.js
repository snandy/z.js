
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