<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>    
<html>
<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-toastr/toastr.min.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="${static_ctx}/global/plugins/data-tables/css/jquery.dataTables.min.css"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/css/custom.css" rel="stylesheet" type="text/css"/>

</head>
<!-- BEGIN BODY -->
<body>
<div class="page-content-wrapper">
		<div class="page-content">
		
		     <h3 class="page-title"><spring:message code="menu.courseschedulescheme"/></h3>
					<div class="page-bar">
						<ul class="page-breadcrumb">
							<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
									class="fa fa-angle-right"></i>
							</li>
							<li><a href="#"><spring:message code="menu.classcard"/></a><i class="fa fa-angle-right"></i>
							</li>
							<li><a href="#"><spring:message code="menu.coursescheduleset"/></a>
							</li>
						</ul>
					</div>

      <!-- END PAGE HEADER--> 
      <!-- BEGIN PAGE CONTENT-->
      <div id="page">
        <div class="row">
          <div class="col-md-12"> 
               <!-- BEGIN EXAMPLE TABLE PORTLET-->
			     <div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-edit"></i>教室课表
							</div>
							<div class="tools" style="display:none;">
								<a href="javascript:;" class="collapse">
								</a>
								<a href="#portlet-config" data-toggle="modal" class="config">
								</a>
								<a href="javascript:;" class="reload">
								</a>
								<a href="javascript:;" class="remove">
								</a>
							</div>
						</div>
				        <div class="portlet-body">
				              <!--  form wizard start  -->
                                <div class="form-wizard form-horizontal" id="form_wizard_1" >
                                    <div class="form-body">
                                        <ul class="nav nav-pills nav-justified steps" style="display:none;">
                                            <li> <a href="#tab1" data-toggle="tab" class="step active"> <span class="number"> 1 </span> </a> </li>
                                            <li> <a href="#tab2" data-toggle="tab" class="step"> <span class="number"> 2 </span> </a> </li>
                                        </ul>
                                        <div id="bar" class="progress progress-striped" role="progressbar"  style="display:none;">
                                            <div class="progress-bar progress-bar-success"> </div>
                                        </div>
                                        <div class="tab-content">
                                            <div class="tab-pane active " id="tab1" >
                                                 <div class="note note-info">
												   <p>先选择教室，进行课表查看和录入课表信息</p>
												 </div>
												 <div class="form-group row margin-top-20">
												    <label class="col-md-2 control-label">当前课表方案 *</label>
												    <div class="col-md-4">  
												        <select id="schedule_scheme_list" name="scheduleSchemeList" class="form-control">
																<option>选择课表方案</option>
															
														</select>
												    </div>  
												  </div>
												  <div class="form-group row">
												    <label class="col-md-2 control-label">选择教室 *</label>
												    <div class="col-md-4">  
												        <select id="classroom_list" name="classroomList" class="form-control">
																<option value="">选择教室</option>
																
														</select>
												    </div>  
												 </div>
                                         
                                            </div>
                                          <!--  tab2 start -->
                                            <div class="tab-pane" id="tab2">
                                                   
                                            </div>
                                            <!--  tab2 end -->
                               
                                        </div>
                                    </div>
                                    <div class="form-actions fluid">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-md-offset-2 col-md-9"> 
                                                    <a href="javascript:;" class="btn default button-previous"> <i class="m-icon-swapleft"></i> 后退</a> 
                                                    <a href="javascript:;" class="btn btn-info button-next">继续 <i class="m-icon-swapright m-icon-white"></i> </a> </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
	
				                <!--  form wizard end  -->
				
				         </div>
				 </div>
		 <!-- END EXAMPLE TABLE PORTLET-->
          


          </div>
        </div>
      </div>
      <div id="nest_modal"></div>
      <!-- END PAGE CONTENT--> 
<!-- END CONTAINER -->

<!--BEGIN Template-->

