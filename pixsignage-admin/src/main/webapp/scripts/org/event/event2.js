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
	'aoColumns' : [ 
	                {'sTitle' : '考勤分组', 'mData' : 'roomname', 'bSortable' : false, 'sWidth' : '15%' },
	                {'sTitle' : '事件名', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
	                {'sTitle' : '类型', 'mData' : 'type', 'bSortable' : false, 'sWidth' : '8%' },
					{'sTitle' : '开始日期', 'mData' : 'startdate', 'bSortable' : false, 'sWidth' : '10%' },
					{'sTitle' : '结束日期', 'mData' : 'enddate', 'bSortable' : false, 'sWidth' : '10%' },
					{'sTitle' : '时间段', 'mData' : 'shortstarttime', 'bSortable' : false, 'sWidth' : '10%' },
					{'sTitle' : '', 'mData' : 'eventid', 'bSortable' : false, 'sWidth' : '10%' },
					{'sTitle' : '', 'mData' : 'eventid', 'bSortable' : false, 'sWidth' : '10%' }],
				
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		

		 $('td:eq(2)',nRow).html(function(){
			 if(aData.type=='0'){
				   return '每天';
			    }else if(aData.type=='1'){
			    	return '工作日';
			    }else if(aData.type=='2'){
			    	
			    	return '自定义';
			    }
			 
		 });
		 $('td:eq(3)',nRow).html(function(){
			 if(aData.startdate!=null){
				   return moment(aData.startdate).format('YYYY-MM-DD');
			    }else{
				   return null;
			   }
			 
		 });
		 $('td:eq(4)',nRow).html(function(){
			 
			 if(aData.enddate!=null){
				   return moment(aData.enddate).format('YYYY-MM-DD')
			    }else{
				   return null;
			   }
			 
			 
		 });
		 $('td:eq(5)',nRow).html(function(){
			 if(aData.type=='0' || aData.type=='1'){
			 if(aData.shortstarttime!=null && aData.shortendtime!=null){
				
				   return moment(aData.shortstarttime).format('HH:mm')+"-"+moment(aData.shortendtime).format('HH:mm');
			    }else{
				   return null;
			   }
			 }else{
				 
				 return null;
			 }
		 });
		 

		$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(7)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
		

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
FormValidateOption.rules['event.startdate'] = {};
FormValidateOption.rules['event.startdate']['required'] = true;
FormValidateOption.rules['event.enddate'] = {};
FormValidateOption.rules['event.enddate']['required'] = true;
FormValidateOption.rules['event.shortstarttime'] = {};
FormValidateOption.rules['event.shortstarttime']['required'] = true;
FormValidateOption.rules['event.shortendtime'] = {};
FormValidateOption.rules['event.shortendtime']['required'] = true;

function validateHHmm(shorttime){
	
	  var reg=/^[0-2]?[0-9]:[0-5][0-9]$/i;
	  if(!reg.test(shorttime) ){
	    	console.log('shorttime:%s时间格式不合法！',shorttime);
	    	return false;
	    }
	
	  return true;
}

function validateRangeDate(startdate,enddate){
	
	var startdatewrap=new Date(startdate+' '+'00:00:00');
	var enddatewrap=new Date(enddate+' '+'00:00:00');
	if(startdatewrap.getTime()<=enddatewrap.getTime()){
		return true;
	}
	
	return false;
}

function validateRangeShorttime(shortstarttime,shortendtime){
	
	var dt1=new Date('1997-01-01'+' '+shortstarttime);
	var dt2=new Date('1997-01-01'+' '+shortendtime);
	if(dt1.getTime()<dt2.getTime()){
		return true;
	}
	
	return false;
}

FormValidateOption.submitHandler = function(form) {
	
	var checkedRadio=$('input[name="event.type"]:checked');
	var  checkedflag=$(checkedRadio).val();
	var eventdtls=[];
	var startdate=$('#startdate').attr("value");
	var enddate=$('#enddate').attr("value");
	var shortstarttime=$('#shortstarttime').val();
	var shortendtime=$('#shortendtime').val();
	if(startdate==null || enddate==null){
			alert("日期不允许为空！");
			return;
	 }
	if(!validateRangeDate(startdate,enddate)){
			alert("日期开始时间不能大于结束时间！");
			return;
	  }
	if($.trim(shortstarttime)=='' || $.trim(shortendtime)==''){
			alert("时间段不允许为空！");
			return;
		}
	if(!validateHHmm(shortstarttime) || !validateHHmm(shortendtime)){
			
			alert("时间格式不正确！");
			return;
	}
	
	if(!validateRangeShorttime(shortstarttime,shortendtime)){
			alert("时间段开始时间必须小于结束时间！");
			return;
	}
	if(checkedflag=='2'){
	   
		$('div.week-form-group').each(function(){
			var eventdtl={};
			 var dayofweekchk=$(this).find('input[name=dayofweek]');
			 if(dayofweekchk.is(':checked')){
				 var dayofweek=$(dayofweekchk).attr('value');
				 var shortstarttime=$(this).find("input[name=shortstarttime]").val();
				 var shortendtime=$(this).find("input[name=shortendtime]").val();
				 if($.trim(shortstarttime)=='' || $.trim(shortendtime)==''){
				      console.log("Invalid data:shortstarttime:%s,shortendtime:%s",shortstarttime,shortendtime);

				 }
				eventdtl={'dayofweek': dayofweek,'shortstarttime':shortstarttime,'shortendtime':shortendtime};
			    eventdtls.push(eventdtl);
			 }
			
		});
		if(eventdtls.length==0){
			
		   alert('自定义时间段不能为空！');
		   return;
		}
		for(var i=0;i<eventdtls.length;i++){
		  var eventdtl= eventdtls[i];
		  if($.trim(eventdtl.shortstarttime)=='' || $.trim(eventdtl.shortendtime)==''){
			  alert('请输入完整的时间段！');
			  return;
		  }
		  if(!validateHHmm(eventdtl.shortstarttime) || !validateHHmm(eventdtl.shortendtime) ){
  	    	   alert('时间格式不合法！');
  	    	return;
  	       }
		  if(!validateRangeShorttime(eventdtl.shortstarttime,eventdtl.shortendtime)){
			  
				alert("时间段开始时间必须小于结束时间！");
			  return;
		  }
		  
		  
		}
	}
	$('input[name="event.timedtls"]').attr('value',JSON.stringify(eventdtls));
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

function initEventForm(eventdtls){
	
    	var checkedRadio=$('input[name="event.type"]:checked');
		var  checkedflag=$(checkedRadio).val();
		
		if(checkedflag=='0' || checkedflag=='1'){ //每天或者工作日考勤
			$('div.week-form-group input[type=text]').attr('value','');
			$('div.week-form-group').hide();
		}else if(checkedflag=='2'){//自定义考勤
			
			$('div.week-form-group input').attr('value','');
			var  checkedCheckers= $("input[name='dayofweek']:lt(5)");
			var uncheckedCheckers=$("input[name='dayofweek']:gt(4)");
			var dayofweek=1;
			$.each(checkedCheckers,function(idx,obj){
				$(obj).attr("value",dayofweek);
				$(obj).attr("checked",true)
			    $.uniform.update($(obj));
			    dayofweek++;
			});
			$.each(uncheckedCheckers,function(idx,obj){
				$(obj).attr("checked",false);
				$(obj).attr("value",dayofweek);
			    dayofweek++;
	            $.uniform.update($(obj));
		     });
			$('div.week-form-group').each(function(){
				var dayofweekchk=  $(this).find('input[name=dayofweek]');
				if($(dayofweekchk).is(':checked')){
					$(this).find('input[name=shortstarttime]').attr('value',$('#shortstarttime').val());
					$(this).find('input[name=shortendtime]').attr('value',$('#shortendtime').val());
				}
			});
			//初始化数据
			if(eventdtls!=null){
			$('div.week-form-group input[type=text]').attr('value','');
		    $('input[name=dayofweek]').removeAttr("checked");
			 $.uniform.update($('input[name=dayofweek]'));
			 $.each(eventdtls,function(idx,eventdtl){
				 var dayofweek=eventdtl.dayofweek;
				 var shortstarttime=eventdtl.shortstarttime;
				 var shortendtime=eventdtl.shortendtime;
				 var dayofweekchk='input[name=dayofweek][value='+dayofweek+']';
				 $(dayofweekchk).attr("checked",true)
				 $.uniform.update($(dayofweekchk))
				 $(dayofweekchk).closest('.week-form-group').find('input[name=shortstarttime]').attr('value',shortstarttime);
				 $(dayofweekchk).closest('.week-form-group').find('input[name=shortendtime]').attr('value',shortendtime);
				 
				 
			 });
				
				
				
			}
			
			
			$('div.week-form-group').show();
		}

	
	
}

$('input[name="event.type"]').click(function(){

	initEventForm();
	
});
$('body').on('click', '.pix-add', function(event) {
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'event!add.action');
	$('#MyEditModal').modal();
	$("#ClassSelect").select2('val','');
	$("#ClassSelect").prop("disabled", false);
	initEventForm();

});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var item = $('#MyTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in item) {
		if(name=='startdate' || name=='enddate'){
			formdata['event.' + name] =moment(item[name]).format('YYYY-MM-DD') 
		}else if(name=='shortstarttime' || name=='shortendtime'){
			formdata['event.' + name] =moment(item[name]).format('HH:mm') 
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
	initEventForm(item.eventdtls);

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
	            allowClear: true,
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





$('.date-picker').datepicker({
    rtl: Metronic.isRTL(),
    orientation: "left",
    language: "zh-CN",
    autoclose: true
  

});
//初始化timerpicker
$('.timepicker-24').timepicker({
    autoclose: true,
    minuteStep: 5,
    showSeconds: false,
    showMeridian: false,
    defaultTime:'00:00'
});
// handle input group button click
$('.timepicker').parent('.input-group').on('click', '.input-group-btn', function(e){
    e.preventDefault();
    $(this).parent('.input-group').find('.timepicker').timepicker('showWidget');
});

$(".form_datetime").datetimepicker({
    autoclose: true,
    isRTL: Metronic.isRTL(),
    format: "yyyy-mm-dd hh:ii",
    language: "zh-CN",
    pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
});

