
Z.declareUI('Scroll', function() {

function template() {

}

this.init = function(div, option) {
    this.step = option.step
    this.width = option.width
    this.height = option.height
    this.evtType = option.evtType || 'click'
    this.visibleNum = option.visibleNum || 1

    this.autoPlay = option.autoPlay || true
    this.autoPlayTime = option.autoPlayTime || '2000'

    var btnNext = option.btnNext || '.btnNext'
    var btnPrev = option.btnPrev || '.btnPrev'
    this.btnNext = Z.isString(btnNext) ? Z(btnNext) : btnNext
    this.btnPrev = Z.isString(btnPrev) ? Z(btnPrev) : btnPrev

    this.div = Z.isString(div) ? Z(div) : div
    this.ul = this.div.find('ul')
    this.lis = this.div.find('li')
    this.total = Math.ceil((this.lis.length - this.visibleNum) / this.step) + 1

    this.events()

    if (this.autoPlay) {
        this.play()
    }

}

this.animate = function() {
    
}

this.play = function() {
    var div = this.div
    var ul = div.find('ul')
    var liWidth = ul.find('li').innerWidth()
    var length = this.visibleNum * liWidth
    
    clearInterval(this.timer)
    this.timer = setInterval(function() {
        var left = parseInt(ul.css('left'), 10)
        ul.css({
            left: -length+left
        })
    }, this.autoPlayTime)
}

this.events = function() {

}

})