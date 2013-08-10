
/**
 * @class Z.String
 *
 * A collection of useful static methods to deal with strings. 
 * @singleton
 */
Z.String = function(Z) {

    var regTrim = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g
    var entityMap = {
        escape: {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        }
    }
    entityMap.unescape = Z.invert(entityMap.escape)
    var entityReg = {
        escape: RegExp('[' + Z.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: RegExp('(' + Z.keys(entityMap.unescape).join('|') + ')', 'g')
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
        htmlEscape: escape,
        htmlUnescape: unescape,

        urlAppend : function(url, str) {
            if (Z.isString(str) && str.length) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + str    
            }
            return url
        },

        trim: function(str) {
            return str.replace(regTrim, '')
        }
    }

}(Z)