window.jQuery = window.jQuery || {};

//console.log(jQuery);

/*
 * Common Function
 * 2016.10.10
 * */

(function($) {
	"use strict";

    // 如果页面有元素则执行相关函数
    $.fn.runFunction = function(fuc) {
        var $this = $(this);
        if ($this.length) {
            fuc($this);
        }
    };

	function loginPageSpecialWing($ad) {
        function setHeight() {
            $ad.height($('.panel-box').height());
        }

        setHeight();
        $(window).resize(setHeight);
    }

    /**
     * modify 2016.10.13
     * */
    function selectCard($sel) {
        // 执行每个选择控件单元
        $sel.each(function() {
            var $this = $(this);
            var names = [];

            function getNames() {
                var $inputs = $this.find(':radio, :checkbox');
                $inputs.each(function() {
                    var th = this;
                    var has = true;

                    $.each(names, function(i) {
                        if (names[i] === th.name) {
                            has = false;
                        }
                    });
                    if (has) {
                        names.push(th.name);
                    }
                });
            }

            function handles() {
                // 执行不同name的input组
                $.each(names, function(index, name) {
                    var $inputs = $('input[name=' + name + ']');
                    var $other = $this.next();

                    function other() {
                        var value = parseInt($inputs.filter(':checked').val());

                        if (value === -1) {
                            $other.show();
                        } else {
                            $other.hide();
                        }
                    }

                    function reSet() {
                        //是否显示其他
                        other();

                        //重设样式
                        $inputs.each(function() {
                            var th = this;
                            var $lb = $(th).parent('label');

                            if (th.disabled) {
                                $lb.addClass('disabled');
                            }

                            if (th.checked) {
                                $lb.addClass('checked');
                            } else {
                                $lb.removeClass('checked');
                            }
                        });
                    }

                    reSet();
                    $inputs.on('change', reSet);
                });
            }

            //获取该单元不同name组
            getNames();
            //初始
            handles();
        });

    }

    function moreFilter($more) {
        $more.each(function() {
            var $this = $(this);
            var $parent = $this.parent('.zy-mall-filter');
            $this.on('click', function() {
                $parent.toggleClass('show');
            });
        });
    }

    /**
     * modify 2016.10.19
     * */
    function meetingDateTimes($times) {
        var $bookTimeBox = $('.zy-datetime-box');
        var $bookTimeBtn = $bookTimeBox.find('.zy-datetime-btn');
        var $bookTimeIptDate = $bookTimeBox.find('input[name=date]');
        var $bookTimeIptTime = $bookTimeBox.find('input[name=time]');

        $times.each(function() {
            var $this = $(this);
            var $show = $this.prev('.times-show');

            function showDateTime() {
                var date = $bookTimeIptDate.val();
                var $checked = $bookTimeIptTime.filter(':checked');
                var times = '';

                $.each($checked, function() {
                    var val = $(this).val();

                    times += val && ' ' + val;
                });
                date && $show.text(date + times);
                return false;
            }

            $this.on('click', function() {
                layer.open({
                    type: 1,
                    title: false,
                    skin: 'zy-datetime',
                    content: $bookTimeBox,
                    cancel: function() {
                        $bookTimeBtn.off('click');
                    }
                });
                $bookTimeBtn.on('click', showDateTime);
                return false;
            });
        });
    }

    function horizontallyScroll($scroll) {
        $scroll.mousewheel(function(e, delta) {
            this.scrollLeft -= (delta * 30);
            e.preventDefault();
        });

        if ($scroll.is('.thumbnail')) {
            $scroll.each(function() {
                var that = this;
                $(that).children('a').on('click', function() {
                    var $this = $(this);
                    that.scrollLeft = $this[0].offsetLeft + ($this.width() - $(that).width()) / 2;
                });
            });
        }
    }

    /**
     * modify 2016.10.27
     * */
    function popupServices($btn) {
        var $dialog = $('#service_dialog');
        $btn.each(function() {
            var $this = $(this);
            var anchor = $this.attr('href');
            $this.on('click', function() {
                $dialog.load('system.html ' + anchor, function() {
                    layer.open({
                        type: 1,
                        title: false,
                        area: [], // 内容滚动条
                        //scrollbar: false, // 禁用body滚动条
                        skin: 'zy-service-dialog',
                        content: $(this)
                    });
                });
                return false;
            });
        });
    }

    /**
     * modify 2016.10.28
     * */
    function scrollToAnchor($btn) {
        var $head = $('.zy-header');
        $btn.each(function() {
            var $this = $(this);
            var $offset = $($this.attr('href'));
            $this.on('click', function () {
                var hdHeight = $head.height();
                var offsetTop = $offset.offset().top;
                $('html, body').animate({scrollTop: offsetTop - hdHeight}, 500);
                return false;
            });
        });
    }

    /**
     * modify 2016.10.29
     * */
    function showBDMap($map) {
        // 加载并显示地图
        function showMap($el, point) {
            var map = new BMap.Map($el[0]);                      // 创建Map实例
            //var point = new BMap.Point(121.487899, 31.249162); // 创建点坐标,上海市百度坐标
            map.centerAndZoom(point, 16);                        // 显示地图,并调整视野
            map.enableScrollWheelZoom();                         // 启用滚轮放大缩小
            map.addOverlay(new BMap.Marker(point));              // 显示图像标注
            // 绑定reset事件到元素上面
            $el.on('map.reset', function() {
                map.centerAndZoom(point, 16);
            });
        }
        // 百度地图API jsonp 回调函数
        $.fn.getBDMap = function() {
            // 页面元素遍历
            $map.each(function() {
                var $this = $(this);
                var data = $this.data('map').split('|');
                var myGeo = new BMap.Geocoder(); // 创建地址解析器实例
                // 地址解析
                myGeo.getPoint(data[0] + data[1], function(point) {
                    if (point) {
                        showMap($this, point);
                    } else {
                        alert('您的地址没有解析到结果!');
                    }
                }, data[0]);
            });

        };
        // 百度地图API异步加载
        function loadBDMapJScript() {
            var script = document.createElement('script');
            var ak = 'pSGAnLpdWH13CLqHRikFYEtAkvzyMUjE';
            script.type = 'text/javascript';
            script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=$.fn.getBDMap';
            document.body.appendChild(script);
        }
        window.onload = loadBDMapJScript;
    }

    function showTheDefaultImage($img) {
        $img.each(function() {
            var $this = $(this);
            var $img = $('<img>');
            var val = $this.css('background-image');
            var def = '../assets/images/img-none.png';

            $img[0].onerror = function() {
                $this.css('background-image', 'url(' + def + ')');
            };
            $img.attr('src', val.slice(5, val.length - 2));
        });
    }

	$(function() {
	    // 广告位高度处理
        //$('.zy-wing-special').runFunction(loginPageSpecialWing);

        // 金额银行卡之类的选择卡片处理
        $('.select-card, .select-bank').runFunction(selectCard);

        // 展开和收拢商城筛选项
        $('.more-filter').runFunction(moreFilter);

        // 会议室详细预定时间弹出层处理
        $('.times-select').runFunction(meetingDateTimes);

        // 主要处理页脚滚轴控制水平滚动
        $('.ft-content, .thumbnail').runFunction(horizontallyScroll);

        // 首页弹窗
        $('.zy-service:not(.anchor)').runFunction(popupServices);

        // 四大体系锚点
        $('.zy-service.anchor').runFunction(scrollToAnchor);

        // 生成百度地图
        $('.zy-map').runFunction(showBDMap);

        // 如果背景图片不存在则显示默认图片
        $('.item-vi>.vi-img').runFunction(showTheDefaultImage);
	});

})(jQuery);

