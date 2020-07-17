<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/admin/pages/css/timeline-old.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
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
									<div class="caption"><i class="fa fa-calendar"></i><spring:message code="pixsign.schedule"/></div>
									<div class="actions">
										<a class="btn default btn-sm yellow pix-add-schedule" href="#"><i class="fa fa-plus"></i><spring:message code="pixsign.addschedule"/></a>
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
																<input type="radio" name="playmode" value="2" checked> <spring:message code="pixsign.daily"/>
															</label>
														</div>
													</div>
													<div class="form-group schedule-add">
														<label class="col-md-3 control-label"><spring:message code="pixsign.prop.starttime"/><span class="required">*</span></label>
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
														<label class="col-md-3 control-label"><spring:message code="pixsign.bundle"/><span class="required">*</span></label>
														<div class="col-md-9">
															<div class="portlet box blue">
																<div class="portlet-title">
																	<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.warehouse"/></div>
																	<ul class="nav nav-tabs">
																		<li id="nav_tab2" class="touch-ctrl" style="display:none">
																			<a href="#portlet_tab" data-toggle="tab"><spring:message code="pixsign.touchbundle"/></a>
																		</li>
																		<li id="nav_tab1" class="active">
																			<a href="#portlet_tab" data-toggle="tab"><spring:message code="pixsign.bundle"/></a>
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
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.attachschedule"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="menu.schedule"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="ScheduleModule.refresh();" class="reload"></a>
							</div>
							<ul class="nav nav-tabs" style="margin-right: 30px;">
								<li class="devicegroup-navigator"><a href="#DevicegroupTab" data-toggle="tab"><spring:message code="pixsign.devicegroup"/></a></li>
								<li class="device-navigator" devicetype="10" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device10"/></a></li>
								<li class="device-navigator" devicetype="7" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device7"/></a></li>
								<li class="device-navigator" devicetype="6" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device6"/></a></li>
								<li class="device-navigator" devicetype="2" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device2"/></a></li>
								<li class="device-navigator" devicetype="1" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device1"/></a></li>
							</ul>
						</div>
						<div class="portlet-body" id="SchedulePortlet">
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-10">
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
</body>

<div id="SiteMethJavaScript">
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
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/plan/schedule-solo-attach.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/bundle/preview.js?t=${timestamp}"></script>
<script>
var TouchCtrl = <%=(session_org != null && session_org.getTouchflag().equals("1"))%>;
var Max1 = <%=session_org == null ? 0 : session_org.getMaxDevices("1")%>;
var Max2 = <%=session_org == null ? 0 : session_org.getMaxDevices("2")%>;
var Max6 = <%=session_org == null ? 0 : session_org.getMaxDevices("6")%>;
var Max7 = <%=session_org == null ? 0 : session_org.getMaxDevices("7")%>;
var Max10 = <%=session_org == null ? 0 : session_org.getMaxDevices("10")%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	ScheduleModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
