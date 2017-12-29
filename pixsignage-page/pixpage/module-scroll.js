var ScrollZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var host = "";
	var terminalid = "";
	var text = "";
	var checksum = "";
	
	var startTextTimer = function () {
		$.ajax({
			type : 'POST',
			url : 'http://' + host + '/pixsignage-api/service/v2.1/get_text',
			data : '{ "terminal_id": "' + terminalid + '" }',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				if (data.code == 0) {
					if (data.checksum != checksum) {
						text = '';
						for (var i=0; i<data.texts.length; i++) {
							text += data.texts[i] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
						}
						checksum = data.checksum;
						console.log('text', text);
						$(zonediv).find('marquee').html(text);
					}
				} else {
					console.log('error: ', data);
				}
				setTimeout(startTextTimer, 60000); 
			},
			error : function() {
				console.log('failue');
				setTimeout(startTextTimer, 60000); 
			}
		});
	};
	
	var init = function () {
		var marquee_element = document.createElement('marquee');
		$(marquee_element).attr('direction', 'left');
		$(marquee_element).attr('behavior', 'scroll');
		$(marquee_element).attr('scrollamount', '1');
		$(marquee_element).attr('scrolldelay', '0');
		$(marquee_element).attr('loop', '-1');
		$(zonediv).append(marquee_element);
		
		if (zone.sourcetype == 0) {
			$(marquee_element).html(zone.content);
		} else {
			if (typeof(window.android) != 'undefined') {
				host = window.android.getHost();
				terminalid = window.android.getTerminalId();
			} else {
				host = window.location.host;
				terminalid = '00001';
			}
			console.log('host', host);
			console.log('terminalid', terminalid);
			if (host != '') {
				startTextTimer();
			} else {
				$(marquee_element).html('SCROLL');
			}
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
			'font-family': zone.fontfamily, 
			'font-size': Math.ceil(parseInt(zone.fontsize) / scalew) + 'px', 
			'text-decoration': zone.decoration, 
			'text-align': zone.align, 
			'font-weight': zone.fontweight, 
			'font-style': zone.fontstyle, 
			'line-height': Math.ceil(parseInt(zone.lineheight) / scaleh) + 'px', 
			'text-shadow': shadow, 
			'word-wrap': 'break-word',
		});
	};

	init();
};
