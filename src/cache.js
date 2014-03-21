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
            if (!el) throw new Error('setting failed, invalid element')

            var id = uuid(el)
            var c = cache[id] || (cache[id] = {})
            if (key) c[key] = val

            return c
        },
        get: function(el, key, create) {
            if (!el) throw new Error('getting failed, invalid element')

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