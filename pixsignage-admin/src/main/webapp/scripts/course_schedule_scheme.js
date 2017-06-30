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
                	   if ($('#form_add_schedule_scheme [name="scheduleScheme.name"]').val() == '') {
                           toastr.warning("请填写方案名称！");
                           $('#form_add_schedule_scheme [name="scheduleScheme.name"]').focus();
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
                        toastr.warning("请选择课表的工作日！");
                        return false;
                    }
                    workdays=workdayVals.substring(0,workdayVals.length-1);
                    var workdaysform = {
                            name: 'scheduleScheme.workdays',
                            value: workdays,
                            type: 'text',
                            required: true
                        };
                        data.push(workdaysform);
            
                	
                	
                },
                success: function (result) {
                    switch (result.retcode) {
                        case -90:
                            bootbox.alert(common.tips.t00, function () {
                                document.location.href = ctx + "/login.action";
                            });
                            break;
                        case 1:
                            toastr.success("添加课表方案成功。");
                            $("#modal_add_schedule_scheme").modal("toggle");
                            $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                            break;
                        case -2:
                            toastr.warning(common.tips.t10);
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
                switch (data.retcode) {
                    case 1:
                        $("#nest_modal").empty();
                        $("#nest_modal").setTemplateElement("temp_edit_schedule_scheme");
                        $("#nest_modal").processTemplate(data.data);
                        initSpinners();
                        if(data.data.periodInitFlag){
                        	disableSpinners();
                        }
                        $("#modal_edit_schedule_scheme input[name=workdays]").each(function(){
                        	   var  selWorkdays=","+ data.data.workdays+",";
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
                                	if ($('#form_edit_schedule_scheme [name="scheduleScheme.name"]').val() == '') {
                                        toastr.warning("请填写方案名称！");
                                        $('#form_edit_schedule_scheme [name="scheduleScheme.name"]').focus();
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
                                     toastr.warning("请选择课表的工作日！");
                                     return false;
                                 }
                                 workdays=workdayVals.substring(0,workdayVals.length-1);
                                 var workdaysform = {
                                         name: 'scheduleScheme.workdays',
                                         value: workdays,
                                         type: 'text',
                                         required: true
                                     };
                                     data.push(workdaysform);
                                },
                                success: function (result) {
                                    switch (result.retcode) {
                                        case -90:
                                            bootbox.alert(common.tips.t00, function () {
                                                document.location.href = ctx + "/login.action";
                                            });
                                            break;
                                        case 1:
                                            toastr.success("编辑课表方案成功。");
                                            $("#modal_edit_schedule_scheme").modal("toggle");
                                            $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                                            break;
                                        case -2:
                                            toastr.warning(common.tips.t10);
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
                        break;
                    case -3:
                        toastr.error(common.tips.t01);
                        break;
                    case -4:
                        toastr.error(common.tips.t02);
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
                    var jsonData = {"scheduleScheme.id": scheduleschemeid, "scheduleScheme.enableflag": "1"};
                    $.ajax({
                        url: 'courseschedulescheme!setflag.action',
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
                                    toastr.success("操作成功。");
                                    $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
                                    break;
                                case -3:
                                    toastr.error(common.tips.t01);
                                    break;
                                case -4:
                                    toastr.error(common.tips.t02);
                                    break;
                                case -104:
                                	toastr.error("启用失败，请完善课表方案信息！");
                                	break;
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            toastr.warning("请求异常:" + textStatus);
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
                    var jsonData = {"scheduleScheme.id": scheduleschemeid, "scheduleScheme.enableFlag": "0"};
                    $.ajax({
                        url: ctx + '/schedule/setScheduleSchemeFlag.action',
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
                                    toastr.success("操作成功。");
                                    $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
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
                            toastr.warning(courseList.tips.t08 + textStatus);
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
                            switch (result.retcode) {
                                case -90:
                                    bootbox.alert(common.tips.t00, function () {
                                        document.location.href = ctx + "/login.action";
                                    });
                                    break;
                                case 1:
                                    toastr.success("删除成功。");
                                    var pageInfo = $('#scheduleSchemeList').DataTable().page.info();
                                    if (pageInfo.pages > 1 && pageInfo.pages == pageInfo.page + 1 && 1 == pageInfo.end - pageInfo.start) {
                                        $('#scheduleSchemeList').DataTable().page(pageInfo.page - 1);
                                    }
                                    $('#scheduleSchemeList').DataTable().ajax.reload(null, false);
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
                            toastr.warning("删除异常:" + textStatus);
                        }
                    });
                }
            },
            //title: "bootbox confirm也可以添加标题哦",
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
            $('#scheduleSchemeList').dataTable({
                serverSide: true,
                ajax: {
                    url: "courseschedulescheme!list.action",
                    type: "GET",
                    contentType: 'application/json; charset=utf-8',
                    data: function (d) {
                        
                        var searchKey = $('input[type="search"]').val();
                        var pageSize = d.length;
                        var pageNo = d.start / d.length + 1;
                  
                        var jsonData = {
                            searchKey: searchKey,
                            pageSize: pageSize,
                            pageNo: pageNo
               
                        };
                    
                        return jsonData;
                        
                        
                    }
                },
                lengthMenu: [
                    [10, 20, 50],
                    [10, 20, 50]
                ],
                // set the initial value
                pageLength: 10,
                processing: true,
                language: {
                    "processing": "<img src='" + res + "/global/img/ajax-loading.gif' />",
                    "lengthMenu": common.view.v03,
                    "zeroRecords": common.view.v04,
                    "info": common.view.v05,
                    "infoEmpty": common.view.v06,
                    "search": common.view.v07,
                    "infoFiltered": common.view.v08,
                    "paginate": {
                        previous: common.view.v09,
                        next: common.view.v10
                    }
                },
                columns: [
                    {data: "name"},
                    {data: "description"},
                    {data: "workdays"},
                    {data: "morningperiods"},
                    {data: "afternoonperiods"},
                    {data: "nightperiods"},
                    {data: "createtime"},
                    {data: "enableflag"},
                    {data: "id"},
                 

                ],
                order: [[0, "asc"]],
                columnDefs: [
                    {
                        "render": function (data, type, row) {
                        	
                            return '<div class="btn-group">' +
                                '<a class="btn btn-sm blue" href="#" data-toggle="dropdown">' + common.menu.m00 + ' <i class="fa fa-angle-down"></i> </a>' +
                                '<ul class="dropdown-menu pull-right">' +
                                '<li> <a href="period-time-dtl.jsp?CurrentP=30711&ParentP=307&scheduleSchemeId='+data+'" scheduleschemeid="' + data + '"> <i class="fa fa-cog"></i> 时间配置 </a> </li>' +
                                '<li> <a href="javascript:;" class="enableschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-bullhorn"></i>  启用  </a> </li>' +
                                '<li> <a href="javascript:;" class="disableschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-minus-circle"></i> 停用   </a> </li>' +
                                '<li > <a href="javascript:;" class="editschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-trash-o"></i> 编辑</a> </li>'+
                                '<li > <a href="javascript:;" class="deleteschedulescheme" scheduleschemeid="' + data + '"> <i class="fa fa-trash-o"></i> ' + common.menu.m02 + ' </a> </li></ul></div>';
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

                        if (data.enableFlag != 1) {
                            $(row).find("a.disableschedulescheme").closest("li").remove();
                        }else if (data.enableFlag == 1) {
                            $(row).find("a.enableschedulescheme").closest("li").remove();
                        }
                        else {
                           
                        }
                
                
                
                },
            });
            // modify table search input
            jQuery('input[type="search"]').addClass("form-control input-small input-inline");
            // modify table per page dropdown
            jQuery('select[name="rolelist_length"]').addClass("form-control input-xsmall");
            // initialize select2 dropdown
            jQuery('select[name="rolelist_length"]').select2();
            //按钮行为初始化
            initaction();
        }
    };
}();