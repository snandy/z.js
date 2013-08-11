/**
 * @class Z.Object
 *
 * A collection of useful static methods to deal with objects.
 * @singleton
 */
 Z.Object = function() {
    // Retrieve the keys of an object's properties.
    var keys = Object.keys || function(obj) {
        obj = Object(obj)
        var result = []    
        for (var a in obj) result.push(a)
        return result
    }
    // Retrieve the values of an object's properties.
    var values = function(obj) {
        var result = []
        for (var key in obj) result.push(obj[key])
        return result
    }
    // Invert the keys and values of an object. The values must be serializable.
    var invert = function(obj) {
        obj = Object(obj)
        var result = {}
        for (var a in obj) result[obj[a]] = a
        return result
    }
    // Convert an object into a list of `[key, value]` pairs.
    var pairs = function(obj) {
        var result = []
        for (var a in obj) result.push([a, obj[a]])
        return result
    }
    // Return a copy of the object only containing the whitelisted properties.
    var pick = function(obj) {
        var copy = {}
        var keys = slice.call(arguments, 1)
        forEach(keys, function(key) {
          if (key in obj) copy[key] = obj[key]
        })
        return copy
    }
    var toQueryString = function(obj) {
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

    return {
        keys: keys,
        values: values,
        pairs: pairs,
        invert: invert,
        pick: pick,
        toQueryString: toQueryString
    }

 }()