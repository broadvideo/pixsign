var OriginalFormData = {};
function refreshForm(form) {
	$('#'+form).loadJSON(OriginalFormData[form]);
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
}			

function transferIntToComma(nStr) 
{ 
	nStr += ''; 
	x = nStr.split('.'); 
	x1 = x[0]; 
	x2 = x.length > 1 ? '.' + x[1] : ''; 
	var rgx = /(\d+)(\d{3})/; 
	while (rgx.test(x1)) { 
		x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
	}
	return x1 + x2; 
}

function transferIntToTime(nStr) 
{ 
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
}

$.fn.serializeObject = function()
{
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

var DataTableLanguage = {
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
	}
};

var FormValidateOption = {
		errorElement : 'span', //default input error message container
		errorClass : 'help-block', // default input error message class
		focusInvalid : false, // do not focus the last invalid input
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


function startPingTimer(){
	$.ajax({
		type : 'POST',
		url : 'ping.action',
		data : '{}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		success : function(data, status) {
			setTimeout('startPingTimer()',10000); 
		},
		error : function() {
			window.location.reload();
		}
	});
}

var DataInit = function() {
	return {
		init : function(locale) {
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
		
			FormValidateOption.rules = {};
			FormValidateOption.rules['staff.oldpassword'] = {};
			FormValidateOption.rules['staff.oldpassword']['required'] = true;
			FormValidateOption.rules['staff.password'] = {};
			FormValidateOption.rules['staff.password']['required'] = true;
			FormValidateOption.rules['staff.password']['minlength'] = 5;
			FormValidateOption.rules['staff.password2'] = {};
			FormValidateOption.rules['staff.password2']['equalTo'] = '#password';
			FormValidateOption.submitHandler = function(form) {
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
							bootbox.alert(password_success.error);
						}
					},
					error : function() {
						$('#ChangePwdModal').modal('hide');
						bootbox.alert(password_success.error);
					}
				});
			};
			$('#ChangePwdForm').validate(FormValidateOption);
			
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
		}

	};
}();

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