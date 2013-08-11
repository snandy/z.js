/**
 * @class Z.Function
 * 
 * Create a function bound to a given object (assigning `this`, and arguments, optionally)
 * @singleton
 */
Z.Function = function() {
    function bind(func, context) {
        var args, bound
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1))
        if (!Z.isFunction(func)) throw new TypeError
        args = slice.call(arguments, 2)
        return bound = function() {
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)))
            noop.prototype = func.prototype
            var self = new noop
            noop.prototype = null
            var result = func.apply(self, args.concat(slice.call(arguments)))
            if (Object(result) === result) return result
            return self
        }
    }
    function once(func) {
        var run, memo
        return function() {
            if (run) return memo
            run = true
            return memo = func.apply(this, arguments)
        }
    }
    function delay(func, wait) {
        return function() {
            var context = this, args = arguments
            setTimeout(function() {
                func.apply(context, args)
            }, wait)
        }
    }
    function debounce(func, wait, immediate) {
        var timeout
        return function() {
            var context = this, args = arguments
            later = function() {
                timeout = null
                if (!immediate) func.apply(context, args)
            }
            var callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(context, args)
        }
    }
    function throttle(func, wait) {
        var context, args, timeout, throttling, more, result
        var whenDone = debounce(function() {
                more = throttling = false
            }, wait)
        return function() {
            context = this, args = arguments
            var later = function() {
                timeout = null
                if (more) func.apply(context, args)
                whenDone()
            }
            if (!timeout) timeout = setTimeout(later, wait)
            
            if (throttling) {
                more = true
            } else {
                result = func.apply(context, args)
            }
            whenDone()
            throttling = true
            return result
        }
    }

    return {
        bind: bind,
        once: once,
        delay: delay,
        debounce: debounce,
        throttle: throttle
    }
}()