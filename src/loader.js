/**
 * js/css LazyLoad
 * 
 * 变量hash记录已经加载过的资源，避免重复加载
 * 
 * Z.loadScript('a.js', function() { ... })
 *
 * Z.loadScript('a.js', option, function() { ... })
 * 
 * 加载多个js后才回调，缺陷是js文件不存在，那么也将触发回调
 * Z.loadScript(['a.js','b.js','c.js'], function() { ... })
 * 
 * option
 *   charset: 'utf-8'
 *   scope: xx
 * 
 * 加载多个css后才回调，IE6/7/8/9和Opera中支持link的onreadystatechange事件
 * Firefox/Safari/Chrome既不支持onreadystatechange，也不支持onload。使用setTimeout延迟加载
 *
 * Z.loadLink('a.css', function() { ... })
 * 
 */

~function(Z) {

var hash = {}
var emptyFunc = noop()
var head = doc.head || doc.getElementsByTagName('head')[0]

function createEl(type, attrs) {
    var el = doc.createElement(type), attr
    for (attr in attrs) {
        el.setAttribute(attr, attrs[attr])
    }
    return el
}
function done(list, obj) {
    hash[obj.url] = true
    list.shift()
    if (!list.length) {
        obj.callback.call(obj.scope)
    }
}
function load(type, urls, option, callback) {

    if (Z.isString(urls)) {
        urls = [urls]
    }

    if (Z.isFunction(option)) {
        callback = option
        option = {}
    }

    option = option || {}

    var obj = {
        scope: option.scope || window,
        callback: callback || emptyFunc
    }
    var list = [].concat(urls)
    var charset = option.charset || 'utf-8'

    forEach(urls, function(url, i) {
        var el = null
            
        // 已经加载的不再加载
        if (hash[url]) {
            Z.error('warning: ' + url + ' has loaded.')
        }

        if (type === 'js') {
            el = createEl('script', {
                src: url,
                async: 'async',
                charset: charset
            })
        } else {
            el = createEl('link', {
                href: url,
                rel: 'stylesheet',
                type: 'text/css'
            })
        }

        (function(url) {
            if (Z.ie) {
                el.onreadystatechange = function() {
                    var readyState = this.readyState
                    if(readyState === 'loaded' || readyState === 'complete') {
                        obj.url = url
                        this.onreadystatechange = null
                        done(list, obj)
                    }
                }
            } else {
                if (type == 'js') {
                    el.onload = el.onerror = function() {
                        obj.url = url
                        done(list, obj)
                    }
                } else {
                    setTimeout(function() {
                        obj.url = url
                        done(list, obj)
                    }, 100)
                }
            }
        })(url)
        
        if (type === 'js') {
            head.insertBefore(el, head.firstChild)
        } else {
            head.appendChild(el)
        }
    })

}

Z.loadScript = function(urls, option, callback) {
    load('js', urls, option, callback)
}

Z.loadLink = function(urls, option, callback) {
    load('css', urls, option, callback)
}

}(Z)
