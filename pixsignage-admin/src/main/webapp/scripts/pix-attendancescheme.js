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
	'sAjaxSource' : 'attendancescheme!list.action',
	'aoColumns' : [ {'sTitle' : '类型', 'mData' : 'type', 'bSortable' : false, 'sWidth' : '10%' },
	                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '考勤次数', 'mData' : 'amount', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : '创建时间', 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : '状态', 'mData' : 'enableflag', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : '', 'mData' : 'attendanceschemeid', 'bSortable' : false, 'sWidth' : '8%' },
					{'sTitle' : '', 'mData' : 'attendanceschemeid', 'bSortable' : false, 'sWidth' : '8%' },
					{'sTitle' : '', 'mData' : 'attendanceschemeid', 'bSortable' : false, 'sWidth' : '8%' }],
				
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		
		 $('td:eq(0)',nRow).html(function(){
			 
			if(aData.type=='0'){
				return '按天考勤';
			}else if(aData.type=='1'){
				
				return '按课程考勤';
			}else{
				
				return '自定义考勤';
			}
			 
		 });
		 $('td:eq(4)',nRow).html(function(){
			 
			 if(aData.enableflag=='1'){
				 
				 return '启用';
			 }else{
				 
				 return '禁用';
			 }
			 
		 });
		 $('td:eq(2)',nRow).html(function(){
			 
			 if(aData.type=='1'){
				 
				 return '课表节数';
			 }
			 
			 return aData.amount;
			 
			 
			 
		 });
		
	    $('td:eq(3)',nRow).html(moment(aData.createtime).format('YYYY-MM-DD HH:mm'));
		$('td:eq(5)', nRow).html(function(){
			if(aData.enableflag=='0'){//禁用状态
				
				return '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-enable"><i class="fa fa-edit"></i>启用</a>';
				
			}else{//启用状态
				return '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-disable"><i class="fa fa-edit"></i>禁用</a>';
	
			}
			
			
		});
		$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(7)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
		

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

function collectTimeconfig(){
	
	var selectedType=$("#ClassSelect").val();
	var dataArr=[];
	if(selectedType=='0'){//按天考勤
		
		$('#MyEditModal div.form-body').find('div.attendance-times').each(function(){
			
			var eventname=$(this).find('input[name=eventname]').val();
			var shortstarttime= $(this).find('input[name=shortstarttime]').val();
			var shortendtime=$(this).find('input[name=shortendtime]').val();
			if(shortstarttime!=null && shortendtime!=null){
				var dataJson={};
				dataJson.eventname=eventname;
				dataJson.shortstarttime=shortstarttime;
				dataJson.shortendtime=shortendtime;
				dataArr.push(dataJson);
			}
			
		});
		
	}else if(selectedType=='1'){//按课表考勤
		
		$('#MyEditModal div.form-body').find('div.attendance-times').each(function(){

			var beforeminstart= $(this).find('input[name=beforeminstart]').val();
			var afterminend=$(this).find('input[name=afterminend]').val();
			if(beforeminstart!=null && afterminend!=null){
				var dataJson={};
				dataJson.beforeminstart=beforeminstart;
				dataJson.afterminend=afterminend;
				dataArr.push(dataJson);
			}
			
		});
		
		
	}
	return dataArr;
	
	
	
}

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
				url : 'attendancescheme!delete.action',
				cache: false,
				data : {
					'attendancescheme.attendanceschemeid': CurRow.attendanceschemeid
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
FormValidateOption.rules['attendancescheme.name'] = {};
FormValidateOption.rules['attendancescheme.name']['required'] = true;
FormValidateOption.rules['attendancescheme.type'] = {};
FormValidateOption.rules['attendancescheme.type']['required'] = true;

FormValidateOption.submitHandler = function(form) {
	
	//collectJsonData();
	var timeconfig=collectTimeconfig();
	
	$('#MyEditForm').find('input[name="attendancescheme.timeconfig"]').val(JSON.stringify(timeconfig));
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
	$('#MyEditModal div.form-body').find('div.attendance-times').remove();
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'attendancescheme!add.action');
	$('#MyEditModal').modal();
	$("#ClassSelect").select2('val','');
	$("#ClassSelect").prop("disabled", false);

	$('#preview').html('')

});			


$('body').on('click', '.pix-update', function(event) {
	$('#MyEditModal div.form-body').find('div.attendance-times').remove();
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var item = $('#MyTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in item) {
		formdata['attendancescheme.' + name] = item[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'attendancescheme!update.action');
	$('#MyEditModal').modal();
	$("#ClassSelect").select2('val',item.type);
	$("#ClassSelect").prop("disabled", true);
	initTimeconfigs(item.type,JSON.parse(item.timeconfig));


});

$("#ClassSelect").select2({
	placeholder: common.tips.detail_select,
	minimumInputLength: 0,
	data: [{'id':0,'text':'按天考勤'},{'id':1,'text':'按课表考勤'},{'id':2,'text':'自定义考勤'}],
	dropdownCssClass: "bigdrop", 
	escapeMarkup: function (m) { return m; } 
});

$("a[name='rmattendancetimes']").live('click',function(){
	
	$(this).closest("div.form-group").remove();
	
	
});
$("a[name='addattendancetimes']").click(function(){
	
	var  selectedVal=$('#ClassSelect').val();
	if(selectedVal.length==0){
		bootbox.alert("请先选择考勤类型!");
		return;		
	}
	var tmpId='tmp'+selectedVal+'_attendance_times';
	var attendanceTimesTmp=$('#'+tmpId).clone();
	attendanceTimesTmp.css("display","block").removeAttr("id");
	$("div.form-body").append(attendanceTimesTmp.prop("outerHTML"));
	if(selectedVal=='0'){
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
	}else if(selectedVal=='2'){
		
        $(".form_datetime").datetimepicker({
            autoclose: true,
            isRTL: Metronic.isRTL(),
            format: "yyyy-mm-dd hh:ii",
            pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
        });
		
		
	}
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
