var CurStudent = null;
var CurClassid = null;



function preview(file) {
    var filePath=$("#avatarfile").val();
    if($.trim(filePath).length==0){
		   return false;
         }
    var reg=/\.(jpg|png)/i;
    if(!reg.test(filePath)){
    	bootbox.alert("文件格式不合法，请上传jpg或者png格式头像！");
    	return false;
    }
    var filebytes=file.files[0].size;
    if(filebytes>1024*1024){
    	bootbox.alert("上传头像不允许大于1MB！");
    	return false;
 	
    }
    
	
	var prevDiv = document.getElementById('preview');
    if (file.files && file.files[0]) {
      var reader = new FileReader();
      reader.onload = function(evt) {
        prevDiv.innerHTML = '<img src="' + evt.target.result + '" width="120px" height="120px"/>';
      }
      reader.readAsDataURL(file.files[0]);
    } 
  }
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
	'sAjaxSource' : 'student!list.action',
	'aoColumns' : [ {'sTitle' : '班级', 'mData' : 'schoolclassname', 'bSortable' : false, 'sWidth' : '10%' },
	                {'sTitle' : '学号', 'mData' : 'studentno', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '姓名', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '硬件ID', 'mData' : 'hardid', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : '', 'mData' : 'studentid', 'bSortable' : false, 'sWidth' : '8%' },
					{'sTitle' : '', 'mData' : 'studentid', 'bSortable' : false, 'sWidth' : '8%' }],
				
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');

		return nRow;
	},
	'fnServerParams': function(aoData) { 
		if (CurClassid != null) {
			aoData.push({'name':'schoolclassid','value':CurClassid });
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
	CurStudent = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.remove + CurStudent.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'student!delete.action',
				cache: false,
				data : {
					'student.studentid': CurStudent.studentid
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
		dataType: 'json',
		data : new FormData($('#MyEditForm')[0]) ,
		 contentType: false,
		processData: false,
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
	$("#ClassSelect").select2('val','');
	$('#preview').html('')

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
	//初始化图片
	$('#preview').html("");
	if(formdata['student.avatar']!=null){
		
        $('#preview').append('<img src="/pixsigdata' + formdata['student.avatar'] + '?ts='+Date.now()+'"  width="120px" height="120px"/>');
    }
	$('#MyEditModal').modal();
	$("#ClassSelect").select2('val',item.schoolclassid);

});

$.ajax({
	type : 'GET',
	url : 'schoolclass!list.action',
	data : {"iDisplayStart" :0,"iDisplayLength" :999},
	dataType: 'json',
	success : function(data, status) {
		if (data.errorcode ==0) {
			var classlist = [];
			for (var i=0; i<data.aaData.length; i++) {
				classlist.push({
					id: data.aaData[i].schoolclassid,
					text: data.aaData[i].name
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
			bootbox.alert(data.errorcode + ": " + data.errormsg);
		}
	},
	error : function() {
		bootbox.alert('failure');
	}
});
