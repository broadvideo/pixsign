var CurClassroomid = null;
var CurExaminationroom=null;
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
	'sAjaxSource' : 'examinationroom!list.action',
	'aoColumns' : [ {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '12%' },
					{'sTitle' : '科目', 'mData' : 'coursename', 'bSortable' : false, 'sWidth' : '11%' },
					{'sTitle' : '描述', 'mData' : 'description', 'bSortable' : false, 'sWidth' : '16%' },
	                {'sTitle' : '教室', 'mData' : 'classroomname', 'bSortable' : false, 'sWidth' : '15%' },
	                {'sTitle' : '开始时间', 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '15%' },
	                {'sTitle' : '结束时间', 'mData' : 'endtime', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '', 'mData' : 'examinationroomid', 'bSortable' : false, 'sWidth' : '8%' },
					{'sTitle' : '', 'mData' : 'examinationroomid', 'bSortable' : false, 'sWidth' : '8%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
	    $('td:eq(4)',nRow).html(moment(aData.starttime).format('YYYY-MM-DD HH:mm'));
	    $('td:eq(5)',nRow).html(moment(aData.endtime).format('YYYY-MM-DD HH:mm'));
		$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(7)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
		return nRow;
	},
	'fnServerParams': function(aoData) { 
	
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
	CurExaminationroom = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.remove + CurExaminationroom.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'examinationroom!delete.action',
				cache: false,
				data : {
					'examinationroom.examinationroomid': CurExaminationroom.examinationroomid
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
FormValidateOption.rules['examinationroom.name'] = {};
FormValidateOption.rules['examinationroom.name']['required'] = true;
FormValidateOption.rules['examinationroom.coursename'] = {};
FormValidateOption.rules['examinationroom.coursename']['required'] = true;
FormValidateOption.rules['examinationroom.strstarttime'] = {};
FormValidateOption.rules['examinationroom.strstarttime']['required'] = true;
FormValidateOption.rules['examinationroom.strendtime'] = {};
FormValidateOption.rules['examinationroom.strendtime']['required'] = true;
FormValidateOption.submitHandler = function(form) {
	
	var starttime=moment($("#starttime").val());
	var endtime=moment($("#endtime").val());
	if(endtime<=starttime){
		
		bootbox.alert("结束时间必须大于开始时间!");
		return;

	}
	
	
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data : $('#MyEditForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#MyEditModal').modal('hide');
				bootbox.alert(common.tips.success);
				refreshMyTable();
			} else if(data.errorcode==-3){
				bootbox.alert("数据校验失败，请按要求填写表单!");

			}else if(data.errorcode==-2){
				bootbox.alert("教室时间冲突!");
				
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
	$('#MyEditForm').attr('action', 'examinationroom!add.action');
	$('#MyEditModal').modal();
	$("#ClassroomSelect").select2('val','');
   $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii',
		 autoclose: true,
         language: "zh-CN",
         todayHighlight: true,
         minuteStep: 5,
         todayBtn: false	 
	 
	 });

});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var item = $('#MyTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in item) {
		if(name=='starttime' || name=='endtime'){
			formdata['examinationroom.str' + name] = moment(item[name]).format('YYYY-MM-DD HH:mm');

		}else{
		  formdata['examinationroom.' + name] = item[name];
		}
	}
	refreshForm('MyEditForm');
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii',
		 autoclose: true,
         language: "zh-CN",
         todayHighlight: true,
         minuteStep: 5,
         todayBtn: false	 
	 
	 });
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'examinationroom!update.action');
	$('#MyEditModal').modal();
	$("#ClassroomSelect").select2('val',item.classroomid);

});

$.ajax({
	type : 'GET',
	url : 'classroom!list.action',
	data : {"iDisplayStart" :0,"iDisplayLength" :999},
	dataType: 'json',
	success : function(data, status) {
		if (data.errorcode == 0) {
			var classlist = [];
			for (var i=0; i<data.aaData.length; i++) {
				classlist.push({
					id: data.aaData[i].classroomid,
					text: data.aaData[i].name
				});
			}
			$("#ClassroomSelect").select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				data: classlist,
				dropdownCssClass: "bigdrop", 
				escapeMarkup: function (m) { return m; } 
			});
		} else {
			bootbox.alert(data.errorcode + ": " + data.errmsg);
		}
	},
	error : function() {
		bootbox.alert('failure');
	}
});
