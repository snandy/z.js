// 特性检测
var support = function() {
    var div = doc.createElement('div')
    div.className = 'a'
    div.innerHTML = '<p style="color:red;"><a href="#" style="opacity:.4;float:left;">a</a></p>'
    div.setAttribute('class', 't')
    
    var p = div.getElementsByTagName('p')[0]
    var a = p.getElementsByTagName('a')[0]
    
    // http://www.cnblogs.com/snandy/archive/2011/08/27/2155300.html
    var setAttr = div.className === 't'
    // http://www.cnblogs.com/snandy/archive/2011/03/11/1980545.html
    var cssText = /;/.test(p.style.cssText)
    var opacity = /^0.4$/.test(a.style.opacity)
    var getComputedStyle = !!(doc.defaultView && doc.defaultView.getComputedStyle)
    
    var sliceOnNodeList = true
    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof doc !== 'undefined') {
            slice.call(doc.getElementsByTagName('body'))
        }
    } catch (e) {
        sliceOnNodeList = false
    }

    var tableInnerHTML = true
    var table = doc.createElement('table')
    var tbody = doc.createElement('tbody')
    table.appendChild(tbody)
    var boo = true
    try {
        tbody.innerHTML = '<tr></tr>'
    } catch(e) {
        tableInnerHTML = false
    }

    return {
        setAttr : setAttr,
        cssText : cssText,
        opacity : opacity,
        classList : !!div.classList,
        cssFloat : !!a.style.cssFloat,
        getComputedStyle : getComputedStyle,
        sliceOnNodeList: sliceOnNodeList,
        tableInnerHTML: tableInnerHTML
    }
}()