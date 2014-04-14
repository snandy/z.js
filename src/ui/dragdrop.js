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

Z.declareUI('Dragdrop', function() {

var winObj = Z(window)
var docObj = Z(document)
var doc  = docObj[0] 
var ZF = Z.Function
var axisReg = /^xy$/

/*
 * 获取视窗的宽高
 */
function getViewSize() {
    return {
        width: winObj.width(),
        height: winObj.height()
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
    var handle   = this.handle

    var dragObj  = this.dragObj = Z(option.elem)
    var downObj  = this.downObj = handle ? dragObj.find(option.handle) : dragObj
    var dargElem = this.dragElem = dragObj[0]

    // 暂存配置对象
    dragObj.data('optionData', option)
    dragObj.data('originData', Z.extend({}, option))

    // 设置鼠标状态
    downObj.css('cursor', option.cursor)

    // 需要使用的一些状态变量
    var self = this
    var viewSize

    // 鼠标mousedown
    downObj.mousedown(function(ev) {
        // 模拟拖拽，需要设置为绝对定位
        dragObj.css('position', 'absolute')
        
        // 鼠标按下的时候计算下window的宽高，拖拽元素尺寸. 
        // 不要再mousemove内计算
        viewSize = getViewSize()
        self.dragElemWidth = Math.max(dargElem.offsetWidth, dargElem.clientWidth)
        self.dragElemHeight = Math.max(dargElem.offsetHeight, dargElem.clientHeight)
        self.dragElemMarginTop = parseInt(dargElem.style.marginTop, 10) || 0
        self.dragElemMarginLeft = parseInt(dargElem.style.marginLeft, 10) || 0

        // 仅在窗口可视范围内移动
        if (option.inwin) {
            var winX = viewSize.width - self.dragElemWidth
            var winY = viewSize.height - self.dragElemHeight
            option.area = [0, winX, 0, winY]
        }

        var mousemove = ZF.bind(self.onMousemove, self)
        self.mouseup = ZF.bind(self.onMouseup, self)
        self.mousemove = function(ev) {
            mousemove(ev)
        }

        if (window.captureEvents) { //标准DOM
            ev.stopPropagation()
            ev.preventDefault()
            winObj.blur(self.mouseup)
        } else if(dargElem.setCapture) { //IE
            dargElem.setCapture()
            ev.cancelBubble = true
            dragObj.bind('losecapture', self.mouseup)
        }
        
        self.diffX = ev.clientX - dargElem.offsetLeft
        self.diffY = ev.clientY - dargElem.offsetTop

        docObj.mousemove(self.mousemove)
        docObj.mouseup(self.mouseup)

        // drag start event
        // if (option.start) {
        //     option.start.call(dragObj)
        // }
    })

}

this.onMousemove = function(ev) {
    var minX, maxX, minY, maxY    
    var moveX = ev.clientX - this.diffX
    var moveY = ev.clientY - this.diffY
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
        moveX = moveX - this.dragElemMarginTop
        moveY = moveY - this.dragElemMarginLeft
        if (axis === 'x' || axisReg.test(axis)) {
            dragElem.style.left = moveX + 'px'
        }
        if (axis === 'y' || axisReg.test(axis)) {
            dragElem.style.top =  moveY + 'px'
        }
    }
    // drag event
    // if (option.drag) {
    //     option.drag.call(dragObj, moveX, moveY)
    // }
}

this.onMouseup = function(ev) {
    var self = this

    // 删除事件注册
    docObj.off('mousemove', this.mousemove)
    docObj.off('mouseup', this.mouseup)

    if (window.releaseEvents) { //标准DOM
        winObj.off('blur', this.mouseup)
    } else if (dargElem.releaseCapture) { //IE
        dragObj.off('losecapture', this.mouseup)
        dragElem.releaseCapture()
    }
    // drag end evnet
    // if (option.end) {
    //     option.end.call(dragObj)
    // }
}

})
