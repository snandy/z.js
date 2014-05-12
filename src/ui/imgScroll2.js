/**
 * 图片滚动插件
 */
$.fn.imgScroll = function(options, callback) {
    // 默认参数
    var defaults = {
        // 动态数据
        data: [],
        // 数据渲染模板
        template: null,
        // 事件类型=click,mouseover
        evtType: 'click',
        // 可见图片个数
        visible: 1,
        // 方向x,y
        direction: 'x',
        // 按钮-下一张，默认为元素选择器字符串，也可以是jQuery对象
        next: '#next',
        // 按钮-上一张，默认为元素选择器字符串，也可以是jQuery对象
        prev: '#prev',
        // 滚动到头按钮class
        disableClass: 'disabled',
        // 滚动到头按钮class是否加方向前缀prev-, next-
        disableClassPerfix: false,
        // 滚动速度
        speed: 300,
        // 每次滚动图片个数
        step: 1,
        // 是否循环
        loop: false,
        // 是否自动播放
        autoPlay: false,
        // 自动播放时间
        autoPlayTime: 2000,
        // 无法(不足以)滚动时是否显示控制按钮
        showControl: false,
        // 每个滚动元素宽度，默认取li的outerWidth
        width: null,
        // 每个滚动元素宽度，默认取li的outerHeight
        height: null,
        // 是否显示滚动当前状态(1,2,3,4,...)
        navItems: false,
        // 包围元素的class，默认为'scroll-nav-wrap'
        navItmesWrapClass: 'scroll-nav-wrap',
        // 当前项目高亮class
        navItemActivedClass: 'current',
        // 滚动分页状态条==<<==(n/total)==>>==
        status: false,
        // 滚动分布状态条包围元素选择器，如页面已准备好元素可传元素css selector否则生成一个class为scroll-status-wrap的div插入到滚动后面
        statusWrapSelector: '.scroll-status-wrap',

        end: function() {}
    };

    // 继承 初始化参数 - 替代默认参数
    var settings = $.extend(defaults, options);
    var TPL = settings.template || '<ul>{for slide in list}<li><a href="${slide.href}" target="_blank"><img src="${slide.src}" alt="${slide.alt}" /></a></li>{/for}</ul>';

    // 自动播放为true时，loop也为true
    if (settings.autoPlay) {
        settings.loop = true
    }

    // 实例化每个滚动对象
    return this.each(function() {

        var that = $(this),
            ul = that.find('ul').eq(0),
            nextFrame, lis = ul.children('li'),
            len = lis.length,
            liWidth = null,
            liHeight = null,

            btnNext = typeof settings.next == 'string' ? $(settings.next) : settings.next,
            btnPrev = typeof settings.prev == 'string' ? $(settings.prev) : settings.prev,

            current = 0,
            step = settings.step,
            visible = settings.visible,
            total = Math.ceil((len - visible) / step) + 1,
            loop = settings.loop,
            dir = settings.direction,
            evt = settings.evtType,

            disabled = settings.disableClass,
            prevDisabled = settings.disableClassPerfix ? 'prev-' + disabled : disabled,
            nextDisabled = settings.disableClassPerfix ? 'next-' + disabled : disabled,

            nav = settings.navItems,
            navWrap = settings.navItmesWrapClass,
            navHasWrap = $('.' + navWrap).length > 0,
            navClass = settings.navItemActivedClass,

            status = settings.status,
            statusWrap = settings.statusWrapSelector,
            hasStatusWrap = $(statusWrap).length > 0,

            last = false,
            first = true,

            perfect = (len - visible) % step === 0;

        /**
         * direction 滚动方向
         */
        function resetStyles(direction) {
            // 重置按钮样式
            if (len > visible && !loop) {
                btnPrev.addClass(prevDisabled);
                btnNext.removeClass(nextDisabled);
            } else {
                if (!loop) {
                    btnNext.addClass(nextDisabled);
                }
            }

            // 重置每个滚动列表项样式
            if(lis.eq(0).css('float') !== 'left') {
                lis.css('float', 'left');
            }

            // 重新设置滚动列表项高宽
            liWidth = settings.width || lis.eq(0).outerWidth(true);
            liHeight = settings.height || lis.eq(0).outerHeight();

            // 重置最外层可视区域元素样式
            that.css({
                'position': that.css('position') == 'static' ? 'relative' : that.css('position'),
                'width': direction == 'x' ? liWidth * visible : liWidth,
                'height': direction == 'x' ? liHeight : liHeight * visible,
                'overflow': 'hidden'
            });


            // 重置滚动内容区元素样式
            ul.css({
                'position': 'absolute',
                'width': direction == 'x' ? liWidth * len : liWidth,
                'height': direction == 'x' ? liHeight : liHeight * len,
                'top': 0,
                'left': 0
            })
        }

        /**
         * 重新初始化参数
         */
        function reInitSettings() {
            len = settings.data.length;
            ul = that.find('ul').eq(0);
            lis = ul.children('li');
            total = Math.ceil((len - visible) / step) + 1;
            perfect = (len - visible) % step === 0;
        }

        /**
         * direction 滚动方向
         */
        function renderHTML(data) {
            var r = {list: data};
            that.html(TPL.process(r));
            reInitSettings();
        }

        /**
         * index 切换到第几页滚动
         * isPrev 是否点击上一张
         */
        function switchTo(index, isPrev) {
            // 是否正在动画中
            if (ul.is(':animated')) {
                return false;
            }

            if (loop) {
                if (first && isPrev) {
                    current = total;
                }
                if (last && !isPrev) {
                    current = -1;
                }
                index = isPrev ? --current : ++current;
            } else {
                // 是否滚动到头或者尾
                if (first && isPrev || last && !isPrev) {
                    return false;
                } else {
                    index = isPrev ? --current : ++current;
                }
            }

            // 滚动下一帧位移量
            nextFrame = dir == 'x' ? {
                left: index >= (total - 1) ? -(len - visible) * liWidth : -index * step * liWidth
            } : {
                top: index >= (total - 1) ? -(len - visible) * liHeight : -index * step * liHeight
            };

            // 滚动完成一帧回调
            function onEnd() {
                if (!loop) {
                    // 滚动尾
                    if (len - index * step <= visible) {
                        btnNext.addClass(nextDisabled);
                        last = true;
                    } else {
                        btnNext.removeClass(nextDisabled);
                        last = false;
                    }

                    // 滚动头
                    if (index <= 0) {
                        btnPrev.addClass(prevDisabled)
                        first = true
                    } else {
                        btnPrev.removeClass(prevDisabled)
                        first = false
                    }
                } else {
                    if (len - index * step <= visible) {
                        last = true
                    } else {
                        last = false
                    }

                    if (index <= 0) {
                        first = true
                    } else {
                        first = false
                    }
                }

                // 显示导航数字
                if (nav || status) {
                    setCurrent(index)
                }

                // 每次可视区li的总集合
                var allLi = lis.slice(index * step, index * step + visible)
                // 每次滚动到可视区li的集合
                var viewLi = lis.slice(index * step + visible - step, index * step + visible)
                // 每次滚动后回调参数
                if (typeof callback == 'function') {
                    /**
                     * index 当前滚动到第几页
                     * total 一共有多少页
                     * 可视区域内的滚动li jQuery对象集合
                     */
                    callback.apply(that, [index, total, allLi, viewLi])
                }
            }

            // 是否动画滚动
            if( !!settings.speed) {
                ul.animate(nextFrame, settings.speed, onEnd);
            } else {
                ul.css(nextFrame);
                onEnd();
            }
        }

        /**
         * 显示数字分页1,2,3,4,5,6...
         * nav 数字导航外层div的class
         * 数字导航当前页高亮class
         */
        function showNavItem(nav, actived) {
            var navPage = navHasWrap ? $('.' + nav).eq(0) : $('<div class="' + nav + '"></div>');
            for(var i = 0; i < total; i++) {
                navPage.append('<em ' + (i === 0 ? ' class=' + actived : '') + ' title="' + (i + 1) + '">' + (i + 1) + '</em>');
            }
            if(!navHasWrap) {
                that.after(navPage);
            }
        }

        /**
         * 显示数字导航 (1/10)
         */
        function showStatus() {
            var statusPage = hasStatusWrap ? $(statusWrap).eq(0) : $('<div class="' + statusWrap.replace('.', '') + '"></div>');
            statusPage.html('<b>1</b>/' + total);
            if (!hasStatusWrap) {
                that.after(statusPage);
            }
        }

        // 设置当前状态的数字导航与分页
        function setCurrent(ind) {
            if (nav) {
                $('.' + navWrap).find('em').removeClass(navClass).eq(ind).addClass(navClass);
            }
            if (status) {
                $(statusWrap).html('<b>' + (ind + 1) + '</b>/' + total);
            }
        }

        var intervalTimer = null
        function play() {
            intervalTimer = setInterval(function() {
                switchTo(current, false)
            }, settings.autoPlayTime)
        }

        function stop() {
            clearInterval(intervalTimer)
        }

        function bindEvent() {
            btnPrev.unbind(evt).bind(evt, function() {
                switchTo(current, true);
            })
            btnNext.unbind(evt).bind(evt, function() {
                switchTo(current, false);
            })
            if (settings.autoPlay) {
                btnPrev.mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                });
                btnNext.mouseover(function() {
                    stop() 
                }).mouseout(function() {
                    play()
                });
                ul.find('li').mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                });               
                play();
            }
            
        }

        // 自定义数据模板
        if (settings.data.length > 0) {
            if (!settings.width || !settings.height) {
                return false;
            }
            renderHTML(settings.data);
        }

        // 初始化滚动
        if (len > visible && visible >= step) {
            // 可以滚动
            resetStyles(dir);
            bindEvent();
            if (nav) {
                showNavItem(navWrap, navClass);
            }
            if (status) {
                showStatus(statusWrap);
            }
        } else {
            // 无法滚动
            if (settings.showControl) {
                btnNext.add(btnPrev).show();
            } else {
                btnNext.add(btnPrev).hide();
            }
            btnPrev.addClass(prevDisabled);
            btnNext.addClass(nextDisabled);
        }

    })
};
