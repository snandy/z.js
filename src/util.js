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

/**
 * Browser Detect
 * 注意：IE11中Browser.ie返回false，把IE11当成标准浏览器吧，别叫它IE
 * IE11 API变化: http://www.cnblogs.com/snandy/p/3174777.html
 */
var Browser = function(ua) {
    var b = {
        sogou: /se/.test(ua),
        opera: /opera/.test(ua),
        chrome: /chrome/.test(ua),
        firefox: /firefox/.test(ua),
        maxthon: /maxthon/.test(ua),
        tt: /TencentTraveler/.test(ua),
        ie: /msie/.test(ua) && !/opera/.test(ua),
        safari: /webkit/.test(ua) && !/chrome/.test(ua)
    }
    var mark = ''
    for (var i in b) {
        if (b[i]) {
            mark = 'safari' == i ? 'version' : i
            break
        }
    }
    var reg = RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)')
    b.version = mark && reg.test(ua) ? RegExp.$1 : '0'

    var iv = parseInt(b.version, 10)
    for (var i = 6; i < 11; i++) {
        b['ie'+i] = iv === i
    }
    
    return b
}(navigator.userAgent.toLowerCase())

