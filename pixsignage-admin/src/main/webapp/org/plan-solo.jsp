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

		<div id="PlandtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static" style="z-index: 10051;">
			<div class="modal-dialog modal-wide">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<form id="PlandtlForm" class="form-horizontal" method="POST">
							<div class="form-body">
								<div class="form-group plandtl-duration">
									<label class="col-md-3 control-label"><spring:message code="global.duration"/><span class="required">*</span></label>
									<div class="col-md-9">
										<div class="input-icon right">
											<i class="fa"></i> <input type="text" class="form-control" name="duration" />
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.maxtimes"/><span class="required">*</span></label>
									<div class="col-md-9">
										<div class="input-icon right">
											<i class="fa"></i> <input type="text" class="form-control" name="maxtimes" />
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
						<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
					</div>
				</div>
			</div>
		</div>

		<div id="PlanModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-full">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">

								<div id="MyWizard">
									<div class="form-wizard">
										<div class="form-body">
											<ul class="nav nav-pills nav-justified steps">
												<li>
													<a href="#tab1" data-toggle="tab" class="step">
														<span class="number">1</span>
														<span class="desc"><i class="fa fa-check"></i> <spring:message code="global.plan.baseedit"/></span>   
													</a>
												</li>
												<li>
													<a href="#tab2" data-toggle="tab" class="step">
														<span class="number">2</span>
														<span class="desc"><i class="fa fa-check"></i> <spring:message code="global.plan.programdetail"/></span>   
													</a>
												</li>
												<li>
													<a href="#tab3" data-toggle="tab" class="step">
														<span class="number">3</span>
														<span class="desc"><i class="fa fa-check"></i> <spring:message code="global.plan.devicedetail"/></span>   
													</a>
												</li>
											</ul>
															
											<div class="tab-content">
												<div class="alert alert-danger display-none">
													<button class="close" data-dismiss="alert"></button>
													You have some form errors. Please check below.
												</div>
												<div class="alert alert-success display-none">
													<button class="close" data-dismiss="alert"></button>
													Your form validation is successful!
												</div>
																
												<div class="tab-pane" id="tab1">
													<form id="PlanOptionForm" class="form-horizontal" data-async method="POST">
														<!-- 
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.plan.startdate"/><span class="required">*</span></label>
															<div class="col-md-1 checkbox-list">
																<label class="checkbox-inline">
																	<input type="checkbox" name="plan.startdate.unlimited" value="1"><spring:message code="global.plan.unlimited"/>
																</label>
															</div>
															<div class="col-md-3">
																<div class="input-group date form_date">                                       
																	<input type="text" size="16" readonly class="form-control" name="plan.startdate">
																	<span class="input-group-btn">
																	<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																	</span>
																</div>
															</div>
														</div>
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.plan.enddate"/><span class="required">*</span></label>
															<div class="col-md-1 checkbox-list">
																<label class="checkbox-inline">
																	<input type="checkbox" name="plan.enddate.unlimited" value="1"><spring:message code="global.plan.unlimited"/>
																</label>
															</div>
															<div class="col-md-3">
																<div class="input-group date form_date">                                       
																	<input type="text" size="16" readonly class="form-control" name="plan.enddate">
																	<span class="input-group-btn">
																	<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																	</span>
																</div>
															</div>
														</div>
														 -->
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.plan.playtime"/><span class="required">*</span></label>
															<div class="col-md-1 checkbox-list">
																<label class="checkbox-inline">
																	<input type="checkbox" name="plan.fulltime" value="1"><spring:message code="global.plan.fulltime"/>
																</label>
															</div>
															<div class="col-md-3">
																<div class="input-group date form_time">                                       
																	<input type="text" size="16" readonly class="form-control" name="plan.starttime">
																	<span class="input-group-btn">
																	<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																	</span>
																</div>
															</div>
															<div class="col-md-3">
																<div class="input-group date form_time">                                       
																	<input type="text" size="16" readonly class="form-control" name="plan.endtime">
																	<span class="input-group-btn">
																	<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																	</span>
																</div>
															</div>
														</div>
													</form>
												</div>

												<div class="tab-pane" id="tab2">
													<div class="row">
														<div class="col-md-8 col-sm-12">
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
														
														<div class="col-md-4 col-sm-12">
															<div class="portlet box green">
																<div class="portlet-title">
																	<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.detail"/></div>
																</div>
																<div class="portlet-body">
																	<div class="table-responsive">
																		<table id="SelectedDtlTable" class="table table-condensed table-hover">
																			<thead></thead>
																			<tbody></tbody>
																		</table>
																	</div>
																</div>
															</div>
														</div>
														
													</div>
												</div>
												
												<div class="tab-pane" id="tab3">
													<div class="row">
														<div class="col-md-7">
															<div class="portlet box blue tabbable">
																<div class="portlet-title">
																	<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.plan.devicewarehouse"/></div>
																	<ul class="nav nav-tabs">
																		<li id="nav_dtab1" class="active">
																			<a href="#device_tab" data-toggle="tab"><spring:message code="global.device"/></a>
																		</li>
																		<li id="nav_dtab2">
																			<a href="#device_tab" data-toggle="tab"><spring:message code="global.devicegroup"/></a>
																		</li>
																	</ul>
																</div>
																<div class="portlet-body">
																	<div class="tab-content">
																		<div class="tab-pane active" id="device_tab">
																			<div class="row">
																				<div class="col-md-3">
																					<div id="DeviceBranchTreeDiv"></div>
																				</div>
																				<div class="col-md-9">
																					<div id="DeviceDiv">
																						<table id="DeviceTable" class="table table-condensed table-hover">
																							<thead></thead>
																							<tbody></tbody>
																						</table>
																					</div>
																					<div id="DevicegroupDiv" style="display:none">
																						<table id="DevicegroupTable" class="table table-condensed table-hover">
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
														<div class="col-md-5">
															<div class="portlet box green">
																<div class="portlet-title">
																	<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.plan.deviceselected"/></div>
																</div>
																<div class="portlet-body">
																	<div class="table-responsive">
																		<table id="SelectedBindTable" class="table table-condensed table-hover">
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
														
										<div class="fluid">
											<div class="row">
												<div class="col-md-12">
													<div class="col-md-offset-9 col-md-3">
														<a href="javascript:;" class="btn default button-previous" style="display: none;"><i class="m-icon-swapleft"></i> <spring:message code="global.wizard.previous"/> </a>
														<a href="javascript:;" class="btn blue button-next"><spring:message code="global.wizard.next"/> <i class="m-icon-swapright m-icon-white"></i></a>
														<a href="javascript:;" class="btn green button-submit" style="display: none;"><spring:message code="global.submit"/> <i class="m-icon-swapright m-icon-white"></i></a>                            
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
								<div class="caption"><i class="fa fa-desktop"></i><spring:message code="global.schedule"/></div>
								<div class="tools">
									<a href="javascript:;" onClick="refreshPlan();" class="reload"></a>
								</div>
							</div>
							<div class="portlet-body">
								<div class="table-toolbar">
									<div class="btn-group">
										<button class="btn green pix-add">
											<spring:message code="global.add"/> <i class="fa fa-plus"></i>
										</button>
									</div>
								</div>
								<table id="PlanTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-branchtree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-preview.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-plan-solo.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
