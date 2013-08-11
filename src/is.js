
// Z.isArray, Z.isBoolean, ...
forEach(types, function(name) {
    Z['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})

Z.isPrimitive = function(obj) {
    var a = typeof obj
    return !!(obj === undefined || obj === null || a === 'boolean' || a === 'number' || a === 'string')
}

Z.isEmptyObject = function(obj) {
    for (var prop in obj) return false
    return true
}

Z.isEmpty = function(obj) {
    if (obj == null) return true
    if (Z.isArray(obj) || Z.isString(obj)) return obj.length === 0
    for (var key in obj) return false
    return true
}

Z.isPlainObject = function(obj) {
    if (!obj || obj === window || obj === doc || obj === doc.body) return false
    return 'isPrototypeOf' in obj && Z.isObject(obj)
}

Z.isArrayLike = function(obj) {
    return obj.length === +obj.length && !Z.isString(obj)
}

Z.isWindow = function(obj) {
    return obj != null && obj === obj.window
}

Z.isDocument = function(obj) { 
    return obj != null && obj.nodeType === obj.DOCUMENT_NODE 
}

Z.isElement = function(obj) {
    return obj ? obj.nodeType === 1 : false
}

Z.isTextNode = function(obj) {
    return obj ? obj.nodeName === "#text" : false;
}

Z.isZ = function(obj) {
    return obj.constructor === Z
}
