var ButtonZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var init = function () {
		var pagezonedtls = zone.pagezonedtls;
		if (pagezonedtls.length > 0 && pagezonedtls[0].image != null) {
			$(zonediv).css('background-image', 'url(image/' + pagezonedtls[0].image.filename + ')');
			$(zonediv).css('background-size', '100% 100%');
			$(zonediv).css('background-position', 'center');
			$(zonediv).css('background-repeat', 'no-repeat');
		}
		var a_element = document.createElement('a');
		if (zone.touchtype == 0) {
			a_element.href = 'javascript:history.back(-1)';
		} else if (zone.touchtype == 1) {
			a_element.href = 'index.html';
		} else if (zone.touchtype == 2) {
			a_element.href = zone.touchpageid + '.html';
		} else if (zone.touchtype == 3) {
			$(a_element).attr('href', 'javascript:;');
			$(a_element).attr('diyaction', zone.diyaction.code);
			$(a_element).click(function(e) {
				if (PixPage.diyzones.length > 0) {
					PixPage.diyzones[0].doAction($(a_element).attr('diyaction'));
				}
			});
		}
		$(zonediv).wrap(a_element);
		var p_element = document.createElement('p');
		$(p_element).html(zone.content);
		$(zonediv).append(p_element);
	};

	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).css({
			'box-sizing': 'border-box',
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': Math.ceil(parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': Math.ceil(parseInt(zone.bdradius) / scalew) + 'px', 
			'color': zone.color, 
			'font-family': zone.fontfamily, 
			'font-size': Math.ceil(parseInt(zone.fontsize) / scalew) + 'px', 
			'text-decoration': zone.decoration, 
			'text-align': zone.align, 
			'font-weight': zone.fontweight, 
			'font-style': zone.fontstyle, 
			'line-height': Math.ceil(parseInt(zone.lineheight) / scaleh) + 'px', 
			'text-shadow': shadow, 
			'word-wrap': 'break-word',
		});
		$(zonediv).find('p').css({
			'word-wrap': 'break-word',
			'white-space': 'pre-wrap',
			'text-decoration': zone.decoration,
			'margin': '0 0 0px',
		});
	};
	
	init();
};
