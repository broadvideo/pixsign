var myurls = {
	'common.list' : 'org!list.action',
	'common.add' : 'org!add.action',
	'common.update' : 'org!update.action',
	'common.delete' : 'org!delete.action',
	'org.validate' : 'org!validate.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : 'rt',
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {"sTitle" : "企业名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "企业编码", "mData" : "code", "bSortable" : false }, 
						{"sTitle" : "过期时间", "mData" : "expiretime", "bSortable" : false }, 
						{"sTitle" : "终端上限", "mData" : "maxdevices", "bSortable" : false }, 
						{"sTitle" : "当前终端", "mData" : "currentdevices", "bSortable" : false }, 
						{"sTitle" : "存储上限", "mData" : "maxstorage", "bSortable" : false }, 
						{"sTitle" : "当前存储", "mData" : "currentstorage", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "orgid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(5)', nRow).html(transferIntToComma(aData['maxstorage']) + ' MB');
			$('td:eq(6)', nRow).html(transferIntToComma(aData['currentstorage']) + ' MB');
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			dropdownBtn += '</ul></div>';
			$('td:eq(7)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

    jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#MyTable_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
	
    
	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.delete'];
		currentItem = item;
		
		bootbox.confirm('请确认是否删除"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'org.orgid': currentItem['orgid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert('出错了！');
					}
				});				
			}
         });
		
	});
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules = {};
	FormValidateOption.rules['org.name'] = {
		required: true,
		minlength: 2,
		remote: {
			url: myurls['org.validate'],
			type: 'post',
			data: {
				'org.orgid': function() {
					return $('#MyEditForm input[name="org.orgid"]').val();
				},
				'org.name': function() {
					return $('#MyEditForm input[name="org.name"]').val();
				}
			},
			dataFilter: function(responseString) {
				var response = $.parseJSON(responseString);
				if (response.errorcode == 0) {
					return true;
				}
				return false;
			}
		}
	};
	FormValidateOption.rules['org.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: myurls['org.validate'],
				type: 'post',
				data: {
					'org.orgid': function() {
						return $('#MyEditForm input[name="org.orgid"]').val();
					},
					'org.code': function() {
						return $('#MyEditForm input[name="org.code"]').val();
					}
				},
				dataFilter: function(responseString) {
					var response = $.parseJSON(responseString);
					if (response.errorcode == 0) {
						return true;
					}
					return false;
				}
			}
		};
	FormValidateOption.messages = {
		'org.name': {
			remote: "名称已存在"
		},
		'org.code': {
			remote: "编码已存在"
		},
	};
	FormValidateOption.rules['org.maxdevices'] = {};
	FormValidateOption.rules['org.maxdevices']['required'] = true;
	FormValidateOption.rules['org.maxdevices']['number'] = true;
	FormValidateOption.rules['org.maxstorage'] = {};
	FormValidateOption.rules['org.maxstorage']['required'] = true;
	FormValidateOption.rules['org.maxdevices']['number'] = true;
	FormValidateOption.rules['org.maxdevices']['max'] = MaxDevicesPerSigOrg;
	FormValidateOption.rules['org.maxstorage']['max'] = MaxStoragePerSigOrg;
	
	FormValidateOption.submitHandler = function(form) {
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('input[name="org.expiretime"]').val('2037-01-01');
		}
		
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( key, value ) {
		    if (value.checked === false) {
		        value.value = 0;
		    } else {
		        value.value = 1;
		    }
		});
		var data = jQuery("#MyEditForm").serializeArray();
		data = data.concat(
			jQuery('#MyEditForm input[type=checkbox]:not(:checked)').map(
				function() {
					return {"name": this.name, "value": this.value};
				}).get()
	    );
		
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : data,
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert('操作成功');
					refreshMyTable();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
	};
	$('#MyEditForm').validate(FormValidateOption);

	$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
		if ($('#MyEditForm').valid()) {
			$('#MyEditForm').submit();
		}
	});
	
	$('body').on('click', '.pix-add', function(event) {
		if ($('#MyTable').dataTable().fnGetData().length >= MaxOrgs) {
			bootbox.alert('企业数量已达上限，无法新增。');
			return;
		}
		
		var action = myurls['common.add'];
		refreshForm('MyEditForm');
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
		    $(checkbox).attr('checked');
		    $(checkbox).parent().addClass('checked');
		});
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in data) {
			formdata['org.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
			if (formdata[$(checkbox).attr('name')] == 0) {
			    $(checkbox).removeAttr('checked');
			    $(checkbox).parent().removeClass('checked');
			} else {
			    $(checkbox).attr('checked');
			    $(checkbox).parent().addClass('checked');
			}
		});
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});

	$('input[name="org.expireflag"]').click(function(e) {
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
	});  

	$(".form_datetime").datetimepicker({
        autoclose: true,
        isRTL: App.isRTL(),
        format: "yyyy-mm-dd",
        pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
        language: "zh-CN",
        minView: 'month',
        todayBtn: true
    });
}


