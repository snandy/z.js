/**
 * 拖拽插件
 *
 * 简单使用
 * $(selector).dragable()
 * 
 * 配置对象 option
 * $(selector).dargable({
 *       handle:  // @string   鼠标按下开始拖动的元素
 *       canDrag: // @boolean  默认: true
 *       axis:    // @string   拖拽方向，默认: "xy"。x: 仅水平方向，y: 仅垂直方向
 *       area:    // @array    [minX,maxX,minY,maxY] 拖拽范围 默认任意拖动
 *       inwin:   // @boolean  仅在浏览器窗口内拖动
 *       cursor:  // @string   鼠标状态
 *       zIndex:  // @number   拖拽时zIndex值
 *       fixed:   // @boolean  出现滚动条时保持fixed 默认true
 * })
 * 
 * 方法 method
 * $(selector).dragable('disable') // 停止拖拽
 * $(selector).dragable('enable')  // 开启拖拽
 * $(selector).dragable('reset')   // 重置配置对象option
 *
 * 事件 event [start:开始拖拽, drag:拖拽中, end:拖拽结束]
 * 
 * $(selector).dragable({
 *     start: function() {
 *   
 *     },
 *     drag: function() {
 *   
 *     },
 *     end: function() {
 *   
 *     }
 * })
 * 
 *
 */

