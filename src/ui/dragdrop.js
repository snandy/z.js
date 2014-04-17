/**
 * 拖拽插件
 *
 * 使用 Use
 *   Z.ui.Dragable(option)
 * 
 * 配置 Option
 *   elem:    // DOM元素
 *   handle:  // @string   鼠标按下开始拖动的元素
 *   canDrag: // @boolean  默认: true
 *   axis:    // @string   拖拽方向，默认: "xy"。x: 仅水平方向，y: 仅垂直方向
 *   area:    // @array    [minX,maxX,minY,maxY] 拖拽范围 默认任意拖动
 *   inwin:   // @boolean  仅在浏览器窗口内拖动
 *   cursor:  // @string   鼠标状态
 *   zIndex:  // @number   拖拽时zIndex值
 *   fixed:   // @boolean  出现滚动条时保持fixed 默认true
 * 
 * 方法 Method
 *   stopDrag   // 停止拖拽
 *   startDrag  // 开启拖拽
 *
 * 事件 Event 
 *   start  开始拖拽 
 *   drag   拖拽中
 *   end    拖拽结束
 *
 */

Z.declareUI('Dragdrop', function() {

var winObj = Z(window)
var docObj = Z(document)
var doc  = docObj[0] 
var ZF = Z.Function
var axisReg = /^xy$/

this.init = function(elem, option) {

    // 相关属性数据
    this.elem = Z.isElement(elem) ? elem : Z(elem)[0]
    this.handle = option.handle
    this.canDrag = option.canDrag !== false
    this.axis = option.axis || 'xy'
    this.area = option.area || []
    this.inwin = option.inwin || false
    this.cursor = option.cursor || 'move'
    this.zIndex = option.zIndex || ''
    this.dragObj = Z(this.elem)
    this.downObj = this.handle ? this.dragObj.find(this.handle) : this.dragObj

    // 暂存配置对象
    // this.dragObj.data('optionData', option)
    // this.dragObj.data('originData', Z.extend({}, option))

    // 设置鼠标状态
    this.downObj.css('cursor', this.cursor)

    // 鼠标mousedown
    var mousedown = ZF.bind(this.onMousedown, this)
    this.downObj.mousedown(function(ev) {
        mousedown(ev)
    })
}

this.onMousedown = function(ev) {
    var dragElem = this.dragObj[0]
    // 模拟拖拽，需要设置为绝对定位
    this.dragObj.css('position', 'absolute')
    
    // 鼠标按下的时候计算下window的宽高，拖拽元素尺寸，不要再mousemove内计算
    var viewSize = Z.viewSize()
    this.dragElemWidth = Math.max(dragElem.offsetWidth, dragElem.clientWidth)
    this.dragElemHeight = Math.max(dragElem.offsetHeight, dragElem.clientHeight)
    this.dragElemMarginTop = parseInt(dragElem.style.marginTop, 10) || 0
    this.dragElemMarginLeft = parseInt(dragElem.style.marginLeft, 10) || 0

    // 仅在窗口可视范围内移动
    if (this.inwin) {
        var winX = viewSize.width - this.dragElemWidth
        var winY = viewSize.height - this.dragElemHeight
        this.area = [0, winX, 0, winY]
    }

    var mousemove = ZF.bind(this.onMousemove, this)
    this.mouseup = ZF.bind(this.onMouseup, this)
    this.mousemove = function(ev) {
        mousemove(ev)
    }

    if (window.captureEvents) { //标准DOM
        ev.stopPropagation()
        ev.preventDefault()
        winObj.blur(this.mouseup)
    } else if(dragElem.setCapture) { //IE
        dragElem.setCapture()
        ev.cancelBubble = true
        this.dragObj.on('losecapture', this.mouseup)
    }
    
    this.diffX = ev.clientX - dragElem.offsetLeft
    this.diffY = ev.clientY - dragElem.offsetTop

    // 开始拖拽
    docObj.mousemove(this.mousemove)
    docObj.mouseup(this.mouseup)

    // starg 事件
    this.fire('start')
}

this.onMousemove = function(ev) {
    var minX, maxX, minY, maxY    
    var moveX = ev.clientX - this.diffX
    var moveY = ev.clientY - this.diffY
    var dragObj = this.dragObj 
    var dragElem = dragObj[0]
    var area = this.area
    
    // 设置拖拽范围
    if (this.area) {
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
    if (this.canDrag) {
        var axis = this.axis
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

    // drag 事件
    this.fire('drag', moveX, moveY)
}

this.onMouseup = function(ev) {
    var self = this
    var dragElem = this.dragObj[0]

    // 删除事件注册
    docObj.off('mousemove', this.mousemove)
    docObj.off('mouseup', this.mouseup)

    if (window.releaseEvents) { //标准DOM
        winObj.off('blur', this.mouseup)
    } else if (dargElem.releaseCapture) { //IE
        dragObj.off('losecapture', this.mouseup)
        dragElem.releaseCapture()
    }

    // end 事件
    this.fire('end')
}

this.stopDrag = function() {
    this.canDrag = false
}

this.startDrag = function() {
    this.canDrag = true
}

})
