
Z.declareUI('Suggest', function() {

function create(tag, cls) {
    var el = document.createElement(tag)
    if (cls) {
        el.className = cls
    }
    return Z(el)
}

this.init = function(input, option) {
    this.input = Z(input)
    this.ulCls = option.ulCls || ''
    this.liCls = option.liCls || 'suggest-li'
    this.currCls = option.currCls || 'curr'
    this.url = option.url || ''
    this.data = option.data || []
    this.processData = option.processData || function(data) {return data}
    this.processLi = option.processLi || function(v1, v2) { return v1 }
    this.processVal = option.processVal || function(v1, v2) { return v1 }
    this.currLi = null

    var posi = this.getInputPosition()
    this.div = create('div', 'suggest-div').hide()
    this.div.css({
        position: 'absolute',
        top: posi.top + this.input[0].offsetHeight - 1,
        left: posi.left,
        width: this.input[0].offsetWidth - 2
    })
    this.ul = create('ul', option.ulCls)
    this.div.append(this.ul)
    Z(document.body).append(this.div)

    this.events()

    this.fire('init')
}

this.events = function() {
    this.input.on('keyup', {
        context: this, 
        handler: function(ev) {
            if (this.input.value === '') {
                this.hide()
            } else {
                this.onKeyup(ev)
            }
        }
    }).on('blur', {
        context: this, 
        handler: function() {
            this.hide()
        }
    })

    var self = this
    var currCls = self.currCls
    this.ul.delegate('li', 'mousedown', function() {
        var li = Z(this)
        self.input.val( li.attr('data-val') )
    }).delegate('li', 'mouseover', function() {
        var li = Z(this)
        li.addClass(currCls)
        self.currLi = li
    }).delegate('li', 'mouseout', function() {
        var li = Z(this)
        li.removeClass(currCls)
    })
}

this.getInputPosition = function() {
    return this.input.offset()
}

this.hide = function() {
    this.div.hide()
    this.visible = false
    this.fire('hide')
}

this.show = function() {
    this.div.show()
    this.visible = true
    this.fire('show')
}

this.render = function() {
    var iVal = this.input.val()
    if (iVal === '') {
        this.hide()
        return
    }
    this.ul.empty()
    Z.each(this.data, function(it, i) {
        var li = create('li', this.liCls)
        var fVal = this.processVal(it, iVal)
        li.attr('data-val', fVal)
        li.html( this.processLi(it, iVal) )
        this.ul.append(li)
    }, this)
    this.visible = true
    this.show()
    this.fire('render')
}

this.specKeys = function(keyCode) {
    var ul = this.ul
    var lis = ul.find('li')
    var input = this.input
    var currLi = this.currLi
    var liCls = this.liCls
    var currCls = this.currCls

    switch (keyCode) {
        case 13: // Enter
            if (currLi) {
                input.val( currLi.attr('data-val') )
                this.hide()
            }
            return
        case 38: // 方向键上
            if (currLi == null) {
                this.currLi = lis.last()
                this.currLi.addClass(currCls)
                input.val( this.currLi.attr('data-val') )
            } else {
                if (this.currLi.prev().length) {
                    this.currLi.removeClass(currCls)
                    this.currLi = this.currLi.prev()
                    this.currLi.addClass(currCls)
                    input.val( this.currLi.attr('data-val') )
                } else {
                    this.currLi.removeClass(currCls)
                    this.currLi = null
                    input[0].focus()
                    input.val(this.finalValue)
                }
            }
            return
        case 40: // 方向键下
            if (currLi == null) {
                this.currLi = lis.first()
                this.currLi.addClass(currCls)
                input.val( this.currLi.attr('data-val') )
            } else {
                if (this.currLi.next().length) {
                    this.currLi.removeClass(currCls)
                    this.currLi = this.currLi.next()
                    this.currLi.addClass(currCls)
                    input.val( this.currLi.attr('data-val') )
                } else {
                    this.currLi.removeClass(currCls)
                    this.currLi = null
                    input[0].focus()
                    input.val(this.finalValue)
                }
            }
            return
        case 27: // ESC键
            this.hide();
            input.val(this.finalValue)
            return
    }
}

this.onKeyup = function(ev) {
    var self = this
    var input = this.input
    var keyCode = ev.keyCode
    if ( (keyCode === 13 || keyCode === 27 || keyCode ===38 || keyCode === 40) && this.visible) {
        this.specKeys(keyCode)
    } else {
        this.lis = []
        var val = input.val()
        if (this.finalValue !== val) {
            if (this.url) {
                Z.get(this.url, function(data) {
                    self.data = self.process(data)
                    self.render()
                })
            } else {
                this.render()    
            }
            this.finalValue = val
        }
    }
}


})