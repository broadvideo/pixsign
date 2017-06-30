//初始化配置向导
function formWizard() {
	if (!jQuery().bootstrapWizard) {
		 return;
	}
	
  var handleTitle = function(tab, navigation, index) {
		 var total = navigation.find('li').length;
		 var current = index + 1;
		 // set done steps
		 jQuery('li', $('#form_wizard_1')).removeClass("done");
		 var li_list = navigation.find('li');
		 for (var i = 0; i < index; i++) {
			  jQuery(li_list[i]).addClass("done");
		 }
		 if (current == 1) {
			  $('#form_wizard_1').find('.button-previous').hide();
		 } else {
			  $('#form_wizard_1').find('.button-previous').show();
		 }
		 if (current >= total) {
			  $('#form_wizard_1').find('.button-next').hide();
			  $('#form_wizard_1').find('.button-submit').show();
		 } else {
			  $('#form_wizard_1').find('.button-next').show();
			  $('#form_wizard_1').find('.button-submit').hide();
		 }
	};
	// default form wizard
	$('#form_wizard_1').bootstrapWizard({
		 'nextSelector': '.button-next',
		 'previousSelector': '.button-previous',
		 onTabClick: function (tab, navigation, index, clickedIndex) {
			  return false;
		 },
		 onNext: function (tab, navigation, index) {
			  handleTitle(tab, navigation, index);
			  if(index==1){
				  initTab2();
				  
			  }
			
		 },
		 onPrevious: function (tab, navigation, index) {
			  handleTitle(tab, navigation, index);
			  if(index==2){
					$('#form_wizard_1 .button-next').removeAttr("disabled");
			  }				  
		 }
	});
	$('#form_wizard_1').find('.button-previous').hide();
	$('#form_wizard_1 .button-submit').click(function () {
		$("#loading").fadeIn();
		$("#bodyShade").fadeIn();
		$("#loading").fadeOut();
		$("#bodyShade").fadeOut();
	}).hide();
}
//比较选中的部分为黄色
function markSelectedRect(selObj){
	
	$('#scheduleTableList td.editable').each(function(){
		
    	$(this).css("background","none");

		
	});
	
	$(selObj).css("background","yellow");
	
	
	
}

$("#classroom_list").on("change",function(){

    if(validateTab1()){
    	
		$('#form_wizard_1 .button-next').removeAttr("disabled","disabled");

    }else{
		$('#form_wizard_1 .button-next').attr("disabled","disabled");
    }

});

function validateTab1(){
	
	var validateFlag=false;
	var scheduleSchemeVal=$("#schedule_scheme_list").val();
	var classroomVal=$("#classroom_list").val();
	if(scheduleSchemeVal.length==0 || classroomVal.length==0){
		validateFlag=false;

	}else{
		validateFlag=true;

	}
	
   return validateFlag;
}

//初始化tab1的课表方案下拉框
function initScheduleScheme(){
	$.ajax({
		url:  'courseschedulescheme!getenable.action',
		type : 'GET',
		contentType : 'application/json; charset=utf-8',
		timeout: 5000,
		async: false,
		dataType : 'json',
		success: function(result, textStatus){
			switch(result.retcode){
			case -90:
				bootbox.alert(common.tips.t00,function(){
					document.location.href=ctx+"/login.action";
				});
				break;
			case 1:
		     $("#schedule_scheme_list").html("");
		      $("#schedule_scheme_list").append("<option value=\""+result.data.id+"\">"+result.data.name+"</option>");
				break;
			case -2:
				toastr.warning(common.tips.t10);
				break;
			case -3:
				toastr.error(common.tips.t01);
				break;
			case -4:
				toastr.error(common.tips.t02);
				break;
			}
		},
		error : function(jqXHR, textStatus) {
			toastr.error("请求异常!" + textStatus);
		}
	});	
	
	
	
}
//初始化Tab1下拉框的教室列表
function initClassroom(){
	var jsonData={"pageSize" :1000};
	$.ajax({
		url: 'classroom!list.action',
		type : 'GET',
		contentType : 'application/json; charset=utf-8',
		timeout: 5000,
		async: false,
		data : jsonData,
		dataType : 'json',
		success: function(result, textStatus){
			switch(result.retcode){
			case -90:
				bootbox.alert(common.tips.t00,function(){
					document.location.href=ctx+"/login.action";
				});
				break;
			case 1:
			    $.each(result.data,function(index,val,array){
			    	 $("#classroom_list").append("<option value=\""+val.id+"\">"+val.name+"</option>");
			    });
				
				break;
			case -2:
				toastr.warning(common.tips.t10);
				break;
			case -3:
				toastr.error(common.tips.t01);
				break;
			case -4:
				toastr.error(common.tips.t02);
				break;
			}
		},
		error : function(jqXHR, textStatus) {
			toastr.error("请求异常！" + textStatus);
		}
	});	
	
	
	
}



