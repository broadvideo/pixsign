var CurStudent = null;
var CurClassid = null;

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
	'sAjaxSource' : 'event!list.action',
	'aoColumns' : [ {'sTitle' : '事件名', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' },
	                {'sTitle' : '考勤位置', 'mData' : 'roomname', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '开始时间', 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '结束时间', 'mData' : 'endtime', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : '', 'mData' : 'eventid', 'bSortable' : false, 'sWidth' : '8%' },
					{'sTitle' : '', 'mData' : 'eventid', 'bSortable' : false, 'sWidth' : '8%' }],
				
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		
		 $('td:eq(2)',nRow).html(function(){
			 if(aData.starttime!=null){
				   return moment(aData.starttime).format('YYYY-MM-DD HH:mm');
			    }else{
				   return null;
			   }
			 
		 });
		 $('td:eq(3)',nRow).html(function(){
			 
			 if(aData.endtime!=null){
				   return moment(aData.endtime).format('YYYY-MM-DD HH:mm') 
			    }else{
				   return null;
			   }
			 
			 
		 });

		$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
		

		return nRow;
	},
	'fnServerParams': function(aoData) { 
	
		aoData.push({'name':'event.roomtype','value':2 });

	}
});

$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').select2();
$('#MyTable').css('width', '100%').css('table-layout', 'fixed');



$('body').on('click','.pix-enable',function(event){
	
	updateEnableflag(event,'1');
});

$('body').on('click','.pix-disable',function(event){
	
	updateEnableflag(event,'0');

});

function updateEnableflag(event,enableflag){
	
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurRow = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm('确认启用/禁用该考勤模式：' + CurRow.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'attendancescheme!updateenableflag.action',
				cache: false,
				data : {
					'attendancescheme.attendanceschemeid': CurRow.attendanceschemeid,
					'attendancescheme.enableflag': enableflag
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
	
	
}

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurRow = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.remove + CurRow.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'event!delete.action',
				cache: false,
				data : {
					'event.eventid': CurRow.eventid
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
FormValidateOption.rules['event.name'] = {};
FormValidateOption.rules['event.name']['required'] = true;
FormValidateOption.rules['event.roomid'] = {};
FormValidateOption.rules['event.roomid']['required'] = true;

FormValidateOption.submitHandler = function(form) {
	

	
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data :  $('#MyEditForm').serialize(),
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
	$('#MyEditForm').attr('action', 'event!add.action');
	$('#MyEditModal').modal();
	$("#ClassSelect").select2('val','');
	$("#ClassSelect").prop("disabled", false);

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
		if(name=='starttime' || name=='endtime'){
			formdata['event.' + name] =moment(item[name]).format('YYYY-MM-DD HH:mm') 
		}else{
		    formdata['event.' + name] = item[name];
	    }
		
		
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'event!update.action');
	$('#MyEditModal').modal();
	$("#ClassSelect").select2('val',item.roomid);
	//$("#ClassSelect").prop("disabled", true);


});

$.ajax({
	type : 'GET',
	url : 'room!list.action?room.type=2',
	data : {"iDisplayStart" :0,"iDisplayLength" :999},
	dataType: 'json',
	success : function(data, status) {
		if (data.errorcode == 0) {
			var classlist = [];
			for (var i=0; i<data.aaData.length; i++) {
				classlist.push({
					id: data.aaData[i].roomid,
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



$(".form_datetime").datetimepicker({
    autoclose: true,
    isRTL: Metronic.isRTL(),
    format: "yyyy-mm-dd hh:ii",
    language:  'zh-CN',
    pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
});



function initTimeconfigs(type,timeconfigs){
	
     
	$.each(timeconfigs,function(index,value,arr){
    
		var tmpId='tmp'+type+'_attendance_times';
		var attendanceTimesTmp=$('#'+tmpId).clone();
		attendanceTimesTmp.css("display","block").removeAttr("id");
		
		if(type=='0'){
			    
			    //初始化timerpicker
			    $('.timepicker-24').timepicker({
			        autoclose: true,
			        minuteStep: 5,
			        showSeconds: false,
			        showMeridian: false,
			        defaultTime: false
			        });
			
			    // handle input group button click
			    $('.timepicker').parent('.input-group').on('click', '.input-group-btn', function(e){
			        e.preventDefault();
			        $(this).parent('.input-group').find('.timepicker').timepicker('showWidget');
			    });
			    attendanceTimesTmp.find('input[name=shortstarttime]').attr("value",value.shortstarttime);
			    attendanceTimesTmp.find('input[name=shortendtime]').attr("value",value.shortendtime);
			    attendanceTimesTmp.find('input[name=eventname]').attr('value',value.eventname);

			   
		}else if(type=='1'){
			
		    attendanceTimesTmp.find('input[name=beforeminstart]').attr("value",value.beforeminstart);
		    attendanceTimesTmp.find('input[name=afterminend]').attr("value",value.afterminend);
		}else if(type=='2'){
			
	        $(".form_datetime").datetimepicker({
	            autoclose: true,
	            isRTL: Metronic.isRTL(),
	            format: "yyyy-mm-dd hh:ii",
	            pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
	        });
			
			
		}
		
		$("div.form-body").append(attendanceTimesTmp.prop("outerHTML"));

	
	});
	
	
	
}
