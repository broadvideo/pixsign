
var RoomModule=function(){
	
	var CurRecord = null;
	var  CurRecordid=null;
	var  _parentid=-1;
	var  _parent=null;
	var  _roomtype=1;
	
	var init=function(roomtype){
		if(roomtype!=null){
			
			_roomtype=roomtype;
		}
		initRoomTable();
		initEvent();
		
	};


	
	//初始化新增、修改删除事件
var initEvent=function(){
		

		$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#MyTable_wrapper .dataTables_length select').select2();
		$('#MyTable').css('width', '100%').css('table-layout', 'fixed');

		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			CurRecord = $('#MeetingroomTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + CurRecord.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'room!delete.action',
						cache: false,
						data : {
							'room.roomid': CurRecord.roomid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								refresh();
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
		FormValidateOption.rules['room.name'] = {};
		FormValidateOption.rules['room.name']['required'] = true;		
		FormValidateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#MyEditForm').attr('action'),
				data : $('#MyEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MyEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
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
			initPersonList();
			$('#MyEditForm').attr('action', 'room!add.action?room.type='+_roomtype);
			$('#MyEditModal').modal();

		});			


		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			initTerminalList();
			initPersonList();
			var item = $('#MeetingroomTable').dataTable().fnGetData(index);
			var formdata = new Object();
			for (var name in item) {
			   formdata['room.' + name] = item[name];
			}
		
			refreshForm('MyEditForm');
			$('#MyEditForm').loadJSON(formdata);
			if(formdata['room.roompersonflag']=='1'){
				$('div.persons-form-group').show();
			}else{
				$('div.persons-form-group').hide();
			}
		
			$('#MyEditForm').attr('action', 'room!update.action');
			$('#MyEditModal').modal();
			//$("#ClassSelect").select2('val',item.terminalid);


		});
		
		$('input[name="room.roompersonflag"]').click(function(){
			
			var selValue=$(this).val();
			if(selValue=='0'){
				$('div.persons-form-group').hide();
				
			}else if(selValue=='1'){
				
				$('div.persons-form-group').show();
			}
			
	
			
		});
		


	};

var refresh = function () {
		
		$('#MeetingroomTable').dataTable()._fnAjaxUpdate();
		$('.pix-add').css('display', '');
		
		
	};


	

var initRoomTable = function () {

		
		$('#MeetingroomTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'room!list.action',
			'aoColumns' : [ {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
			                {'sTitle' : '描述', 'mData' : 'description', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : '创建时间', 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '15%' },
			                {'sTitle' : '终端', 'mData' : 'terminalids', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : '', 'mData' : 'roomid', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'roomid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : DataTableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			    $('td:eq(2)',nRow).html(moment(aData.createtime).format('YYYY-MM-DD HH:mm'));
				$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
			      aoData.push({'name':'room.type','value':_roomtype });

			}
		});
		$('#MeetingroomTable_wrapper').addClass('form-inline');
		$('#MeetingroomTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#MeetingroomTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#MeetingroomTable_wrapper .dataTables_length select').select2();
		$('#MeetingroomTable').css('width', '100%');
	};
	

	
var initTerminalList=function(){
		
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
						multiple:true,
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
	
var  initPersonList=function(){
	
	$.ajax({
		type : 'GET',
		url : 'person!list.action',
		data : {"iDisplayStart" :0,"iDisplayLength" :999,"person.type" : 2},
		dataType: 'json',
		success : function(data, status) {
			if (data.errorcode == 0) {
				var classlist = [];
				for (var i=0; i<data.aaData.length; i++) {
					classlist.push({
						id: data.aaData[i].personid,
						text: data.aaData[i].name
					});
				}
				$("#PersonClassSelect").select2({
					placeholder: common.tips.detail_select,
					minimumInputLength: 0,
					multiple:true,
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
	
	
}	

	
	return {
		init: init,
		refresh: refresh,
	}
	
	
}();





