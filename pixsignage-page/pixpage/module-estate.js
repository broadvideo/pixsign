var Estate = function (zonediv, zone, scalew, scaleh) {
	this.zonediv = zonediv;
	this.zone = zone;
	this.scalew = scalew;
	this.scaleh = scaleh;

	var init = function () {
		if (typeof(android) != 'undefined') {
			var left = parseInt(zone.leftoffset)/scalew;
			var top = parseInt(zone.topoffset)/scaleh;
			var width = parseInt(zone.width)/scalew;
			var height = parseInt(zone.height)/scaleh;
			android.openAndroidWindow(left, top, width, height, 'estate', '');
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
		});
	};
	
	init();
};
