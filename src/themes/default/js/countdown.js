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
