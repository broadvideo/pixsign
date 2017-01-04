function refreshMyTable() {
	$.ajax({
		type : 'GET',
		url : 'config!list.action',
		data : '',
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#MyTable').dataTable().fnClearTable();

				for (var i=0; i<data.aaData.length; i++) {
					var config = data.aaData[i];
					if (config.code == 'ServerIP') {
						$('#MyTable').dataTable().fnAddData([common.view.config_serverip, config.value]);
						$('#MyEditForm input[name=serverip]').val(config.value);
					} else if (config.code == 'ServerPort') {
						$('#MyTable').dataTable().fnAddData([common.view.config_serverport, config.value]);
						$('#MyEditForm input[name=serverport]').val(config.value);
					} else if (config.code == 'PixedxIP' && CalendarCtrl) {
						$('#MyTable').dataTable().fnAddData([common.view.config_pixedxip, config.value]);
						$('#MyEditForm input[name=pixedxip]').val(config.value);
					} else if (config.code == 'PixedxPort' && CalendarCtrl) {
						$('#MyTable').dataTable().fnAddData([common.view.config_pixedxport, config.value]);
						$('#MyEditForm input[name=pixedxport]').val(config.value);
					}
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
FormValidateOption.rules['serverip'] = {};
FormValidateOption.rules['serverip']['required'] = true;
FormValidateOption.rules['serverport'] = {};
FormValidateOption.rules['serverport']['required'] = true;
FormValidateOption.rules['serverport']['number'] = true;
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
	$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
	$('#MyEditForm').attr('action', 'config!update.action');
	$('#MyEditModal').modal();
});

