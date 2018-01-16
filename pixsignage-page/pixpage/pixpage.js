var PixPage = function () {
	var allmodules = [];
	var diymodules = [];
	var maxzindex = 0;
	var idletimestamp = new Date().getTime();

	var init = function (mode) {
		this.mode = mode;
		$('#PageDiv').empty();
		var width = $('#PageDiv').width();
		var height = $('#PageDiv').height();
		var scalew = Page.width / width;
		var scaleh = Page.height / height;
		var zones = Page.pagezones;
		var animations = [];
		for (var i = 0; i < zones.length; i++) {
			var zone = zones[i];
			var zone_div = document.createElement('div');
			PixPage.maxzindex = Math.max(PixPage.maxzindex, zone.zindex + 1);
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
				allmodules.push(videozone);
			} else if (zone.type == 2) {
				var imagezone = new ImageZone($(inner_div), zone);
				allmodules.push(imagezone);
			} else if (zone.type == '3') {
				//Text Zone
				var textzone = new TextZone($(inner_div), zone);
				allmodules.push(textzone);
			} else if (zone.type == '4') {
				//Scroll Zone
				var scrollzone = new ScrollZone($(inner_div), zone);
				allmodules.push(scrollzone);
			} else if (zone.type == '5') {
				//Date Zone
				var datezone = new DateZone($(inner_div), zone);
				allmodules.push(datezone);
			} else if (zone.type == '6') {
				//Web Zone
				var webzone = new WebZone($(inner_div), zone);
				allmodules.push(webzone);
			} else if (zone.type == '7') {
				//Button Zone
				var buttonzone = new ButtonZone($(inner_div), zone);
				allmodules.push(buttonzone);
			} else if (zone.type == '11') {
				//CalendarList Zone
				var dczone = new DailyCourse($(inner_div), zone, scalew, scaleh);
				allmodules.push(dczone);
			} else if (zone.type == '12') {
				//CalendarTable Zone
				var wczone = new WeeklyCourse($(inner_div), zone, scalew, scaleh);
				allmodules.push(wczone);
			} else if (zone.type == '13') {
				//Attendance Zone
				var attendance = new Attendance($(inner_div), zone, scalew, scaleh);
				allmodules.push(attendance);
			} else if (zone.type == '14') {
				//HomeSchool Zone
				var homeschool = new HomeSchool($(inner_div), zone, scalew, scaleh);
				allmodules.push(homeschool);
			} else if (zone.type == '15') {
				//ExamNotice Zone
				var examnotice = new ExamNotice($(inner_div), zone, scalew, scaleh);
				allmodules.push(examnotice);
			} else if (zone.type == '21') {
				//Diy Zone
				if (zone.diy.type == 'route-guide') {
					var diypath = './' + zone.diy.code;
					if (PixPage.mode == 'preview') {
						diypath = '/pixsigdata/diy/' + zone.diy.code;
					}
					var routeguide = new RouteGuide($(inner_div), zone, scalew, scaleh, diypath);
					allmodules.push(routeguide);
					diymodules.push(routeguide);
				}
			} else if (zone.type == '31') {
				//Meeting Zone
				var meeting = new Meeting($(inner_div), zone, scalew, scaleh);
				allmodules.push(meeting);
			} else if (zone.type == '41') {
				//Estate Zone
				var estate = new Estate($(inner_div), zone, scalew, scaleh);
				allmodules.push(estate);
			} else {
				var otherzone = new OtherZone($(inner_div), zone);
				allmodules.push(otherzone);
			}
			
			if (zone.animationinit != 'none' && zone.animationinit != '') {
				var animation = {
					onevent: 'load',
					selectors: '#PagezoneDiv' + zone.pagezoneid + ' #PagezoneCT',
					anid: zone.animationinit,
					delay: zone.animationinitdelay + 'ms',
					iterationcount: -1,
				};
				animations.push(animation);
				console.log('Add on init animation: ', zone.pagezoneid, zone.animationinit);
			}
			if (zone.animationclick != 'none' && zone.animationinit != '') {
				var animation = {
					onevent: 'click',
					selectors: '#PagezoneDiv' + zone.pagezoneid + ' #PagezoneCT',
					anid: zone.animationclick,
					delay: 0,
					iterationcount: 1,
				};
				animations.push(animation);
				console.log('Add on click animation: ', zone.pagezoneid, zone.animationinit);
			}
		}
		
		resize();
		
		var anCapacity = new AnCapacity();
		anCapacity.init(null, animations);
		
		if (PixPage.mode != 'preview' && Page.homeflag == 0 && Page.homeidletime > 0) {
			checkidle();
		}

		$(window).resize(function(e) {
			PixPage.resize();
		});
		
		$('body').on('click', function(event) {
			idletimestamp = new Date().getTime();
		});
	};

	var resize = function () {
		var width = $('#PageDiv').width();
		var height = $('#PageDiv').height();
		var scalew = Page.width / width;
		var scaleh = Page.height / height;
		for (var i = 0; i < allmodules.length; i++) {
			var zone = allmodules[i].zone;
			var zone_div = $('#PagezoneDiv' + zone.pagezoneid);
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
			allmodules[i].resize(scalew, scaleh);
		}
	};
	
	var checkidle = function() {
		var timestamp = new Date().getTime();
		if (timestamp - idletimestamp > Page.homeidletime * 1000) {
			if (typeof(android) != 'undefined') {
				android.closeAllAndroidWindow();
			}
			window.location.href = 'index.html';
		}
		setTimeout(checkidle, 1000); 
	}
  
	return {
		init: init,
		resize: resize,
		diymodules: diymodules,
		maxzindex: maxzindex,
	}
	
}();


