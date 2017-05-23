var CurrentDevice;

function refreshMyTable() {
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
}			

$('#DeviceTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'device!list.action',
	'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.mtype, 'mData' : 'mtype', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.appname, 'mData' : 'appname', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.versioncode, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.upgradeflag, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		if (aData.name != aData.terminalid) {
			$('td:eq(0)', nRow).html(aData.name + '(' + aData.terminalid + ')');
		}
		if (aData.status == 0) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
		} else if (aData.onlineflag == 9) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
		} else if (aData.onlineflag == 1) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
		} else if (aData.onlineflag == 0) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
		}
		if (aData.mtype != null) {
			$('td:eq(2)', nRow).html(aData.mtype);
		} else {
			$('td:eq(2)', nRow).html('');
		}
		$('td:eq(4)', nRow).html(aData.vname + '(' + aData.vcode + ')');
		
		if (aData.upgradeflag == 0) {
			$('td:eq(5)', nRow).html('<span class="label label-sm label-default">' + common.view.upgradeflag_0 + '</span>');
		} else if (aData.upgradeflag == 1) {
			$('td:eq(5)', nRow).html('<span class="label label-sm label-success">' + common.view.upgradeflag_1 + '</span>');
		} else if (aData.upgradeflag == 2) {
			$('td:eq(5)', nRow).html('<span class="label label-sm label-warning">' + common.view.upgradeflag_2 + '</span>' + aData.appfile.vname + '(' + aData.appfile.vcode + ')');
		} else {
			$('td:eq(5)', nRow).html('');
		}
		
		$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-upgrade"><i class="fa fa-delicious"></i> ' + common.view.upgradeflag + '</a>');

		return nRow;
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
		aoData.push({'name':'status','value':1 });
	}
});
$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DeviceTable_wrapper .dataTables_length select').select2();
$('#DeviceTable').css('width', '100%');

function refreshAppfile() {
	if (CurrentDevice == null) {
		return;
	}
	$.ajax({
		type : 'GET',
		url : 'appfile!list.action',
		data : {
			name: CurrentDevice.appname,
			mtype: CurrentDevice.mtype
		},
		dataType: 'json',
		success : function(data, status) {
			if (data.errorcode == 0) {
				var appfilelist = [];
				for (var i=0; i<data.aaData.length; i++) {
					appfilelist.push({
						id: data.aaData[i].appfileid,
						text: data.aaData[i].mtype + ' ' + data.aaData[i].name + ' ' + data.aaData[i].vname + '(' + data.aaData[i].vcode + ')'
					});
				}
				$("#AppfileSelect").select2({
					placeholder: common.tips.detail_select,
					minimumInputLength: 0,
					data: appfilelist,
					dropdownCssClass: "bigdrop", 
					escapeMarkup: function (m) { return m; } 
				});
			} else {
				bootbox.alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			bootbox.alert('failure');
		}
	});
}

OriginalFormData['SoloDeviceForm'] = $('#SoloDeviceForm').serializeObject();

FormValidateOption.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : 'device!update.action',
		data : $('#SoloDeviceForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#SoloDeviceModal').modal('hide');
				bootbox.alert(common.tips.success);
				refreshMyTable();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
};
$('#SoloDeviceForm').validate(FormValidateOption);

$('[type=submit]', $('#SoloDeviceModal')).on('click', function(event) {
	if ($('#SoloDeviceForm').valid()) {
		$('#SoloDeviceForm').submit();
	}
});

$('body').on('click', '.pix-upgrade', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentDevice = $('#DeviceTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in CurrentDevice) {
		formdata['device.' + name] = CurrentDevice[name];
	}
	refreshForm('SoloDeviceForm');
	$('#SoloDeviceForm').loadJSON(formdata);

	refreshAppfile();
	$("#AppfileSelect").select2('val', CurrentDevice.appfileid);
	if (CurrentDevice.upgradeflag == 2) {
		$('.upgradeflag').css('display', '');
		FormValidateOption.rules = {};
		FormValidateOption.rules['device.appfileid'] = {};
		FormValidateOption.rules['device.appfileid']['required'] = true;
		$('#SoloDeviceForm').validate(FormValidateOption);
		$.extend($('#SoloDeviceForm').validate().settings, {
			rules: FormValidateOption.rules
		});
	} else {
		$('.upgradeflag').css('display', 'none');
		FormValidateOption.rules = {};
		$('#SoloDeviceForm').validate(FormValidateOption);
		$.extend($('#SoloDeviceForm').validate().settings, {
			rules: FormValidateOption.rules
		});
	}
	$('#SoloDeviceModal').modal();
});

$('#SoloDeviceForm input[name="device.upgradeflag"]').click(function(e) {
	if ($('#SoloDeviceForm input[name="device.upgradeflag"]:checked').val() == 2) {
		$('.upgradeflag').css('display', '');
		FormValidateOption.rules = {};
		FormValidateOption.rules['device.appfileid'] = {};
		FormValidateOption.rules['device.appfileid']['required'] = true;
		$('#SoloDeviceForm').validate(FormValidateOption);
		$.extend($('#SoloDeviceForm').validate().settings, {
			rules: FormValidateOption.rules
		});
	} else {
		$('.upgradeflag').css('display', 'none');
		$('input[name="device.appfileid"]').val(0);
		FormValidateOption.rules = {};
		$('#SoloDeviceForm').validate(FormValidateOption);
		$.extend($('#SoloDeviceForm').validate().settings, {
			rules: FormValidateOption.rules
		});
	}
});  

$('body').on('click', '.pix-all-upgrade', function(event) {
	$('#AllDeviceModal').modal();
});

$('[type=submit]', $('#AllDeviceModal')).on('click', function(event) {
	$.ajax({
		type : 'POST',
		url : 'device!updateupgradeflag.action',
		data : {
			branchid: CurBranchid,
			upgradeflag: $('#AllDeviceForm input[name="upgradeflag"]:checked').val()
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#AllDeviceModal').modal('hide');
				bootbox.alert(common.tips.success);
				refreshMyTable();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});
