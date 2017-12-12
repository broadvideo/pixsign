var CurRecord = null;
var  CurRecordid=null;
var  _parentid=-1;
var  _parent=null;
var _leftparentid=-1;
var _leftparent=null;

//init list
var classlist = [];
classlist.push({id:0,text: '投影仪'},{id:2,text:'扬声器'},{ id:1,text:'便携式电脑'});
var MeetingRoomModule=function(){
	
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

MeetingRoomModule.prototype.initLeftLocationTree=function(){
	
	var BranchTree = $('#MeetingroomPortlet .leftLocationTree');
	BranchTree.jstree('destroy');
	BranchTree.jstree({
		'core' : {
			'multiple' : false,
			'data' : {
				'url': function(node) {
					return 'location!listnode.action';
				},
				'data': function(node) {
					return {
						'id': node.id,
						'location':node.location,

					}
				}
			}
		},
		'plugins' : ['unique'],
	});
	
	BranchTree.on('loaded.jstree', function() {
		_leftparentid = BranchTree.jstree(true).get_json('#')[0].id;
		BranchTree.jstree('select_node', _leftparentid );
		
		refresh();
	});
	BranchTree.on('select_node.jstree', function(event, data) {
	
		_leftparentid  = data.instance.get_node(data.selected[0]).id;
		_leftparent  = data.instance.get_node(data.selected[0]).original.location;
		refresh();
	});
	
};
MeetingRoomModule.prototype.initLocationTree=function(){
	
	var BranchTree = $('#MyEditForm #BranchTree');
	BranchTree.jstree('destroy');
	BranchTree.jstree({
		'core' : {
			'multiple' : false,
			'data' : {
				'url': function(node) {
					return 'location!listnode.action';
				},
				'data': function(node) {
					return {
						'id': node.id,
						'location':node.location,

					}
				}
			}
		},
		'plugins' : ['unique'],
	});
	
	BranchTree.on('loaded.jstree', function() {
		_parentid = BranchTree.jstree(true).get_json('#')[0].id;
		BranchTree.jstree('select_node', _parentid );
		
	
	});
	BranchTree.on('select_node.jstree', function(event, data) {
	
		_parentid  = data.instance.get_node(data.selected[0]).id;
		_parent  = data.instance.get_node(data.selected[0]).original.location;

	});
	
};
var refresh = function () {
	
	$('#MeetingroomTable').dataTable()._fnAjaxUpdate();
	$('#MeetingroomPortlet .leftLocationTree').jstree(true).refresh_node(_leftparentid);
	$('.pix-add').css('display', '');
	
	
};


function refreshMyTable(){
	
	$('#MeetingroomTable').dataTable()._fnAjaxUpdate();
	
	
};

MeetingRoomModule.prototype.initEvent=function(){
	

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
					url : 'meetingroom!delete.action',
					cache: false,
					data : {
						'meetingroom.meetingroomid': CurRecord.meetingroomid
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
	FormValidateOption.rules['schoolclass.name'] = {};
	FormValidateOption.rules['schoolclass.name']['required'] = true;
	FormValidateOption.submitHandler = function(form) {
		$("input[name='meetingroom.locationid']").val(_parentid);
		var openflag=$('#OpenFlagSwitch').bootstrapSwitch('state'); 
		 if (openflag == true)
         {
            $("input[name='meetingroom.openflag']").val("1")
         }
         else
         {
             $("input[name='meetingroom.openflag']").val("0")

         }
		 var auditflag=$("#AuditFlagSwitch").bootstrapSwitch('state'); 
		 if(auditflag==true){
			 $("input[name='meetingroom.auditflag']").val("1")
			 
		 }else{
			 $("input[name='meetingroom.auditflag']").val("0")
			 
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
	

	
	$('body').on('click','.pix-equipment',function(event){
		
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
    	CurRecord = $('#MeetingroomTable').dataTable().fnGetData(index);
		$('#EquipmentTable').dataTable()._fnAjaxUpdate();
		$('#MeetingroomEquipmentTable').dataTable()._fnAjaxUpdate();
    	$('#EquipmentDtlModal').modal();
		
	});

	$('body').on('click', '.pix-add', function(event) {
		refreshForm('MyEditForm');
		initTerminalList();
		//清理内容数据,解决静态dom加载spiner数字不会恢复初始值
		$('#peoples_wrapper_div').html('');
		//插入模板数据
		$('#peoples_wrapper_div').html($("#peoples_spinner_tpl").html());
		$("#peoples_spinner").spinner({value:1, min: 1, max:1000});
		$('#MyEditForm').attr('action', 'meetingroom!add.action');
		$('#MyEditModal').modal();

	});			


	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		initTerminalList();
		//清理内容数据,解决静态dom加载spiner数字不会恢复初始值
		$('#peoples_wrapper_div').html('');
		//插入模板数据
		$('#peoples_wrapper_div').html($("#peoples_spinner_tpl").html());
		var item = $('#MeetingroomTable').dataTable().fnGetData(index);
		$("#meetingroom.meetingroomid").attr("value",item.meetingroomid);
	    $("#BranchTree").jstree("deselect_all",true);
        $('#BranchTree').jstree('select_node',item.locationid,false);
		var formdata = new Object();
		for (var name in item) {
		   formdata['meetingroom.' + name] = item[name];
		}
		if(item['openflag']=='1'){
			$('#OpenFlagSwitch').bootstrapSwitch('state', true); 
		}else{
			$('#OpenFlagSwitch').bootstrapSwitch('state', false); 

		}
		if(item['auditflag']=='1'){
			$('#AuditFlagSwitch').bootstrapSwitch('state', true); 
		}else{
			$('#AuditFlagSwitch').bootstrapSwitch('state', false); 

		}
		
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
	     $("#peoples_spinner").spinner({value:item['peoples'], min: 1, max:1000});
		$('#MyEditForm').attr('action', 'meetingroom!update.action');
		$('#MyEditModal').modal();
		$("#ClassSelect").select2('val',item.terminalid);


	});

};

MeetingRoomModule.prototype.initMeetingroomTable = function () {

	
	$('#MeetingroomTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'meetingroom!list.action',
		'aoColumns' : [
		                {'sTitle' : '位置', 'mData' : 'locationname', 'bSortable' : false, 'sWidth' : '12%' },
		                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '人数', 'mData' : 'peoples', 'bSortable' : false, 'sWidth' : '11%' },
		                {'sTitle' : '接受预定', 'mData' : 'openflag', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '终端', 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : '', 'mData' : 'meetingroomid', 'bSortable' : false, 'sWidth' : '20%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			if(aData.openflag=='1'){
				$('td:eq(3)', nRow).html("是");
			}else{
				$('td:eq(3)', nRow).html("否");

			}
			
			var buttonhtml = '';
			buttonhtml += '<div class="util-btn-margin-bottom-5">';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-equipment"><i class="fa fa-cog"></i>设备</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			buttonhtml += '</div>';
			$('td:eq(5)', nRow).html(buttonhtml);
		    //$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			//$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'locationid','value':_leftparentid });

		}
	});
	$('#MeetingroomTable_wrapper').addClass('form-inline');
	$('#MeetingroomTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MeetingroomTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MeetingroomTable_wrapper .dataTables_length select').select2();
	$('#MeetingroomTable').css('width', '100%');
};
MeetingRoomModule.prototype.initEquipmentTable=function(){
	var selectedEquipments = [];
	var selectedMREquipments = [];



 	//未关联设备清单
 	$('#EquipmentTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
 		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
 						[ 10, 25, 50, 100 ] 
 						],
 		'bProcessing' : true,
 		'bServerSide' : true,
 		'sAjaxSource' : 'equipment!list.action',
 		'aoColumns' : [
                        {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'equipmentid', 'bSortable' : false ,'sWidth' : '5%'}, 
 	                    {'sTitle' : '类型', 'mData' : 'type', 'bSortable' : false, 'sWidth' : '10%' },
 		                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
 						{'sTitle' : 'Code', 'mData' : 'code', 'bSortable' : false, 'sWidth' : '15%' }
 		                ],
 		'iDisplayLength' : 10,
 		'sPaginationType' : 'bootstrap',
 		'oLanguage' : DataTableLanguage,
 		'fnServerParams': function(aoData) { 
 			if(CurRecord!=null){
 			    aoData.push({'name':'meetingroomid','value': -1});
 			}
 			
 			
 		},
 		columnDefs: [{
 	       "render": function (data, type, row) {
	        
 	    	   
 	    	   return '<input type="checkbox" id="EquipmentCheck' + data + '" />';
	          
	        },
	        "targets": [0]	
 	    	
 	    	
 	    	
 	    },{
 	        "render": function (data, type, row) {
 	        	
 	        	for(var key in classlist){
 	        		if(classlist[key].id==data){
 	        			
 	        			return classlist[key].text;
 	        		}
 	        		
 	        	}
 	          
 	        },
 	        "targets": [1]
 	    }]
 	});
 	
	//已关联设备
 	$('#MeetingroomEquipmentTable').dataTable({
 		
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
 		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
 						[ 10, 25, 50, 100 ] 
 						],
 		'bProcessing' : true,
 		'bServerSide' : true,
 		'sAjaxSource' : 'equipment!list.action',
 		'aoColumns' : [
                        {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'equipmentid', 'bSortable' : false ,'sWidth' : '5%'}, 
 	                    {'sTitle' : '类型', 'mData' : 'type', 'bSortable' : false, 'sWidth' : '10%' },
 		                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
 						{'sTitle' : 'Code', 'mData' : 'code', 'bSortable' : false, 'sWidth' : '15%' }
 		                ],
 		'iDisplayLength' : 10,
 		'sPaginationType' : 'bootstrap',
 		'oLanguage' : DataTableLanguage,
 		'fnServerParams': function(aoData) { 
 			if(CurRecord!=null){
 			    aoData.push({'name':'meetingroomid','value': CurRecord.meetingroomid});
 			}
 			
 		},
 		columnDefs: [{
 	        "render": function (data, type, row) {
 	        	
 	        	for(var key in classlist){
 	        		if(classlist[key].id==data){
 	        			
 	        			return classlist[key].text;
 	        		}
 	        	}
 	          
 	        },
 	        "targets": [1]
 	    },{
 	       "render": function (data, type, row) {
	        
 	    	   
 	    	   return '<input type="checkbox" id="MREquipmentCheck' + data + '" />';
	          
	        },
	        "targets": [0]	
 	    	
 	    	
 	    	
 	    }]
 	});
 	
	$('#EquipmentTable').on('click', 'tr', function () {
		var row = $('#EquipmentTable').dataTable().fnGetData(this);
		if (row == null) return;
		var equipmentid = row.equipmentid;
		var index = $.inArray(equipmentid, selectedEquipments);
		if (index >= 0) {
			selectedEquipments.splice(index, 1);
			$('#EquipmentCheck'+equipmentid).prop('checked', false);
		} else {
			selectedEquipments.push(equipmentid);
			$('#EquipmentCheck'+equipmentid).prop('checked', true);
		}
		$(this).toggleClass('active');
	});
 	 
	$('#CheckAll', $('#EquipmentTable')).on('click', function() {
		var rows = $("#EquipmentTable").dataTable().fnGetNodes();
		for (var i=0; i<rows.length; i++) {
			var equipmentid = $('#EquipmentTable').dataTable().fnGetData(rows[i]).equipmentid;
			if (this.checked) {
				$(rows[i]).addClass('active');
			} else {
				$(rows[i]).removeClass('active');
			}
			$('#EquipmentCheck'+equipmentid).prop('checked', this.checked);
			var index = $.inArray(equipmentid, selectedEquipments);
			if (index == -1 && this.checked) {
				selectedEquipments.push(equipmentid);
			} else if (index >= 0 && !this.checked) {
				selectedEquipments.splice(index, 1);
			}
	    }
	}); 
	
	
	$('#MeetingroomEquipmentTable').on('click', 'tr', function () {
		var row = $('#MeetingroomEquipmentTable').dataTable().fnGetData(this);
		if (row == null) return;
		var equipmentid = row.equipmentid;
		var index = $.inArray(equipmentid, selectedMREquipments);
		if (index >= 0) {
			selectedMREquipments.splice(index, 1);
			$('#MREquipmentCheck'+equipmentid).prop('checked', false);
		} else {
			selectedMREquipments.push(equipmentid);
			$('#MREquipmentCheck'+equipmentid).prop('checked', true);
		}
		$(this).toggleClass('active');
	});
	$('#CheckAll', $('#MeetingroomEquipmentTable')).on('click', function() {
		var rows = $("#MeetingroomEquipmentTable").dataTable().fnGetNodes();
		for (var i=0; i<rows.length; i++) {
			var equipmentid = $('#MeetingroomEquipmentTable').dataTable().fnGetData(rows[i]).equipmentid;
			if (this.checked) {
				$(rows[i]).addClass('active');
			} else {
				$(rows[i]).removeClass('active');
			}
			$('#MREquipmentCheck'+equipmentid).prop('checked', this.checked);
			var index = $.inArray(equipmentid, selectedMREquipments);
			if (index == -1 && this.checked) {
				selectedMREquipments.push(equipmentid);
			} else if (index >= 0 && !this.checked) {
				selectedMREquipments.splice(index, 1);
			}
	    }
	});
	
	//选择终端加入终端组
	$('body').on('click', '.pix-adddevicegpdtl', function(event) {
	
		$.ajax({
			type : 'POST',
			url : 'meetingroom!addequipments.action',
			data : '{"meetingroom":{"meetingroomid":' + CurRecord.meetingroomid + '}, "equipmentids":' + $.toJSON(selectedEquipments) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				if (data.errorcode == 0) {
				     selectedEquipments = [];
					 selectedMREquipments = [];
					$('#EquipmentTable').dataTable()._fnAjaxUpdate();
					$('#MeetingroomEquipmentTable').dataTable()._fnAjaxUpdate();
					refresh();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	});

	//从终端组删除终端
	$('body').on('click', '.pix-deletedevicegpdtl', function(event) {
		$.ajax({
			type : 'POST',
			url : 'meetingroom!deleteequipments.action',
			data : '{"meetingroom":{"meetingroomid":' + CurRecord.meetingroomid + '}, "equipmentids":' + $.toJSON(selectedMREquipments) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				if (data.errorcode == 0) {
					selectedEquipments = [];
					selectedMREquipments = [];
					$('#EquipmentTable').dataTable()._fnAjaxUpdate();
					$('#MeetingroomEquipmentTable').dataTable()._fnAjaxUpdate();
					refresh();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	});
	 
 };	

MeetingRoomModule.prototype.init=function(){
	this.initMeetingroomTable();
	this.initEquipmentTable();
	this.initLocationTree();
	this.initLeftLocationTree();
	this.initEvent();

	
};


