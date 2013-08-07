~function(window, undefined) {

var OP = Object.prototype
var types = ['Array', 'Boolean', 'Function', 'Object', 'String', 'Number']

var toString = OP.toString
var slice = types.slice
var push  = types.push
var doc = window.document
var isStrict = doc.compatMode == 'CSS1Compat'
var rwhite = /\s/
var trimLeft = /^\s+/
var trimRight = /\s+$/
var rroot = /^(?:body|html)$/i
    
// IE6/7/8 return false
if (!rwhite.test( '\xA0' )) {
    trimLeft = /^[\s\xA0]+/
    trimRight = /[\s\xA0]+$/
}

// For IE9/Firefox/Safari/Chrome/Opera
var makeArray = function(obj) {
    return slice.call(obj, 0)
}
// For IE6/7/8
try {
    slice.call(doc.documentElement.childNodes, 0)[0].nodeType
} catch(e) {
    makeArray = function(obj) {
        var res = []
        for (var i = 0, len = obj.length; i < len; i++) {
            res[i] = obj[i]
        }
        return res
    }
}

// Iterator
function forEach(obj, iterator, context) {
    if ( obj.length === +obj.length ) {
        for (var i = 0; i < obj.length; i++) {
            if (iterator.call(obj[i] || context, obj[i], i, obj) === true) return
        }
    } else {
        for (var k in obj) {
            if (iterator.call(obj[k] || context, obj[k], k, obj) === true) return
        }
    }
}