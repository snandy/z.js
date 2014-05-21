

Z.declareUI('Calendar', function() {

var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/
var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// 是否是闰年
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}

function calculateDate(year, month) {

}

function format(date, hasDay) {
    var arr, m, d, day

    if (Z.isString(date)) {
        arr = date.split('-')
        date = new Date(arr[0], arr[1]-1, arr[2])
    }

    var mm = date.getMonth()
    var dd = date.getDate()
    if (mm < 9) {
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

this.init = function(input, option) {
    option = option || {}
    this.x = option.x || 0
    this.y = option.y || 0
    this.hasDay = option.hasDay
    this.startDate  = option.startDate
    this.endDate    = option.endDate
    this.chosenDate = option.chosenDate

    this.dateCls = option.dateCls || 'day'
    this.chosenCls = option.chosenCls || 'chosen'
    this.dateOverCls = option.dateOverCls || 'over'
    this.prevHook  = option.prevHook || '.prev'
    this.nextHook  = option.nextHook || '.next'
    this.closeHook = option.closeHook || '.close'
    this.todayHook = option.todayHook || '.today'
    this.yearHook  = option.yearHook || '[data-cal=year]'
    this.monthHook = option.monthHook || '[data-cal=month]'

    this.currDate = new Date()
    this.input = Z(input)

    var self = this
    this.input.click(function(ev) {
        var input = Z(this)
        // 已经初始化过直接返回
        if ( input.data('hasDatepicker') ) return
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
}

this.onBodyClick = function(ev) {
    var target = Z(ev.target)
    if (!target.closest('.o-datepicker').length && target[0] != this.input[0]) {
        this.remove()
    }
}

this.template = function() {
    var templ = '<table cellpadding="0" cellpadding="0" class="ui-calendar-table">' + 
                    '<thead>' +
                        '<tr><th class="prev"><i></i></th><th colspan="5" class="switch"><span data-cal="year"></span>年<span data-cal="month"></span>月</th><th class="next"><i></i></th></tr>' +
                        '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>' +
                    '</thead>' +
                    '<tbody></tbody>' +
                    '<tfoot><tr><td colspan="7"></td></tr></tfoot>' +
                 '</table>'

    var table = Z.dom(templ)[0]
    table = Z(table)
    table.find('tfoot').html('<td colspan="2"><span class="today">今天</span></td><td></td><td></td><td></td><td colspan="2"><span class="close">关闭</span></td>')
    
    var tr = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
    var arr = []
    for (var i = 0; i < 6; i++) {
        arr[i] = tr
    }
    table.find('tbody').html(arr.join(''))

    var div = Z.dom('<div class="o-datepicker ui-calendar"></div>')
    div = Z(div)
    return div.append(table)
}

this.render = function() {
    var input = this.input
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
    currDate = this.currDate

    this.div = this.template()
    var table = this.table = this.div.find('table')
    var yearSpan  = table.find(this.yearHook)
    var monthSpan = table.find(this.monthHook)
    var cMonth = currDate.getMonth()
    var cYear  = currDate.getFullYear()
    if (cMonth == 11) {
        yearSpan.text(cYear)
        monthSpan.text(cMonth + 1)
    } else {
        yearSpan.text(cYear)
        monthSpan.text(cMonth + 1)
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

this.fillDate = function() {
    var currDate  = this.currDate
    var startDate = this.startDate
    var endDate   = this.endDate

    // fill td
    var table  = this.table
    var tds    = table.find('tbody').find('td').empty().removeClass()
    var cYear  = table.find(this.yearHook).text() - 0
    var cMonth = table.find(this.monthHook).text() - 1
    var qDate  = new Date(cYear, cMonth, 1)
    var rDate  = new Date()
    var aDay = qDate.getDay()
    var start = 0
    var hasDate = true
    var days = months[cMonth]
    
    // 2月比较特殊，非闰年28天，闰年29天，如2008年2月为29天
    if ( 1 == cMonth && isLeapYear(cYear) ) {
        days = 29
    }

    // 填充数字，并高亮当前天
    for (var i = 0; i < days; i++) {
        var td = tds.eq(i + aDay)
        td.text(i + 1)
        // 年月日都一样就高亮显示
        if (i + 1 == currDate.getDate() && cMonth == currDate.getMonth() && cYear == currDate.getFullYear()) {
            td.addClass(this.chosenCls)
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
        if (cYear > year || cMonth > month && cYear == year) {
            hasDate = false
        }
    }

    if (hasDate) {
        for (var u = start; u < days; u++) {
            var td = tds.eq(u + aDay)
            td.addClass('day')
        }
    }

}

this.events = function() {
    var self = this
    var dateCls = '.' + this.dateCls
    var dateOverCls = this.dateOverCls

    this.div.delegate(dateCls, 'click', function(ev) {
        var td    = Z(this)
        var table = td.closest('table')
        var year  = table.find(self.yearHook).text()
        var month = table.find(self.monthHook).text() - 1
        var date  = td.text()
        self.currDate = new Date(year, month, date)
        self.remove()
        self.fire('select')

    }).delegate(dateCls, 'mouseover', function() {
        Z(this).addClass(dateOverCls)

    }).delegate(dateCls, 'mouseout', function() {
        Z(this).removeClass(dateOverCls)

    }).delegate(this.todayHook, 'click', function() {
        self.currDate = new Date()
        self.remove()
        self.fire('select')

    }).delegate(this.closeHook, 'click', function() {
        self.remove()
        self.fire('close')

    }).delegate(this.prevHook, 'click', function() {
        var span = Z(this)
        if (span.hasClass('disabled')) return false
        self.prevMonth()

    }).delegate(this.nextHook, 'click', function() {
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

this.nextMonth = function() {
    var year  = this.table.find(this.yearHook)
    var month = this.table.find(this.monthHook)
    var y  = year.text() - 0
    var m  = month.text() - 1

    switch (m) {
        case 11:
            year.text(y+1)
            month.text(1)
            break
        case 0:
            year.text(y)
            month.text(2)
            break
        default:
            m += 1
            year.text(y)
            month.text(m + 1)
            break
    }

    this.fillDate()
}

this.prevMonth = function() {
    var year  = this.table.find(this.yearHook)
    var month = this.table.find(this.monthHook)
    var y  = year.text() - 0
    var m  = month.text() - 1

    if (m == 0) {
        year.text(y-1)
        month.text(12)
    } else {
        year.text(y)
        month.text(m)
    }

    this.fillDate()
}

this.remove = function() {
    this.div.remove()
    this.input.val( format(this.currDate, this.hasDay) )
    this.input.data('hasDatepicker', false)
    Z(window).off('resize', this.setPosi)
    Z(document).off('click', this.onBodyClick)
}

})
