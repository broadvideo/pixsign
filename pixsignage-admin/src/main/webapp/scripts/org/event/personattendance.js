var CurRecord = null;
var  CurRecordid=-1;
var _leftparentid=null;
var _leftparent=null;
var _branchparentid=null;
var  _searchParams=[];

var PersonAttendanceModule=function(){


};
var refresh = function () {
	
	$('#MyTable').dataTable()._fnAjaxUpdate();
	$('.pix-add').css('display', '');
};


function refreshMyTable(){
	$('#MyTable').dataTable()._fnAjaxUpdate();
};

PersonAttendanceModule.prototype.initEvent=function(){
	

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%').css('table-layout', 'fixed');


OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
$('body').on('click','.pix-search',function(event){
	
  $(".form_datetime").datetimepicker({
         autoclose: true,
         language: "zh-CN",
         isRTL: Metronic.isRTL(),
         format: "yyyy-mm-dd hh:ii",
         pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
    });
		
	refreshForm('MySearchForm');
	$('#MeetingSearchModal').modal();
	
	
	
});

$('body').on('click','.pix-search',function(event){
	
  $(".form_datetime").datetimepicker({
         autoclose: true,
         language: "zh-CN",
         isRTL: Metronic.isRTL(),
         format: "yyyy-mm-dd hh:ii",
         pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
    });
		
	refreshForm('MySearchForm');
	$('#MySearchModal').modal();
});
	
	
OriginalFormData['MySearchForm'] = $('#MySearchForm').serializeObject();


$('body').on('click','.btn-search',function(event){
	
	_searchParams=[];
	var starttime=$('input[name=starttime]').val();
	var endtime=$('input[name=endtime]').val();
	if(starttime!=null && starttime.length>0){
		_searchParams.push({'name' : 'attendancelog.starttime','value': starttime});
	}
	if(endtime!=null && endtime.length>0){
		_searchParams.push({'name' : 'attendancelog.endtime','value': endtime});
	}
    $('#MyTable').dataTable()._fnAjaxUpdate();
	
	
	
});



};


PersonAttendanceModule.prototype.initMyTable = function () {
	

	$('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'personattendance!list.action',
		'aoColumns' : [
                        {'sTitle' : '事件名称', 'mData' : 'eventname', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '终端', 'mData' : 'terminalname', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '考勤位置', 'mData' : 'roomname', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '考勤人员', 'mData' : 'personname', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : '考勤时间', 'mData' : 'signtime', 'bSortable' : false, 'sWidth' : '20%' }

		                
		                
		               ],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		    $('td:eq(4)',nRow).html(moment(aData.signtime).format('YYYY-MM-DD HH:mm'));
	
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	
			if(_searchParams.length>0){
				
			     for(var key in _searchParams){
			    	 aoData.push(_searchParams[key]); 
			     }
			}

		}
	});
	$('#MyTable_wrapper').addClass('form-inline');
	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
};


PersonAttendanceModule.prototype.init=function(){
	this.initMyTable();
	this.initEvent();

	
};


