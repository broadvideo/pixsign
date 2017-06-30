var CurStudent = null;
var CurClassid = null;

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

$('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'schoolclass!list.action',
	'aoColumns' : [ {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : '描述', 'mData' : 'description', 'bSortable' : false, 'sWidth' : '15%' },
	                {'sTitle' : '教室', 'mData' : 'classroomname', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '', 'mData' : 'schoolclassid', 'bSortable' : false, 'sWidth' : '10%' },
					{'sTitle' : '', 'mData' : 'schoolclassid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
		return nRow;
	},
	'fnServerParams': function(aoData) { 
		if (CurClassid != null) {
			aoData.push({'name':'classid','value':CurClassid });
		}
	}
});

$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').select2();
$('#MyTable').css('width', '100%').css('table-layout', 'fixed');

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurSchoolclass = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.remove + CurSchoolclass.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'schoolclass!delete.action',
				cache: false,
				data : {
					'schoolclass.schoolclassid': CurSchoolclass.schoolclassid
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						refreshMyTable();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});				
		}
	 });
	
});

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

//FormValidateOption.rules['student.classid'] = {};
//FormValidateOption.rules['student.classid']['required'] = true;
FormValidateOption.rules['student.studentno'] = {};
FormValidateOption.rules['student.studentno']['required'] = true;
FormValidateOption.rules['student.name'] = {};
FormValidateOption.rules['student.name']['required'] = true;
FormValidateOption.rules['student.hardid'] = {};
FormValidateOption.rules['student.hardid']['required'] = true;
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

$('body').on('click', '.pix-add', function(event) {
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'schoolclass!add.action');
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var item = $('#MyTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in item) {
		
		formdata['schoolclass.' + name] = item[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'schoolclass!update.action');
	$('#MyEditModal').modal();
});

$.ajax({
	type : 'GET',
	url : 'classroom!list.action',
	data : {'pageSize': 999},
	dataType: 'json',
	success : function(data, status) {
		if (data.retcode ==1) {
			var classlist = [];
			for (var i=0; i<data.data.length; i++) {
				classlist.push({
					id: data.data[i].id,
					text: data.data[i].name
				});
			}
			$("#ClassSelect").select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				data: classlist,
				dropdownCssClass: "bigdrop", 
				escapeMarkup: function (m) { return m; } 
			});
		} else {
			bootbox.alert(data.retcode + ": " + data.message);
		}
	},
	error : function() {
		bootbox.alert('failure');
	}
});
