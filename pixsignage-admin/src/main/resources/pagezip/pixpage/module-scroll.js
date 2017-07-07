var ScrollZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var init = function () {
		var marquee_element = document.createElement('marquee');
		$(marquee_element).attr('direction', 'left');
		$(marquee_element).attr('behavior', 'scroll');
		$(marquee_element).attr('scrollamount', '1');
		$(marquee_element).attr('scrolldelay', '0');
		$(marquee_element).attr('loop', '-1');
		$(marquee_element).html(zone.content);
		$(zonediv).find('#PagezoneCT').append(marquee_element);
	};

	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).find('#PagezoneCT').css({
			'box-sizing': 'border-box',
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': (parseInt(zone.bdradius) / scalew) + 'px', 
			'color': zone.color, 
			'font-family': zone.fontfamily, 
			'font-size': (parseInt(zone.fontsize) / scalew) + 'px', 
			'text-decoration': zone.decoration, 
			'text-align': zone.align, 
			'font-weight': zone.fontweight, 
			'font-style': zone.fontstyle, 
			'line-height': (parseInt(zone.lineheight) / scaleh) + 'px', 
			'text-shadow': shadow, 
			'word-wrap': 'break-word',
		});
	};

	init();
};
