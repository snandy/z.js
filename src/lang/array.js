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