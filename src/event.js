
var guid = 1
var guidStr = '__guid__'
        
// 存放所有事件handler, 以guid为key, cache[1] = {}
// cache[1] = {handle: evnetHandle, events: {}}, events = {click: [handler1, handler2, ..]}
var cache = {}

// 优先使用标准API
var w3c = !!window.addEventListener

var ZFunc = Z.Function
var onceFunc = ZFunc.once
var delayFunc = ZFunc.delay
var debounceFunc = ZFunc.debounce
var throttleFunc = ZFunc.throttle

// Utility functions ---------------------------------------------------------------------------
function each(arr, callback) {
    for (var i=0; i<arr.length; i++) {
        if ( callback(arr[i], i) === true ) return
    }
}

var addListener = function() {
    if (w3c) {
        return function(el, type, handler) { el.addEventListener(type, handler, false) } 
    } else {
        return function(el, type, handler) { el.attachEvent('on' + type, handler) }
    }
}()
var removeListener = function() {
    if (w3c) {
        return function(el, type, handler) { el.removeEventListener(type, handler, false) }
    } else {
        return function(el, type, handler) { el.detachEvent('on' + type, handler) }
    }
}()


// Private functions ---------------------------------------------------------------------------

function returnFalse() {
    return false
}
function returnTrue() {
    return true
}
function excuteHandler(elem, e, args /*only for trigger*/) {
    if (!elem || !e) return
    
    var e = fix(e, elem)
    var type = e.type
    var id = elem[guidStr]
    var elData = cache[id]
    var events = elData.events
    var handlers = events[type]
    
    var ret = null
    for (var i = 0, handlerObj; handlerObj = handlers[i++];) {
        if (args) handlerObj.args = handlerObj.args.concat(args)
        if (e.namespace) {
            if (e.namespace === handlerObj.namespace) {
                ret = callback(elem, type, e, handlerObj)
            }
        } else {
            ret = callback(elem, type, e, handlerObj)
        }

        if (ret === false) {
            e.preventDefault()
            e.stopPropagation()
        }
    }
}
function callback(elem, type, e, handlerObj) {
    var args      = handlerObj.args
    var stop      = handlerObj.stop
    var data      = handlerObj.data
    var handler   = handlerObj.handler
    var prevent   = handlerObj.prevent
    var context   = handlerObj.context || elem
    var stopBubble = handlerObj.stopBubble
    
    // 如果数组第一个元素不是事件对象，将事件对象插入到数组第一个位置; 如果是则用新的事件对象替换
    if (args[0] && args[0].type === e.type) {
        args.shift()
        args.unshift(e)
    } else {
        args.unshift(e)
    }
    
    if (stop) {
        e.preventDefault()
        e.stopPropagation()
    }
    
    if (prevent) e.preventDefault()
    
    if (data) e.data = data
    
    if (stopBubble) e.stopPropagation()
    
    return handler.apply(context, args)
}
// handlerObj class
function Handler(config) {
    this.handler   = config.handler
    this.one       = config.one
    this.delay     = config.delay
    this.debounce  = config.debounce
    this.immediate = config.immediate
    this.throttle  = config.throttle
    this.context   = config.context
    this.stop      = config.stop
    this.prevent   = config.prevent
    this.stopBubble = config.stopBubble
    this.data       = config.data
    if (config.args) {
        this.args = config.args.length ? config.args : [config.args]
    } else {
        this.args = []
    }
}
// 删除事件的注册，从缓存中去除
function remove(elem, type, guid) {
    var elData = cache[guid]
    var handle = elData.handle
    var events = elData.events
    
    // 从缓存中删除指定类型事件相关数据
    delete events[type]
    
    // DOM中事件取消注册
    removeListener(elem, type, handle)
    // events是空对象时，从cache中删除
    if ( Z.isEmptyObject(events) ) {
        delete elData.elem
        delete elData.handle        
        delete elData.events
        delete cache[guid]
    }
}
// Custom event class
function Event(event) {
    var namespace
    if (event.type) {
        this.originalEvent = event
        this.type = event.type
    } else {
        if (event.indexOf('.') > -1) {
            namespace = event.split('.')
            this.type = namespace[0]
            this.namespace = namespace[1]
        } else {
            this.type = event
            this.namespace = ''
        }
    }
    this.timeStamp = now()
}
Event.prototype = {
    preventDefault: function() {
        this.isDefaultPrevented = returnTrue
        var e = this.originalEvent
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false
    },
    stopPropagation: function() {
        this.isPropagationStopped = returnTrue
        var e = this.originalEvent
        if (e.stopPropagation) {
            e.stopPropagation()
        }
        e.cancelBubble = true
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = returnTrue
        this.stopPropagation()
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
}

// Fix evnet object
function fix(e, elem) {
    var i, prop, props = [], originalEvent = e
    
    props = props.concat('altKey bubbles button cancelable charCode clientX clientY ctrlKey currentTarget'.split(' '))
    props = props.concat('data detail eventPhase fromElement handler keyCode layerX layerY metaKey'.split(' '))
    props = props.concat('newValue offsetX offsetY originalTarget pageX pageY prevValue relatedTarget'.split(' '))
    props = props.concat('screenX screenY shiftKey target toElement view wheelDelta which'.split(' '))
    
    e = new Event(originalEvent)
    for (i=props.length; i;) {
        prop = props[--i]
        e[prop] = originalEvent[prop]
    }
    
    if (!e.target) {
        e.target = originalEvent.srcElement || elem // elem for trigger event
    }
    if (e.target.nodeType === 3) {
        e.target = e.target.parentNode
    }
    if (!e.relatedTarget && e.fromElement) {
        e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement
    }
    if (e.pageX == null && e.clientX != null) {
        var docElem = document.documentElement
        var body = document.body
        e.pageX = e.clientX + 
            (docElem && docElem.scrollLeft || body && body.scrollLeft || 0) -
            (docElem && docElem.clientLeft || body && body.clientLeft || 0)
        e.pageY = e.clientY + 
            (docElem && docElem.scrollTop  || body && body.scrollTop  || 0) -
            (docElem && docElem.clientTop  || body && body.clientTop  || 0)
    }
    if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode)) {
        e.which = e.charCode || e.keyCode
    }
    if (!e.metaKey && e.ctrlKey) {
        e.metaKey = e.ctrlKey
    }
    if (!e.which && e.button !== undefined) {
        e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ))
    }
    
    return e
}

