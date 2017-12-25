var CurRecord = null;
var  CurRecordid=null;
//init list
var classlist = [];
classlist.push({id:0,text: '投影仪'},{id:2,text:'扬声器'},{ id:1,text:'便携式电脑'});
$("#ClassSelect").select2({
	placeholder: common.tips.detail_select,
	minimumInputLength: 0,
	data: classlist,
	dropdownCssClass: "bigdrop", 
	escapeMarkup: function (m) { return m; } 
});
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
	'sAjaxSource' : 'equipment!list.action',
	'aoColumns' : [
                    {'sTitle' : '类型', 'mData' : 'type', 'bSortable' : false, 'sWidth' : '10%' },
	                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : 'Code', 'mData' : 'code', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : 'IP', 'mData' : 'ipaddr', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '', 'mData' : 'equipmentid', 'bSortable' : false, 'sWidth' : '10%' },
					{'sTitle' : '', 'mData' : 'equipmentid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		
		$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
		return nRow;
		
		
		
	},
	'fnServerParams': function(aoData) { 
	
	
	},
	columnDefs: [{
        "render": function (data, type, row) {
        	
        	for(var key in classlist){
        		if(classlist[key].id==data){
        			
        			return classlist[key].text;
        		}
        		
        	}
        	
        	

          
        },
        "targets": [0]
    }]
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
	CurRecord = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.remove + CurRecord.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'equipment!delete.action',
				cache: false,
				data : {
					'equipment.equipmentid': CurRecord.equipmentid
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
FormValidateOption.rules['equipment.type'] = {};
FormValidateOption.rules['equipment.type']['required'] = true;
FormValidateOption.rules['equipment.name'] = {};
FormValidateOption.rules['equipment.name']['required'] = true;
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
			} else if(data.errorcode==-3){
				bootbox.alert("数据校验失败，请按要求填写表单!");

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
	$('#MyEditForm').attr('action', 'equipment!add.action');
	$('#MyEditModal').modal();
	$("#ClassSelect").select2('val','');

});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var item = $('#MyTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in item) {
		
		formdata['equipment.' + name] = item[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'equipment!update.action');
	$('#MyEditModal').modal();
	$("input[name='equipment.equipmentid']").val(item.equipmentid);
	$("#ClassSelect").select2('val',item.type);

});

