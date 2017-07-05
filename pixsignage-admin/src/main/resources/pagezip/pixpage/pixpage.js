$(window).resize(function(e) {
	resizePage();
});

function showPage() {
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

		if (zone.type == '3') {
			//Text Zone
			var p_element = document.createElement('p');
			$(p_element).html(zone.content);
			$(inner_div).append(p_element);
		} else if (zone.type == '4') {
			//Scroll Zone
			var marquee_element = document.createElement('marquee');
			$(marquee_element).attr('direction', 'left');
			$(marquee_element).attr('behavior', 'scroll');
			$(marquee_element).attr('scrollamount', '1');
			$(marquee_element).attr('scrolldelay', '0');
			$(marquee_element).attr('loop', '-1');
			$(marquee_element).html(zone.content);
			$(inner_div).append(marquee_element);
		} else {
			if (zone.type == 11) {
				$(inner_div).addClass('calendar-list');
			} else if (zone.type == 12) {
				$(inner_div).addClass('calendar-table');
			} else if (zone.type == 13) {
				$(inner_div).addClass('attendance');
			} else if (zone.type == 14) {
				$(inner_div).addClass('home-school');
			}
		}
	}
	resizePage();
}

function resizePage() {
	var width = $('#PageDiv').width();
	var height = $('#PageDiv').height();
	var scalew = Page.width / width;
	var scaleh = Page.height / height;
	var zones = Page.pagezones;
	for (var i = 0; i < zones.length; i++) {
		var zone = zones[i];
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
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-top-right-radius': (parseInt(zone.bdtr) / scalew) + 'px', 
			'border-top-left-radius': (parseInt(zone.bdtl) / scalew) + 'px', 
			'border-bottom-left-radius': (parseInt(zone.bdbl) / scalew) + 'px', 
			'border-bottom-right-radius': (parseInt(zone.bdbr) / scalew) + 'px', 
			'padding': (parseInt(zone.padding) / scalew) + 'px', 
		});
		if (zone.type == '2') {
			//Image Zone
			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
			shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
			shadow += zone.shadowcolor;
			ImageZone.resize($(zone_div));
		} else if (zone.type == '3') {
			//Text Zone
			
			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
			shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
			shadow += zone.shadowcolor;
			$(inner_div).css({
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
			$(inner_div).find('p').css({
				'word-wrap': 'break-word',
				'white-space': 'pre-wrap',
				'text-decoration': zone.decoration,
				'margin': '0 0 0px',
			});
		} else if (zone.type == '4') {
			//Scroll Zone			
			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
			shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
			shadow += zone.shadowcolor;
			$(inner_div).css({
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
		} else {
			$(inner_div).css({
				'color': zone.color, 
				'font-size': (60 / scalew) + 'px', 
				'word-wrap': 'break-word',
			});
		}
	}
}

