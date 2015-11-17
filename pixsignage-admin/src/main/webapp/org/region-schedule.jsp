<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

<%
response.setHeader("Cache-Control","no-store");
response.setHeader("Pragrma","no-cache");
response.setDateHeader("Expires",0);
%>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>Pix Signage</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta content="" name="description" />
<meta content="" name="author" />
<meta name="MobileOptimized" content="320">
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN PAGE LEVEL STYLES -->
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/admin/pages/css/timeline-old.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div class="page-content-wrapper">
			<div class="page-content">
			
				<div id="ScheduleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							</div>
							<div class="modal-body">
								<form id="ScheduleForm" class="form-horizontal" method="POST">
									<div class="form-body">
										<input type="hidden" name="regionschedule.regionscheduleid" value="0" />
										<input type="hidden" name="regionschedule.bindtype" />
										<input type="hidden" name="regionschedule.bindid" />
										<input type="hidden" name="regionschedule.regionid" />
										<div class="form-group">
											<label class="control-label col-md-3"><spring:message code="global.option"/></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="regionschedule.playmode" value="2" checked> <spring:message code="global.daily"/>
												</label>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.starttime"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-group date form_time">                                       
													<input type="text" size="16" readonly class="form-control" name="regionschedule.starttime">
													<span class="input-group-btn">
													<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
													</span>
												</div>
											</div>
										</div>

										<div class="form-group objtype-0">
											<label class="control-label col-md-3"><spring:message code="global.type"/></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="regionschedule.objtype" value="1" checked> <spring:message code="global.medialist"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="regionschedule.objtype" value="3"> <spring:message code="global.stream"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="regionschedule.objtype" value="4"> <spring:message code="global.dvb"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="regionschedule.objtype" value="5"> <spring:message code="global.widget"/>
												</label>
											</div>
										</div>
										<div class="form-group objtype-1">
											<label class="control-label col-md-3"><spring:message code="global.type"/></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="regionschedule.objtype" value="2"> <spring:message code="global.text"/>
												</label>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.detail"/><span class="required">*</span></label>
											<div class="col-md-9">
												<input type="hidden" id="RegionDtlSelect" class="form-control select2" name="regionschedule.objid" />
											</div>
										</div>
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
								<button class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
							</div>
						</div>
					</div>
				</div>
			
		
				<!-- BEGIN PAGE HEADER-->
				<h3 class="page-title"><spring:message code="menu.regionschedule"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.regionschedule"/></a>
						</li>
					</ul>
				</div>
				<!-- END PAGE HEADER-->
			
				<!-- BEGIN PAGE CONTENT-->
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.regionschedule"/></div>
								<div class="tools">
									<a href="javascript:;" onClick="refreshLeftTab();" class="reload"></a>
								</div>
								<ul class="nav nav-tabs" style="margin-right: 30px;">
									<li><a id="DeviceTab" href="#TopTab" data-toggle="tab"><spring:message code="global.device"/></a></li>
									<li class="active"><a id="DevicegroupTab" href="#TopTab" data-toggle="tab"><spring:message code="global.devicegroup"/></a></li>
								</ul>
							</div>
							<div class="portlet-body">
								<div class="tab-content">
									<div class="tab-pane active" id="TopTab">
										<div class="row">
											<div class="col-md1 col-sm-1">
												<h3 class="event-form-title"><spring:message code="global.select"/></h3>
											</div>
											<div class="col-md3 col-sm-3">
												<input type="hidden" id="DeviceSelect" class="form-control select2">
											</div>
											<div class="col-md8 col-sm-8">
												<a class="btn purple pull-right pix-syncschedule" href="#"><i class="fa fa-rss"></i> <spring:message code="global.syncschedule"/></a>&nbsp;
												<a class="btn green pull-right pix-addschedule" href="#"><i class="fa fa-plus"></i> <spring:message code="global.addschedule"/></a>
											</div>
										</div>
										<br/>
										
										<div class="row">
											<div id="LeftTab" class="col-md-2 col-sm-2 col-xs-2">
											</div>
											<div class="col-md-10 col-sm-10 col-xs-10">
												<div class="tab-content">
													<div id="ScheduleDetail" class="tab-pane active">
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- END PAGE CONTENT -->
			</div>
		</div>

	</div>
	<!-- END CONTAINER -->
	
	<!-- BEGIN FOOTER -->
	<div class="footer">
		<div class="footer-inner">
			<%if (session_org == null || session_org.getCopyright() == null || session_org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;&nbsp;${global_copyright}
			<%} else { %>
			©<%=session_org.getCopyright()%>
			<%} %>
		</div>
		<div class="footer-tools">
			<span class="go-top">
			<i class="fa fa-angle-up"></i>
			</span>
		</div>
	</div>
	<!-- END FOOTER -->
	
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->   
<!--[if lt IE 9]>
<script src="${static_ctx}/global/plugins/respond.min.js"></script>
<script src="${static_ctx}/global/plugins/excanvas.min.js"></script> 
<![endif]-->   
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-region-schedule.js?t=2"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init();
	initRegionSchedules();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
