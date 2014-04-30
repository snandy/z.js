(function($) {

var now = new Date()
var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
var months = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',')
var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/

function format(date, hasDay) {
    var arr, m, d, day
    if (typeof date == 'string') {
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
    var table1 = $('<table cellpadding="0" cellpadding="0" class="datepicker"></table>')
    var table2 = $('<table cellpadding="0" cellpadding="0" class="datepicker"></table>')
    table1.append("<thead></thead>").append("<tfoot></tfoot>").append("<tbody></tbody>")
    table2.append("<thead></thead>").append("<tfoot></tfoot>").append("<tbody></tbody>")
    $("thead", table1).append('<tr class="controls"><th colspan="7"><span class="prevMonth"><s></s></span><span class="currDate"><span class="currYs"></span>年<span class="currMo"></span>月</span></th></tr>')
    $("thead", table1).append('<tr class="days"><th class="org sun">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="org sat">六</th></tr>')
    $("tfoot", table1).append('<tr><td colspan="7"><span class="today">今天</span></td></tr>')
    for (var o = 0; o < 6; o++) {
        $("tbody", table1).append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
    }
    $("thead", table2).append('<tr class="controls"><th colspan="7"><span class="nextMonth"><s></s></span><span class="currDate"><span class="currYs"></span>年<span class="currMo"></span>月</span></span></th></tr>')
    $("thead", table2).append('<tr class="days"><th class="org sun">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="org sat">六</th></tr>')
    $("tfoot", table2).append('<tr><td colspan="7"><span class="close">关闭</span></td></tr>')
    for (var o = 0; o < 6; o++) {
        $("tbody", table2).append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
    }

    return $('<div class="o-datepicker"></div>').append(table1).append(table2)
}

$.fn.Jcal = function(options) {
    var options = $.extend({}, $.fn.Jcal.defaults, options)

    function setPosi($div, $input) {
        var posi = $input.offset()
        var outerHeight = $input.outerHeight()
        var left = (options.x ? options.x-0 : 0) + posi.left
        var top  = (options.y ? options.y-0 : 0) + posi.top + outerHeight
        $div.css({
            position: 'absolute',
            left: left,
            top: top
        })
    }

    function prevMonth($div, $input) {
        var $tables = $div.find('table')
        var $year1 = $('.currYs', $tables[0])
        var $year2 = $('.currYs', $tables[1])
        var $month1 = $('.currMo', $tables[0])
        var $month2 = $('.currMo', $tables[1])
        var year1 = $year1.text() - 0
        var year2 = $year2.text() - 0
        var month1 = $month1.text() - 1
        var month2 = $month2.text() - 1

        switch (month1) {
            case 11:
                $year1.text(year1)
                $month1.text(11)
                $year2.text(year1)
                $month2.text(12)
                break
            case 0:
                $year1.text(year1 - 1)
                $month1.text(12)
                $year2.text(year1)
                $month2.text(1)
                break
            default:
                month1 -= 1
                $month1.text(month1 + 1)
                $month2.text(month1 + 2)
                $year1.text(year1)
                $year2.text(year1)
                break
        }

        fillDate($div, $input)
    }

    function nextMonth($div, $input) {
        var $tables = $div.find('table')
        var $year1 = $('.currYs', $tables[0])
        var $year2 = $('.currYs', $tables[1])
        var $month1 = $('.currMo', $tables[0])
        var $month2 = $('.currMo', $tables[1])
        var year1 = $year1.text() - 0
        var year2 = $year2.text() - 0
        var month1 = $month1.text() - 1
        var month2 = $month2.text() - 1

        switch (month2) {
            case 11:
                $year1.text(year1)
                $month1.text(12)
                $year2.text(year1 + 1)
                $month2.text(1)
                break
            case 0:
                $year1.text(year2)
                $month1.text(1)
                $year2.text(year2)
                $month2.text(2)
                break
            default:
                month1 += 1
                $month1.text(month1 + 1)
                $month2.text(month1 + 2)
                $year1.text(year1)
                $year2.text(year1)
                break
        }

        fillDate($div, $input)
    }

    function fillDate($div, $input) {
        var currDate = $input.data('currDate')

        $div.find('table').each(function(i, table) {
            var $table = $(table)
            var $tds   = $table.find('tbody td').unbind().empty().removeClass()
            var cYear  = $table.find('.currYs').text() - 0
            var cMonth = $table.find('.currMo').text() - 1
            var qDate  = new Date(cYear, cMonth, 1)
            var aDay = qDate.getDay()
            var start = 0
            var hasDate = true
            var day1 = months[cMonth]
            var day2 = months[cMonth]
            
            if (1 == cMonth && ((cYear % 4 == 0 && cYear % 100 != 0) || cYear % 400 == 0)) {
                day2 = 29
            }

            // 高亮当前
            for (var i = 0; i < day2; i++) {
                var $td = $tds.eq(i + aDay)
                $td.text(i + 1)
                if (i + 1 == currDate.getDate() && cMonth == currDate.getMonth() && cYear == currDate.getFullYear()) {
                    $td.addClass('chosen')
                }
            }

            if ( options.startdate && reDate.test(options.startdate) ) {
                var arr   = options.startdate.split('-')
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

            if ( options.enddate && reDate.test(options.enddate) ) {
                var arr   = options.enddate.split('-')
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
                    var $td = $tds.eq(u + aDay)
                    $td.addClass('date')
                }
            }
        })
    }

    function addEvent($div, $input) {
        $div.delegate('.date', 'click', function(ev) {
            var $td = $(this)
            var $table = $td.closest('table')
            var year = $table.find('.currYs').text()
            var month = $table.find('.currMo').text() - 1
            var day = $td.text()
            $input.data('currDate', new Date(year, month, day))
            remove($div, $input)
            if (typeof options.callback === 'function') {
                options.callback()
            }
        })
        .delegate('.date', 'mouseover', function() {
            $(this).addClass('over')
        })
        .delegate('.date', 'mouseout', function() {
            $(this).removeClass('over')
        })
        .delegate('.today', 'click', function() {
            $input.data('currDate', new Date())
            remove($div, $input)
            if (typeof options.callback === 'function') {
                options.callback()
            }
        })
        .delegate('.close', 'click', function() {
            remove($div, $input)
        })
        .delegate('.prevMonth', 'click', function(ev) {
            var $span = $(this)
            if ($span.hasClass('disabled')) {
                return false
            }
            prevMonth($div, $input)
        })
        .delegate('.nextMonth', 'click', function(ev) {
            var $span = $(this)
            if ($span.hasClass('disabled')) {
                return false
            }
            nextMonth($div, $input)
        })

        $(window).bind('resize', {div: $div, input: $input}, onResize)
        $('body').bind('click', {div: $div, input: $input}, onBody)
    }


    function remove($div, $input) {
        var date = $input.data('currDate')
        $input.data('hasDatepicker', false)
        $input.val(format(date, options.day))
        $div.remove()
        $('body').unbind('click', onBody)
        $(window).unbind('resize', onResize)
    }

    function onBody(ev) {
        var $div = ev.data.div
        var $input = ev.data.input
        var date = ev.data.date
        var $target = $(ev.target)
        if (!$target.parents('.datepicker').length && $target[0] != $input[0]) {
            remove($div, $input)
        }
    }
    
    function onResize(ev) {
        var $div = ev.data.div
        var $input = ev.data.input
        setPosi($div, $input)
    }

    return this.each(function() {
        var $div = template()
        var $input = $(this)
        var currDate = null

        // 留一个标记
        $input.data('hasDatepicker', false)
        $input.val(format(options.chosendate, options.day))
        $input.click(function(ev) {
            if ( $input.data('hasDatepicker') ) return

            // 记录已弹出
            $input.data('hasDatepicker', true)

            var val = $.trim($input.val())
            var chosendate = options.chosendate
            if (val && reDate.test(val)) {
                val = val.split('-')
                currDate = new Date(val[0], val[1] - 1, val[2])
            } else {
                if (chosendate.constructor == Date) {
                    currDate = chosendate
                } else {
                    if (reDate.test(chosendate)) {
                        var arr = chosendate.split('-')
                        currDate = new Date(arr[0], arr[1]-1, arr[2])
                    } else {
                        currDate = now
                    }
                }
            }

            var tables = $div.find('table')
            var table1 = tables.eq(0)
            var table2 = tables.eq(1)
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

            $input.data('currDate', currDate)

            // 设置日期弹层位置
            setPosi($div, $input)
            // 第一次渲染
            fillDate($div, $input)
            // 添加事件
            addEvent($div, $input)
            // 添加到body
            $('body').prepend($div)
        })

    })
}

$.fn.Jcal.formatOutput = format
$.fn.Jcal.defaults = {
    chosendate: now,
    // day: true,
    startdate: null,
    enddate: null,
    x: 0,
    y: 0
}

})(jQuery);