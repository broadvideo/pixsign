var CurRecord = null;
var  CurRecordid=-1;
var _leftparentid=-1;
var _leftparent=null;

var MeetingRoomModule=function(){
	
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
		'sAjaxSource' : 'meeting!list.action',
		'aoColumns' : [
		                {'sTitle' : '位置', 'mData' : 'locationname', 'bSortable' : false, 'sWidth' : '11%' },
		                {'sTitle' : '会议室', 'mData' : 'meetingroomname', 'bSortable' : false, 'sWidth' : '11%' },
		                {'sTitle' : '主题', 'mData' : 'subject', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '开始时间', 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '12%' },
		                {'sTitle' : '结束时间', 'mData' : 'endtime', 'bSortable' : false, 'sWidth' : '12%' },
		                {'sTitle' : '预定人', 'mData' : 'bookstaffname', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : '', 'mData' : 'meetingroomid', 'bSortable' : false, 'sWidth' : '12%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		    $('td:eq(3)',nRow).html(moment(aData.createtime).format('YYYY-MM-DD HH:mm'));
		    $('td:eq(4)',nRow).html(moment(aData.createtime).format('YYYY-MM-DD HH:mm'));
			var buttonhtml = '';
			buttonhtml += '<div class="util-btn-margin-bottom-5">';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-meetingdtl"><i class="fa fa-edit"></i> 明细</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			buttonhtml += '</div>';
			$('td:eq(6)', nRow).html(buttonhtml);
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


MeetingRoomModule.prototype.init=function(){
	this.initMeetingroomTable();
	this.initAttendeeTable();
	this.initLeftLocationTree();
	this.initEvent();

	
};


