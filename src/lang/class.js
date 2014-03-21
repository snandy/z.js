/**
 * @class Z.Class
 * 
 * JavaScript OOP, Support class, inheritance, namespace, private and more.
 * @Singleton
 */
Z.Class = function() {

function Observer(type, context) {
    this.type = type
    this.scope = context || window
    this.listeners = []
}
Observer.prototype = {
    subscribe: function(fn, scope, options) {
        var listeners = this.listeners
        if (!fn || this._find(fn, scope) !== -1) return false

        var listener = {
            fn: fn,
            scope: scope || this.scope,
            opt: options
        }

        if (this.firing) {
            // if we are currently firing this event, don't disturb the listener loop
            listeners = this.listeners = listeners.slice(0)
        }
        listeners.push(listener)

        return true
    },
    unsubscribe: function(fn, scope) {
        if (!fn) {
            return this.clear()
        }

        var index = this._find(fn, scope)
        if (index !== -1) {
            this._delete(index)
            return true
        }

        return false
    },
    publish: function() {
        var listeners = this.listeners
        var count = listeners.length
        var i = 0, xargs, listener

        if (count > 0) {
            this.firing = true
            while (listener = listeners[i++]) {
                xargs = sliceArgs(arguments)
                if (listener.opt) {
                    xargs.push(listener.opt)
                }
                if (listener && listener.fn.apply(listener.scope, xargs) === false) {
                    return (this.firing = false)
                }
            }
        }
        this.firing = false

        return true
    },
    clear: function() {
        var l = this.listeners.length, i = l
        while (i--) this._delete(i)
        this.listeners = []
        return l
    },
    _find: function(fn, scope) {
        var listeners = this.listeners
        var i = listeners.length
        var listener, s

        while (i--) {
            if (listener = listeners[i]) {
                if (listener.fn === fn && (!scope || listener.scope === scope)) return i
            }
        }
        return -1
    },
    _delete: function(index) {
        var listeners = this.listeners
        var o = listeners[index]
        if (o) {
            delete o.fn
            delete o.scope
            delete o.opt
        }
        listeners.splice(index, 1)
    }
}

var Event = {
    on: function(type, fn, scope, o) {
        var config, ev
        if (typeof type === 'object') {
            o = type
            for (type in o) {
                if (!o.hasOwnProperty(type)) continue
                config = o[type]
                this.on(type, config.fn || config, config.scope || o.scope, config.fn ? config : o)
            }
        } else {
            this._events = this._events || {}
            ev = this._events[type] || false
            if (!ev) {
                ev = this._events[type] = new Observer(type, this)
            }
            ev.subscribe(fn, scope, o)
        }
    },
    off: function(type, fn, scope) {
        var config, ev, o, index
        if (typeof type === 'object') {
            o = type
            for (type in o) {
                if (!o.hasOwnProperty(type)) continue
                config = o[type]
                this.un(type, config.fn || config, config.scope || o.scope)
            }
        } else {
            ev = this._events[type]
            if (ev) ev.unsubscribe(fn, scope)
        }
    },
    clearEvent: function(type) {
        var ev = this._events && this._events[type]
        if (ev) ev.clear()
    },
    fire: function(type) {
        var ev
        if (!this._events || !(ev = this._events[type])) return true
        return ev.publish.apply(ev, sliceArgs(arguments, 1))
    }
}

// initialize namespace
function namespace(classPath, globalNamespace) {
    if ( !Z.isString(classPath) ) throw new Error('classPath must be a string')
    globalNamespace = Z.isObject(globalNamespace) ? globalNamespace : window
    var arr = classPath.split('.')
    var namespace = globalNamespace
    var className = arr.pop()

    while (arr.length) {
        var name = arr.shift()
        var obj = namespace[name]
        if (!obj) {
            namespace[name] = obj = {}
        }
        namespace = obj
    }

    var clazz = namespace[className]
    if ( Z.isFunction(clazz) ) throw new Error(className + ' is already defined')
    namespace[className] = undefined
    return {
        namespace: namespace,
        className: className
    }
}

var create = Object.create ? 
        function(o) { return Object.create(o) } : 
        (function() { // Reusable constructor function for the Object.create() shim.
            function F() {}
            return function(o) {
                F.prototype = o
                return new F
            }
        }())

// define a class
function Class(name, superClass, factory) {
    if (!factory) {
        if (!superClass) {
            throw new Error('class create failed, verify definitions')
        }
        factory = superClass
        superClass = Object
    }

    function Constructor() {
        if ( Z.isFunction(this.init) ) {
            this.init.apply(this, arguments)
        }
    }
    Constructor.toString = function() { return name }

    var supr = superClass.prototype
    // var proto = Constructor.prototype = new superClass
    var proto = Constructor.prototype = create(supr)
    proto.constructor = factory
    factory.call(proto, supr)
    
    Z.extend(proto, Event)

    if (Class.amd) return Constructor
    var obj = namespace(name, Class.globalNamespace)
    obj.namespace[obj.className] = Constructor
}

Class.statics = function(clazz, obj) {
    Z.extend(clazz, obj)
}

Class.methods = function(clazz, obj, override) {
    var proto = clazz.prototype
    for (var m in obj) {
        if ( !Z.isFunction(obj[m]) ) throw new Error(m + ' is not a function')
        if (override) {
            proto[m] = obj[m]
        } else {
            if (!proto[m]) {
                proto[m] = obj[m]
            }
        }
    }
}

return Class
}()