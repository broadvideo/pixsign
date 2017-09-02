$.fn.serializeObject = function() {
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

var FormHandler = function (form) {
	this.form = form;
	var _initdata = form.serializeObject();
	
	this.validateOption = {
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : false,
        highlight: function (element) { 
            $(element).closest('.form-group').addClass('has-error'); 
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        },
        rules: {},
        ignore: null,
	};
	
	var init = function () {
		
	};
	
	this.reset = function () {
		this.form.loadJSON(_initdata);
		this.form.find('.form-group').removeClass('has-error');
		this.form.find('.help-block').remove();
	}
	
	this.setdata = function (prefex, obj) {
		var formdata = new Object();
		for (var name in obj) {
			formdata[prefex + '.' + name] = obj[name];
		}
		this.form.loadJSON(formdata);

		var checkboxes = this.form.find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
			if (formdata[$(checkbox).attr('name')] == 0) {
				$(checkbox).removeAttr('checked');
				$(checkbox).parent().removeClass('checked');
			} else {
				$(checkbox).attr('checked');
				$(checkbox).parent().addClass('checked');
			}
		});
	}
	
	init();
};

var PixData = function() {
	var tableLanguage = {
		'sZeroRecords' : common.view.table_ZeroRecords,
		'sProcessing' : common.view.table_Processing,
		'sEmptyTable' : common.view.table_EmptyTable,
		'sLengthMenu' : common.view.table_LengthMenu,
		'sInfo' : common.view.table_Info,
		'sInfoEmpty' : common.view.table_InfoEmpty,
		'sSearch' : common.view.table_Search,
		'oPaginate' : {
			'sPrevious' : common.view.table_Previous,
			'sNext' : common.view.table_Next
		},
	};
	
	var transferIntToComma = function (nStr) { 
		nStr += ''; 
		x = nStr.split('.'); 
		x1 = x[0]; 
		x2 = x.length > 1 ? '.' + x[1] : ''; 
		var rgx = /(\d+)(\d{3})/; 
		while (rgx.test(x1)) { 
			x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
		}
		return x1 + x2; 
	};

	var transferIntToTime = function (nStr) { 
		h=parseInt(nStr/3600);
		if (h<10) {
			h='0'+h;
		}
		m=parseInt((nStr%3600)/60);
		if (m<10) {
			m='0'+m;
		}
		s=nStr%60;
		if (s<10) {
			s='0'+s;
		}
		return h+':'+m+':'+s;
	};

	var transferIntToByte = function (nStr) { 
		if (nStr > 1073741824)
			return (nStr / 1073741824).toFixed(2) + " GB";
		else if (nStr > 1048576)
			return (nStr / 1048576).toFixed(2) + " MB";
		else if (nStr > 1024)
			return (nStr / 1024).toFixed(2) + " KB";
		else
			return nStr + " B";
	};

	var init = function (locale) {
		bootbox.setDefaults({
			locale: locale
		});
		
		$('.modal').on('hidden.bs.modal', function(e) {
			var parent = ($(this).attr('parent'));
			$('#' + parent).modal('show');
		});

		$('.modal').on('shown.bs.modal', function(e) {
			var parent = ($(this).attr('parent'));
			$('#' + parent).modal('hide');
		});	
	
		var formHandler = new FormHandler($('#ChangePwdForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['staff.oldpassword'] = {};
		formHandler.validateOption.rules['staff.oldpassword']['required'] = true;
		formHandler.validateOption.rules['staff.password'] = {};
		formHandler.validateOption.rules['staff.password']['required'] = true;
		formHandler.validateOption.rules['staff.password']['minlength'] = 5;
		formHandler.validateOption.rules['staff.password2'] = {};
		formHandler.validateOption.rules['staff.password2']['equalTo'] = '#password';
		formHandler.validateOption.submitHandler = function(form) {
			var postData = {};
			postData.staffid = $('#ChangePwdForm input[name="staff.staffid"]').val();
			postData.oldpassword = $('#ChangePwdForm input[name="staff.oldpassword"]').val();
			postData.password = $('#ChangePwdForm input[name="staff.password"]').val();
			$.ajax({
				type : 'POST',
				url : 'staff!updatepassword.action',
				data : '{"staff":' + $.toJSON(postData) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#ChangePwdModal').modal('hide');
						bootbox.alert(common.tips.success);
					} else {
						$('#ChangePwdModal').modal('hide');
						bootbox.alert(common.tips.error);
					}
				},
				error : function() {
					$('#ChangePwdModal').modal('hide');
					bootbox.alert(common.tips.error);
				}
			});
		};
		$('#ChangePwdForm').validate(formHandler.validateOption);
		
		$('[type=submit]', $('#ChangePwdModal')).on('click', function(event) {
			if ($('#ChangePwdForm').valid()) {
				$('#ChangePwdForm').submit();
			}
		});

		$('#change_password').on('click', function() {
			$('#ChangePwdForm input[name="staff.oldpassword"]').attr('value', '');
			$('#ChangePwdForm input[name="staff.password"]').attr('value', '');
			$('#ChangePwdForm input[name="staff.password2"]').attr('value', '');
			$('#ChangePwdModal').modal();
		});
		
		startPingTimer();
	};
	
	var startPingTimer = function () {
		$.ajax({
			type : 'POST',
			url : 'ping.action',
			data : '{}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				setTimeout(startPingTimer, 10000); 
			},
			error : function() {
				window.location.reload();
			}
		});
	};

	return {
		init: init, 
		tableLanguage: tableLanguage, 
		transferIntToComma: transferIntToComma,
		transferIntToTime: transferIntToTime,
		transferIntToByte: transferIntToByte,
	}
	
}();


Date.prototype.format = function(format)
{
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter
		"S" : this.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4- RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return format;
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