/*
 * SMS Code module for jquery extend
 * 2016.9.28
 * */

(function($) {
	"use strict";

	$.fn.countdown = function(opts) {
        var defaults = {
                time: 60,
                callback: function() {}
            },
            o = $.extend({}, defaults, opts || {});

        if (typeof opts === 'function') {
            o.callback = opts;
        }
        if (typeof opts === 'number') {
            o.time = opts;
        }

        return this.each(function() {
            var $btn = $(this);
            var fuc = $btn.is('input') ? 'val' : 'text';
            var isA = $btn.is('a');
            var original = $btn[fuc]();
            var remind = ' 秒后重试';
            var smsTimer, i;

            i = (typeof o.time === 'number') ? o.time : 60;

            if (isA) {
                $btn.addClass('disabled');
            } else {
                $btn[0].disabled = true;
            }
            $btn[fuc](i + remind);

            smsTimer = setInterval(function() {
                i--;

                if (i < 0) {
                    clearInterval(smsTimer);

                    if (isA) {
                        $btn.removeClass('disabled');
                    } else {
                        $btn[0].disabled = false;
                    }
                    $btn[fuc](original);

                    typeof o.callback === 'function' && o.callback();
                } else {
                    $btn[fuc](i + remind);
                }
            }, 1000);
        });
    };

})(jQuery);

/*
 * Linkage module for jquery extend
 * 2016.10.10
 * */