// Public functions -----------------------------------------------------------------------------

// Add event handler
function bind(elem, type, handler) {
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !type) return
    
    var id = elem[guidStr] = elem[guidStr] || guid++
    var elData = cache[id] = cache[id] || {}
    var events = elData.events
    var handle = elData.handle
    var handlerObj, eventType, i = 0, arrType, namespace
    
    // 批量添加, 递归
    if ( Z.isObject(type) ) {
        for (eventType in type) {
            bind(elem, eventType, type[eventType])
        }
        return
    } else {
        arrType = type.split(' ')
    }
    
    // handle parameter handler
    if ( Z.isFunction(handler) ) {
        handlerObj = new Handler({handler: handler})
    } else {
        if ( !Z.isFunction(handler.handler) ) return
        handlerObj = new Handler(handler)
    }
    
    handler = handlerObj.handler
    
    // one 仅执行一次
    if (handlerObj.one) {
        handlerObj.special = handler
        handlerObj.handler = onceFunc(handler)
    }
    
    // delay延迟执行
    if (handlerObj.delay) {
        handlerObj.special = handler
        handlerObj.handler = delayFunc(handler, handlerObj.delay)
    }
    
    // debounce防弹跳
    if (handlerObj.debounce) {
        handlerObj.special = handler
        handlerObj.handler = debounceFunc(handler, handlerObj.debounce)
    }
    
    // immediate 执行后立即延迟指定时间，如避免重复提交
    if (handlerObj.immediate) {
        handlerObj.special = handler
        handlerObj.handler = debounceFunc(handler, handlerObj.immediate, true)
    }
    
    // throttle 事件节流
    if (handlerObj.throttle) {
        handlerObj.special = handler
        handlerObj.handler = throttleFunc(handler, handlerObj.throttle)
    }
    
    // 初始化events
    if (!events) {
        elData.events = events = {}
    }
    
    // 初始化handle
    if (!handle) {
        elData.handle = handle = function(e) {
            return excuteHandler(elData.elem, e)
        }
    }
    
    // elem暂存到handle
    elData.elem = elem
    
    while ( eventType=arrType[i++] ) {
        // Namespaced event handlers
        if ( eventType.indexOf('.') > -1 ) {
            namespace = type.split('.')
            eventType = namespace[0]
            handlerObj.namespace = namespace[1]
        } else {
            handlerObj.namespace = ''
        }
        
        // 取指定类型事件(如click)的所有handlers, 如果有则是一个数组, 第一次是undefined则初始化为空数组
        // 也仅在handlers为undefined时注册事件, 即每种类型事件仅注册一次, 再次添加handler只是push到数组handlers中
        handlers  = events[eventType]
        if (!handlers) {
            handlers = events[eventType] = []
            addListener(elem, eventType, handle)
        }
        // 添加到数组
        handlers.push(handlerObj)
    }
    
    // 避免IE低版本内存泄露
    elem = null
}

