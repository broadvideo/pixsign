var DateZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var show = function() {
		$(zonediv).find('p').html(new Date().pattern(zone.dateformat));
		setTimeout(show, 1000); 
	}

	var init = function () {
		var p_element = document.createElement('p');
		$(p_element).html(zone.content);
		$(zonediv).find('#PagezoneCT').append(p_element);
		show();
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
			'font-family': zone.fontfamily, 
			'font-size': (parseInt(zone.fontsize) / scalew) + 'px', 
			'text-decoration': zone.decoration, 
			'text-align': zone.align, 
			'font-weight': zone.fontweight, 
			'font-style': zone.fontstyle, 
			'line-height': (parseInt(zone.lineheight) / scaleh) + 'px', 
			'text-shadow': shadow, 
			'word-wrap': 'break-word',
			'box-sizing': 'border-box',
		});
		$(zonediv).find('p').css({
			'word-wrap': 'break-word',
			'white-space': 'pre-wrap',
			'text-decoration': zone.decoration,
			'margin': '0 0 0px',
		});
	};
	
	init();
};

Date.prototype.pattern=function(fmt) {		   
	var o = {
	'M+' : this.getMonth()+1, //�·�
	'd+' : this.getDate(), //��
	'h+' : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //Сʱ
	'H+' : this.getHours(), //Сʱ
	'm+' : this.getMinutes(), //��
	's+' : this.getSeconds(), //��
	'q+' : Math.floor((this.getMonth()+3)/3), //����
	'S' : this.getMilliseconds() //����
	};
	var week = {
	'0' : '������',
	'1' : '����һ',
	'2' : '���ڶ�',
	'3' : '������',
	'4' : '������',
	'5' : '������',
	'6' : '������'
	};
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+'').substr(4 - RegExp.$1.length));
	}
	if(/(w+)/.test(fmt)){		   
		fmt=fmt.replace(RegExp.$1, week[this.getDay()+'']);
	}
	for (var k in o){
		if (new RegExp('('+ k +')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)));
		}
	}
	return fmt;
}
