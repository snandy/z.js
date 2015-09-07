
/**
 * @class Z.String
 *
 * A collection of useful static methods to deal with strings. 
 * @singleton
 */
Z.String = function() {

    var ZO = Z.Object
    var regFormat = /\{(\d+)\}/g
    var regNum = /^\d+$/
    var regScript = /<script[^>]*>([\s\S]*?)<\/script>/gi
    var regTrim   = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g
    var entityMap = {
        escape: {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        }
    }
    entityMap.unescape = ZO.invert(entityMap.escape)
    var entityReg = {
        escape: RegExp('[' + ZO.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: RegExp('(' + ZO.keys(entityMap.unescape).join('|') + ')', 'g')
    }

    function escape(html) {
        if (typeof html !== 'string') return ''
        return html.replace(entityReg.escape, function(match) {
            return entityMap.escape[match]
        })
    }

    function unescape(str) {
        if (typeof str !== 'string') return ''
        return str.replace(entityReg.unescape, function(match) {
            return entityMap.unescape[match]
        })    
    }

    return {
        escape: escape,
        unescape: unescape,
        trim: function(str) {
            return str.replace(regTrim, '')
        },
        isNumberStr: function(str) {
            return regNum.test(str)
        },
        toInt: function(str, base) {
            if (this.isNumberStr(str)) return parseInt(str, base||10)
            Z.error('not a number')
        },
        toFloat: function(str) {
            if (this.isNumberStr(str)) return parseFloat(str)
            Z.error('not a number')
        },
        urlAppend : function(url, str) {
            if (Z.isString(str) && str.length) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + str
            }
            return url
        },
        stripScript: function(str) {
            return str.replace(regScript, function() {
                return ''
            })
        },
        ellipsis: function(val, len, word) {
            if (val && val.length > len) {
                if (word) {
                    var vs = val.substr(0, len - 2)
                    var i = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'))
                    if ( i !== -1 && i >= (len-15) ) {
                        return vs.substr(0, i) + '...'
                    }
                }
                return val.substr(0, len-3) + '...'
            }
            return val
        },
        format: function(str) {
            var args = sliceArgs(arguments, 1)
            return str.replace(regFormat, function(m, i) {
                return args[i]
            })
        }
    }

}()