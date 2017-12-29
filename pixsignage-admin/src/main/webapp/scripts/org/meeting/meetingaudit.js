var CurRecord = null;
var  CurRecordid=-1;
var _leftparentid=null;
var _leftparent=null;
var _branchparentid=null;
var  _searchParams=[];
var classlist=[];
classlist.push({id:1,text: '通过'},{id:2,text:'拒绝'});

var MeetingRoomModule=function(){
	
};

function initBranchTree() {
	BranchTree = $('.branchtree');
	BranchTree.jstree('destroy');
	BranchTree.jstree({
		'core' : {
			'multiple' : false,
			'data' : {
				'url': function(node) {
					return 'branch!listnode.action';
				},
				'data': function(node) {
					return {
						'id': node.id,
						'branch':node.branch,
					}
				}
			}
		},
		'plugins' : ['unique'],
	});
	BranchTree.on('loaded.jstree', function() {
		_branchparentid = BranchTree.jstree(true).get_json('#')[0].id;
		BranchTree.jstree('select_node', _branchparentid);
	});
	BranchTree.on('select_node.jstree', function(event, data) {
		_branchparentid = data.instance.get_node(data.selected[0]).id;
		//_branchparent = data.instance.get_node(data.selected[0]).original.branch;
	});
};

var refresh = function () {
	
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
		bootbox.confirm(common.tips.remove + CurRecord.subject, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : 'meeting!delete.action',
					cache: false,
					data : {
						'meeting.meetingid': CurRecord.meetingid
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
	
$('body').on('click', '.pix-meetingdtl', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			CurRecord = $('#MeetingroomTable').dataTable().fnGetData(index);
			CurRecordid=CurRecord.meetingid
			$('#AttendeeTable').dataTable()._fnAjaxUpdate();
	
			var formdata = new Object();
			for (var name in CurRecord) {
				if(name=="starttime" || name=="endtime"){
				   formdata['meeting.' + name] = moment(CurRecord[name]).format('YYYY-MM-DD HH:mm');
	
				}else{
			       formdata['meeting.' + name] = CurRecord[name];
				}
			}
	         refreshForm('MyEditForm');
	    	$('#MyEditForm').loadJSON(formdata);
			$('#MyEditModal').modal();
		});
     OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

 	$('body').on('click', '.pix-audit', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurRecord = $('#MeetingroomTable').dataTable().fnGetData(index);
		alert(JSON.stringify(CurRecord));

		CurRecordid=CurRecord.meetingid
		$("#ClassSelect3").select2('val','');
		$("#ClassSelect3").select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			data: classlist,
			dropdownCssClass: "bigdrop", 
			escapeMarkup: function (m) { return m; } 
		});
		var formdata = new Object();
		for (var name in CurRecord) {
		       formdata['meeting.' + name] = CurRecord[name];
			
		}
		alert(CurRecord.auditstatus);

        refreshForm('MeetingAuditForm');
    	$('#MeetingAuditForm').loadJSON(formdata);
		$('#MeetingAuditForm').attr('action', 'meeting!auditmeeting.action');
		$('#MeetingAuditModal').modal();
		$("#ClassSelect3").select2('val',CurRecord.auditstatus);

	});	
	

	OriginalFormData['MeetingAuditForm'] = $('#MeetingAuditForm').serializeObject();

	FormValidateOption.rules['meeting.auditstatus'] = {};
	FormValidateOption.rules['meeting.auditstatus']['required'] = true;
	FormValidateOption.submitHandler = function(form) {

		$.ajax({
			type : 'POST',
			url : $('#MeetingAuditForm').attr('action'),
			data : $('#MeetingAuditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MeetingAuditModal').modal('hide');
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
	$('#MeetingAuditForm').validate(FormValidateOption);

	$('[type=submit]', $('#MeetingAuditModal')).on('click', function(event) {
		
		if ($('#MeetingAuditForm').valid()) {
			$('#MeetingAuditForm').submit();
		}
	});
};

MeetingRoomModule.prototype.initAttendeeTable=function(){
	
	$('#AttendeeTable').dataTable({
		'sDom' : 'rt',
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'meeting!attendees.action',
		'aoColumns' : [ {'sTitle' : '与会人员', 'mData' : 'staffname', 'bSortable' : false }, 
		        		{'sTitle' : '签到时间', 'mData' : 'signtime', 'bSortable' : false }
		              ],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : PixData.tableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(1)',nRow).html((function(){
				if(aData.signtime!=null){
				   return moment(aData.signtime).format('YYYY-MM-DD HH:mm') 
			    }else{
				   return null;
			   }
				
			})());
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'meeting.meetingid','value':CurRecordid });
		
		}
	});
	$('#AttendeeTable').css('width', '100%').css('table-layout', 'fixed');
};
MeetingRoomModule.prototype.initMeetingroomTable = function () {

	$('#MeetingroomTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'meeting!auditlist.action',
		'aoColumns' : [
		                {'sTitle' : '会议室', 'mData' : 'meetingroomname', 'bSortable' : false, 'sWidth' : '11%' },
		                {'sTitle' : '主题', 'mData' : 'subject', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '开始时间', 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '12%' },
		                {'sTitle' : '结束时间', 'mData' : 'endtime', 'bSortable' : false, 'sWidth' : '12%' },
		                {'sTitle' : '预定人', 'mData' : 'bookstaffname', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '状态', 'mData' : 'auditstatus', 'bSortable' : false, 'sWidth' : '8%' },
						{'sTitle' : '', 'mData' : 'meetingroomid', 'bSortable' : false, 'sWidth' : '18%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		    $('td:eq(2)',nRow).html(moment(aData.starttime).format('YYYY-MM-DD HH:mm'));
		    $('td:eq(3)',nRow).html(moment(aData.endtime).format('YYYY-MM-DD HH:mm'));
			$('td:eq(5)', nRow).html(function(){
				if(aData.auditstatus=='0'){
					
					return "待审核";
				}else if(aData.auditstatus=='1'){
					return "通过";

				}else if(aData.auditstatus=='2'){
					return "拒绝";

				}
				
			});
			$('td:eq(6)', nRow).html(function(){
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-meetingdtl"><i class="fa fa-edit"></i> 明细</a>';
				if(aData.auditstatus=='0'){
				    buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-audit"><i class="fa fa-edit"></i>审核</a>';
			     }
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				
				return buttonhtml;
				});
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			if(_leftparentid!=null){
			   aoData.push({'name':'meeting.locationid','value':_leftparentid });
			}
			if(_searchParams.length>0){
				
			     for(var key in _searchParams){
			    	 aoData.push(_searchParams[key]); 
			     }
			}


		}
	});
	$('#MeetingroomTable_wrapper').addClass('form-inline');
	$('#MeetingroomTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MeetingroomTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MeetingroomTable_wrapper .dataTables_length select').select2();
	$('#MeetingroomTable').css('width', '100%');
};


MeetingRoomModule.prototype.init=function(){
	this.initMeetingroomTable();
	this.initAttendeeTable();
	this.initEvent();

	
};


