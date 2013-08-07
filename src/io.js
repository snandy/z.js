
// object to queryString
function serialize(obj) {
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

// parse json string
function parseJSON(str) {
    try {
        return JSON.parse(str)
    } catch(e) {
        try {
            return (new Function('return ' + str))()
        } catch(e) {
        }
    }
}

// exports 
Z.parseJSON = parseJSON
    
// empty function
function noop() {}


/**
 *  Ajax API
 *     Z.ajax, Z.get, Z.post, Z.text, Z.json, Z.xml
 *  
 */
var createXHR = window.XMLHttpRequest ?
    function() {
        try{
            return new XMLHttpRequest()
        } catch(e){}
    } :
    function() {
        try{
            return new window.ActiveXObject('Microsoft.XMLHTTP')
        } catch(e){}
    }
    
function ajax(url, options) {
    if ( Z.isObject(url) ) {
        options = url
        url = options.url
    }
    if ( Z.isFunction(options) ) {
        options = {success: options}
    }
    var xhr, isTimeout, timer, options = options || {}

    var async      = options.async !== false
    var method     = options.method  || 'GET'
    var type       = options.type    || 'json'
    var encode     = options.encode  || 'UTF-8'
    var timeout    = options.timeout || 0
    var credential = options.credential
    var data       = options.data
    var scope      = options.scope
    var success    = options.success || noop
    var failure    = options.failure || noop
    
    // 大小写都行，但大写是匹配HTTP协议习惯
    method  = method.toUpperCase()
    
    // 对象转换成字符串键值对
    if ( Z.isObject(data) ) {
        data = serialize(data)
    }
    if (method === 'GET' && data) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + data
    }
    
    xhr = createXHR()
    if (!xhr) return
    
    isTimeout = false
    if (async && timeout>0) {
        timer = setTimeout(function() {
            // 先给isTimeout赋值，不能先调用abort
            isTimeout = true
            xhr.abort()
        }, timeout)
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (isTimeout) {
                failure(xhr, 'request timeout')
            } else {
                onStateChange(xhr, type, success, failure, scope)
                clearTimeout(timer)
            }
        }
    }
    xhr.open(method, url, async)
    if (credential) {
        xhr.withCredentials = true
    }
    if (method == 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode)
    }
    xhr.send(data)
    return xhr
}

function onStateChange(xhr, type, success, failure, scope) {
    var s = xhr.status, result
    if (s>= 200 && s < 300) {
        switch (type) {
            case 'text':
                result = xhr.responseText
                break
            case 'json':
                result = parseJSON(xhr.responseText)
                break
            case 'xml':
                result = xhr.responseXML
                break
        }
        // text, 返回空字符时执行success
        // json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
        result !== undefined && success.call(scope, result)
        
    } else {
        failure(xhr, xhr.status)
    }
    xhr = null
}

// exports to Z
var ajaxOptions = {
    method: ['get', 'post'],
    type: ['text','json','xml'],
    async: ['sync', 'async']
}

// Low-level Interface: Z.ajax
Z.ajax = ajax

// Shorthand Methods: Z.get, Z.post, Z.text, Z.json, Z.xml
forEach(ajaxOptions, function(val, key) {
    forEach(val, function(item, index) {
        Z[item] = function(key, item) {
            return function(url, opt, success) {
                if ( Z.isObject(url) ) {
                    opt = url
                }
                if ( Z.isFunction(opt) ) {
                    opt = {success: opt}
                }
                if ( Z.isFunction(success) ) {
                    opt = {data: opt}
                    opt.success = success
                }
                if (key === 'async') {
                    item = item==='async' ? true : false
                }
                opt = opt || {}
                opt[key] = item
                return ajax(url, opt)
            }
        }(key, item)
    })
})


/**
 *  JSONP API
 *  Z.jsonp
 *  
 */    
var ie678 = !-[1,]
var opera = window.opera
var head = doc.head || doc.getElementsByTagName('head')[0]
var jsonpDone = false

//Thanks to Kevin Hakanson
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/873856#873856
function generateRandomName() {
    var uuid = '', s = [], i = 0, hexDigits = '0123456789ABCDEF';
    for (i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[12] = '4';
    // bits 6-7 of the clock_seq_hi_and_reserved to 01    
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
    uuid = 'jsonp_' + s.join('');
    return uuid;
}

function jsonp(url, options) {
    if ( Z.isObject(url) ) {
        options = url;
        url = options.url;
    }
    var options = options || {}
    var me      = this
    var timeout = 3000
    var url     = url + '?'
    var data    = options.data
    var charset = options.charset
    var success = options.success || noop
    var failure = options.failure || noop
    var scope   = options.scope || window
    var timestamp = options.timestamp
    var jsonpName = options.jsonpName || 'callback'
    var callbackName = options.jsonpCallback || generateRandomName()
    
    if ( Z.isObject(data) ) {
        data = serialize(data)
    }
    var script = doc.createElement('script')
    
    function callback(isSucc) {
        if (isSucc) {
            jsonpDone = true
        } else {
            failure.call(scope)
        }
        // Handle memory leak in IE
        script.onload = script.onerror = script.onreadystatechange = null
        if ( head && script.parentNode ) {
            head.removeChild(script)
            script = null
            window[callbackName] = undefined
        }
    }
    function fixOnerror() {
        setTimeout(function() {
            if (!jsonpDone) {
                callback()
            }
        }, timeout)
    }
    if (ie678) {
        script.onreadystatechange = function() {
            var readyState = this.readyState
            if (!jsonpDone && (readyState == 'loaded' || readyState == 'complete')) {
                callback(true)
            }
        };
        
    } else {
        script.onload = function() {
            callback(true)
        }
        script.onerror = function() {
            callback()
        }
        if (opera) {
            fixOnerror()
        }
    }
    
    url += jsonpName + '=' + callbackName
    
    if (charset) {
        script.charset = charset
    }
    if (data) {
        url += '&' + data
    }
    if (timestamp) {
        url += '&ts='
        url += (new Date).getTime()
    }
    
    window[callbackName] = function(json) {
        success.call(scope, json)
    };
    
    script.src = url
    head.insertBefore(script, head.firstChild)
}

// exports to Z
Z.jsonp = function(url, opt, success) {
    if ( Z.isObject(url) ) {
        opt = url
    }
    if ( Z.isFunction(opt) ) {
        opt = {success: opt}
    }
    if ( Z.isFunction(success) ) {
        opt = {data: opt}
        opt.success = success
    }
    
    return jsonp(url, opt)
}

