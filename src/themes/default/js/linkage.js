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
