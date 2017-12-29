var WebZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var init = function () {
		var iframe_element = document.createElement('iframe');
		$(iframe_element).attr('src', zone.content);
		$(zonediv).append(iframe_element);
	};

	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += Math.ceil(parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += Math.ceil(parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += Math.ceil(parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).css({
			'box-sizing': 'border-box',
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': Math.ceil(parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': Math.ceil(parseInt(zone.bdradius) / scalew) + 'px', 
		});
		$(zonediv).find('iframe').css({
			'display': 'block',
			'width': '100%',
			'height': '100%',
		});
	};
	
	init();
};
