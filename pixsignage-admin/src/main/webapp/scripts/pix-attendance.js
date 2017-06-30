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
	'sAjaxSource' : 'attendance!list.action',
	'aoColumns' : [ {'sTitle' : '考勤时间', 'mData' : 'eventtime', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : '班级', 'mData' : 'schoolclassname', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '教室', 'mData' : 'classroomname', 'bSortable' : false, 'sWidth' : '15%' },
	                {'sTitle' : '课程', 'mData' : 'coursename', 'bSortable' : false, 'sWidth' : '15%' },
	                {'sTitle' : '姓名', 'mData' : 'studentname', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '学号', 'mData' : 'studentno', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '', 'mData' : 'id', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
	    $('td:eq(0)',nRow).html(moment(aData.eventtime).format('YYYY-MM-DD HH:mm'));
		$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
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
	CurAttendancelog = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.remove, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'attendance!delete.action',
				cache: false,
				data : {
					'attendance.id': CurAttendancelog.id
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
	$('#MyEditForm').attr('action', 'student!add.action');
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
		formdata['student.' + name] = item[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'student!update.action');
	$('#MyEditModal').modal();
});

$.ajax({
	type : 'GET',
	url : 'classroom!list.action',
	data : {'pageSize': 9999},
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
