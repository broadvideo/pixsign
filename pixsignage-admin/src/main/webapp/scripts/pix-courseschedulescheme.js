var CurClassroom = null;
var CONST_WEEKDAYS=['','一','二','三','四','五','六','日'];
function initSpinners(){
    //初始化spinner
	$("#morning_spinner").spinner({value:4, min: 1, max: 6});
	//$("#noon_spinner").spinner({value:0, min: 0, max: 2});
	$("#afternoon_spinner").spinner({value:4, min: 1, max: 6});
	$("#night_spinner").spinner({value:2, min: 0, max: 6});
}

function disableSpinners(){
$("#morning_spinner").spinner( "disable" )
$("#afternoon_spinner").spinner("disable" );
$("#night_spinner").spinner("disable");
}		


//初始化操作栏按钮动作
function initaction() {
  $("#action_add_schedule_scheme").click(function () {
  	//对数据进行模版渲染
      $("#nest_modal").empty();
      $("#nest_modal").setTemplateElement("temp_add_schedule_scheme");
      $("#nest_modal").processTemplate("");
      $("#modal_add_schedule_scheme").modal("toggle");
      //初始化上课节数
      initSpinners();
      $("#action_submit_add").click(function () {
          $('#form_add_schedule_scheme').ajaxSubmit({
              url: 'courseschedulescheme!add.action',
              type: 'POST',
              contentType: 'application/x-www-form-urlencoded; charset=utf-8',
              beforeSubmit: function (data) {

              	   if ($('#form_add_schedule_scheme [name="courseschedulescheme.name"]').val() == '') {
              		 bootbox.alert("请填写方案名称！");
                         $('#form_add_schedule_scheme [name="courseschedulescheme.name"]').focus();
                         return false;
                     }
              	
                  var workdaysChecked=false;
                  var workdayVals="";
                  $('#form_add_schedule_scheme [name="workdays"]').each(function(){
                  	 if($(this).attr("checked")){
                  		 workdaysChecked=true;
                  		 workdayVals+=$(this).val()+",";
                  	 }
                  	
                  });
                  
                  if(!workdaysChecked){
                	  bootbox.alert("请选择课表的工作日！");
                      return false;
                  }
                  workdays=workdayVals.substring(0,workdayVals.length-1);
                  var workdaysform = {
                          name: 'courseschedulescheme.workdays',
                          value: workdays,
                          type: 'text',
                          required: true
                      };
                      data.push(workdaysform);
          
              	
              	
              },
              success: function (result) {
                  switch (result.errorcode) {
                
                      case 0:
          				  bootbox.alert(common.tips.success);
                          $("#modal_add_schedule_scheme").modal("toggle");
                          $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                          break;
                      case -3:
  						bootbox.alert("数据校验失败，请填写表单!");
                    	  break;
                      case -1:
                			bootbox.alert(result.errorcode + ": " + result.errormsg);
                          break;
                   
                  }
              }
          });
      });
  });

 
  //操作栏编辑按钮动作
  $('#scheduleSchemeList').delegate("a.editschedulescheme", "click", function () {
      var jsonData = {id: $(this).attr("scheduleschemeid")};
      $.ajax({
          url: 'courseschedulescheme!get.action',
          type: 'GET',
          contentType: 'application/json; charset=utf-8',
          data: jsonData,
          dataType: 'json',
          success: function (data) {
              switch (data.errorcode) {
                  case 0:
                      $("#nest_modal").empty();
                      $("#nest_modal").setTemplateElement("temp_edit_schedule_scheme");
                      $("#nest_modal").processTemplate(data.courseschedulescheme);
                      initSpinners();
                      if(data.courseschedulescheme.periodinitflag){
                      	disableSpinners();
                      }
                      $("#modal_edit_schedule_scheme input[name=workdays]").each(function(){
                      	   var  selWorkdays=","+ data.courseschedulescheme.workdays+",";
                      	   var thisVal=","+$(this).val()+",";
                      	   if(selWorkdays.indexOf(thisVal)!=-1){
                      		   
                      		   $(this).attr("checked",true);
                      		   
                      	   }else{
                      		   
                      		   $(this).attr("checked",false);

                      	   }
                      	
                      });
                     
                      $("#modal_edit_schedule_scheme").modal("toggle");
                      $("#action_submit_edit").click(function () {
                          $('#form_edit_schedule_scheme').ajaxSubmit({
                              url: 'courseschedulescheme!update.action',
                              type: 'POST',
                              contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                              dataType: 'json',
                              beforeSubmit: function (data) {
                              	if ($('#form_edit_schedule_scheme [name="courseschedulescheme.name"]').val() == '') {
                              		bootbox.alert("请填写方案名称！");
                                      $('#form_edit_schedule_scheme [name="courseschedulescheme.name"]').focus();
                                      return false;
                                  }
                           	  
                               var workdaysChecked=false;
                               var workdayVals="";
                               $('#form_edit_schedule_scheme [name="workdays"]').each(function(){
                               	 if($(this).attr("checked")){
                               		 workdaysChecked=true;
                               		 workdayVals+=$(this).val()+",";
                               	 }
                               	
                               });
                               if(!workdaysChecked){
                            	   bootbox.alert("请选择课表的工作日！");
                                   return false;
                               }
                               workdays=workdayVals.substring(0,workdayVals.length-1);
                               var workdaysform = {
                                       name: 'courseschedulescheme.workdays',
                                       value: workdays,
                                       type: 'text',
                                       required: true
                                   };
                                   data.push(workdaysform);
                              },
                              success: function (result) {
                                  switch (result.errorcode) {
                                    
                                      case 0:
                          				  bootbox.alert(common.tips.success);

                                          $("#modal_edit_schedule_scheme").modal("toggle");
                                          $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                                          break;
                                    
                                     
                                      case -1:
                                          bootbox.alert("操作异常！");
                                          break;
                                      case -3:
                  						bootbox.alert("数据校验失败，请填写表单!");
                                    	  break;
                                     
                                  }
                              }
                          });
                      });
                      break;
                  case -1:
          			bootbox.alert(data.errorcode + ": " + data.errormsg);
                      break;
                
              }
          }
      });
  });
  
  $("#scheduleSchemeList").delegate("a.enableschedulescheme","click",function(){
  	var scheduleschemeid=$(this).attr("scheduleschemeid");

      bootbox.confirm({
          buttons: {
              confirm: {label: common.tips.t03, className: 'default blue-stripe'},
              cancel: {label: common.tips.t04, className: 'default'}
          },
          message: "确认启用课表方案:" + $(this).closest("tr").find("td:first").text()+",启用后其它的课表方案会自动设置为停用！",
          callback: function (result) {
              if (result) {
                  var jsonData = {"courseschedulescheme.coursescheduleschemeid": scheduleschemeid, "courseschedulescheme.enableflag": "1"};
                  $.ajax({
                      url: 'courseschedulescheme!setflag.action',
                      type: 'POST',
                      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                      data: jsonData,
                      dataType: 'json',
                      success: function (result) {
                          switch (result.errorcode) {
                           
                              case 0:
                                 bootbox.alert(common.tips.success);
                                  $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                                  break;
                              case -1:
                        			bootbox.alert(result.errorcode + ": " + result.errormsg);
                                  break;
                         
                          }
                      },
                      error: function (jqXHR, textStatus) {
                          bootbox.alert("请求异常:" + textStatus);
                      }
                  });
              }
          },
          //title: "bootbox confirm也可以添加标题哦",
      });
  	
  	
  });
  
  $("#scheduleSchemeList").delegate("a.disableschedulescheme","click",function(){
  	var scheduleschemeid=$(this).attr("scheduleschemeid");
      bootbox.confirm({
          buttons: {
              confirm: {label: common.tips.t03, className: 'default blue-stripe'},
              cancel: {label: common.tips.t04, className: 'default'}
          },
          
          message: "确认停用课表方案:" + $(this).closest("tr").find("td:first").text()+",停用后,可能会影响已经创建的课表！",
          callback: function (result) {

        	     if (result) {
                     var jsonData = {"courseschedulescheme.coursescheduleschemeid": scheduleschemeid, "courseschedulescheme.enableflag": "0"};
                     $.ajax({
                         url: 'courseschedulescheme!setflag.action',
                         type: 'POST',
                         contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                         data: jsonData,
                         dataType: 'json',
                         success: function (result) {
                             switch (result.errorcode) {
                              
                                 case 0:
                                    bootbox.alert(common.tips.success);
                                     $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                                     break;
                                 case -1:
                           			bootbox.alert(result.errorcode + ": " + result.errormsg);
                                     break;
                            
                             }
                         },
                         error: function (jqXHR, textStatus) {
                             bootbox.alert("请求异常:" + textStatus);
                         }
                     });
                 }
          },
          //title: "bootbox confirm也可以添加标题哦",
      });
  	
  	
  });
  
  //课表方案时间配置
  $("#scheduleSchemeList").delegate("a.edittimeconfig","click",function(){
  	
  	
  	 $("#nest_modal").empty();
       $("#nest_modal").setTemplateElement("temp_edit_time_config");
       $("#nest_modal").processTemplate();         
       $("#modal_edit_time_config").modal("toggle");
       $('.timepicker').timepicker({
           autoclose: true,
           minuteStep: 5,
           showSeconds: false,
           showMeridian: false
       });
     
  	
  });

  //操作栏删除按钮动作
  $('#scheduleSchemeList').delegate("a.deleteschedulescheme", "click", function () {
      var scheduleschemeid = $(this).attr('scheduleschemeid');
      bootbox.confirm({
          buttons: {
              confirm: {label: common.tips.t03, className: 'default blue-stripe'},
              cancel: {label: common.tips.t04, className: 'default'}
          },
          message: "删除后课表方案关联的课表信息将会清空，确认是否删除课表方案:" + $(this).closest("tr").find("td:first").text()+"?",
          callback: function (result) {
              if (result) {
                  var jsonData = {ids: scheduleschemeid};
                  $.ajax({
                      url:'courseschedulescheme!delete.action',
                      type: 'GET',
                      contentType: 'application/json; charset=utf-8',
                      data: jsonData,
                      dataType: 'json',
                      success: function (result) {
                          switch (result.errorcode) {
                            
                              case 0:
                                  var pageInfo = $('#scheduleSchemeList').DataTable().page.info();
                                  if (pageInfo.pages > 1 && pageInfo.pages == pageInfo.page + 1 && 1 == pageInfo.end - pageInfo.start) {
                                      $('#scheduleSchemeList').DataTable().page(pageInfo.page - 1);
                                  }
                                  $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                                  break;
                              case -1:
                        			bootbox.alert(result.errorcode + ": " + result.errormsg);
                                  break;
                             
                          }
                      },
                      error: function (jqXHR, textStatus) {
                    		bootbox.alert("删除异常:" + textStatus);
                      }
                  });
              }
          },
          //title: "bootbox confirm也可以添加标题哦",
      });
  });
}
$('#scheduleSchemeList').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
    serverSide: true,
    ajax: {
        url: "courseschedulescheme!list.action",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        data: function (d) {
            var searchKey = $('input[type="search"]').val();
            var jsonData = {
            	sSearch: searchKey,
                iDisplayStart: d.start,
                iDisplayLength: d.length 
   
            };
        
            return jsonData;
            
            
        }
    },
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
    processing: true,
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
    columns: [
        {data: "name",'bSortable' : false,},
        {data: "description",'bSortable' : false,},
        {data: "workdays"},
        {data: "morningperiods"},
        {data: "afternoonperiods"},
        {data: "nightperiods"},
        {data: "createtime",'bSortable' : false,},
        {data: "enableflag"},
        {data: "coursescheduleschemeid"},
     

    ],
    columnDefs: [
        {
            "render": function (data, type, row) {

                return '<div class="btn-group">' +
                    '<a class="btn btn-sm blue" href="#" data-toggle="dropdown" > 操作 <i class="fa fa-angle-down"></i> </a>' +
                    '<ul class="dropdown-menu pull-right" >' +
                    '<li> <a href="periodtimedtl.jsp?CurrentP=30711&ParentP=307&coursescheduleschemeid='+data+'" coursescheduleschemeid="' + data + '"> <i class="fa fa-cog"></i> 时间配置 </a> </li>' +
                    '<li> <a href="javascript:;" class="enableschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-bullhorn"></i>  启用  </a> </li>' +
                    '<li> <a href="javascript:;" class="disableschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-minus-circle"></i> 停用   </a> </li>' +
                    '<li > <a href="javascript:;" class="editschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-trash-o"></i> 编辑</a> </li>'+
                    '<li > <a href="javascript:;" class="deleteschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-trash-o"></i> 删除 </a> </li></ul></div>';
            },
            "targets": [8]
        },{
           "render":  function (data,type,row){
        	  var  workdayFormatStr=""; 
        	   if(data!=null && data!=''){
        		   
        		var vals= data.split(",");
        		for(var index=0;index<vals.length;index++){
        			
        			if(index==0){
        				workdayFormatStr=CONST_WEEKDAYS[vals[index]];

        			}else{
        				
        				workdayFormatStr+="、"+CONST_WEEKDAYS[vals[index]];
        			}
        			 
        		}
      
        	   }
        	   
        	   
        	  return workdayFormatStr;
        	   
           },
           "targets" : [2]
        	
        	
        },
        
        {
            "render": function (data, type, row) {
                return moment(data).format('YYYY MM-DD HH:mm');
            },
            "targets": [6]
        },
        {
           "render": function (data,type,row) {
        	   
        	   if(data=='0'){
        		   return "未启用";
        	   }else if(data=='1'){
        		   
        		   return "启用";
        	   }else{
        		   
        		   return "未知";
        	   }
        	   
        	 
        	   
        	   
           },
           "targets": [7]
        	
        },
        
        {"orderable": false, "targets": [2,3,4,5,7,8]},
        {"searchable": false, "targets": [2]}
    ],
    "createdRow": function (row, data, index) {

            if (data.enableflag != 1) {
                $(row).find("a.disableschedulescheme").closest("li").remove();
            }else if (data.enableflag == 1) {
                $(row).find("a.enableschedulescheme").closest("li").remove();
            }
            else {
               
            }
    
    },
});

$('#scheduleSchemeList_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#scheduleSchemeList_wrapper .dataTables_length select').addClass('form-control input-small');
$('#scheduleSchemeList_wrapper .dataTables_length select').select2();
$('#scheduleSchemeList').css('width', '100%').css('table-layout', 'fixed');