function initTab1(){
	$('#form_wizard_1 .button-next').attr("disabled","disabled");
	initScheduleScheme();
	initClassroom();

}


function initTab2(){
   var scheduleSchemeId= $("#schedule_scheme_list").val();
   var classroomId=$("#classroom_list").val();
   if(!validateTab1()){
		toastr.warning("请选择课表方案和教室！");
		return;
   }
   $.ajax({
		url:  'courseschedulescheme!getperiodtimedtl.action?scheduleScheme.id='+scheduleSchemeId,
		type : 'GET',
		contentType : 'application/json; charset=utf-8',
		timeout: 5000,
		async: true,
		dataType : 'json',
		success: function(result, textStatus){
			switch(result.retcode){
			case -90:
				bootbox.alert(common.tips.t00,function(){
					document.location.href=ctx+"/login.action";
				});
				break;
			case 1:
				$("#tab2").setTemplateElement("temp_classroom_schedule");
				result.data.classroomname=$("#classroom_list :selected").text();
			    $("#tab2").processTemplate(result.data);
			    //初始化教室已经有的课表数据
			    initClassroomSchedule(classroomId,scheduleSchemeId);
			    //标记有效的workday
				var workdaysArr=result.data.workdays.split(",");
				$("#scheduleTableList td.editable").each(function(){
					var workday= $(this).attr("data-workday");
					var isExists=false;
					for(var key in  workdaysArr){
						if(workdaysArr[key]==workday){
							isExists=true;
							return;
						}						
					}
					if(!isExists){
						$(this).removeClass("editable");
						$(this).css("background-color","#F7F7F7")
						
					}
				});
				//定制td的click事件
			
			    $('#scheduleTableList td.editable').on('click',function(){
			    //	markSelectedRect(this);
			    	var periodTimeDtlId=$(this).parent().attr("data-id")
			    	var workday=$(this).attr("data-workday");
			    	var classroomId=$("#classroom_list").val();
			    	var scheduleId=$(this).attr("data-schedule-id");
			    	var initDataJson={"periodtimedtlid": periodTimeDtlId,"workday": workday,"coursescheduleschemeid":scheduleSchemeId,"classroomid": classroomId};
			    	var scheduleUrl='courseschedule!add.action';
			    	if(scheduleId!=null && scheduleId.length>0){
			    		initDataJson.coursename=$(this).find("div[name=coursename]").html();
			    		initDataJson.teachername=$(this).find("div[name=teachername]").html();
			    		initDataJson.scheduleid=scheduleId;
			    		scheduleUrl='courseschedule!update.action';
			    	}
			    	//对数据进行模版渲染
			        $("#nest_modal").empty();
			        $("#nest_modal").setTemplateElement("temp_edit_period_info");
			        $("#nest_modal").processTemplate(initDataJson);
			        $("#modal_edit_period_info").modal("toggle");
			        
		
			        // 新增操作
			        $("#action_submit_add").click(function () {
			        	
			            $('#form_edit_period_info').ajaxSubmit({
			                url: scheduleUrl,
			                type: 'POST',
			                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			                beforeSubmit: function (data) {
			                	var  subjectName=$("#form_edit_period_info input[name='schedule.coursename']").val();
			                	var  teacherName=$("#form_edit_period_info input[name='schedule.teachername']").val();
			                	if(subjectName=="" || subjectName.trim().length==0){
			                           toastr.warning("学科不允许为空！");
			                           $("#form_edit_period_info input[name='schedule.coursename']").focus();
			                           return false;
			                	}
			                	if(teacherName.trim().length==0){
			                           toastr.warning("上课老师不允许为空！！");
			                           $("#form_edit_period_info input[name='schedule.teachername']").focus();
			                           return false;
			                	}
			                
			                   
			                },
			                success: function (result) {
			                    switch (result.retcode) {
			                        case -90:
			                            bootbox.alert(common.tips.t00, function () {
			                                document.location.href = ctx + "/login.action";
			                            });
			                            break;
			                        case 1:
			                            toastr.success("操作成功！");
			                            $("#modal_edit_period_info").modal("toggle");
			                            //重新load数据
			                            initClassroomSchedule(classroomId,scheduleSchemeId);
			                            break;
			                        case -2:
			                            toastr.warning("添加失败：记录已经存在！");
			                            initClassroomSchedule(classroomId,scheduleSchemeId);
			                            break;
			                        case -3:
			                            toastr.error("操作异常！");
			                            break;
			                        case -4:
			                            toastr.error(common.tips.t02);
			                            break;
			                    }
			                }
			            });

			
			       });

			   });
			     
				break;
			case -2:
				toastr.warning(common.tips.t10);
				break;
			case -3:
				toastr.error(common.tips.t01);
				break;
			case -4:
				toastr.error(common.tips.t02);
				break;
			}
		},
		error : function(jqXHR, textStatus) {
			toastr.error(addInstant.tips.t05 + textStatus);
		}
	});	
	

}



