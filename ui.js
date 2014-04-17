/*!
 * Z.js v0.1.0
 * @snandy 2014-04-17 11:04:41
 *
 */
/**
 * 拖拽插件
 *
 * 使用
 * Z.ui.Dragable(option)
 * 
 * 配置对象 option
 * Dargable({
 *    elem: // DOM元素
 *    handle:  // @string   鼠标按下开始拖动的元素
 *    canDrag: // @boolean  默认: true
 *    axis:    // @string   拖拽方向，默认: "xy"。x: 仅水平方向，y: 仅垂直方向
 *    area:    // @array    [minX,maxX,minY,maxY] 拖拽范围 默认任意拖动
 *    inwin:   // @boolean  仅在浏览器窗口内拖动
 *    cursor:  // @string   鼠标状态
 *    zIndex:  // @number   拖拽时zIndex值
 *    fixed:   // @boolean  出现滚动条时保持fixed 默认true
 * })
 * 
 * 方法 method
 * stopDrag // 停止拖拽
 * startDrag  // 开启拖拽
 *
 * 事件 event [start:开始拖拽, drag:拖拽中, end:拖拽结束]
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
    this.downObj = this.handle ? this.dragObj.find(this.handle) : dragObj

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

/**
 * 页签组件 
 *   Z.ui.Tab(elem, option)
 *   Z.ui.Tab('.single', {eventType: 'click'})
 *
 * Option
 *   elem            // DOM元素或CSS选择器
 *   eventType:      // 默认 "mouseover"，鼠标移动到上面时切换，可选 "click"
 *   currClass:      // 默认 "curr"
 *   autoPlay:       // 是否自动播放，默认false
 *   interval:       // 自动播放时间间隔
 *   attrName:       // tab的css属性选择器的key，默认为 data-ui
 *   tabNavVal:      // tab的css属性选择器的key，默认为 tab-nav
 *   tabConVal:      // tab content的css属性选择器的key，默认为 tab-content
 *   index:          // 指定当前的tab, autoPlay必须为true
 *
 */
Z.declareUI('Tab', function() {

var ZF = Z.Function

this.init = function(elem, option) {
    var option = option || {}
    // 内部状态变量
    this.elem = Z.isElement(elem) ? elem : Z(elem)[0]
    this.eventType = option.eventType || 'mouseover'
    this.currClass = option.currClass || 'curr'
    this.autoPlay = option.autoPlay || false
    this.interval = option.interval || 5000
    this.currIndex = option.currIndex || 0
    this.attrName = option.attrName || 'data-ui'
    this.tabNavVal = option.tabNavVal || 'tab-nav'
    this.tabConVal = option.tabConVal || 'tab-content'

    // DOM element
    var attrName = this.attrName
    var tabNavVal = this.tabNavVal
    var tabConVal = this.tabConVal

    var elemObj = this.elemObj = Z(this.elem)
    var navObj = this.navObj = elemObj.find('[' + attrName + '=' + tabNavVal + ']')
    var contentObj = this.contentObj = elemObj.find('[' + attrName + '=' + tabConVal + ']')

    if (navObj.length != contentObj.length) {
        throw new Error('navObj and contentObj length must be equal')
    }

    // tab长度
    this.length = navObj.length

    // 设置当前tab，默认为第一个
    this.change(this.currIndex)

    // 自动播放
    if (this.autoPlay) {
        this.play()
    }

    // 事件
    var self = this
    elemObj.delegate('[' + attrName + '=' + tabNavVal + ']', this.eventType, function(ev) {
        var index = navObj.index(this)
        self.change(index)
    })

}

this.change = function(index) {
    var navObj = this.navObj
    var contentObj = this.contentObj
    var currClass = this.currClass

    var nav = navObj.eq(index)
    var content = contentObj.eq(index)

    this._preNav = this._preNav ? this._preNav : nav
    this._preCon = this._preCon ? this._preCon : content

    // nav
    this._preNav.removeClass(currClass)
    nav.addClass(currClass)
    this._preNav = nav

    // content
    this._preCon.hide()
    content.show()
    this._preCon = content

    // 充值当前的索引
    this.currIndex = index

    // change事件
    this.fire('change', index)
}

this.play = function() {
    var self = this
    this.timer = setInterval(function() {
        // 递增顺序播放
        var index = self.currIndex + 1
        // 到达最后一个tab后，从第一个开始
        if (index === self.length) {
            index = 0
        }
        self.change(index)
    }, this.interval)
}

this.stop = function() {
    clearInterval(this.timer)
}


})