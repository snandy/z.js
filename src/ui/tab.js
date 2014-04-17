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