// Remove event handler
function unbind(elem, type, handler) {
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8) return
    var id       = elem[guidStr]
    var elData   = id && cache[id]
    var events   = elData && elData.events
    var handlers = events && events[type]
    
    if (handler) { // 传3个参数
        each(handlers, function(handlerObj, i) {
            if (handlerObj.handler === handler || handlerObj.special === handler) {
                handlers.splice(i, 1)
                return true
            }
        })
        if (handlers.length === 0) remove(elem, type, id)
    
    } else if (type) { // 传两个参数
        remove(elem, type, id)
    
    } else { // 传一个参数
        for (var type in events) remove(elem, type, id)
    }
}

// Fire event
function trigger(elem, type) {
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8) return

    var id       = elem[guidStr]
    var elData   = id && cache[id]
    var events   = elData && elData.events
    var handlers = events && events[type]
    var args     = sliceArgs(arguments, 2)
    var length   = arguments.length
    
    if (length===1 && elem.nodeType===1) {
        for (var type in events) excuteHandler(elem, type, args)
    } else {
        excuteHandler(elem, type, args)
    }
}

// on / off
forEach({on: bind, off: unbind}, function(fn, name) {
    Z.fn[name] = function(type, handler) {
        return this.each(function(el) {
            fn(el, type, handler)
        })
    }
})

// one / delay / throttle / debounce / immediate
forEach(['one', 'delay', 'throttle', 'debounce', 'immediate'], function(name) {
    Z.fn[name] = function(type, handler, wait) {
        return this.each(function(el) {
            var option = {handler: handler}
            option[name] = name === 'one' ? true : wait
            bind(el, type, option)
        })
    }
})

// fire
Z.fn.fire = function(type) {
    return this.each(function(el) {
        trigger(el, type)
    })
}

// Shorthand Methods
forEach('click,dblclick,mouseover,mouseout,mouseenter,mouseleave,mousedown,mouseup,keydown,keyup,keypress,focus,blur'.split(','), function(name) {
    Z.fn[name] = function(handler) {
        if (arguments.length === 0) {
            this.fire(name)
        } else {
            this.on(name, handler)
        }
        return this
    }
})

// Event delegate
Z.fn.delegate = function(selector, type, handler) {
    if (arguments.length === 2 && Z.isFunction(type)) {
        fn = type
        type = 'click'
    }
    return this.each(function(el) {
        Z(el).on(type, function(e) {
            var tar = e.target
            Z(selector, this).each( function(el) {
                if (tar == el || Z.contains(el, tar)) handler.call(el, e)
            })
        })
    })
}
Z.fn.undelegate = function(type, fn) {
    return this.each(function(el) {
        Z(el).off(type, fn)
    })
}

