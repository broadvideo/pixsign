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
		var background_div = document.createElement('div');
		background_div.id = 'PagezoneBG';
		var inner_div = document.createElement('div');
		inner_div.id = 'PagezoneCT';
		$(zone_div).append(background_div);
		$(zone_div).append(inner_div);
		$('#PageDiv').append(zone_div);

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
		if (zone.type == 0) {
			var p_element = document.createElement('p');
			p_element.innerHTML = zone.content;
			$(inner_div).append(p_element);
			
			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
			shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
			shadow += zone.shadowcolor;
			$(inner_div).css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'color': zone.color, 
				'font-family': zone.fontfamily, 
				'font-size': (parseInt(zone.fontsize) / scalew) + 'px', 
				'text-decoration': zone.decoration, 
				'text-align': zone.align, 
				'font-weight': zone.fontweight, 
				'font-style': zone.fontstyle, 
				'line-height': (parseInt(zone.lineheight) / scaleh) + 'px', 
				'text-shadow': shadow, 
				'padding': (parseInt(zone.padding) / scalew) + 'px', 
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
				'border-top-right-radius': (parseInt(zone.bdtr) / scalew) + 'px', 
				'border-top-left-radius': (parseInt(zone.bdtl) / scalew) + 'px', 
				'border-bottom-left-radius': (parseInt(zone.bdbl) / scalew) + 'px', 
				'border-bottom-right-radius': (parseInt(zone.bdbr) / scalew) + 'px',
				'word-wrap': 'break-word',
			});
			$(p_element).css({
				'word-wrap': 'break-word',
				'white-space': 'pre-wrap',
				'text-decoration': zone.decoration,
				'margin': '0 0 0px',
			});
		} else if (zone.type == '1') {
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);

			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
			shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
			shadow += zone.shadowcolor;
			$(inner_div).css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'box-shadow': shadow, 
				'padding': (parseInt(zone.padding) / scalew) + 'px', 
				'opacity': parseInt(zone.opacity)/255,
			});
			$(inner_div).find('img').css({
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
				'border-top-right-radius': (parseInt(zone.bdtr) / scalew) + 'px', 
				'border-top-left-radius': (parseInt(zone.bdtl) / scalew) + 'px', 
				'border-bottom-left-radius': (parseInt(zone.bdbl) / scalew) + 'px', 
				'border-bottom-right-radius': (parseInt(zone.bdbr) / scalew) + 'px', 
			})
			if (zone.content != '' && zone.content != 'no' && zone.content != 'non') {
				$(zone_div).find('img').attr('src', zone.content);
				$(zone_div).find('img').attr('width', '100%');
				$(zone_div).find('img').attr('height', '100%');
			}
		} else {
			$(inner_div).css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'color': zone.color, 
				'font-size': (60 / scalew) + 'px', 
				'padding': (parseInt(zone.padding) / scalew) + 'px', 
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
				'border-top-right-radius': (parseInt(zone.bdtr) / scalew) + 'px', 
				'border-top-left-radius': (parseInt(zone.bdtl) / scalew) + 'px', 
				'border-bottom-left-radius': (parseInt(zone.bdbl) / scalew) + 'px', 
				'border-bottom-right-radius': (parseInt(zone.bdbr) / scalew) + 'px',
				'word-wrap': 'break-word',
			});
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
}

function resizePage() {
	var width = $('#PageDiv').width();
	var height = $('#PageDiv').height();
	var scalew = Page.width / width;
	var scaleh = Page.height / height;
	var zones = Page.pagezones;
	for (var i = 0; i < zones.length; i++) {
		var zone = zones[i];
		var pagezonediv = $('#PagezoneDiv' + zone.pagezoneid);
		$(pagezonediv).css({
			'width': 100*zone.width/Page.width + '%',
			'height': 100*zone.height/Page.height + '%',
			'top': 100*zone.topoffset/Page.height + '%', 
			'left': 100*zone.leftoffset/Page.width + '%', 
		});
		$(pagezonediv).find('#PagezoneBG').css({
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'background': zone.bgcolor, 
			'opacity': parseInt(zone.bgopacity)/255, 
		});
		if (zone.type == 0) {
			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
			shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
			shadow += zone.shadowcolor;
			$(pagezonediv).find('#PagezoneCT').css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'font-size': (parseInt(zone.fontsize) / scalew) + 'px', 
				'line-height': (parseInt(zone.lineheight) / scaleh) + 'px', 
				'text-shadow': shadow, 
				'padding': (parseInt(zone.padding) / scalew) + 'px', 
				'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
				'border-top-right-radius': (parseInt(zone.bdtr) / scalew) + 'px', 
				'border-top-left-radius': (parseInt(zone.bdtl) / scalew) + 'px', 
				'border-bottom-left-radius': (parseInt(zone.bdbl) / scalew) + 'px', 
				'border-bottom-right-radius': (parseInt(zone.bdbr) / scalew) + 'px',
			});
		} else if (zone.type == '1') {
			var shadow = '';
			shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
			shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
			shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
			shadow += zone.shadowcolor;
			$(pagezonediv).find('#PagezoneCT').css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'box-shadow': shadow, 
				'padding': (parseInt(zone.padding) / scalew) + 'px', 
				'opacity': parseInt(zone.opacity)/255,
			});
			$(pagezonediv).find('img').css({
				'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
				'border-top-right-radius': (parseInt(zone.bdtr) / scalew) + 'px', 
				'border-top-left-radius': (parseInt(zone.bdtl) / scalew) + 'px', 
				'border-bottom-left-radius': (parseInt(zone.bdbl) / scalew) + 'px', 
				'border-bottom-right-radius': (parseInt(zone.bdbr) / scalew) + 'px', 
			})
		} else {
			$(pagezonediv).find('#PagezoneCT').css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'font-size': (60 / scalew) + 'px', 
				'padding': (parseInt(zone.padding) / scalew) + 'px', 
				'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
				'border-top-right-radius': (parseInt(zone.bdtr) / scalew) + 'px', 
				'border-top-left-radius': (parseInt(zone.bdtl) / scalew) + 'px', 
				'border-bottom-left-radius': (parseInt(zone.bdbl) / scalew) + 'px', 
				'border-bottom-right-radius': (parseInt(zone.bdbr) / scalew) + 'px',
			});
		}
	}
}

