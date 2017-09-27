var OtherZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var init = function () {
		if (zone.type == 11) {
			$(zonediv).addClass('calendar-list');
		} else if (zone.type == 12) {
			$(zonediv).addClass('calendar-table');
		} else if (zone.type == 13) {
			$(zonediv).addClass('attendance');
		} else if (zone.type == 14) {
			$(zonediv).addClass('home-school');
		}
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
			'color': zone.color, 
			'font-size': Math.ceil(60 / scalew) + 'px', 
			'word-wrap': 'break-word',
		});
	};
	
	init();
};
