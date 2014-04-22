
Z.declareUI('Suggest', function() {

function create(tag, cls) {
    var el = document.createElement(tag)
    if (cls) {
        el.className = cls
    }
    return Z(el)
}

this.init = function(input, option) {
    var input = this.input = Z(input)
    this.ulCls = option.ulCls || ''
    this.liCls = option.liCls || 'suggest-li'
    this.currCls = option.currCls || 'curr'
    this.url = option.url || ''
    this.data = option.data || []
    this.buildLi = option.buildLi
    this.currLi = null

    var posi = this.getInputPosition()
    this.div = create('div', 'suggest-div').hide()
    this.div.css({
        position: 'absolute',
        top: posi.top+input[0].offsetHeight-1,
        left: posi.left,
        width: input[0].offsetWidth-2
    })
    this.ul = create('ul', option.ulCls)
    this.div[0].appendChild(this.ul[0])
    document.body.appendChild(this.div[0])

    var self = this
    this.input.on('keyup', function(ev) {
        if (input.value === '') {
            self.hide()
        } else {
            self.onKeyup(ev)
        }
    })
}

this.getInputPosition = function() {
    return this.input.offset()
}

this.hide = function() {
    this.div.hide()
}

this.show = function() {
    this.div.show()
}

this.render = function() {
    this.ul.empty()
    Z.each(this.data, function(val, i) {
        var li = create('li', this.liCls)
        li.attr('data-val', val)
        if ( Z.isFunction(this.buildLi) ) {
            li.html( this.buildLi(val) )
        } else {
            li.html(val)
        }
        this.ul[0].appendChild(li[0])
    }, this)
    this.visible = true
    this.show()
}

this.onKeyup = function(ev) {
    var div = this.div
    var ulElem = this.ul[0]
    var input = this.input
    var liCls = this.liCls
    var currCls = this.currCls

    if (this.visible) {
        switch (ev.keyCode) {
            case 13: // Enter
                if (this.currLi) {
                    input.value = this.currLi.firstChild.data
                    this.hide()
                }
                return
            case 38: // 方向键上
                if (this.currLi == null) {
                    this.currLi = ulElem.lastChild
                    this.currLi.className = currCls
                    input.val(this.currLi.firstChild.data)
                } else {
                    if (this.currLi.previousSibling != null) {
                        this.currLi.className = liCls
                        this.currLi = this.currLi.previousSibling
                        this.currLi.className = currCls
                        input.val(this.currLi.firstChild.data)
                    } else {
                        this.currLi.className = liCls;
                        this.currLi = null
                        input[0].focus()
                        input.val(this.finalValue)
                    }
                }
                return
            case 40: // 方向键下
                if (this.currLi == null) {
                    this.currLi = ulElem.firstChild
                    this.currLi.className = currCls
                    input.val(this.currLi.firstChild.data)
                } else {
                    if (this.currLi.nextSibling != null) {
                        this.currLi.className = liCls
                        this.currLi = this.currLi.nextSibling
                        this.currLi.className = currCls
                        input.val(this.currLi.firstChild.data)
                    } else {
                        this.currLi.className = liCls
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
    
    this.lis = [];
    var val = input.val()
    if (this.finalValue !== val) {
        this.render()
        this.finalValue = val
    }
}


})