<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>    
<html>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-toastr/toastr.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/data-tables/css/jquery.dataTables.min.css" rel="stylesheet" />
<link href="${static_ctx}/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/css/custom.css" rel="stylesheet" type="text/css"/>
</head>

<!-- BEGIN BODY -->
<body class="page-header-fixed">
 <input type="hidden" name="scheduleSchemeId" value="${param.scheduleSchemeId}"/>
<div class="page-content-wrapper">
	 <div class="page-content">
		
		     <h3 class="page-title"><spring:message code="menu.classcard"/></h3>
					<div class="page-bar">
						<ul class="page-breadcrumb">
							<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
									class="fa fa-angle-right"></i>
							</li>
							<li><a href="#"><spring:message code="menu.classcard"/></a><i class="fa fa-angle-right"></i>
							</li>
							<li><a href="#"><spring:message code="menu.classcard"/></a>
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
                <div class="caption"> <i class="fa fa-list"></i><spring:message code="menu.shemetimeconfig"/></div>
                <div class="actions"> 
                  <div class="btn-group"> 
                  	<a href="javascript:history.back(-1);" id="action_add_schedule_config" class="btn green"> <i class="fa"></i>返回 </a>
                  </div>
                </div>
              </div>
              <div class="portlet-body form">
               <!-- BEGIN FORM-->                  		
              <!-- END FORM-->                  		
              
              </div>
            </div>
            <!-- END EXAMPLE TABLE PORTLET--> 
          </div>
        </div>
      </div>
      <!-- END PAGE CONTENT--> 
<!-- END CONTAINER --> 

<p style="display:none"> 
<!-- 修改上课时间 -->
<textarea id="temp_edit_periods" rows="0" cols="0"><!--

