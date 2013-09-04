// For IE9/Firefox/Safari/Chrome/Opera
var makeArray = support.sliceOnNodeList ? function(obj) {
    return sliceArgs(obj)
} : function(obj) {
    var res = []
    for (var i = 0, len = obj.length; i < len; i++) {
        res[i] = obj[i]
    }
    return res
}

// Iterator
function forEach(obj, iterator, context) {
    if (obj == null) return
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context)
    } else if ( obj.length === +obj.length ) {
        for (var i = 0; i < obj.length; i++) {
            if (iterator.call(context||obj[i], obj[i], i, obj) === true) return
        }
    } else {
        for (var k in obj) {
            if (iterator.call(context||obj[k], obj[k], k, obj) === true) return
        }
    }
}

// Return the results of applying the iterator to each element
function map(obj, iterator, context) {
    var results = []
    if (obj == null) return results
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context)     
    forEach(obj, function(val, i, coll) {
        results[i] = iterator.call(context, val, i, coll)
    })
    return results
}

function sliceArgs(args, start) {
    return slice.call(args, start || 0)
}
