var PixPage = function () {
	var allzones = [];

	var init = function () {
		$('#PageDiv').empty();
		var width = $('#PageDiv').width();
		var height = $('#PageDiv').height();
		var scalew = Page.width / width;
		var scaleh = Page.height / height;
		var zones = Page.pagezones;
		for (var i = 0; i < zones.length; i++) {
			var zone = zones[i];
			var zone_div = document.createElement('div');
			zone_div.id = 'PagezoneDiv' + zone.pagezoneid;
			$(zone_div).attr('zoneid', zone.pagezoneid);
			$(zone_div).attr('zonetype', zone.type);
			var background_div = document.createElement('div');
			background_div.id = 'PagezoneBG';
			var inner_div = document.createElement('div');
			inner_div.id = 'PagezoneCT';
			$(zone_div).append(background_div);
			$(zone_div).append(inner_div);
			$('#PageDiv').append(zone_div);
			
			if (zone.type == 1) {
				var videozone = new VideoZone($(inner_div), zone);
				allzones.push(videozone);
			} else if (zone.type == 2) {
				var imagezone = new ImageZone($(inner_div), zone);
				allzones.push(imagezone);
			} else if (zone.type == '3') {
				//Text Zone
				var textzone = new TextZone($(inner_div), zone);
				allzones.push(textzone);
			} else if (zone.type == '4') {
				//Scroll Zone
				var scrollzone = new ScrollZone($(inner_div), zone);
				allzones.push(scrollzone);
			} else if (zone.type == '5') {
				//Date Zone
				var datezone = new DateZone($(inner_div), zone);
				allzones.push(datezone);
			} else if (zone.type == '7') {
				//Button Zone
				var buttonzone = new ButtonZone($(inner_div), zone);
				allzones.push(buttonzone);
			} else if (zone.type == '11') {
				//CalendarList Zone
				var dczone = new DailyCourse($(inner_div), zone, scalew, scaleh);
				allzones.push(dczone);
			} else if (zone.type == '12') {
				//CalendarTable Zone
				var wczone = new WeeklyCourse($(inner_div), zone, scalew, scaleh);
				allzones.push(wczone);
			} else if (zone.type == '13') {
				//Attendance Zone
				var attendance = new Attendance($(inner_div), zone, scalew, scaleh);
				allzones.push(attendance);
			} else if (zone.type == '14') {
				//HomeSchool Zone
				var homeschool = new HomeSchool($(inner_div), zone, scalew, scaleh);
				allzones.push(homeschool);
			} else if (zone.type == '15') {
				//ExamNotice Zone
				var examnotice = new ExamNotice($(inner_div), zone, scalew, scaleh);
				allzones.push(examnotice);
			} else {
				var otherzone = new OtherZone($(inner_div), zone);
				allzones.push(otherzone);
			}
		}
		
		resize();
	};

	var resize = function () {
		var width = $('#PageDiv').width();
		var height = $('#PageDiv').height();
		var scalew = Page.width / width;
		var scaleh = Page.height / height;
		for (var i = 0; i < allzones.length; i++) {
			var zone_div = allzones[i].zonediv;
			var zone = allzones[i].zone;
			var background_div = $(zone_div).find('#PagezoneBG');
			var inner_div = $(zone_div).find('#PagezoneCT');		
			$(zone_div).css({
				'position': 'absolute',
				'width': 100*zone.width/Page.width + '%',
				'height': 100*zone.height/Page.height + '%',
				'top': 100*zone.topoffset/Page.height + '%', 
				'left': 100*zone.leftoffset/Page.width + '%', 
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
				'padding': (parseInt(zone.padding) / scalew) + 'px', 
			});
			allzones[i].resize(scalew, scaleh);
		}
	};

	return {
		init: init,
		resize: resize,
	}
	
}();


