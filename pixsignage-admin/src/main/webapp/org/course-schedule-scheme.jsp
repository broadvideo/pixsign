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
							<li><a href="#"><spring:message code="menu.courseschedulescheme"/></a>
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
                <div class="caption"> <i class="fa fa-list"></i> 课表方案列表 </div>
                <div class="actions"> 
                  <div class="btn-group"> 
                  	<a href="javascript:;" id="action_add_schedule_scheme" class="btn green"> <i class="fa fa-plus"></i><spring:message  code="global.add"/> </a>
                  </div>
                </div>
              </div>
              <div class="portlet-body">
                <table class="display" cellspacing="0" id="scheduleSchemeList">
                  <thead>
                    <tr>
                      <th style="width:120px" rowspan="2">方案名称</th>
                      <th rowspan="2">描述</th>
                      <th rowspan="2">工作日</th>
                      <th colspan="3" style="text-align:center;" >上课节数</th>
                      <th rowspan="2" style="width:100px;">创建时间</th>
                      <th rowspan="2" >状态</th>
                      <th rowspan="2" style="width:60px">操作</th>
                    </tr>
                    <tr>
                          
                    <th style="width:30px;">上午</th>
                    <th style="width:30px;">下午</th>
                    <th style="width:30px;">晚上</th>
                    </tr>
                  </thead>
                  <tfoot>
                     <tr>
                      <th style="width:120px" rowspan="2">方案名称</th>
                      <th rowspan="2">描述</th>
                      <th rowspan="2" >工作日</th>
                      <th colspan="3" style="text-align:center" >上课节数</th>
                      <th rowspan="2" style="width:100px;">创建时间</th>
                      <th rowspan="2" >状态</th>
                      <th rowspan="2" style="width:60px">操作</th>
                    </tr>
                    <tr>
                    <th>上午</th>
                    <th>下午</th>
                    <th>晚上</th>
                    </tr>
                  </tfoot>
                </table>
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
<textarea id="temp_add_schedule_scheme" rows="0" cols="0"><!--
<div id="modal_add_schedule_scheme" class="modal fade" tabindex="-1"  data-width="650px" data-height="450px" data-backdrop="static" data-keyboard="false">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <h4 id="myModalLabel" class="modal-title">新增课表方案</h4>
      </div>
      <div class="modal-body">
        <form id="form_add_schedule_scheme" class="form-horizontal" method="post" action="" role="form">
              <div class="row">
              	<div class="col-md-12">              	 
                  <div class="form-group row">
                    <label class="col-md-2 control-label">方案名称 *</label>
                    <div class="col-md-10">
                      <input type="text" class="form-control" name="scheduleScheme.name" value="" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 control-label">备注信息 </label>
                    <div class="col-md-10">    
                       <textarea rows="2"  maxlength=500" class="form-control" name="scheduleScheme.description" value=""/>                       
                    </div>  
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 control-label">工作日* </label>
                    <div class="col-md-10"  > 
                           <div class="col-md-6">
		                         <div class="checkbox-list">
									<label><input type="checkbox" name="workdays" value="1" checked> 星期一</label>
									<label><input type="checkbox" name="workdays" value="2" checked> 星期二 </label>
									<label><input type="checkbox" name="workdays" value="3" checked> 星期三 </label>									
									 <label><input type="checkbox" name="workdays" value="4" checked>星期四</label>
			                         <label><input type="checkbox" name="workdays" value="5" checked>星期五</label>
								
								  </div>
							 </div>
							 <div class="col-md-4">
							 	<div class="checkbox-list">
							 	    <label><input type="checkbox" name="workdays" value="6" >星期六</label>
									<label><input type="checkbox" name="workdays" value="7" >星期日</label>
								 </div>
							 </div>
							 
		
                    </div>  
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 control-label">上课节数* </label>
                    <div class="col-md-10"  >
                            <div class="row margin-bottom-5">
	                                <label class="col-md-2 control-label">上午 </label>
	                                <div id="morning_spinner" class="col-md-8" >
										<div class="input-group input-small">
											 <input type="text" class="spinner-input form-control" name="scheduleScheme.morningperiods" maxlength="3" readonly>
											 <div class="spinner-buttons input-group-btn btn-group-vertical">
												 <button type="button" class="btn spinner-up btn-xs blue">
													<i class="fa fa-angle-up"></i>
												 </button>
												 <button type="button" class="btn spinner-down btn-xs blue">
													<i class="fa fa-angle-down"></i>
												 </button>
											 </div>
										 </div>
									 </div>
                            </div>
                            
                            <div class="row margin-bottom-5">
	                                <label class="col-md-2 control-label">下午 </label>
	                                <div id="afternoon_spinner" class="col-md-8" >
										<div class="input-group input-small">
											 <input type="text" class="spinner-input form-control" name="scheduleScheme.afternoonperiods" maxlength="3" readonly>
											 <div class="spinner-buttons input-group-btn btn-group-vertical">
												 <button type="button" class="btn spinner-up btn-xs blue">
													<i class="fa fa-angle-up"></i>
												 </button>
												 <button type="button" class="btn spinner-down btn-xs blue">
													<i class="fa fa-angle-down"></i>
												 </button>
											 </div>
										 </div>
									 </div>
                            </div>
                            <div class="row margin-bottom-5">
	                                <label class="col-md-2 control-label">晚上 </label>
	                                <div id="night_spinner" class="col-md-8" >
										<div class="input-group input-small">
											 <input type="text" class="spinner-input form-control" name="scheduleScheme.nightperiods" maxlength="3" readonly>
											 <div class="spinner-buttons input-group-btn btn-group-vertical">
												 <button type="button" class="btn spinner-up btn-xs blue">
													<i class="fa fa-angle-up"></i>
												 </button>
												 <button type="button" class="btn spinner-down btn-xs blue">
													<i class="fa fa-angle-down"></i>
												 </button>
											 </div>
										 </div>
									 </div>
                            </div>
                            
                            
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

