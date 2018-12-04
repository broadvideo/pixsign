var PagePreviewModule = function () {
	var preview = function (container, page, maxsize) {
		$(container).empty();
		var scale, width, height;
		if (page.width > page.height ) {
			width = maxsize;
			scale = page.width / width;
			height = page.height / scale;
			$(container).css('width' , width);
			$(container).css('height' , height);
		} else {
			height = maxsize;
			scale = page.height / height;
			width = page.width / scale;
			$(container).css('width' , width);
			$(container).css('height' , height);
		}
		var zones;
		if (typeof(page.pagezones) != 'undefined') {
			zones = page.pagezones;
		} else {
			zones = page.templatezones;
		}
		for (var i = 0; i < zones.length; i++) {
			var zone = zones[i];
			var zonedtls;
			if (typeof(zone.pagezonedtls) != 'undefined') {
				zonedtls = zone.pagezonedtls;
			} else {
				zonedtls = zone.templatezonedtls;
			}

			var zone_div = document.createElement('div');
			var background_div = document.createElement('div');
			var inner_div = document.createElement('div');
			$(zone_div).append(background_div);
			$(zone_div).append(inner_div);
			$(container).append(zone_div);

			$(zone_div).css({
				'position': 'absolute',
				'width': width*zone.width/page.width,
				'height': height*zone.height/page.height,
				'top': height*zone.topoffset/page.height, 
				'left': width*zone.leftoffset/page.width, 
				'z-index': zone.zindex,
				'-moz-transform': zone.transform,
				'-webkit-transform': zone.transform,
			});
			$(background_div).css({
				'position': 'absolute',
				'width': '100%',
				'height': '100%',
				'background': zone.bgcolor, 
				'opacity': parseInt(zone.bgopacity)/255, 
			});
			$(inner_div).css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'padding': (parseInt(zone.padding) / scale) + 'px', 
			});
			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scale) + 'px ';
			shadow += (parseInt(zone.shadowv) / scale) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scale) + 'px ';
			shadow += zone.shadowcolor;
			if (zone.type == 1) {
				//Video Zone
				$(inner_div).css({
					'box-shadow': shadow, 
					'opacity': parseInt(zone.opacity)/255,
				});
				if (zonedtls.length > 0 && zonedtls[0].video != null) {
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(zone_div).find('img').css({
						'box-sizing': 'border-box',
						'border-color': zone.bdcolor, 
						'border-style': zone.bdstyle, 
						'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
						'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					});
					$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].video.thumbnail);
					$(zone_div).find('img').attr('width', '100%');
					$(zone_div).find('img').attr('height', '100%');
				}
			} else if (zone.type == '2') {
				//Image Zone
				$(inner_div).css({
					'box-shadow': shadow, 
					'opacity': parseInt(zone.opacity)/255,
				});
				if (zonedtls.length > 0 && zonedtls[0].image != null) {
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(zone_div).find('img').css({
						'box-sizing': 'border-box',
						'border-color': zone.bdcolor, 
						'border-style': zone.bdstyle, 
						'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
						'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					});
					$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].image.thumbnail);
					$(zone_div).find('img').attr('width', '100%');
					$(zone_div).find('img').attr('height', '100%');
				}
			} else if (zone.type == '3') {
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);			
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
					'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					'color': zone.color, 
					'font-family': zone.fontfamily, 
					'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
					'text-decoration': zone.decoration, 
					'text-align': zone.align, 
					'font-weight': zone.fontweight, 
					'font-style': zone.fontstyle, 
					'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
					'text-shadow': shadow, 
					'word-wrap': 'break-word',
					//'overflow': 'auto',
				});
				$(p_element).css({
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
					'text-decoration': zone.decoration,
				});
			} else if (zone.type == '4') {
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
					'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					'color': zone.color, 
					'font-family': zone.fontfamily, 
					'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
					'text-decoration': zone.decoration, 
					'text-align': zone.align, 
					'font-weight': zone.fontweight, 
					'font-style': zone.fontstyle, 
					'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
					'text-shadow': shadow, 
					'word-wrap': 'break-word',
				});
				$(p_element).css({
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
					'text-decoration': zone.decoration,
				});
			} else if (zone.type == '5') {
				var p_element = document.createElement('p');
				$(p_element).html(new Date().pattern(zone.dateformat));
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
					'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					'color': zone.color, 
					'font-family': zone.fontfamily, 
					'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
					'text-decoration': zone.decoration, 
					'text-align': zone.align, 
					'font-weight': zone.fontweight, 
					'font-style': zone.fontstyle, 
					'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
					'text-shadow': shadow, 
					'word-wrap': 'break-word',
				});
				$(p_element).css({
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
					'text-decoration': zone.decoration,
				});
			} else if (zone.type == '6' || zone.type == '9') {
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
					'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					'color': zone.color, 
					'text-align': 'left', 
					'word-wrap': 'break-word',
				});
			} else if (zone.type == '7') {
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);			
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
					'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					'color': zone.color, 
					'font-family': zone.fontfamily, 
					'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
					'text-decoration': zone.decoration, 
					'text-align': zone.align, 
					'font-weight': zone.fontweight, 
					'font-style': zone.fontstyle, 
					'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
					'text-shadow': shadow, 
					'word-wrap': 'break-word',
				});
				if (zonedtls.length > 0 && zonedtls[0].image != null) {
					$(inner_div).css('background-image', 'url(/pixsigdata' + zonedtls[0].image.thumbnail + ')');
					$(inner_div).css('background-size', '100% 100%');
					$(inner_div).css('background-position', 'center');
					$(inner_div).css('background-repeat', 'no-repeat');
				}
				$(p_element).css({
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
					'text-decoration': zone.decoration,
				});
			} else if (zone.type == '8') {
				//Weather Zone
				var span_element = document.createElement('span');
				$(inner_div).append(span_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': Math.ceil(zone.bdwidth / scale) + 'px', 
					'border-radius': Math.ceil(zone.bdradius / scale) + 'px', 
					'color': zone.color, 
					'font-family': zone.fontfamily, 
					'font-size': Math.ceil(zone.fontsize / scale) + 'px', 
					'text-decoration': zone.decoration, 
					'text-align': zone.align, 
					'font-weight': zone.fontweight, 
					'font-style': zone.fontstyle, 
					'line-height': Math.ceil(zone.lineheight / scale) + 'px', 
					'text-shadow': shadow,  
					'word-wrap': 'break-word',
					'overflow': 'hidden',
				});
				$(inner_div).find('span').css({
					'text-align': 'center',
					'overflow': 'hidden',
					'text-overflow': 'clip',
					'white-space': 'nowrap',
					'color': zone.color,
					'font-size': Math.ceil(zone.fontsize / scale) + 'px', 
					'line-height': Math.ceil(zone.lineheight / scale) + 'px', 
					'vertical-align': 'middle',
				});
				$(inner_div).find('span').html('深圳  <img src="/pixsignage-page/image/weather/30.png" /> 30℃');
				$(inner_div).find('img').each(function() {
					$(this).css({
						'height': Math.ceil(zone.fontsize / scale + 10) + 'px',
						'vertical-align': 'middle',
						'vertical-display': 'inline',
					});
				});
			} else if (zone.type == '10') {
				//Camera Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(zone_div).find('img').attr('src', '/pixsignage-page/module/camera/snapshot.jpg');
				$(zone_div).find('img').attr('width', '100%');
				$(zone_div).find('img').attr('height', '100%');
			} else if (zone.type == '11' || zone.type == '12') {
				var table = document.createElement('table');
				$(inner_div).append(table);
				$(table).attr('width', '100%');
				$(table).attr('height', '100%');
				$(table).attr('rules', zone.rules);
				$(table).empty();
				if (zone.type == 11) {
					for (var row=0; row<zone.rows; row++) {
						var tr_element = document.createElement('tr');
						$(table).append(tr_element);
						for (var col=0; col<zone.cols; col++) {
							var td_element = document.createElement('td');
							$(tr_element).append(td_element);
							if (col == 0 && row < 2) {
								$(td_element).html('0' + (row+8) + ':00');
							} else if (col == 0 && row >=2) {
								$(td_element).html('' + (row+8) + ':00');
							} else {
								$(td_element).html('' + row + col);
							}
						}
					}
					$(inner_div).find('tr td:first').attr('width', '30%');
				} else if (zone.type == 12) {
					for (var row=0; row<zone.rows; row++) {
						var tr_element = document.createElement('tr');
						$(table).append(tr_element);
						for (var col=0; col<zone.cols; col++) {
							var td_element = document.createElement('td');
							$(tr_element).append(td_element);
							if (col == 0) {
								if (row == 1 || row == 2) {
									$(td_element).html('0' + (row+7) + ':00');
								} else if (row > 2) {
									$(td_element).html('' + (row+7) + ':00');
								}
							} else {
								if (row == 0) {
									$(td_element).html('周' + col);
								} else {
									$(td_element).html('' + row + col);
								}
							}
						}
					}
				}
				$(inner_div).find('td').css({
					'border-width': Math.ceil(zone.rulewidth / scale) + 'px', 
					'border-color': zone.rulecolor,
					'text-decoration': zone.decoration, 
				});
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': Math.ceil(zone.bdwidth / scale) + 'px', 
					'border-radius': Math.ceil(zone.bdradius / scale) + 'px', 
					'color': zone.color, 
					'font-family': zone.fontfamily, 
					'font-size': Math.ceil(zone.fontsize / scale) + 'px', 
					'text-align': zone.align, 
					'font-weight': zone.fontweight, 
					'font-style': zone.fontstyle, 
					'line-height': '1px', 
				});
			} else if (zone.type == '21') {
				//Diy Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(inner_div).css({
					'box-shadow': shadow, 
					'opacity': parseInt(zone.opacity)/255,
				});
				$(zone_div).find('img').css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
					'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
				});
				if (zone.diy != null) {
					$(zone_div).find('img').attr('src', '/pixsigdata' + zone.diy.thumbnail);
					$(zone_div).find('img').attr('width', '100%');
					$(zone_div).find('img').attr('height', '100%');
				}
			} else if (zone.type == '41') {
				//Estate Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(zone_div).find('img').attr('src', '/pixsignage-page/module/estate/snapshot.jpg');
				$(zone_div).find('img').attr('width', '100%');
				$(zone_div).find('img').attr('height', '100%');
			} else {
				var p_element = document.createElement('p');
				$(p_element).html(eval('common.view.pagezone_type_' + zone.type));
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'border-color': zone.bdcolor, 
					'border-style': zone.bdstyle, 
					'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
					'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
					'color': zone.color, 
					'font-size': (60 / scale) + 'px', 
					'word-wrap': 'break-word',
				});
				$(p_element).css({
					'word-wrap': 'break-word',
					'text-align': 'center',
					'overflow': 'hidden',
					'text-overflow': 'clip',
					'white-space': 'nowrap',
				});
			}
		}
	};
	
	return {
		preview: preview, 
	}
	
}();