function initClassroomSchedule(classroomId,scheduleSchemeId){
	//重置所有的编辑区域
	$("#scheduleTableList td.editable").html("");	
	$("#scheduleTableList td.editable").removeAttr("data-schedule-id");
        var jsonData = {"schedule.classroomid" : classroomId,"schedule.coursescheduleschemeid": scheduleSchemeId};
        $.ajax({
            url:  'courseschedule!classroomschedulelist.action',
            type: 'GET',
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            data: jsonData,
            dataType: 'json',
            success: function (result) {
                
                switch (result.retcode) {
                    case -90:
                        bootbox.alert(common.tips.t00, function () {
                            document.location.href = ctx + "/login.action";
                        });
                        break;
                    case 1:
                       $.each(result.data,function(index,item){
                        var td= $("#scheduleTableList tr[data-id='"+item.periodtimedtlid+"']").find("td[data-workday='"+item.workday+"']");
                       	$(td).setTemplateElement("temp_schedule_cell");
        			    $(td).processTemplate({"coursename" : item.coursename,"teachername": item.teachername,"scheduleId" : item.id});
        			    $(td).attr("data-schedule-id",item.id);
                       	
                       });
                       //初始化操作按钮，选择操作
	                 $("#sel_schedule").off("click").on("click",function(){
	                	 
	                	if($("td.editable").find("span[name=scheduleOpt]").is(":hidden")){
	                		
	                		$("td.editable").find("span[name=scheduleOpt]").css("display","");
	                	}else{
	                		$("td.editable").find("span[name=scheduleOpt]").css("display","none");
	                	}
	                
			        	
			        	
			        });
                   	$("input[name='schedule.id']").off("click").on("click",function(e){
    					
    					e.stopImmediatePropagation();

    				});
                   	$("#delete_schedule").off("click").on("click",function(e){
                   		
                   		var checkedScheduIds=[];
                   		$("input[name='schedule.id']:checked").each(function(){
                   			
                   			checkedScheduIds.push($(this).val());
                   			
                   		});
                   		if(checkedScheduIds.length==0){
                   			toastr.error("请先选择需要删除的记录！");
                   			return;
                   		}
                   		deleteSchedule(classroomId,scheduleSchemeId,checkedScheduIds);
                   		
                   		
                   	});

                        break;
                    case -3:
                        toastr.error(common.tips.t01);
                        break;
                    case -4:
                        toastr.error(common.tips.t02);
                        break;
                }
            },
            error: function (jqXHR, textStatus) {
                toastr.warning("请求异常：" + textStatus);
            }
        });
	
	
	
	
	
	
}




function deleteSchedule(classroomId,scheduleSchemeId,checkedScheduIds){
	
	var commaSplitIds="";
	for(var i=0;i<checkedScheduIds.length;i++){
		if(i==0){
			commaSplitIds=checkedScheduIds[i];
			
		}else{
			commaSplitIds+=","+checkedScheduIds	[i];

			
		}
	}
	var jsonData={"ids" : commaSplitIds}
    $.ajax({
        url: 'courseschedule!delete.action',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        data: jsonData,
        dataType: 'json',
        success: function (result) {
            
            switch (result.retcode) {
                case -90:
                    bootbox.alert(common.tips.t00, function () {
                        document.location.href = ctx + "/login.action";
                    });
                    break;
                case 1:
                    toastr.success("操作成功！");
                    initClassroomSchedule(classroomId,scheduleSchemeId);

                    break;
                case -3:
                    toastr.error(common.tips.t01);
                    break;
                case -4:
                    toastr.error(common.tips.t02);
                    break;
            }
        },
        error: function (jqXHR, textStatus) {
            toastr.warning(liveList.tips.t02 + textStatus);
        }
    });

	
	
}
//初始化操作栏按钮动作
function initaction() {
	
	 initTab1();
	

    
}


// list初始化
var Custom =function () {	
		    return {
		        //main function to initiate the module
		        init: function () {
		            formWizard();
		            //按钮行为初始化
		            initaction();
		        }
		    };
	     
         

}();