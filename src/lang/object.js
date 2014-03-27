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
        var result = [], i = 0
        for (var a in obj) result[i++] = a
        return result
    }
    // Retrieve the values of an object's properties.
    var values = function(obj) {
        var result = [], i = 0
        for (var key in obj) result[i++] = obj[key]
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
        var result = [], i = 0
        for (var a in obj) result[i] = [a, obj[a]]
        return result
    }
    // Return a copy of the object only containing the whitelisted properties.
    var pick = function(obj) {
        var copy = {}
        var keys = sliceArgs(arguments, 1)
        forEach(keys, function(key) {
          if (key in obj) copy[key] = obj[key]
        })
        return copy
    }

    return {
        keys: keys,
        values: values,
        pairs: pairs,
        invert: invert,
        pick: pick
    }

 }()