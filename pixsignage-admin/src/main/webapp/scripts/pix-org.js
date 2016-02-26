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
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
						{'sTitle' : common.view.expiretime, 'mData' : 'expiretime', 'bSortable' : false }, 
						{'sTitle' : common.view.maxdevices, 'mData' : 'maxdevices', 'bSortable' : false }, 
						{'sTitle' : common.view.currentdevices, 'mData' : 'currentdevices', 'bSortable' : false }, 
						{'sTitle' : common.view.maxstorage, 'mData' : 'maxstorage', 'bSortable' : false }, 
						{'sTitle' : common.view.currentstorage, 'mData' : 'currentstorage', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'orgid', 'bSortable' : false, 'sWidth' : '15%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(5)', nRow).html(transferIntToComma(aData['maxstorage']) + ' MB');
			$('td:eq(6)', nRow).html(transferIntToComma(aData['currentstorage']) + ' MB');
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			$('td:eq(7)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

	jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').select2();
	
	
	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.delete'];
		currentItem = item;
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
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
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert(common.tips.error);
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
			remote: common.tips.name_repeat
		},
		'org.code': {
			remote: common.tips.code_repeat
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
					bootbox.alert(common.tips.success);
					refreshMyTable();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert(common.tips.error);
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
		//if ($('#MyTable').dataTable().fnGetData().length >= MaxOrgs) {
		//	bootbox.alert(common.tips.maxorgs);
		//	return;
		//}
		
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
		var item = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in item) {
			formdata['org.' + name] = item[name];
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
		isRTL: Metronic.isRTL(),
		format: "yyyy-mm-dd",
		pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
		language: "zh-CN",
		minView: 'month',
		todayBtn: true
	});
}


