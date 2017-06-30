function  doSaveValidate(){
	
 var data=collectionJsonData();
	
	
	
}

function  collectionJsonData(){
	
	
	var morningArr=[];
	var afternoonArr=[];
	var nightArr=[];
	
	$("div.morning-periods-group").each(function(){
		var morningJson={};
		var periodNum=$(this).find("input[name=periodNum]").val();
		var shortStartTime=$(this).find("input[name=shortStartTime]").val();
		var shortEndTime=$(this).find("input[name=shortEndTime]").val();
		var dtlId=$(this).find("input[name=dtlId]").val();
		morningJson['periodnum']=periodNum;
		morningJson['shortstarttime']=shortStartTime;
		morningJson['shortendtime']=shortEndTime;
		if(dtlId!=null){
		   morningJson['id']=dtlId;
		}
		morningArr.push(morningJson);

	});
	
	$("div.afternoon-periods-group").each(function(){
		var afternoonJson={};
		var periodNum=$(this).find("input[name=periodNum]").val();
		var shortStartTime=$(this).find("input[name=shortStartTime]").val();
		var shortEndTime=$(this).find("input[name=shortEndTime]").val();
		var dtlId=$(this).find("input[name=dtlId]").val();

		afternoonJson['periodnum']=periodNum;
		afternoonJson['shortstarttime']=shortStartTime;
		afternoonJson['shortendtime']=shortEndTime;
		if(dtlId!=null){
			afternoonJson['id']=dtlId;
			}

		afternoonArr.push(afternoonJson);

	});
	
	$("div.night-periods-group").each(function(){
		var nightJson={};
		var periodNum=$(this).find("input[name=periodNum]").val();
		var shortStartTime=$(this).find("input[name=shortStartTime]").val();
		var shortEndTime=$(this).find("input[name=shortEndTime]").val();
		var dtlId=$(this).find("input[name=dtlId]").val();

		nightJson['periodnum']=periodNum;
		nightJson['shortstarttime']=shortStartTime;
		nightJson['shortendtime']=shortEndTime;
		if(dtlId!=null){
			nightJson['id']=dtlId;
			}
		nightArr.push(nightJson);

	});
	

	var periodDtlJson={};
	var scheduleSchemeId=$("input[name=scheduleSchemeId]").val();
	periodDtlJson.id=scheduleSchemeId;
	periodDtlJson["morningPeriodTimeDtls"]=morningArr;
	periodDtlJson["afternoonPeriodTimeDtls"]=afternoonArr;
	periodDtlJson["nightPeriodTimeDtls"]=nightArr;
	
	return  periodDtlJson;

	
		
	
}


//初始化操作栏按钮动作
function initaction() {
	
	 var scheduleSchemeId=$("input[name=scheduleSchemeId]").val();
	  $.ajax({
          url: 'courseschedulescheme!getperiodtimedtl.action?scheduleScheme.id='+scheduleSchemeId,
          type: 'Get',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          async:false,
          success: function (result) {
              switch (result.retcode) {
                  case -90:
                      bootbox.alert(common.tips.t00, function () {
                          document.location.href = ctx + "/login.action";
                      });
                      break;
                  case 1:
                	  
            		  $("div.portlet-body").setTemplateElement("temp_edit_periods");

                	  var totalPeriods=result.data.morningperiods + result.data.afternoonperiods +result.data.nightperiods;
                	  var dtlTotal=result.data.morningPeriodTimeDtls.length + result.data.afternoonPeriodTimeDtls.length +result.data.nightPeriodTimeDtls.length;
                	  if(totalPeriods == dtlTotal){
                		  $("div.portlet-body").setTemplateElement("temp_edit_periods");
                	  }else{
                		  $("div.portlet-body").setTemplateElement("temp_add_periods");
                	  }
                      $("div.portlet-body").processTemplate(result.data);
                      
                      //初始化timerpicker
                      $('.timepicker-24').timepicker({
                          autoclose: true,
                          minuteStep: 5,
                          showSeconds: false,
                          showMeridian: false,
                          defaultTime:false
                      });
                      $('input[name=shortStartTime]').timepicker().on('hide.timepicker', function(e) {
                      	
                      	
                           if(e.time.value!="" && e.time.value!=null && e.time.value!="0:00"){
                          	 var minutes=e.time.minutes;
                          	 var hours=e.time.hours;
                          	 var endMinutes=minutes+40;
                          	 var addHours= Math.floor(endMinutes/60);
                          	 var endHours=hours+addHours;
                          	 endMinutes=endMinutes-(60*addHours)
                          	 $(this).closest("div.form-group").find("input[name=shortEndTime]").timepicker('setTime', endHours+":"+endMinutes);
                           }
                         
                        });
                      break;
                  case -2:
                      toastr.warning(common.tips.t10);
                      break;
                  case -3:
                      toastr.error("操作异常！");
                      break;
                  case -4:
                      toastr.error("数据校验失败，请按要求填写表单！");
                      break;
              }
          }
      });
	
      $("#action_submit_add").click(function () {
    	  
    	  $.ajax({
              url: 'courseschedulescheme!addpreiodtimedtl.action',
              type: 'POST',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify(collectionJsonData()),
              dataType: 'json',
              success: function (result) {
                  switch (result.retcode) {
                      case -90:
                          bootbox.alert(common.tips.t00, function () {
                              document.location.href = ctx + "/login.action";
                          });
                          break;
                      case 1:
                          toastr.success("添加课表方案成功。");
                          $("#modal_add_schedule_config").modal("toggle");
                          $('#scheduleConfigList').DataTable().ajax.reload(null, false);
                          break;
                      case -2:
                          toastr.warning(common.tips.t10);
                          break;
                      case -3:
                          toastr.error("操作异常！");
                          break;
                      case -4:
                          toastr.error("数据校验失败，请按要求填写表单！");
                          break;
                  }
              }
          });
      });
      
      $("#action_submit_edit").click(function () {
    	  
    	  $.ajax({
              url: 'courseschedulescheme!updateperiodtimedtl.action',
              type: 'POST',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify(collectionJsonData()),
              dataType: 'json',
              success: function (result) {
                  switch (result.retcode) {
                      case -90:
                          bootbox.alert(common.tips.t00, function () {
                              document.location.href = ctx + "/login.action";
                          });
                          break;
                      case 1:
                          toastr.success("修改课表方案成功。");
                          $("#modal_add_schedule_config").modal("toggle");
                          $('#scheduleConfigList').DataTable().ajax.reload(null, false);
                          break;
                      case -2:
                          toastr.warning(common.tips.t10);
                          break;
                      case -3:
                          toastr.error("操作异常！");
                          break;
                      case -4:
                          toastr.error("数据校验失败，请按要求填写表单！");
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
            
            //toastr初始化
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "progressBar": false,
                "positionClass": "toast-bottom-center",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            //按钮行为初始化
            initaction();
        }
    };
}();