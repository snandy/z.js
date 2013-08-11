~function(window, undefined) {

var OP = Object.prototype
var FP = Function.prototype
var types = ['Array', 'Function', 'Object', 'String', 'Number', 'Boolean']

var toString = OP.toString
var slice  = types.slice
var push   = types.push
var concat = types.concat

var nativeForEach = types.forEach
var nativeMap = types.map
var nativeEvery = types.every
var nativeSome = types.some
var nativeIndexOf = types.indexOf
var nativeFilter = types.filter
var nativeBind = FP.bind

var doc = window.document

function Z(selector, context) {
    return new Z.prototype.init(selector, context)
}

Z.identity = function(val) { return val }

