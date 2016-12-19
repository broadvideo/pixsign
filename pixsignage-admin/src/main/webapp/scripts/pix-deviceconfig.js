var CurrentOrg = null;
function refreshMyTable() {
	$.ajax({
		type : 'GET',
		url : 'org!get.action',
		data : '',
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentOrg = data.org;
				$('#MyTable').dataTable().fnClearTable();

				if (CurrentOrg.devicepassflag == 1) {
					var devicepasshtml = '<span class="label label-xs label-success">' + common.view.on + '</span>';
					$('#MyTable').dataTable().fnAddData([common.view.devicepassflag, devicepasshtml]);
					$('#MyTable').dataTable().fnAddData([common.view.devicepass, CurrentOrg.devicepass]);
				} else {
					var devicepasshtml = '<span class="label label-xs label-warning">' + common.view.off + '</span>';
					$('#MyTable').dataTable().fnAddData([common.view.devicepassflag, devicepasshtml]);
				}
				if (CurrentOrg.backupvideo != null) {
					var backupvideohtml = '';
					if (CurrentOrg.backupvideo.thumbnail == null) {
						backupvideohtml = '<span><img src="../img/video.jpg" height="25" /> ' + CurrentOrg.backupvideo.name + '</span>';
					} else {
						backupvideohtml = '<span><img src="/pixsigdata' + CurrentOrg.backupvideo.thumbnail + '" height="25" /> ' + CurrentOrg.backupvideo.name + '</span>';
					}
					$('#MyTable').dataTable().fnAddData([common.view.backupvideo, backupvideohtml]);
				} else {
					$('#MyTable').dataTable().fnAddData([common.view.backupvideo, '']);
				}
				if (CurrentOrg.powerflag == 1) {
					var powerhtml = '<span class="label label-xs label-success">' + common.view.on + '</span>';
					$('#MyTable').dataTable().fnAddData([common.view.powerflag, powerhtml]);
					$('#MyTable').dataTable().fnAddData([common.view.poweron, CurrentOrg.poweron]);
					$('#MyTable').dataTable().fnAddData([common.view.poweroff, CurrentOrg.poweroff]);
				} else {
					var powerhtml = '<span class="label label-xs label-warning">' + common.view.off + '</span>';
					$('#MyTable').dataTable().fnAddData([common.view.powerflag, powerhtml]);
				}
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			bootbox.alert(common.tips.error);
		}
	});
}			

$('#MyTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'bSort' : false,
	'aoColumns' : [ {'sTitle' : common.view.name, 'bSortable' : false, 'sWidth' : '25%' },
					{'sTitle' : common.view.value, 'bSortable' : false, 'sWidth' : '75%' }],
	'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
	}
});
refreshMyTable();

var currentConfig;
FormValidateOption.rules = {};
FormValidateOption.rules['org.devicepass'] = {};
FormValidateOption.rules['org.devicepass']['required'] = true;
FormValidateOption.rules['org.devicepass']['number'] = true;
FormValidateOption.rules['org.devicepass']['minlength'] = 6;
FormValidateOption.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data : $('#MyEditForm').serialize(),
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

$('body').on('click', '.pix-update', function(event) {
	if (CurrentOrg == null) {
		return;
	}
	var formdata = new Object();
	for (var name in CurrentOrg) {
		formdata['org.' + name] = CurrentOrg[name];
	}
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

	if ($('input[name="org.devicepassflag"]:checked').val() == 0) {
		$('.devicepassflag').css('display', 'none');
	} else {
		$('.devicepassflag').css('display', '');
	}

	if ($('input[name="org.powerflag"]:checked').val() == 0) {
		$('.powerflag').css('display', 'none');
	} else {
		if ($('input[name="org.poweron"]').val() == '') {
			$('input[name="org.poweron"]').val('07:00:00');
		}
		if ($('input[name="org.poweroff"]').val() == '') {
			$('input[name="org.poweroff"]').val('00:00:00');
		}
		$('.powerflag').css('display', '');
	}
	$('#MyEditForm').attr('action', 'org!update.action');
	
	$('#BackupMediaSelect').select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: { 
			url: 'video!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term, 
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.videoid,
							video:item,
						};
					}),
					more: more
				};
			}
		},
		formatResult: function (data) {
			if (data.video == null || data.video.thumbnail == null) {
				return '<span><img src="../img/video.jpg" height="25" /> ' + data.text + '</span>';
			} else {
				return '<span><img src="/pixsigdata' + data.video.thumbnail + '" height="25" /> ' + data.text + '</span>';
			}
		},
		formatSelection: function (data) {
			if (data.video == null || data.video.thumbnail == null) {
				return '<span><img src="../img/video.jpg" height="25" /> ' + data.text + '</span>';
			} else {
				return '<span><img src="/pixsigdata' + data.video.thumbnail + '" height="25" /> ' + data.text + '</span>';
			}
		},
		initSelection: function(element, callback) {
			if (CurrentOrg.backupvideo != null) {
				callback({id: CurrentOrg.backupvideoid, text: CurrentOrg.backupvideo.name, video: CurrentOrg.backupvideo });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});

	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-push', function(event) {
	bootbox.confirm(common.tips.pushall, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'device!config.action',
				cache: false,
				data : {},
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					Metronic.stopPageLoading();
					bootbox.alert(common.tips.error);
				}
			});				
		}
	});
});

$('input[name="org.devicepassflag"]').click(function(e) {
	if ($('input[name="org.devicepassflag"]:checked').val() == 0) {
		$('.devicepassflag').css('display', 'none');
	} else {
		$('.devicepassflag').css('display', '');
	}
});  


$('input[name="org.powerflag"]').click(function(e) {
	if ($('input[name="org.powerflag"]:checked').val() == 0) {
		$('.powerflag').css('display', 'none');
	} else {
		if ($('input[name="org.poweron"]').val() == '') {
			$('input[name="org.poweron"]').val('07:00:00');
		}
		if ($('input[name="org.poweroff"]').val() == '') {
			$('input[name="org.poweroff"]').val('00:00:00');
		}
		$('.powerflag').css('display', '');
	}
});  

$('.form_time').datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: 'hh:ii:ss',
	pickerPosition: (Metronic.isRTL() ? 'bottom-right' : 'bottom-left'),
	language: 'zh-CN',
	minuteStep: 5,
	startView: 1,
	maxView: 1,
	formatViewType: 'time'
});