Z.declareUI('DragDrop', function() {

var $win = Z(window)
var $doc = Z(document)
var doc  = $doc[0] 
var ZF = Z.Function

/*
 * 获取视窗的宽高
 */
function getViewSize() {
    return {
        width: $win.width(),
        height: $win.height()
    }
}

this.init = function(option) {
    option = Z.extend({
        elem: null,
        handle: '',
        canDrag: option.canDrag !== false,
        axis: option.axis || 'xy',
        area: option.area || [],
        inwin: option.inwin,
        cursor: 'move',
        zIndex: ''
    }, option)

    this.option = option

    var axisReg = /^xy$/
    var handle   = this.handle

    var dragObj  = this.dragObj = Z(option.elem)
    var downObj  = this.downObj = handle ? dragObj.find(option.handle) : dragObj
    var dargElem = this.dragElem = dragObj[0]

    // 暂存配置对象
    dragObj.data('optionData', option)
    dragObj.data('originData', $.extend({}, option))

    // 设置鼠标状态
    downObj.css('cursor', option.cursor)

    // 需要使用的一些状态变量
    var self = this
    var diffX, diffY, viewSize
    var dragElemWidth, dragElemHeight, dragElemMarginTop, dragElemMarginLeft

    // 鼠标mousedown
    downObj.mousedown(function(ev) {
        // 模拟拖拽，需要设置为绝对定位
        dragObj.css('position', 'absolute')
        
        // 鼠标按下的时候计算下window的宽高，拖拽元素尺寸. 
        // 不要再mousemove内计算
        viewSize = getViewSize()
        dragElemWidth = Math.max(dargElem.offsetWidth, dargElem.clientWidth)
        dragElemHeight = Math.max(dargElem.offsetHeight, dargElem.clientHeight)
        dragElemMarginTop = parseInt(dargElem.style.marginTop, 10) || 0
        dragElemMarginLeft = parseInt(dargElem.style.marginLeft, 10) || 0

        // 仅在窗口可视范围内移动
        if (option.inwin) {
            var winX = viewSize.width - dragElemWidth
            var winY = viewSize.height - dragElemHeight
            option.area = [0, winX, 0, winY]
        }

        if (window.captureEvents) { //标准DOM
            ev.stopPropagation()
            ev.preventDefault()
            $win.blur(mouseup)
        } else if(dargElem.setCapture) { //IE
            dargElem.setCapture()
            ev.cancelBubble = true
            dragObj.bind('losecapture', mouseup)
        }
        
        diffX = ev.clientX - dargElem.offsetLeft
        diffY = ev.clientY - dargElem.offsetTop

        var onMousemove = ZF.bind(self.onMousemove, self)
        $doc.mousemove(function(ev) {
            onMousemove(ev)
        })
        $doc.mouseup(mouseup)

        // drag start event
        if (option.start) {
            option.start.call(dragObj)
        }
    }

}

this.onMousemove = function(ev) {
    var minX, maxX, minY, maxY    
    var moveX = ev.clientX - diffX
    var moveY = ev.clientY - diffY
    var option = this.option
    var dragObj = this.dragObj 
    var dragElem = this.dragElem
    var area = option.area
    
    // 设置拖拽范围
    if (option.area) {
        minX = area[0]
        maxX = area[1]
        minY = area[2]
        maxY = area[3]
        moveX < minX && (moveX = minX) // left 最小值
        moveX > maxX && (moveX = maxX) // left 最大值
        moveY < minY && (moveY = minY) // top 最小值
        moveY > maxY && (moveY = maxY) // top 最大值
    }

    // 设置是否可拖拽，有时可能有取消元素拖拽行为的需求
    if (option.canDrag) {
        var axis = option.axis
        //设置位置，并修正margin
        moveX = moveX - dragElemMarginTop
        moveY = moveY - dragElemMarginLeft
        if (axis === 'x' || axisReg.test(axis)) {
            dargElem.style.left = moveX + 'px'
        }
        if (axis === 'y' || axisReg.test(axis)) {
            dargElem.style.top =  moveY + 'px'
        }
    }
    // drag event
    if (option.drag) {
        option.drag.call(dragObj, moveX, moveY)
    }
}

this.onMouseup = function(ev) {
    // 删除事件注册
    $doc.unbind('mousemove', mousemove)
    $doc.unbind('mouseup', mouseup)

    if (window.releaseEvents) { //标准DOM
        $win.unbind('blur', mouseup)
    } else if(dargElem.releaseCapture) { //IE
        dragObj.unbind('losecapture', mouseup)
        dargElem.releaseCapture()
    }
    // drag end evnet
    if (option.end) {
        option.end.call(dragObj)
    }
}

})

~function(window, $) {

var $win = $(window)
var $doc = $(window.document)
var doc  = $doc[0]

/**
 * 获取视窗的宽高
 */
function getViewSize() {
    return {
        width: $win.width(),
        height: $win.height()
    }
}

/**
 * @private initilize 初始化拖拽
 * @param {Object} option
 * @param {Object} jqObject
 */
function initilize(option, jqObject) {
    option = option || {}
    var axisReg = /^xy$/
    var option = $.extend({
        handle: '',
        canDrag: option.canDrag !== false,
        axis: option.axis || 'xy',
        area: option.area || [],
        inwin: option.inwin,
        cursor: 'move',
        zIndex: ''
    }, option)

    jqObject.each(function(i, elem) {
        var handle   = option.handle
        var dragObj  = $(elem)
        var downObj  = handle ? dragObj.find(handle) : dragObj
        var dargElem = dragObj[0]

        // 暂存配置对象
        dragObj.data('optionData', option)
        dragObj.data('originData', $.extend({}, option))

        // 设置鼠标状态
        downObj.css('cursor', option.cursor)

        // 需要使用的一些状态变量
        var diffX, diffY, viewSize
        var dragElemWidth, dragElemHeight, dragElemMarginTop, dragElemMarginLeft

        // 鼠标mousedown
        downObj.mousedown(function(ev) {
            // 模拟拖拽，需要设置为绝对定位
            dragObj.css('position', 'absolute')
            
            // 鼠标按下的时候计算下window的宽高，拖拽元素尺寸. 
            // 不要再mousemove内计算
            viewSize = getViewSize()
            dragElemWidth = Math.max(dargElem.offsetWidth, dargElem.clientWidth)
            dragElemHeight = Math.max(dargElem.offsetHeight, dargElem.clientHeight)
            dragElemMarginTop = parseInt(dargElem.style.marginTop, 10) || 0
            dragElemMarginLeft = parseInt(dargElem.style.marginLeft, 10) || 0

            // 仅在窗口可视范围内移动
            if (option.inwin) {
                var winX = viewSize.width - dragElemWidth
                var winY = viewSize.height - dragElemHeight
                option.area = [0, winX, 0, winY]
            }

            if (window.captureEvents) { //标准DOM
                ev.stopPropagation()
                ev.preventDefault()
                $win.blur(mouseup)
            } else if(dargElem.setCapture) { //IE
                dargElem.setCapture()
                ev.cancelBubble = true
                dragObj.bind('losecapture', mouseup)
            }
            
            diffX = ev.clientX - dargElem.offsetLeft
            diffY = ev.clientY - dargElem.offsetTop
            $doc.mousemove(mousemove)
            $doc.mouseup(mouseup)

            // drag start event
            if (option.start) {
                option.start.call(dragObj)
            }
        })

        function mousemove(ev) {
            var minX, maxX, minY, maxY
            var moveX = ev.clientX - diffX
            var moveY = ev.clientY - diffY
            
            // 设置拖拽范围
            if (option.area) {
                minX = option.area[0]
                maxX = option.area[1]
                minY = option.area[2]
                maxY = option.area[3]
                moveX < minX && (moveX = minX) // left 最小值
                moveX > maxX && (moveX = maxX) // left 最大值
                moveY < minY && (moveY = minY) // top 最小值
                moveY > maxY && (moveY = maxY) // top 最大值
            }

            // 设置是否可拖拽，有时可能有取消元素拖拽行为的需求
            if (option.canDrag) {
                var axis = option.axis
                //设置位置，并修正margin
                moveX = moveX - dragElemMarginTop
                moveY = moveY - dragElemMarginLeft
                if (axis === 'x' || axisReg.test(axis)) {
                    dargElem.style.left = moveX + 'px'
                }
                if (axis === 'y' || axisReg.test(axis)) {
                    dargElem.style.top =  moveY + 'px'
                }
            }
            // drag event
            if (option.drag) {
                option.drag.call(dragObj, moveX, moveY)
            }
        }
        function mouseup(ev) {
            // 删除事件注册
            $doc.unbind('mousemove', mousemove)
            $doc.unbind('mouseup', mouseup)

            if (window.releaseEvents) { //标准DOM
                $win.unbind('blur', mouseup)
            } else if(dargElem.releaseCapture) { //IE
                dragObj.unbind('losecapture', mouseup)
                dargElem.releaseCapture()
            }
            // drag end evnet
            if (option.end) {
                option.end.call(dragObj)
            }
        }
        
    })    
}

/**
 * @method dragable jQuery拖拽插件
 * @param {Object} option
 * @param {String} key
 * @param {String} value
 */
$.fn.dragable = function(option, key, value) {

    if (typeof option === 'string') {
        var oldOption = this.data('optionData')
        switch (option) {
            case 'destroy':
                break
            case 'disable':
                oldOption.canDrag = false
                break
            case 'enable':
                oldOption.canDrag = true
                break
            case 'reset':
                var originOption = this.data('originData')
                $.extend(true, oldOption, originOption)
                break
            case 'option':
                if (key && value === undefined) {
                    return oldOption[key]
                }
                switch (key) {
                    case 'axis':
                        oldOption.axis = value
                        break
                    case 'cursor':
                        oldOption.cursor = value
                        break
                    case 'zIndex':
                        oldOption.zIndex = value
                        break
                }
                break
            default:;
        }

    } else if (typeof option === 'object') {
        initilize(option, this)
    }

    return this
}

}(this, jQuery);