<form action="#" id="form_edit_periods" class="form-horizontal form-row-sepe">
	<div class="form-body">
		<h4 class="form-section" >上午课时</h4>
		{#foreach $T.morningPeriodTimeDtls as dtl}
		<div class="form-group morning-periods-group">
			<label class="control-label col-md-3">{#if $T.dtl.periodnum ==1 } 第一节 {#elseif $T.dtl.periodnum ==2}第二节{#elseif $T.dtl.periodnum ==3}第三节{#elseif $T.dtl.periodnum ==4}第四节{#elseif $T.dtl.periodnum ==5}第五节{#elseif $T.dtl.periodnum ==6}第六节{#/if}</label>
			<input type="hidden" name="periodNum" value="{$T.dtl.periodnum }"/>
			<input type="hidden" name="dtlId" value="{$T.dtl.id}" />
			<div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortStartTime" class="form-control timepicker timepicker-24"  value="{$T.dtl.shortstarttime}">
					<span class="input-group-btn">
						<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
			</div>
		   <label class="control-label" style="width:50px;float:left;">至</label>
		  <div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortEndTime" class="form-control timepicker timepicker-24" value="{$T.dtl.shortendtime}">
					<span class="input-group-btn">
							<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
		 </div>
	  </div>
	  {#/for}
      <h4 class="form-section afternoon-periods-group">下午课时</h4>
		{#foreach $T.afternoonPeriodTimeDtls as dtl}
		<div class="form-group afternoon-periods-group">
			<label class="control-label col-md-3">{#if $T.dtl.periodnum ==1 } 第一节 {#elseif $T.dtl.periodnum ==2}第二节{#elseif $T.dtl.periodnum ==3}第三节{#elseif $T.dtl.periodnum ==4}第四节{#elseif $T.dtl.periodnum ==5}第五节{#elseif $T.dtl.periodnum ==6}第六节{#/if}</label>
		    <input type="hidden" name="periodNum" value="{$T.index}"/>
		    <input type="hidden" name="dtlId" value="{$T.dtl.id}" />
			<div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortStartTime" class="form-control timepicker timepicker-24" value="{$T.dtl.shortstarttime}">
					<span class="input-group-btn">
						<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
			</div>
		   <label class="control-label" style="width:50px;float:left;">至</label>
		  <div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortEndTime"  class="form-control timepicker timepicker-24"  value="{$T.dtl.shortendtime}">
					<span class="input-group-btn">
							<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
		 </div>
	    </div>
	   {#/for}

		<h4 class="form-section">晚上课时</h4>

		{#foreach $T.nightPeriodTimeDtls as dtl}
			<div class="form-group night-periods-group last">
			<label class="control-label col-md-3">{#if $T.dtl.periodnum ==1 } 第一节 {#elseif $T.dtl.periodnum ==2}第二节{#elseif $T.dtl.periodnum ==3}第三节{#elseif $T.dtl.periodnum ==4}第四节{#elseif $T.dtl.periodnum ==5}第五节{#elseif $T.dtl.periodnum ==6}第六节{#/if}</label>
		        <input type="hidden" name="periodNum" value="{$T.index}"/>
				<input type="hidden" name="dtlId" value="{$T.dtl.id}" />
				<div class="col-md-3">
					<div class="input-group">
						<input type="text" name="shortStartTime"  class="form-control timepicker timepicker-24" value="{$T.dtl.shortstarttime}">
						<span class="input-group-btn">
							<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
						</span>
					</div>
				</div>
			   <label class="control-label" style="width:50px;float:left;">至</label>
			  <div class="col-md-3">
					<div class="input-group">
						<input type="text"  name="shortEndTime"  class="form-control timepicker timepicker-24" value="{$T.dtl.shortendtime}">
						<span class="input-group-btn">
								<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
						</span>
					</div>
			 </div>
		    </div>
		{#/for}

	</div>
	<div class="form-actions">
		<div class="row">
			<div class="col-md-offset-3 col-md-9">
                  <button type="button" id="action_submit_edit" class="btn blue"><i class="fa fa-check"></i> 保存</button>
                  <button type="reset" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i> 重置</button>
                  
			</div>
		</div>
	</div>
</form>


              
--></textarea>
<!-- 新增上课时间 -->
<textarea id="temp_add_periods" rows="0" cols="0"><!--

<form action="#" id="form_add_periods" class="form-horizontal form-row-sepe">
	<div class="form-body">
		<h4 class="form-section" >上午课时</h4>
		{#for index = 1 to  $T.morningperiods}
		<div class="form-group morning-periods-group">
			<label class="control-label col-md-3">{#if $T.index ==1 } 第一节 {#elseif $T.index==2}第二节{#elseif $T.index==3}第三节{#elseif $T.index==4}第四节{#elseif $T.index==5}第五节{#elseif $T.index==6}第六节{#/if}</label>
			<input type="hidden" name="periodNum" value="{$T.index}"/>
			<div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortStartTime" class="form-control timepicker timepicker-24" >
					<span class="input-group-btn">
						<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
			</div>
		   <label class="control-label" style="width:50px;float:left;">至</label>
		  <div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortEndTime" class="form-control timepicker timepicker-24">
					<span class="input-group-btn">
							<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
		 </div>
	  </div>
	  {#/for}
      <h4 class="form-section afternoon-periods-group">下午课时</h4>
		{#for index = 1 to  $T.afternoonperiods}
		<div class="form-group afternoon-periods-group">
			<label class="control-label col-md-3">{#if $T.index ==1 } 第一节 {#elseif $T.index==2}第二节{#elseif $T.index==3}第三节{#elseif $T.index==4}第四节{#elseif $T.index==5}第五节{#elseif $T.index==6}第六节{#/if}</label>
		    <input type="hidden" name="periodNum" value="{$T.index}"/>
			<div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortStartTime" class="form-control timepicker timepicker-24">
					<span class="input-group-btn">
						<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
			</div>
		   <label class="control-label" style="width:50px;float:left;">至</label>
		  <div class="col-md-3">
				<div class="input-group">
					<input type="text" name="shortEndTime"  class="form-control timepicker timepicker-24" >
					<span class="input-group-btn">
							<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
					</span>
				</div>
		 </div>
	    </div>
	   {#/for}

	    {#if $T.nightperiods>0 }
		  <h4 class="form-section">晚上课时</h4>
		   {#for index = 1 to  $T.nightperiods}
				<div class="form-group night-periods-group last">
					<label class="control-label col-md-3">{#if $T.index ==1 } 第一节 {#elseif $T.index==2}第二节{#elseif $T.index==3}第三节{#elseif $T.index==4}第四节{#elseif $T.index==5}第五节{#elseif $T.index==6}第六节{#/if}</label>
			        <input type="hidden" name="periodNum" value="{$T.index}"/>
					
					<div class="col-md-3">
						<div class="input-group">
							<input type="text" name="shortStartTime"  class="form-control timepicker timepicker-24" value="">
							<span class="input-group-btn">
								<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
							</span>
						</div>
					</div>
				   <label class="control-label" style="width:50px;float:left;">至</label>
				  <div class="col-md-3">
						<div class="input-group">
							<input type="text"  name="shortEndTime"  class="form-control timepicker timepicker-24" value="">
							<span class="input-group-btn">
									<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
							</span>
						</div>
				 </div>
			    </div>
			 {#/for}
	     {#/if}
	</div>
	<div class="form-actions">
		<div class="row">
			<div class="col-md-offset-3 col-md-9">
                  <button type="button" id="action_submit_add" class="btn blue"><i class="fa fa-check"></i> 保存</button>
                  <button type="reset" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i> 重置</button>
                  
			</div>
		</div>
	</div>
</form>

--></textarea>
</p>
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
<script src="${static_ctx}/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js" type="text/javascript"></script>
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
<script src="${base_ctx}/scripts/period_time_dtl.js?t=${timestamp}"></script>
<script>

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	Custom.init();
});

</script>

<!-- END PAGE LEVEL SCRIPTS -->
</div>
</html>