Z.Cache = function() {
    var seed = 0
    var cache = {}
    var id = '_uuid_'
    Z.__cache__ = cache

    // @private
    function uuid(el) {
        return el[id] || (el[id] = ++seed)
    }

    return {
        set: function(el, key, val) {
            if (!el) Z.error('setting failed, invalid element')

            var id = uuid(el)
            var c = cache[id] || (cache[id] = {})
            if (key) c[key] = val

            return c
        },
        get: function(el, key, create) {
            if (!el) Z.error('getting failed, invalid element')

            var id = uuid(el)
            var elCache = cache[id] || (create && (cache[id] = {}))

            if (!elCache) return null
            return key !== undefined ? elCache[key] || null : elCache
        },
        has: function(el, key) {
            return this.get(el, key) !== null
        },
        remove: function(el, key) {
            var id = uuid(el)
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

// data, removeData
Z.fn.extend({
    data: function(key, value) {
        var el = this[0]
        var cache = Z.Cache
        if (key === undefined) {
            return cache.get(el)
        }
        
        if (value === undefined) {
            return cache.get(el, key)
        } else {
            return this.each(function() {
                cache.set(this, key, value)
            })
        }
    },
    removeData: function(key) {
        return this.each(function() {
            Z.Cache.remove(this, key)
        })
    }
})