<p style="display:none"> 
<textarea id="temp_edit_schedule_scheme" rows="0" cols="0"><!--
<div id="modal_edit_schedule_scheme" class="modal fade" tabindex="-1" data-width="650px"  data-height="450px" data-backdrop="static" data-keyboard="false">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <h4 class="modal-title">编辑课表方案</h4>
      </div>
      <div class="modal-body">
        <form id="form_edit_schedule_scheme" class="form-horizontal" method="post" action="" role="form">
              <div class="row">
              	<div class="col-md-12">
                  <div class="form-group row">
                    <label class="col-md-2 control-label">方案名称 *</label>
                    <div class="col-md-10">
                      <input type="hidden" name="scheduleScheme.id" value="{$T.id}"/>
                      <input type="text" class="form-control" name="scheduleScheme.name" value="{$T.name}" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 control-label">备注信息 </label>
                    <div class="col-md-10">    
                       <textarea rows="2"  maxlength=500" class="form-control" name="scheduleScheme.description" >{$T.description}&lt;/textarea>                     
                    </div>  
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 control-label">工作日* </label>
                    <div class="col-md-10"  > 
                           <div class="col-md-6">
		                         <div class="checkbox-list">
									<label><input type="checkbox" name="workdays" value="1" > 星期一</label>
									<label><input type="checkbox" name="workdays" value="2" > 星期二 </label>
									<label><input type="checkbox" name="workdays" value="3"  > 星期三 </label>									
									 <label><input type="checkbox" name="workdays" value="4" >星期四</label>
			                         <label><input type="checkbox" name="workdays" value="5" >星期五</label>
								
								  </div>
							 </div>
							 <div class="col-md-4">
							 	<div class="checkbox-list">
							 	    <label><input type="checkbox" name="workdays" value="6" >星期六</label>
									<label><input type="checkbox" name="workdays" value="7" >星期日</label>
								 </div>
							 </div>
							 
		
                    </div>  
                  </div>
                  <div class="form-group row">
                    <label class="col-md-2 control-label">上课节数* </label>
                    <div class="col-md-10"  >
                            <div class="row margin-bottom-5">
	                                <label class="col-md-2 control-label">上午 </label>
	                                <div id="morning_spinner" class="col-md-8" >
										<div class="input-group input-small">
											 <input type="text" class="spinner-input form-control" name="scheduleScheme.morningperiods" maxlength="3" value="{$T.morningperiods}" readonly>
											 <div class="spinner-buttons input-group-btn btn-group-vertical">
												 <button type="button" class="btn spinner-up btn-xs blue">
													<i class="fa fa-angle-up"></i>
												 </button>
												 <button type="button" class="btn spinner-down btn-xs blue">
													<i class="fa fa-angle-down"></i>
												 </button>
											 </div>
										 </div>
									 </div>
                            </div>
                            
                            <div class="row margin-bottom-5">
	                                <label class="col-md-2 control-label">下午 </label>
	                                <div id="afternoon_spinner" class="col-md-8" >
										<div class="input-group input-small">
											 <input type="text" class="spinner-input form-control" name="scheduleScheme.afternoonperiods" maxlength="3" value="{$T.afternoonperiods}"  readonly>
											 <div class="spinner-buttons input-group-btn btn-group-vertical">
												 <button type="button" class="btn spinner-up btn-xs blue">
													<i class="fa fa-angle-up"></i>
												 </button>
												 <button type="button" class="btn spinner-down btn-xs blue">
													<i class="fa fa-angle-down"></i>
												 </button>
											 </div>
										 </div>
									 </div>
                            </div>
                            <div class="row margin-bottom-5">
	                                <label class="col-md-2 control-label">晚上 </label>
	                                <div id="night_spinner" class="col-md-8" >
										<div class="input-group input-small">
											 <input type="text" class="spinner-input form-control" name="scheduleScheme.nightperiods" maxlength="3" value="{$T.nightperiods}" readonly>
											 <div class="spinner-buttons input-group-btn btn-group-vertical">
												 <button type="button" class="btn spinner-up btn-xs blue">
													<i class="fa fa-angle-up"></i>
												 </button>
												 <button type="button" class="btn spinner-down btn-xs blue">
													<i class="fa fa-angle-down"></i>
												 </button>
											 </div>
										 </div>
									 </div>
                            </div>
                            
                            
			         </div>  
                  </div>
              </div>
            </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i> 关闭</button>
        <button type="button" id="action_submit_edit" class="btn blue"><i class="fa fa-check"></i> 保存</button>
      </div>
