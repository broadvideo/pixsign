var OtherZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var init = function () {
		if (zone.type == 11) {
			$(zonediv).find('#PagezoneCT').addClass('calendar-list');
		} else if (zone.type == 12) {
			$(zonediv).find('#PagezoneCT').addClass('calendar-table');
		} else if (zone.type == 13) {
			$(zonediv).find('#PagezoneCT').addClass('attendance');
		} else if (zone.type == 14) {
			$(zonediv).find('#PagezoneCT').addClass('home-school');
		}
	};

	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).find('#PagezoneCT').css({
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': (parseInt(zone.bdradius) / scalew) + 'px', 
			'color': zone.color, 
			'font-size': (60 / scalew) + 'px', 
			'word-wrap': 'break-word',
			'box-sizing': 'border-box',
		});
	};
	
	init();
};
