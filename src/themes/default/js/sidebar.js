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
