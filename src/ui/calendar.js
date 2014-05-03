
Z.declareUI('Calendar', function() {
//
var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
var months = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',')
var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/

function format(date, hasDay) {
    var arr, m, d, day

    if (Z.isString(date)) {
        arr = date.split('-')
        date = new Date(arr[0], arr[1]-1, arr[2])
    }

    var mm = date.getMonth()
    var dd = date.getDate()
    if (mm < 11) {
        m = '0' + (mm + 1)
    } else {
        m = mm + 1
    }
    if (dd < 10) {
        d = '0' + dd
    } else {
        d = dd
    }

    var str = date.getFullYear() + '-' + m + '-' + d
    if (hasDay) {
        day = week[date.getDay()]
        str += ' ' + day
    }

    return str
}

function template() {
    var templ = '<table cellpadding="0" cellpadding="0" class="datepicker">' + 
                    '<thead>' +
                        '<tr class="controls"><th colspan="7"><span class="prevMonth"><s></s></span><span class="currDate"><span class="currYs"></span>年<span class="currMo"></span>月</span></th></tr>' +
                        '<tr class="days"><th class="org sun">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="org sat">六</th></tr>' +
                    '</thead>' +
                    '<tbody></tbody>' +
                    '<tfoot><tr><td colspan="7"></td></tr></tfoot>' +
                 '</table>'

    var table1 = Z.dom(templ)[0]
    table1 = Z(table1)
    table1.find('tfoot').find('td').append('<span class="today">今天</span>')

    var table2 = Z.dom(templ)[0]
    table2 = Z(table2)
    table2.find('.prevMonth').replaceClass('prevMonth', 'nextMonth')
    table2.find('tfoot').find('td').append('<span class="close">关闭</span>')
    
    var tr = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
    var arr = []
    for (var i = 0; i < 6; i++) {
        arr[i] = tr
    }
    table1.find('tbody').html(arr.join(''))
    table2.find('tbody').html(arr.join(''))


    var div = Z.dom('<div class="o-datepicker"></div>')
    div = Z(div)
    return div.append(table1).append(table2)
}

this.init = function(input, option) {
    option = option || {}
    this.x = option.x || 0
    this.y = option.y || 0
    this.hasDay = option.hasDay
    this.startDate  = option.startDate
    this.endDate    = option.endDate
    this.chosenDate = option.chosenDate

    this.currDate = new Date()
    this.input = Z(input)

    var self = this
    this.input.click(function(ev) {
        var input = Z(this)
        // 已经初始化过直接返回
        if ( input.data('hasDatepicker') ) return
        // console.log('init')
        // ev.stopPropagation()
        self.render()
    })

}

this.setPosi = function() {
    var posi = this.input.offset()
    var outerHeight = this.input.outerHeight()
    var left = (this.x ? this.x-0 : 0) + posi.left
    var top  = (this.y ? this.y-0 : 0) + posi.top + outerHeight
    this.div.css({
        position: 'absolute',
        left: left,
        top: top
    })
    // console.log('win resize')
}

this.onBodyClick = function(ev) {
    var target = Z(ev.target)
    if (!target.closest('.datepicker').length && target[0] != this.input[0]) {
        this.remove()
    }
    // console.log('bodyclick')
}

this.remove = function() {
    this.div.remove()
    this.input.val( format(this.currDate, this.hasDay) )
    this.input.data('hasDatepicker', false)
    Z(window).off('resize', this.setPosi)
    Z(document).off('click', this.onBodyClick)
}

this.events = function() {
    var self = this
    this.div.delegate('.date', 'click', function(ev) {
        var td    = Z(this)
        var table = td.closest('table')
        var year  = table.find('.currYs').text()
        var month = table.find('.currMo').text() - 1
        var date  = td.text()
        self.currDate = new Date(year, month, date)
        self.remove()
        self.fire('select')

    }).delegate('.date', 'mouseover', function() {
        Z(this).addClass('over')

    }).delegate('.date', 'mouseout', function() {
        Z(this).removeClass('over')  

    }).delegate('.today', 'click', function() {
        self.currDate = new Date()
        self.remove()
        self.fire('select')  

    }).delegate('.close', 'click', function() {
        self.remove()
        self.fire('close')

    }).delegate('.prevMonth', 'click', function() {
        var span = Z(this)
        if (span.hasClass('disabled')) return false
        self.prevMonth()

    }).delegate('.nextMonth', 'click', function() {
        var span = Z(this)
        if (span.hasClass('disabled')) return false
        self.nextMonth()     
           
    })

    Z(window).on('resize', {
        context: this,
        handler: this.setPosi
    })

    Z(document).on('click', {
        context: this,
        handler: this.onBodyClick
    })
}

this.render = function() {
    var input = this.input
    var currDate = this.currDate
    var chosenDate = this.chosenDate

    var val = input.val()
    if ( val && reDate.test(val) ) {
        val = val.split('-')
        this.currDate = new Date(val[0], val[1] - 1, val[2])
    } else {
        if ( Z.isDate(chosenDate) ) {
            this.currDate = chosenDate
        } else {
            if ( reDate.test(chosenDate) ) {
                var arr = chosenDate.split('-')
                this.currDate = new Date(arr[0], arr[1]-1, arr[2])
            }
        }
    }

    this.div = template()

    var tables = this.div.find('table')
    var table1 = this.table1 = tables.first()
    var table2 = this.table2 = tables.last()
    var cMonth = currDate.getMonth()
    var cDate  = currDate.getFullYear()
    if (cMonth == 11) {
        table1.find('.currYs').text(cDate)
        table1.find('.currMo').text(cMonth + 1)
        table2.find('.currYs').text(cDate + 1)
        table2.find('.currMo').text(1)
    } else {
        table1.find('.currYs').text(cDate)
        table1.find('.currMo').text(cMonth + 1)
        table2.find('.currYs').text(cDate)
        table2.find('.currMo').text(cMonth + 2)
    }

    // 回填 '天'
    this.fillDate()
    // 添加事件
    this.events()
    // 标记input已经弹出了日期组件
    input.data('hasDatepicker', true)
    // 设置日期组件的位置
    this.setPosi()
    // 添加到body
    Z('body').append(this.div)
}

this.nextMonth = function() {
    var year1  = this.table1.find('.currYs')
    var year2  = this.table2.find('.currYs')
    var month1 = this.table1.find('.currMo')
    var month2 = this.table2.find('.currMo')
    var y1  = year1.text() - 0
    var y2  = year2.text() - 0
    var m1 = month1.text() - 1
    var m2 = month2.text() - 1

    switch (m2) {
        case 11:
            year1.text(y1)
            month1.text(12)
            year2.text(y1 + 1)
            month2.text(1)
            break
        case 0:
            year1.text(y2)
            month1.text(1)
            year2.text(y2)
            month2.text(2)
            break
        default:
            m1 += 1
            month1.text(m1 + 1)
            month2.text(m1 + 2)
            year1.text(y1)
            year2.text(y1)
            break
    }

    this.fillDate()
}

this.prevMonth = function() {
    var year1  = this.table1.find('.currYs')
    var year2  = this.table2.find('.currYs')
    var month1 = this.table1.find('.currMo')
    var month2 = this.table2.find('.currMo')
    var y1  = year1.text() - 0
    var y2  = year2.text() - 0
    var m1 = month1.text() - 1
    var m2 = month2.text() - 1

    switch (m1) {
        case 11:
            year1.text(y1)
            month1.text(11)
            year2.text(y1)
            month2.text(12)
            break
        case 0:
            year1.text(y1 - 1)
            month1.text(12)
            year2.text(y1)
            month2.text(1)
            break
        default:
            m1 -= 1
            month1.text(m1 + 1)
            month2.text(m1 + 2)
            year1.text(y1)
            year2.text(y1)
            break
    }

    this.fillDate()
}

this.fillDate = function() {
    var currDate  = this.currDate
    var startDate = this.startDate
    var endDate   = this.endDate

    this.div.find('table').each(function(el, i) {
        var table  = Z(el)
        var tds    = table.find('tbody').find('td').off().empty().removeClass()
        var cYear  = table.find('.currYs').text() - 0
        var cMonth = table.find('.currMo').text() - 1
        var qDate  = new Date(cYear, cMonth, 1)
        var rDate  = new Date()
        var aDay = qDate.getDay()
        var start = 0
        var hasDate = true
        var day1 = months[cMonth]
        var day2 = months[cMonth]
        
        // 2月比较特殊，非闰年28天，闰年29天，如2008年2月为29天
        if ( 1 == cMonth && ((cYear % 4 == 0 && cYear % 100 != 0) || cYear % 400 == 0) ) {
            day2 = 29
        }

        // 填充数字，并高亮当前天
        for (var i = 0; i < day2; i++) {
            var td = tds.eq(i + aDay)
            td.text(i + 1)
            // 年月日都一样就高亮显示
            if (i + 1 == currDate.getDate() && cMonth == currDate.getMonth() && cYear == currDate.getFullYear()) {
                td.addClass('chosen')
            }
        }

        if ( startDate && reDate.test(startDate) ) {
            var arr   = startDate.split('-')
            var year  = arr[0] - 0
            var month = arr[1] - 1
            var day   = arr[2] - 1
            if (cMonth == month && cYear == year) {
                start = day
            }
            if (cYear < year || cMonth < month && cYear <= year) {
                hasDate = false
            }                
        }

        if ( endDate && reDate.test(endDate) ) {
            var arr   = endDate.split('-')
            var year  = arr[0] - 0
            var month = arr[1] - 1
            if (cMonth == month && cYear == year) {
                day1 = arr[2]
            }
            if (cYear > year || cMonth > month && cYear == year) {
                hasDate = false
            }
        }

        if (hasDate) {
            for (var u = start; u < day1; u++) {
                var td = tds.eq(u + aDay)
                td.addClass('date')
            }
        }

    })

}


})
