var CurrentWxinfo = null;
function refreshMyTable() {
	$.ajax({
		type : 'GET',
		url : 'wxinfo!get.action',
		data : '',
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentWxinfo = data.wxinfo;
				$('#MyTable').dataTable().fnClearTable();

				$('#MyTable').dataTable().fnAddData([common.view.wxappid, CurrentWxinfo.wxappid]);
				$('#MyTable').dataTable().fnAddData([common.view.wxsecret, CurrentWxinfo.wxsecret]);

				if (CurrentWxinfo.validflag == 1) {
					var validhtml = '<span class="label label-xs label-success">' + common.view.valid + '</span>';
					$('#MyTable').dataTable().fnAddData([common.view.wxvalidflag, validhtml]);
				} else {
					var validhtml = '<span class="label label-xs label-warning">' + common.view.invalid + '</span>' + CurrentWxinfo.comment;
					$('#MyTable').dataTable().fnAddData([common.view.wxvalidflag, validhtml]);
				}
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
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
FormValidateOption.rules['wxinfo.wxappid'] = {};
FormValidateOption.rules['wxinfo.wxappid']['required'] = true;
FormValidateOption.rules['wxinfo.wxsecret'] = {};
FormValidateOption.rules['wxinfo.wxsecret']['required'] = 6;
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
			console.log('failue');
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
	if (CurrentWxinfo == null) {
		return;
	}
	var formdata = new Object();
	for (var name in CurrentWxinfo) {
		formdata['wxinfo.' + name] = CurrentWxinfo[name];
	}
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'wxinfo!update.action');
	$('#MyEditModal').modal();
});