</div>
--></textarea>
</p>


<p style="display:none"> 
<textarea id="temp_edit_time_config" rows="0" cols="0"><!--
<div id="modal_edit_time_config" class="modal fade" tabindex="-1" data-width="650px"  data-height="440px" data-backdrop="static" data-keyboard="false">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <h4 class="modal-title">上课时间配置</h4>
      </div>
      <div class="modal-body">
        <form id="form_edit_time_config" class="form-horizontal" method="post" action="" role="form">
           {#for index=1 to 1}
            <div class="row">
	               <div class="col-md-12">
		                  <div class="form-group row">
			                    <label class="col-md-2 control-label">第一节</label>
			                    <div class="col-md-10">
				                  
			                    </div>
		                   </div>
	                </div>
             </div>
            {#/for} 
          </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i> 关闭</button>
        <button type="button" id="action_submit_edit" class="btn blue"><i class="fa fa-check"></i> 保存</button>
      </div>
</div>
--></textarea>
</p>
 </div>
</div>
<!--END Template-->
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
<script src="${static_ctx}/global/plugins/bootbox/bootbox-v4.1.0.min.js" type="text/javascript"></script>
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
<script src="${base_ctx}/scripts/course_schedule_scheme.js?t=${timestamp}"></script>
<script>

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	Custom.init();
});
</script>
</div>
</html>