var CurRecord = null;
var  CurRecordid=null;
var  _parentid=-1;
var  _parent=null;
var _leftparentid=-1;
var _leftparent=null;

var SmartboxModule=function(){
	
};


function initTerminalList(){
	
	$.ajax({
		type : 'GET',
		url : 'device!list.action',
		data : {"iDisplayStart" :0,"iDisplayLength" :999},
		dataType: 'json',
		success : function(data, status) {
			if (data.errorcode == 0) {
				var classlist = [];
				for (var i=0; i<data.aaData.length; i++) {
					classlist.push({
						id: data.aaData[i].terminalid,
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
				bootbox.alert(data.errorcode + ": " + data.errmsg);
			}
		},
		error : function() {
			bootbox.alert('failure');
		}
	});
	
	
};


var refresh = function () {
	
	$('#MyTable').dataTable()._fnAjaxUpdate();
	$('.pix-add').css('display', '');
	
	
};


function refreshMyTable(){
	
	$('#MyTable').dataTable()._fnAjaxUpdate();
	
	
};

SmartboxModule.prototype.initEvent=function(){
	

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
					url : 'smartbox!delete.action',
					cache: false,
					data : {
						'smartbox.smartboxid': CurRecord.smartboxid
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
	FormValidateOption.rules['smartbox.name'] = {};
	FormValidateOption.rules['smartbox.name']['required'] = true;
	FormValidateOption.rules['smartbox.stocknum'] = {};
	FormValidateOption.rules['smartbox.stocknum']['required'] = true;
	FormValidateOption.rules['smartbox.stocknum']['number']=true
	
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
		initTerminalList();
		$('#MyEditForm').attr('action', 'smartbox!add.action');
		$('#MyEditModal').modal();

	});			


	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		initTerminalList();
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
		   formdata['smartbox.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', 'smartbox!update.action');
		$('#MyEditModal').modal();
		$("#ClassSelect").select2('val',item.terminalid);


	});

};

SmartboxModule.prototype.initMyTable = function () {

	
	$('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'smartbox!list.action',
		'aoColumns' : [
		                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '终端id', 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '库存数', 'mData' : 'stocknum', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '创建时间', 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : '', 'mData' : 'smartboxid', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : '', 'mData' : 'smartboxid', 'bSortable' : false, 'sWidth' : '10%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {

			$('td:eq(3)',nRow).html(function(){
				
				
				return  moment(aData.createtime).format('YYYY-MM-DD HH:mm');
			});
		    $('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		    $('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');

			return nRow;
		},
		'fnServerParams': function(aoData) { 

		}
	});
	$('#MyTable_wrapper').addClass('form-inline');
	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
};


SmartboxModule.prototype.init=function(){
	this.initMyTable();
	this.initEvent();

	
};


