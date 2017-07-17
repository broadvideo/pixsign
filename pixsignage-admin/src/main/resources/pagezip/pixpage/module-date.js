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
		$(zonediv).append(p_element);
		show();
	};

	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).css({
			'box-sizing': 'border-box',
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

/**	   
 * 对Date的扩展，将 Date 转化为指定格式的String	   
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符	   
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)	   
 * eg:	   
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423	   
 * (new Date()).pattern("yyyy-MM-dd w HH:mm:ss") ==> 2009-03-10 二 20:09:04	   
 * (new Date()).pattern("yyyy-MM-dd ww hh:mm:ss") ==> 2009-03-10 周二 08:09:04	   
 * (new Date()).pattern("yyyy-MM-dd www hh:mm:ss") ==> 2009-03-10 星期二 08:09:04	   
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18	   
 */
Date.prototype.pattern=function(fmt) {		   
	var o = {
	'M+' : this.getMonth()+1, //月份
	'd+' : this.getDate(), //日
	'h+' : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
	'H+' : this.getHours(), //小时
	'm+' : this.getMinutes(), //分
	's+' : this.getSeconds(), //秒
	'q+' : Math.floor((this.getMonth()+3)/3), //季度
	'S' : this.getMilliseconds() //毫秒
	};
	var week = {
	'0' : '星期日',
	'1' : '星期一',
	'2' : '星期二',
	'3' : '星期三',
	'4' : '星期四',
	'5' : '星期五',
	'6' : '星期六'
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