<p style="display:none">
<textarea id="temp_schedule_cell" rows="0" cols="0">
<!--
   <div name="container"  style="position:relative;line-height:20px;color:#fff;font-size:.85em;width:100%;height:80px;padding-top:20px;text-align:center;background-color:green;opacity:0.7">
	   <span name="scheduleOpt" style="position:absolute;top:0px;left:0px;display:none;"><input type="checkbox" name="schedule.id" value="{$T.scheduleId}" style="margin:0px;width:16px;height:16px;" /></span>
	   <div name="coursename">{$T.coursename}</div>
	   <div name="teachername">{$T.teachername}</div>
   </div>
--></textarea>
</p>

<p style="display:none"> 
<textarea id="temp_classroom_schedule" rows="0" cols="0">
<!--
<div class="table-toolbar">
		<div class="row">
			<div class="col-md-6">
				<div class="btn-group">
					<button id="sample_editable_1_new" class="btn green" style="display:none;">
					Add New <i class="fa fa-plus"></i>
					</button>
					当前课表方案：{$T.name} &nbsp; 排课教室：{$T.classroomname}
				</div>
			</div>
			<div class="col-md-6">
				<div class="btn-group pull-right">
					<button class="btn dropdown-toggle" data-toggle="dropdown">操作 <i class="fa fa-angle-down"></i>
					</button>
					<ul class="dropdown-menu pull-right">
						<li>
							<a href="javascript:;" name="selSchedule" id="sel_schedule">
							选择 </a>
						</li>
						<li>
							<a href="javascript:;" name="deleteSchedule" id="delete_schedule">
							删除 </a>
						</li>
						<li>
						
						</li>
					
					</ul>
				</div>
			</div>
		</div>