(function($) {
	"use strict";

	$.fn.linkage = function(opts) {
		var defaults = {
				id: null,
				dataUrl: 'data.json',
				callback: function() {}
			},
			o = $.extend({}, defaults, opts || {});

		if (typeof opts === 'number') {
			o.id = opts;
		}
		if (typeof opts === 'function') {
			o.callback = opts;
		}

		return this.each(function() {
			var $this = $(this);
			var $prov = $this.find('.province');
			var $city = $this.find('.city');
			var $area = $this.find('.area');
			var selected = {};
			var dataJson = [];

			// init province
			function getProv() {
				var template = '<option value="0">请选择</option>';

				$.each(dataJson, function(i, oProv) {
					template += '<option value="' + oProv.id + '"' + (selected.provId === oProv.id ? ' selected' : '') + '>' + oProv.name + '</option>';
				});
				$prov.html(template);
				getCity();
			}
			// init city
			function getCity() {
				var n = $prov.get(0).selectedIndex - 1;
				var template = '<option value="0">请选择</option>';

				if (n !== -1) {
					$.each(dataJson[n].children, function(i, oCity) {
						template += '<option value="' + oCity.id + '"' + (selected.cityId === oCity.id ? ' selected' : '') + '>' + oCity.name + '</option>';
					});
				}

				$city.html(template);
				getArea();
			}
			// init area
			function getArea() {
				var m = $prov.get(0).selectedIndex - 1;
				var n = $city.get(0).selectedIndex - 1;
				var template = '<option value="0">请选择</option>';

				if (m !== -1 && n !== -1) {
					if(typeof(dataJson[m].children[n].children) === 'undefined') {
						$area.hide();
					} else {
						$area.show();
						$.each(dataJson[m].children[n].children, function(i, oArea) {
							template += '<option value="' + oArea.id + '"' + (selected.areaId === oArea.id ? ' selected' : '') + '>' + oArea.name + '</option>';
						});
					}
				} else {
					$area.hide();
				}
				$area.html(template);

				returnText();
			}

			function returnText() {
				var p = $prov.find('option:not(:first):selected').text();
				var c = $city.find('option:not(:first):selected').text();
				var v = $area.find('option:not(:first):selected').text();
				var address = p + (c && '|' + c) + (v && '|' + v);

				$this.data('address', address);
			}

			// province changed
			$prov.change(getCity);
			// city changed
			$city.change(getArea);
			// area changed
			$area.change(returnText);

			// get the data and initialize
			$.getJSON(o.dataUrl, function(data) {
				dataJson = data;

				$.each(dataJson, function(i, oProv) {
					if (oProv.id === o.id) {
						selected.provId = oProv.id;
						return false;
					}
					$.each(dataJson[i].children, function(j, oCity) {
						if (oCity.id === o.id) {
							selected.provId = oProv.id;
							selected.cityId = oCity.id;
							return false;
						}
						$.each(dataJson[i].children[j].children, function(k, oArea) {
							if (oArea.id === o.id) {
								selected.provId = oProv.id;
								selected.cityId = oCity.id;
								selected.areaId = oArea.id;
								return false;
							}
						});
					});
				});

				getProv();

				// callback
				typeof o.callback === 'function' && o.callback();
			});
		});
	};

})(jQuery);

/*
 * Sidebar module for jquery extend
 * 2016.10.10
 * */

(function($) {
	"use strict";

	function sidebarTooltips($sidebar, $nav) {
	    var $items = $nav.find('.title, .nav>li');
	    var show = $sidebar.hasClass('fold');
        var opts = {
            placement:'right',
            container: 'body'
        };
        if (show) {
            $items.each(function() {
                opts.title = $(this).find('span').text();
                $(this).tooltip(opts);
            });
        } else {
            $items.tooltip('destroy');
        }
    }

    function sidebarCarousel($nav) {
        var $title = $nav.find('.title');

        $title.on('click', function() {
            var $this = $(this);
            $this.toggleClass('pull');
            $this.next().toggleClass('hide');
        });
    }

    function sidebar() {
        var $sidebar = $('#zy_sidebar');
        var $nav = $sidebar.find('.zy-sidebar-nav');
        var $collapse = $sidebar.find('.zy-sidebar-collapse');
        if ($sidebar.length) {
            $collapse.on('click', function() {
                $sidebar.toggleClass('fold');
                $sidebar.next().toggleClass('unfold');
                sidebarTooltips($sidebar, $nav);
            });

            sidebarCarousel($nav);
        }
    }

	$(function() {
		// 左侧菜单处理
        sidebar();
	});

})(jQuery);
