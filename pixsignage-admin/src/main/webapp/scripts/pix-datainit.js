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


var DataInit = function() {
	return {
		init : function() {
			bootbox.setDefaults({
				locale: 'zh_CN'
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
		}

	};
}();

