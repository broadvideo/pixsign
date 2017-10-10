var ImageZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;
	
	var init = function () {
		var pagezonedtls = zone.pagezonedtls;
		if (pagezonedtls.length == 1 && pagezonedtls[0].image != null) {
			var img_element = document.createElement('img');
			if (PixPage.mode == 'preview') {
				$(img_element).attr('src', '/pixsigdata' + pagezonedtls[0].image.filepath);
			} else {
				$(img_element).attr('src', 'image/' + pagezonedtls[0].image.filename);
			}
			$(img_element).attr('width', '100%');
			$(img_element).attr('height', '100%');
			$(zonediv).append(img_element);
		} else if (pagezonedtls.length > 1) {
			var ul_element = document.createElement('ul');
			$(ul_element).addClass('bxslider');
			for (var i=0; i<pagezonedtls.length; i++) {
				if (pagezonedtls[i].image != null) {
					if (PixPage.mode == 'preview') {
						$(ul_element).append('<li><img src="/pixsigdata' + pagezonedtls[i].image.filepath + '" width="100%" height="100%"/></li>');
					} else {
						$(ul_element).append('<li><img src="image/' + pagezonedtls[i].image.filename + '" width="100%" height="100%"/></li>');
					}
				}
			}
			$(zonediv).append(ul_element);
			$(ul_element).bxSlider({
				auto: true,
				controls: false,
				pager: false,
				pause: 10000,
			});
		}
	};
	
	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += Math.ceil(parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += Math.ceil(parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += Math.ceil(parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).css({
			'box-shadow': shadow, 
			'opacity': parseInt(zone.opacity)/255,
		});
		$(zonediv).find('img').css({
			'box-sizing': 'border-box',
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': Math.ceil(parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': Math.ceil(parseInt(zone.bdradius) / scalew) + 'px', 
		});

		$(zonediv).find('.bx-wrapper').css({
			'background-color': 'transparent', 
			'height': $(zonediv).height(),
			'border': '0px',
			'-webkit-box-shadow': '0 0 0px',
			'box-shadow': '0 0 0px',
		});
		$(zonediv).find('.bx-viewport').css({
			'height': $(zonediv).height(),
		});
		$(zonediv).find('.bx-viewport').find('img').css({
			'height': $(zonediv).height(),
		});
	};
	
	init();
};