</div>
<table class="table table-striped2  table-bordered" id="scheduleTableList">
	<thead>
	<tr>
		<th colspan="2">
			 时间
		</th>
		<th data-workday="1" >
			星期一
		</th>
		<th data-workday="2">
			 星期二
		</th>
		<th data-workday="3">
			星期三
		</th>
		<th data-workday="4">
			 星期四
		</th>
		<th data-workday="5">
			 星期五
		</th>
		<th data-workday="6">
		  	星期六
		</th>
		<th data-workday="7">
		            星期日
		</th>
	</tr>
	</thead>
	<tbody>
       
	  {#foreach $T.morningPeriodTimeDtls as record}
		   {#if $T.record.periodnum ==1}
			  <tr height="80px;" data-period="{$T.record.periodnum}" data-id="{$T.record.id}">
				   <td rowspan="{$T.morningperiods}" style="width:20px;">上午</td>
				   <td width="60px;">{$T.record.periodnum}</td>
				   <td class="editable" data-workday="1"  >
				
				   </td>
				   <td class="editable" data-workday="2" ></td>
				   <td class="editable" data-workday="3" ></td>
				   <td class="editable" data-workday="4" ></td>
				   <td class="editable" data-workday="5" ></td>
				   <td class="editable" data-workday="6" ></td>
				   <td class="editable" data-workday="7" ></td>                
			  </tr>
		   {#else}
			  <tr height="80px;" data-period="{$T.index}" data-id="{$T.record.id}">
			   <td>{$T.record.periodnum}</td>
			   <td class="editable" data-workday="1"></td>
			   <td class="editable" data-workday="2"></td>
			   <td class="editable" data-workday="3"></td>
			   <td class="editable" data-workday="4"></td>
			   <td class="editable" data-workday="5"></td>
			   <td class="editable" data-workday="6"></td>
			   <td class="editable" data-workday="7"></td>                
			  </tr>
		   {#/if}
	 {#/for}
	 
     {#foreach $T.afternoonPeriodTimeDtls as record}
     	
     	{#if $T.record.periodnum ==1}
		 <tr height="80px;"  data-period="{$T.record.periodnum}" data-id="{$T.record.id}" >
		   <td rowspan="{$T.afternoonperiods}">下午</td>
		   <td>{$T.record.periodnum}</td>
		   <td class="editable" data-workday="1"></td>
		   <td class="editable" data-workday="2"></td>
		   <td class="editable" data-workday="3"></td>
		   <td class="editable" data-workday="4"></td>
		   <td class="editable" data-workday="5"></td>
		   <td class="editable" data-workday="6"></td>
		   <td class="editable" data-workday="7"></td>                
		  </tr>
		{#else}
		  <tr height="80px;"  data-period="{$T.record.periodnum}" data-id="{$T.record.id}">
		   <td>{$T.record.periodnum}</td>
		   <td class="editable" data-workday="1"></td>
		   <td class="editable" data-workday="2"></td>
		   <td class="editable" data-workday="3"></td>
		   <td class="editable" data-workday="4"></td>
		   <td class="editable" data-workday="5"></td>
		   <td class="editable" data-workday="6"></td>
		   <td class="editable" data-workday="7"></td>                
		  </tr>
	    {#/if}
     {#/for} 
     
     {#foreach $T.nightPeriodTimeDtls as record}
     	
     	{#if $T.record.periodnum ==1}
		 <tr height="80px;"  data-period="{$T.record.periodnum}"  data-id="{$T.record.id}">
		   <td rowspan="{$T.nightperiods}">晚上</td>
		   <td>{$T.record.periodnum}</td>
		   <td class="editable" data-workday="1"></td>
		   <td class="editable" data-workday="2"></td>
		   <td class="editable" data-workday="3"></td>
		   <td class="editable" data-workday="4"></td>
		   <td class="editable" data-workday="5"></td>
		   <td class="editable" data-workday="6"></td>
		   <td class="editable" data-workday="7"></td>                
		  </tr>
		{#else}
		  <tr height="80px;"  data-period="{$T.record.periodnum}" data-id="{$T.record.id}">
		   <td>{$T.record.periodnum}</td>
		   <td class="editable" data-workday="1"></td>
		   <td class="editable" data-workday="2"></td>
		   <td class="editable" data-workday="3"></td>
		   <td class="editable" data-workday="4"></td>
		   <td class="editable" data-workday="5"></td>
		   <td class="editable" data-workday="6"></td>
		   <td class="editable" data-workday="7"></td>                
		  </tr>
	    {#/if}
     {#/for} 
 </tbody>
 </table>
--></textarea>
</p>

<p style="display:none"> 
<textarea id="temp_edit_period_info" rows="0" cols="0"><!--
<div id="modal_edit_period_info" class="modal fade" tabindex="-1" data-width="450px" data-backdrop="static" data-keyboard="false">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <h4 id="myModalLabel" class="modal-title">课表安排</h4>
      </div>
      <div class="modal-body">
        <form id="form_edit_period_info" class="form-horizontal" method="post" action="" role="form">
              <div class="row">
              	<div class="col-md-12">
                  <div class="form-group row">
                    <label class="col-md-3 control-label">课程 *</label>
                    <div class="col-md-9">
                    <input type="hidden" name="schedule.classroomid" value="{$T.classroomid}" />
                     <input type="hidden" name="schedule.workday"  value="{$T.workday}" />
                     <input type="hidden" name="schedule.periodtimedtlid" value="{$T.periodtimedtlid}"/>
                     <input type="hidden" name="schedule.coursescheduleschemeid" value="{$T.coursescheduleschemeid}"/>
                     <input type="hidden" name="schedule.id" value="{$T.scheduleid}"/>
                      <input type="text" class="form-control" name="schedule.coursename" value="{$T.coursename}" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-md-3 control-label">上课老师* </label>
                    <div class="col-md-9">    
                       <input type="text" class="form-control" name="schedule.teachername" value="{$T.teachername}"/>                       
                    </div>  
                  </div>
              </div>
            </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i> 关闭</button>
        <button type="button" id="action_submit_add" class="btn blue"><i class="fa fa-check"></i> 保存</button>
      </div>
</div>
--></textarea>
</p>
<!--END Template--> 

</div>
</div>
</body>
<!-- END BODY -->
<div id="SiteMethJavaScript">


<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/moment/moment.min.js"></script>
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/lib/jquery.form.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-jtemplates/jquery-jtemplates.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-toastr/toastr.min.js"></script>
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript" ></script>
<script src="${static_ctx}/global/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript" ></script>
<script src="${static_ctx}/global/plugins/fuelux/js/spinner.min.js" type="text/javascript"></script>	

<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/tmp/${locale}.js"></script>
<script src="${base_ctx}/scripts/course_schedule.js?t=${timestamp}"></script>
<script>

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	Custom.init();
});

</script>
</div>
</html>