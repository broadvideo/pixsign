var Camera = function (zonediv, zone, scalew, scaleh) {
	this.zonediv = zonediv;
	this.zone = zone;
	this.scalew = scalew;
	this.scaleh = scaleh;

	var init = function () {
		var left = parseInt(zone.leftoffset)/scalew;
		var top = parseInt(zone.topoffset)/scaleh;
		var width = parseInt(zone.width)/scalew;
		var height = parseInt(zone.height)/scaleh;
		try {
			android.openAndroidWindow(left, top, width, height, 'camera', '');
		} catch (e) {
			console.log(e);
		}
		try {
			linux.openAndroidWindow(zone.leftoffset, zone.topoffset, zone.width, zone.height, 'camera', '');
		} catch (e) {
			console.log(e);
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
