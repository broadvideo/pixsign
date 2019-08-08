var BundlePreviewModule = function () {
	var preview = function (container, bundle, maxsize) {
		$(container).empty();
		var scale, width, height;
		if (bundle.width > bundle.height ) {
			width = maxsize;
			scale = bundle.width / width;
			height = bundle.height / scale;
			$(container).css('width' , width);
			$(container).css('height' , height);
		} else {
			height = maxsize;
			scale = bundle.height / height;
			width = bundle.width / scale;
			$(container).css('width' , width);
			$(container).css('height' , height);
		}
		var zones;
		if (typeof(bundle.bundlezones) != 'undefined') {
			zones = bundle.bundlezones;
		} else {
			zones = bundle.templetzones;
		}
		for (var i = 0; i < zones.length; i++) {
			var zone = zones[i];
			var zonedtls;
			if (typeof(zone.bundlezonedtls) != 'undefined') {
				zonedtls = zone.bundlezonedtls;
			} else {
				zonedtls = zone.templetzonedtls;
			}

			var zone_div = document.createElement('div');
			var background_div = document.createElement('div');
			var inner_div = document.createElement('div');
			$(zone_div).append(background_div);
			$(zone_div).append(inner_div);
			$(container).append(zone_div);

			$(zone_div).css({
				'position': 'absolute',
				'width': width*zone.width/bundle.width,
				'height': height*zone.height/bundle.height,
				'top': height*zone.topoffset/bundle.height, 
				'left': width*zone.leftoffset/bundle.width, 
				'z-index': zone.zindex,
				'-moz-transform': 'matrix(1, 0, 0, 1, 0, 0)',
				'-webkit-transform': 'matrix(1, 0, 0, 1, 0, 0)',
			});
			$(background_div).css({
				'position': 'absolute',
				'width': '100%',
				'height': '100%',
				'opacity': parseInt(zone.bgopacity)/255, 
				'background-color': zone.bgcolor,
				'background-size': '100% 100%',
				'background-repeat': 'no-repeat',
			});
			if (zone.bgimage != null) {
				$(background_div).css({'background-image': 'url(/pixsigdata' + zone.bgimage.thumbnail + ')' });
			} else {
				$(background_div).css({'background-image': 'none'});
			}
			$(inner_div).css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
			});
			if (zone.type == 0) {
				//Advert Zone
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'color': '#FFFFFF', 
					'font-size': Math.ceil(50 * zone.height / 100 / scale) + 'px', 
					'line-height': Math.ceil(zone.height / scale) + 'px', 
					'word-wrap': 'break-word',
				});
				$(p_element).css({
					'word-wrap': 'break-word',
					'text-align': 'center',
					'overflow': 'hidden',
					'text-overflow': 'clip',
					'white-space': 'nowrap',
				});
			} else if (zone.type == '1') {
				//Play Zone
				if (zonedtls.length > 0 && zonedtls[0].video != null) {
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].video.thumbnail);
					$(zone_div).find('img').attr('width', '100%');
					$(zone_div).find('img').attr('height', '100%');
				} else if (zonedtls.length > 0 && zonedtls[0].image != null) {
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].image.thumbnail);
					$(zone_div).find('img').attr('width', '100%');
					$(zone_div).find('img').attr('height', '100%');
				}
			} else if (zone.type == '2') {
				//Widget Zone
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'text-align': 'left', 
					'word-wrap': 'break-word',
				});
			} else if (zone.type == '3' || zone.type == '4') {
				//Text & Scroll Zone
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);			
				$(inner_div).css({
					'box-sizing': 'border-box',
					'color': zone.color, 
					'text-align': 'center', 
					'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
					'line-height': Math.ceil(zone.height / scale) + 'px', 
					'word-wrap': 'break-word',
					'overflow': 'hidden',
				});
				$(p_element).css({
					'text-align': 'center', 
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
				});
			} else if (zone.type == 5) {
				//Date Zone
				var p_element = document.createElement('p');
				$(p_element).html(new Date().pattern(zone.dateformat));
				$(inner_div).append(p_element);			
				$(inner_div).css({
					'box-sizing': 'border-box',
					'color': zone.color, 
					'text-align': 'center', 
					'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
					'line-height': Math.ceil(zone.height / scale) + 'px', 
					'word-wrap': 'break-word',
				});
				$(p_element).css({
					'text-align': 'center', 
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
				});
			} else if (zone.type == 6) {
				//Weather Zone
				var span_element = document.createElement('span');
				$(inner_div).append(span_element);
				$(inner_div).find('span').css({
					'text-align': 'center',
					'overflow': 'hidden',
					'text-overflow': 'clip',
					'white-space': 'nowrap',
					'color': zone.color,
					'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
					'line-height': Math.ceil(zone.height / scale) + 'px', 
				});
				$(inner_div).find('span').html('City <img src="/pixsignage-page/image/weather/30.png" /> 30℃');
				$(inner_div).find('img').each(function() {
					$(this).css('height', Math.ceil(zone.size * zone.height / 100 / scale) + 'px');
					$(this).css('display', 'inline');
				});
			} else if (zone.type == 7) {
				//Button Zone
				var p_element = document.createElement('p');
				$(p_element).html(zone.touchlabel);
				$(inner_div).append(p_element);			
				$(inner_div).css({
					'box-sizing': 'border-box',
					'color': zone.color, 
					'text-align': 'center', 
					'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
					'line-height': Math.ceil(zone.height / scale) + 'px', 
					'word-wrap': 'break-word',
				});
				$(p_element).css({
					'text-align': 'center', 
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
				});
			} else if (zone.type == 8) {
				//Navigator Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				if (zone.width > zone.height) {
					$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-navigate-h.jpg');
				} else {
					$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-navigate-v.jpg');
				}
				$(inner_div).find('img').attr('width', '100%');
				$(inner_div).find('img').attr('height', '100%');
			} else if (zone.type == 9) {
				//Control Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-qrcode.jpg');
				$(inner_div).find('img').attr('width', '100%');
				$(inner_div).find('img').attr('height', '100%');
			} else if (zone.type == 10) {
				//Menu Zone
				var menuscale = 1;
				$(inner_div).css({
					'box-sizing': 'border-box',
					'color': zone.color, 
					'overflow': 'hidden',
				});
				if (zone.width > zone.height) {
					var menupercent = 100*menuscale*zone.height/zone.width;
					for (var j=0; j<zone.bundlezonedtls.length; j++) {
						var menu_div = document.createElement('div');
						var bgurl = '/pixsigdata' + zone.bundlezonedtls[j].image.thumbnail;
						$(menu_div).css({
							'position': 'absolute',
							'height': '100%', 
							'width': menupercent + '%',
							'top': '0%',
							'left': j*menupercent + '%',
							'background-image': 'url(' + bgurl + ')',
							'background-size': 'contain',
							'background-position': 'center',
							'background-repeat': 'no-repeat',
						});
						$(inner_div).append(menu_div);
					}
				} else {
					var menupercent = 100/menuscale*zone.width/zone.height;
					for (var j=0; j<zone.bundlezonedtls.length; j++) {
						var menu_div = document.createElement('div');
						var bgurl = '/pixsigdata' + zone.bundlezonedtls[j].image.thumbnail;
						$(menu_div).css({
							'position': 'absolute',
							'height': menupercent + '%',
							'width': '100%',
							'top': j*menupercent + '%',
							'left': '0%',
							'background-image': 'url(' + bgurl + ')',
							'background-size': 'contain',
							'background-position': 'center',
							'background-repeat': 'no-repeat',
						});
						$(inner_div).append(menu_div);
					}
				}
			} else if (zone.type == '12') {
				//RSS Zone
				var p_element = document.createElement('p');
				$(p_element).html(zone.content);
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
					'text-align': 'left', 
					'word-wrap': 'break-word',
				});
			} else if (zone.type == 14) {
				//Stream Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-stream.jpg');
				$(inner_div).find('img').attr('width', '100%');
				$(inner_div).find('img').attr('height', '100%');
			} else if (zone.type == 15) {
				//VideoIn Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-videoin.jpg');
				$(inner_div).find('img').attr('width', '100%');
				$(inner_div).find('img').attr('height', '100%');
			} else if (zone.type == 16) {
				//DVB Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-dvb.jpg');
				$(inner_div).find('img').attr('width', '100%');
				$(inner_div).find('img').attr('height', '100%');
			} else if (zone.type == 101 || zone.type == 102 || zone.type == 103) {
				//Massage Zone & Cloudia Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
				$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-' + zone.type + '.jpg');
				$(inner_div).find('img').attr('width', '100%');
				$(inner_div).find('img').attr('height', '100%');
			} else {
				var p_element = document.createElement('p');
				$(p_element).html(eval('common.view.bundlezone_type_' + zone.type));
				$(inner_div).append(p_element);
				$(inner_div).css({
					'box-sizing': 'border-box',
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
