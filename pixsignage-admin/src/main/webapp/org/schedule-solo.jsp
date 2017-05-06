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
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div id="ScheduleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-full">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="portlet box purple">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-calendar"></i><spring:message code="global.schedule"/></div>
										<div class="actions">
											<a class="btn default btn-sm yellow pix-add-schedule" href="#"><i class="fa fa-plus"></i><spring:message code="global.addschedule"/></a>
										</div>
									</div>
									<div class="portlet-body form schedule-edit">
										<div class="row">
											<div class="col-md-12 col-sm-12">
												<form id="ScheduleForm" class="form-horizontal">
													<div class="form-body">
														<div class="form-group schedule-add">
															<label class="control-label col-md-3"><spring:message code="global.option"/></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="playmode" value="2" checked> <spring:message code="global.daily"/>
																</label>
															</div>
														</div>
														<div class="form-group schedule-add">
															<label class="col-md-3 control-label"><spring:message code="global.starttime"/><span class="required">*</span></label>
															<div class="col-md-9">
																<div class="input-group date form_time">                                       
																	<input type="text" size="16" readonly class="form-control" name="starttime">
																	<span class="input-group-btn">
																	<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																	</span>
																</div>
															</div>
														</div>
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.selected"/></label>
															<div class="col-md-9 pre-scrollable">
																<table id="SelectedTable" class="table-striped"></table>
															</div>
														</div>
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.bundle"/><span class="required">*</span></label>
															<div class="col-md-9">
																<div class="portlet box blue">
																	<div class="portlet-title">
																		<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.resource.warehouse"/></div>
																		<ul class="nav nav-tabs">
																			<li id="nav_tab2" class="touch-ctrl">
																				<a href="#portlet_tab" data-toggle="tab"><spring:message code="global.touchbundle"/></a>
																			</li>
																			<li id="nav_tab1" class="active">
																				<a href="#portlet_tab" data-toggle="tab"><spring:message code="global.bundle"/></a>
																			</li>
																		</ul>
																	</div>
																	<div class="portlet-body">
																		<div class="tab-content">
																			<div class="tab-pane active" id="portlet_tab">
																				<div class="row">
																					<div class="col-md-12">
																						<div id="BundleDiv">
																							<table id="BundleTable" class="table table-condensed table-hover">
																								<thead></thead>
																								<tbody></tbody>
																							</table>
																						</div>
																						<div id="TouchbundleDiv" style="display:none">
																							<table id="TouchbundleTable" class="table table-condensed table-hover">
																								<thead></thead>
																								<tbody></tbody>
																							</table>
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
													<div class="form-actions right">
														<a class="btn green pix-ok"><spring:message code="global.ok"/></a>
														<a class="btn default pix-cancel"><spring:message code="global.cancel"/></a>
													</div>
												</form>
											</div>
										</div>
									</div>
									<div class="portlet-body schedule-view">
										<div class="row">
											<div class="col-md12 col-sm-12" id="ScheduleDetail">
											</div>
										</div>
										
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer schedule-view">
						<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
						<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
					</div>
				</div>
			</div>
		</div>

		<div class="page-content-wrapper">
			<div class="page-content">
				<h3 class="page-title"><spring:message code="menu.schedule"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.schedule"/></a>
						</li>
					</ul>
				</div>
			
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-desktop"></i><spring:message code="menu.schedule"/></div>
								<div class="tools">
									<a href="javascript:;" onClick="refreshSchedule();" class="reload"></a>
								</div>
								<ul class="nav nav-tabs" style="margin-right: 30px;">
									<li id="DevicegroupNav"><a href="#DevicegroupTab" data-toggle="tab"><spring:message code="global.devicegroup"/></a></li>
									<li id="DeviceNav" class="active"><a href="#DeviceTab" data-toggle="tab"><spring:message code="global.device"/></a></li>
								</ul>
							</div>
							<div class="portlet-body">
								<div class="row">
									<div class="col-md-2" id="BranchTreeDiv">
									</div>
									<div class="col-md-10" id="BranchContentDiv">
										<div class="tab-content">
											<div class="tab-pane" id="DevicegroupTab">
												<table id="DevicegroupTable" class="table table-striped table-bordered table-hover">
													<thead></thead>
													<tbody></tbody>
												</table>
											</div>
											<div class="tab-pane active" id="DeviceTab">
												<table id="DeviceTable" class="table table-striped table-bordered table-hover">
													<thead></thead>
													<tbody></tbody>
												</table>
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

	</div>
	
	<div class="page-footer">
		<div class="page-footer-inner">
			<%if (session_org == null || session_org.getCopyright() == null || session_org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;<%=CommonConfig.SYSTEM_COPYRIGHT%>
			<%} else { %>
			©<%=session_org.getCopyright()%>
			<%} %>
		</div>
		<div class="scroll-to-top">
			<i class="icon-arrow-up"></i>
		</div>
	</div>
	
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=2" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=1" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-branchtree.js?t=1"></script>
<script src="${base_ctx}/scripts/pix-preview.js?t=10"></script>
<script src="${base_ctx}/scripts/pix-schedule-solo.js?t=0"></script>
<script>
var TouchCtrl = <%=(session_org != null && session_org.getTouchflag().equals("1"))%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initBranchTree();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>