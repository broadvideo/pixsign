function  doSaveValidate(){
	
 var data=collectionJsonData();
	
	
	
}

function  collectionJsonData(){
	
	
	var morningArr=[];
	var afternoonArr=[];
	var nightArr=[];
	
	$("div.morning-periods-group").each(function(){
		var morningJson={};
		var periodnum=$(this).find("input[name=periodnum]").val();
		var shortstarttime=$(this).find("input[name=shortstarttime]").val();
		var shortendtime=$(this).find("input[name=shortendtime]").val();
		var periodtimedtlid=$(this).find("input[name=periodtimedtlid]").val();
		morningJson['periodnum']=periodnum;
		morningJson['shortstarttime']=shortstarttime;
		morningJson['shortendtime']=shortendtime;
		if(periodtimedtlid!=null){
		   morningJson['periodtimedtlid']=periodtimedtlid;
		}
		morningArr.push(morningJson);

	});
	
	$("div.afternoon-periods-group").each(function(){
		var afternoonJson={};
		var periodnum=$(this).find("input[name=periodnum]").val();
		var shortstarttime=$(this).find("input[name=shortstarttime]").val();
		var shortendtime=$(this).find("input[name=shortendtime]").val();
		var periodtimedtlid=$(this).find("input[name=periodtimedtlid]").val();

		afternoonJson['periodnum']=periodnum;
		afternoonJson['shortstarttime']=shortstarttime;
		afternoonJson['shortendtime']=shortendtime;
		if(periodtimedtlid!=null){
			afternoonJson['periodtimedtlid']=periodtimedtlid;
			}

		afternoonArr.push(afternoonJson);

	});
	
	$("div.night-periods-group").each(function(){
		var nightJson={};
		var periodnum=$(this).find("input[name=periodnum]").val();
		var shortstarttime=$(this).find("input[name=shortstarttime]").val();
		var shortendtime=$(this).find("input[name=shortendtime]").val();
		var periodtimedtlid=$(this).find("input[name=periodtimedtlid]").val();

		nightJson['periodnum']=periodnum;
		nightJson['shortstarttime']=shortstarttime;
		nightJson['shortendtime']=shortendtime;
		if(periodtimedtlid!=null){
			nightJson['periodtimedtlid']=periodtimedtlid;
			}
		nightArr.push(nightJson);

	});
	

	var periodDtlJson={};
	var coursescheduleschemeid=$("input[name=coursescheduleschemeid]").val();
	periodDtlJson.coursescheduleschemeid=coursescheduleschemeid;
	periodDtlJson["morningperiodtimedtls"]=morningArr;
	periodDtlJson["afternoonperiodtimedtls"]=afternoonArr;
	periodDtlJson["nightperiodtimedtls"]=nightArr;
	
	return  periodDtlJson;

	
		
	
}
function  initPeriodtimedtl(){
	
	var coursescheduleschemeid=$("input[name=coursescheduleschemeid]").val();
	  $.ajax({
        url: 'courseschedulescheme!getperiodtimedtl.action?courseschedulescheme.coursescheduleschemeid='+coursescheduleschemeid,
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async:false,
        success: function (result) {
      	  
            switch (result.errorcode) {
          
                case 0:
              	  
          		  $("div.portlet-body").setTemplateElement("temp_edit_periods");
              	  var totalPeriods=result.courseschedulescheme.morningperiods + result.courseschedulescheme.afternoonperiods +result.courseschedulescheme.nightperiods;
              	  var dtlTotal=result.courseschedulescheme.morningperiodtimedtls.length + result.courseschedulescheme.afternoonperiodtimedtls.length +result.courseschedulescheme.nightperiodtimedtls.length;
              	  if(totalPeriods == dtlTotal){
              		  $("div.portlet-body").setTemplateElement("temp_edit_periods");
              	  }else{
              		  $("div.portlet-body").setTemplateElement("temp_add_periods");
              	  }
                    $("div.portlet-body").processTemplate(result.courseschedulescheme);
                    
                    //初始化timerpicker
                    $('.timepicker-24').timepicker({
                        autoclose: true,
                        minuteStep: 5,
                        showSeconds: false,
                        showMeridian: false,
                        defaultTime:false
                    });
                    $('input[name=shortstarttime]').timepicker().on('hide.timepicker', function(e) {
                    	
                    	
                         if(e.time.value!="" && e.time.value!=null && e.time.value!="0:00"){
                        	 var minutes=e.time.minutes;
                        	 var hours=e.time.hours;
                        	 var endMinutes=minutes+40;
                        	 var addHours= Math.floor(endMinutes/60);
                        	 var endHours=hours+addHours;
                        	 endMinutes=endMinutes-(60*addHours)
                        	 $(this).closest("div.form-group").find("input[name=shortendtime]").timepicker('setTime', endHours+":"+endMinutes);
                         }
                       
                      });
                    break;

                case -1:
          			bootbox.alert(result.errorcode + ": " + result.errormsg);
                    break;
               
            }
        }
    });
	
}


//初始化操作栏按钮动作
function initaction() {
	
	  initPeriodtimedtl();
	
      $("#action_submit_add").click(function () {
    	  
    	  $.ajax({
              url: 'courseschedulescheme!addpreiodtimedtl.action',
              type: 'POST',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify(collectionJsonData()),
              dataType: 'json',
              success: function (result) {
                  switch (result.errorcode) {
                    
                      case 0:
                    	  
          				   bootbox.alert(common.tips.success);
          				   initPeriodtimedtl();
                         // $("#modal_add_schedule_config").modal("toggle");
                         // $('#scheduleConfigList').DataTable().ajax.reload(null, false);
                          break;
                   
                      case -1:
                			bootbox.alert(result.errorcode + ": " + result.errormsg);
                          break;
                   
                  }
              }
          });
      });
      
      $("#action_submit_edit").live('click',function () {
    	  
    	  $.ajax({
              url: 'courseschedulescheme!updateperiodtimedtl.action',
              type: 'POST',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify(collectionJsonData()),
              dataType: 'json',
              success: function (result) {
                  switch (result.errorcode) {
               
                      case 0:
                    	  bootbox.alert(common.tips.success);
                    	 // $("#modal_add_schedule_config").modal("toggle");
                        //  $('#scheduleConfigList').DataTable().ajax.reload(null, false);
                          break;
                      case -1:
                    	  bootbox.alert(result.errorcode + ": " + result.errormsg);
                          break;
                 
                  }
              }
          });
      });

   
}
// list初始化
var Custom =function () {	
	

    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
  

            //按钮行为初始化
            initaction();
        }
    };
}();