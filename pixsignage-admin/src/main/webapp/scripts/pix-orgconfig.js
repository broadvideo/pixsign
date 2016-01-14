function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

var oTable = $('#MyTable').dataTable({
	'sDom' : 'rt',
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'org!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'orgid', 'bSortable' : false }],
	'iDisplayLength' : 1,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
		var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-sm blue pix-update"><i class="fa fa-edit"></i>' + common.view.edit + ' </a>';
		$('td:eq(2)', nRow).html(dropdownBtn);
		return nRow;
	}
});

jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small'); 
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
jQuery('#MyTable_wrapper .dataTables_length select').select2(); 

var currentConfig;
OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

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
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentorg = $('#MyTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in currentorg) {
		formdata['org.' + name] = currentorg[name];
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
	if ($('input[name="org.powerflag"]:checked').val() == 0) {
		$('.powerflag').css('display', 'none');
	} else {
		if ($('input[name="org.poweron"]').val() == '') {
			$('input[name="org.poweron"]').val('07:00:00');
		}
		if ($('input[name="org.poweroff"]').val() == '') {
			$('input[name="org.poweroff"]').val('00:00:00');
		}
		$('.powerflag').css('display', 'block');
	}
	$('#MyEditForm').attr('action', 'org!update.action');
	
	$("#BackupMediaSelect").select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: { 
			url: 'video!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term, // search term
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
							id:item.videoid 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function (media) {
			return media.text;
		},
		formatSelection: function (media) {
			return media.text;
		},
		initSelection: function(element, callback) {
			if (currentorg.backupvideo != null) {
				callback({id: currentorg.backupvideoid, text: currentorg.backupvideo.name });
			}
		},
		dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
		escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
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
		$('.powerflag').css('display', 'block');
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

