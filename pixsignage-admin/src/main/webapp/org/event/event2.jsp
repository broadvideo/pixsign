<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link  type="text/css" href="${static_ctx}/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css"  rel="stylesheet" />
<link href="${static_ctx}/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<style type="text/css">
  #preview,
  .img,
  img{
    width: 100px;
    height: 100px;
   }
   
  #preview {
    border: 1px solid #000;
  }
</style>
</head>
<body>
	<div class="page-content-wrapper">
		<div class="page-content">
			<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static"  >
				<div class="modal-dialog modal-wide modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title"><spring:message code="menu.event2"/></h4>
						</div>
						<div class="modal-body">
							<form id="MyEditForm" class="form-horizontal" method="POST"  >
								<input type="hidden" name="event.eventid" />
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label">考勤分组<span class="required">*</span></label>
										<div class="col-md-9">
											<i class="fa"></i><input type="hidden" id="ClassSelect" class="form-control select2" name="event.roomid">
										</div>
									</div>
									 <div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="event.name" />
												</div>
											</div>
									 </div>
									  <div class="form-group">
											<label class="col-md-3 control-label">日期<span class="required">*</span></label>
											<div class="col-md-3">
											
											   <div class="input-group  date date-picker" data-date-format="yyyy-mm-dd" data-date-start-date="+0d">
														<input type="text" id="startdate" name="event.startdate" class="form-control" readonly>
														<span class="input-group-btn">
														<button class="btn default" type="button"><i class="fa fa-calendar"></i></button>
														</span>
												</div>
										    </div>		
										   <label class="control-label col-md-1" style="text-align:center">至</label>
									
										   <div class="col-md-3">
												<div class="input-group  date date-picker" data-date-format="yyyy-mm-dd" data-date-start-date="+0d">
														<input type="text" id="enddate" name="event.enddate"  class="form-control" readonly>
														<span class="input-group-btn">
														  <button class="btn default" type="button"><i class="fa fa-calendar"></i></button>
														</span>
												</div>
											</div>
										</div>
									
									    <div class="form-group">
											<label class="col-md-3 control-label">时间段<span class="required">*</span></label>
										    <div class="col-md-3">
												<div class="input-group">
													<input type="text" id="shortstarttime" name="event.shortstarttime" class="form-control timepicker timepicker-24">
													<span class="input-group-btn">
													  <button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
													</span>
												</div>
											</div>
											<label class="control-label col-md-1" style="text-align:center">至</label>
											<div class="col-md-3">
												<div class="input-group">
													<input type="text" id="shortendtime" name="event.shortendtime" class="form-control timepicker timepicker-24">
													<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
													</span>
												</div>
											</div>
										</div>
									   <div class="form-group" >
									        <label class="col-md-3 control-label">&nbsp;</label>
									        <div class="col-md-9">
									
												<div class="md-radio-inline">
													<div class="md-radio">
														<input type="radio" id="byDay" name="event.type" class="md-radiobtn"  value="0" >
														<label for="byDay">
														<span></span>
														<span class="check"></span>
														<span class="box"></span>
														 每天 </label>
													</div>
													<div class="md-radio">
														<input type="radio" id="workDays" name="event.type" class="md-radiobtn" value="1" checked >
														<label for="workDays">
														<span></span>
														<span class="check"></span>
														<span class="box"></span>
														工作日</label>
													</div>
													<div class="md-radio">
														<input type="radio" id="customDays" name="event.type" class="md-radiobtn" value="2" >
														<label for="customDays">
														<span></span>
														<span class="check"></span>
														<span class="box"></span>
														自定义</label>
													</div>
											      </div>
										  </div>
									   </div>
									   <div class="form-group week-form-group" style="display:none;">
									        <label class="col-md-3 control-label">&nbsp;</label>
										    <label class="checkbox-inline col-md-2"><input type="checkbox" name="dayofweek"  >周一 </label>
											<div class="col-md-3">
												  <div class="input-group">
															<input type="text"  name="shortstarttime" class="form-control timepicker timepicker-24" >
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
													</div>
													<label class="control-label col-md-1">至</label>
													<div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortendtime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
													</div>
											</div>
									   </div>
									    <div class="form-group week-form-group" style="display:none;">
									        <label class="col-md-3 control-label">&nbsp;</label>
										        <label class="checkbox-inline col-md-2"><input type="checkbox" name="dayofweek" >周二 </label>
											    <div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortstarttime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
													</div>
												<label class="control-label col-md-1">至</label>
												<div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortendtime"class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
												 </div>
									   </div>
									   <div class="form-group week-form-group" style="display:none;">
									        <label class="col-md-3 control-label">&nbsp;</label>
										    <label class="checkbox-inline col-md-2"><input type="checkbox" name="dayofweek" >周三</label>
											<div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortstarttime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
											</div>
											<label class="control-label col-md-1">至</label>
											<div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortendtime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
											</div>
									   </div>
									   	 
									   <div class="form-group week-form-group" style="display:none;">
									        <label class="col-md-3 control-label">&nbsp;</label>
										        <label class="checkbox-inline col-md-2"><input type="checkbox" name="dayofweek" >周四</label>
											    <div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortstarttime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
												</div>
												<label class="control-label col-md-1">至</label>
												<div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortendtime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
												 </div>
								
									   </div>
									   	 
									   <div class="form-group week-form-group" style="display:none;">
									        <label class="col-md-3 control-label">&nbsp;</label>
										        <label class="checkbox-inline col-md-2"><input type="checkbox" name="dayofweek" >周五</label>
											    <div class="col-md-3">
														<div class="input-group">
															<input type="text"  name="shortstarttime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
												</div>
												<label class="control-label col-md-1">至</label>
												<div class="col-md-3">
														<div class="input-group">
															<input type="text"  name="shortendtime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
												 </div>
											
									   </div>
									   	 
									   <div class="form-group week-form-group" style="display:none;">
									            <label class="col-md-3 control-label">&nbsp;</label>
										        <label class="checkbox-inline col-md-2"><input type="checkbox" name="dayofweek" >周六</label>
											    <div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortstarttime"  class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
												</div>
												<label class="control-label col-md-1" >至</label>
												<div class="col-md-3">
														<div class="input-group">
															<input type="text" name="shortendtime" class="form-control timepicker timepicker-24">
															<span class="input-group-btn">
															<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
															</span>
														</div>
												</div>
									   </div>
									   	 
									   <div class="form-group week-form-group" style="display:none;">
									        <label class="col-md-3 control-label">&nbsp;</label>
										    <label class="checkbox-inline col-md-2"><input type="checkbox" name="dayofweek">周日</label>
										    <div class="col-md-3">
												<div class="input-group">
														<input type="text" name="shortstarttime" class="form-control timepicker timepicker-24">
														<span class="input-group-btn">
														<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
														</span>
												</div>
											</div>
											<label class="control-label col-md-1" >至</label>
											<div class="col-md-3">
												<div class="input-group">
													<input type="text" name="shortendtime" class="form-control timepicker timepicker-24">
													<span class="input-group-btn">
														<button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
													</span>
												</div>
										    </div>
									   </div>
									
								</div>
								<input type="hidden"  name="event.timedtls"  value=""/>
							</form>
						</div>
						<div class="modal-footer">
							<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
							<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
						</div>
					</div>
				</div>
	
			</div>
			
			<h3 class="page-title"><spring:message code="menu.event2"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.staffattendance"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.event2"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="menu.event2"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button id="MyEditModalBtn"  class="btn green pix-add">新增<i class="fa fa-plus"></i></button>
								</div>
							</div>
							<table id="MyTable" class="table table-striped table-bordered table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>

<div id="SiteMethJavaScript">


<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/moment/moment.min.js"></script>
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-filestyle/bootstrap-filestyle.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>
<script src="${static_ctx}/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.${locale}.min.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/fuelux/js/spinner.min.js" type="text/javascript"></script>	

<!-- END PAGE LEVEL PLUGINS -->



<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/event/event2.js?t=${timestamp}"></script>
<script>
var MyBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
    
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
