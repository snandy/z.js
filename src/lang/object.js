/**
 * Z.Object (singleton)
 * A collection of useful static methods to deal with objects.
 */

 Z.Object = function() {
    var keys = Object.keys || function(obj) {
        obj = Object(obj)
        var arr = []    
        for (var a in obj) arr.push(a)
        return arr
    }
    var invert = function(obj) {
        obj = Object(obj)
        var result = {}
        for (var a in obj) result[obj[a]] = a
        return result
    }

    return {
        keys: keys,
        invert: invert
    }

 }()