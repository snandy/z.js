
Z.declareUI('Dialog', function() {

function template() {
    var dlg = '<div class="thickbox">' +
                '<div class="thickwrap">' +
                  '<div class="thicktitle"><span></span></div>' +
                  '<div class="thickcon"></div>' +
                  '<a class="thickclose" href="javascript:;">×</a>' +
                '</div>' +
              '</div>'
    var mask = '<div class="thickdiv"></div>'
    var iframe = '<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" class="thickframe"></iframe>'

    dlg = Z( Z.dom(dlg) )
    mask = Z( Z.dom(mask) )
    iframe = Z( Z.dom(iframe) )
    return [dlg, mask, iframe]
}

this.init = function(option) {
    this.width = option.width || 200
    this.height = option.height || 100
    this.autoReposi = option.autoReposi || false
    this.dragdrop = option.dragdrop || true

    this.title = option.title || '提示'
    this.content = function() {
        if (option.content) {
            if (Z.isFunction(option.content)) {
                return option.content()
            } else {
                return option.content
            }
        } else {
            return ''
        }
    }()

    var arr = template()
    this.div = arr[0]
    this.mask = arr[1]
    this.iframe = arr[2]

    Z('body').append(arr[0])
    Z('body').append(arr[1])
    Z('body').append(arr[2])

    this.setRect(this.width, this.height)
    this.setTitle(this.title)
    this.setContent(this.content)
    this.setPosi()
    this.events()

    if (this.dragdrop) {
        Z.ui.Dragdrop(this.div[0], {inwin: true, handle: '.thicktitle'})
    }
    this.fire('init')
}

this.setTitle = function(title) {
    this.div.find('.thicktitle').html(title)
}

this.setContent = function(content) {
    this.div.find('.thickcon').html(content)
}

this.setRect = function(width, height) {
    this.div.find('.thickwrap').css({
        width: width + 'px',
        height: height + 'px'
    })
}

this.setPosi = function(top, left) {
    var obj = Z.winSize()
    var top = top || (obj.height-50)/2 - this.div[0].clientHeight/2
    var left = left || obj.width/2 - this.div[0].clientWidth/2
    this.div.css({
        top: top,
        left: left,
        position: 'fixed'
    })
}

this.events = function() {
    var self = this
    this.div.delegate('.thickclose', 'click', function() {
        self.remove()
    })

    if (this.autoReposi) {
        Z(window).on('resize', {
            context: this,
            handler: this.setPosi
        })        
    }

    if (Z.ie6) {
        this.div.css('position', 'absolute')
        Z(window).on('scroll', {
            content: this,
            handler: this.setPosi
        })
    }
}

this.remove = this.close = function() {
    this.div.remove()
    this.mask.remove()
    this.iframe.remove()
    Z(window).off('resize', this.setPosi)
    this.fire('close')
}


})