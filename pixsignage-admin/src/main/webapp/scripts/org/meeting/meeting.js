var CurRecord = null;
var  CurRecordid=-1;
var _leftparentid=null;
var _leftparent=null;
var _branchparentid=null;
var  _searchParams=[];

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


function initMeetingrooms(){
	
	$("#ClassSelect").select2('val','');
	$.ajax({
		type : 'GET',
		url : 'meetingroom!list.action',
		data : {"iDisplayStart" :0,"iDisplayLength" :999,"locationid": _leftparentid},
		dataType: 'json',
		success : function(data, status) {
			if (data.errorcode == 0) {
				var classlist = [];
				for (var i=0; i<data.aaData.length; i++) {
					classlist.push({
						id: data.aaData[i].meetingroomid,
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
	
	var BranchTree =$('.leftLocationTree');    //$('#MeetingroomPortlet .leftLocationTree');
	BranchTree.jstree('destroy');
	BranchTree.jstree({
		'core' : {
			'multiple' : true,
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
	
	initMeetingrooms();
//	$('#MeetingroomTable').dataTable()._fnAjaxUpdate();
	$('.leftLocationTree').jstree(true).refresh_node(_leftparentid);
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

	
$('body').on('click','.pix-search',function(event){
	
	initMeetingrooms();
	initBranchTree();
  $(".form_datetime").datetimepicker({
         autoclose: true,
         language: "zh-CN",
         isRTL: Metronic.isRTL(),
         format: "yyyy-mm-dd hh:ii",
         pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
    });
		
	refreshForm('MeetingSearchForm');
	$('#MeetingSearchModal').modal();
	
	
	
});
OriginalFormData['MeetingSearchForm'] = $('#MeetingSearchForm').serializeObject();


$('body').on('click','.btn-search',function(event){
	
	_searchParams=[];
	var starttime=$('input[name=starttime]').val();
	var endtime=$('input[name=endtime]').val();
	var locationid=_leftparentid;
	var branchid=_branchparentid;
	var meetingroomid=$("#ClassSelect").select2('val');
	if(starttime!=null && starttime.length>0){
		_searchParams.push({'name' : 'meeting.starttime','value': starttime});
	}
	if(endtime!=null && endtime.length>0){
		_searchParams.push({'name' : 'meeting.endtime','value': endtime});
	}
	if(locationid!=null){
		_searchParams.push({'name' : 'meeting.locationid','value': locationid});
	}
	if(meetingroomid!=null){
		_searchParams.push({'name' : 'meeting.meetingroomid','value': meetingroomid});
	}
	if(branchid!=null){
		_searchParams.push({'name' : 'meeting.bookbranchid','value': branchid});
	}

    $('#MeetingroomTable').dataTable()._fnAjaxUpdate();
	
	
	
});

$('body').on('click','.pix-export-excel',function(event){
	
	
	var table =$('#MeetingroomTable').DataTable();
	var params=table.ajax.params();
	var querystr="";
	for(var key in params){
		querystr+=key+"="+params[key]+"&";	
	}
	var exportUrl="meeting!exportmeetings.action?"+querystr;
	$(this).attr("href",exportUrl);
	
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
		'sAjaxSource' : 'meeting!list.action',
		'aoColumns' : [
		                {'sTitle' : '位置', 'mData' : 'locationname', 'bSortable' : false, 'sWidth' : '11%' },
		                {'sTitle' : '会议室', 'mData' : 'meetingroomname', 'bSortable' : false, 'sWidth' : '11%' },
		                {'sTitle' : '主题', 'mData' : 'subject', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '开始时间', 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '12%' },
		                {'sTitle' : '结束时间', 'mData' : 'endtime', 'bSortable' : false, 'sWidth' : '12%' },
		                {'sTitle' : '预定人', 'mData' : 'bookstaffname', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '预定部门', 'mData' : 'bookbranchname', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : '', 'mData' : 'meetingroomid', 'bSortable' : false, 'sWidth' : '12%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		    $('td:eq(3)',nRow).html(moment(aData.starttime).format('YYYY-MM-DD HH:mm'));
		    $('td:eq(4)',nRow).html(moment(aData.endtime).format('YYYY-MM-DD HH:mm'));
			var buttonhtml = '';
			buttonhtml += '<div class="util-btn-margin-bottom-5">';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-meetingdtl"><i class="fa fa-edit"></i> 详情</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			buttonhtml += '</div>';
			$('td:eq(7)', nRow).html(buttonhtml);
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
	this.initLeftLocationTree();
	this.initEvent();

	
};


