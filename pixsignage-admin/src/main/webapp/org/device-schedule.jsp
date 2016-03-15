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
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div id="BundleScheduleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="portlet box purple">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-calendar"></i><spring:message code="global.bundleschedule"/></div>
										<div class="actions">
											<a class="btn default btn-sm yellow pix-add-bundleschedule" href="#"><i class="fa fa-plus"></i><spring:message code="global.addschedule"/></a>
										</div>
									</div>
									<div class="portlet-body form bundle-edit">
										<div class="row">
											<div class="col-md-12 col-sm-12">
												<form id="BundleScheduleForm" class="form-horizontal">
													<div class="form-body">
														<div class="form-group">
															<label class="control-label col-md-3"><spring:message code="global.option"/></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="playmode" value="2" checked> <spring:message code="global.daily"/>
																</label>
															</div>
														</div>
														<div class="form-group">
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
															<label class="col-md-3 control-label"><spring:message code="global.bundle"/><span class="required">*</span></label>
															<div class="col-md-9 pre-scrollable">
																<table id="BundleTable" class="table-striped"></table>
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
									<div class="portlet-body bundle-view">
										<div class="row">
											<div class="col-md12 col-sm-12" id="BundleScheduleDetail">
											</div>
										</div>
										
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer bundle-view">
						<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
						<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
					</div>
				</div>
			</div>
		</div>

		<div id="LayoutScheduleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="portlet box purple">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-calendar"></i><spring:message code="global.layoutschedule"/></div>
										<div class="actions">
											<a class="btn default btn-sm yellow pix-add-layoutschedule" href="#"><i class="fa fa-plus"></i><spring:message code="global.addschedule"/></a>
										</div>
									</div>
									<div class="portlet-body form layout-edit">
										<div class="row">
											<div class="col-md-12 col-sm-12">
												<form id="LayoutScheduleForm" class="form-horizontal">
													<div class="form-body">
														<div class="form-group">
															<label class="control-label col-md-3"><spring:message code="global.option"/></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="playmode" value="2" checked> <spring:message code="global.daily"/>
																</label>
															</div>
														</div>
														<div class="form-group">
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
															<label class="col-md-3 control-label"><spring:message code="global.layout"/><span class="required">*</span></label>
															<div class="col-md-9 pre-scrollable">
																<table id="LayoutTable" class="table-striped"></table>
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
									<div class="portlet-body layout-view">
										<div class="row">
											<div class="col-md12 col-sm-12" id="LayoutScheduleDetail">
											</div>
										</div>
										
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer layout-view">
						<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
						<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
					</div>
				</div>
			</div>
		</div>

		<div id="RegionScheduleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="portlet box purple">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-calendar"></i><spring:message code="global.regionschedule"/></div>
										<div class="actions">
											<a class="btn default btn-sm yellow pix-add-regionschedule" href="#"><i class="fa fa-plus"></i><spring:message code="global.addschedule"/></a>
										</div>
									</div>
									<div class="portlet-body form region-edit">
										<div class="row">
											<div class="col-md-12 col-sm-12">
												<form id="RegionScheduleForm" class="form-horizontal">
													<div class="form-group">
														<label class="control-label col-md-3"><spring:message code="global.option"/></label>
														<div class="col-md-9 radio-list">
															<label class="radio-inline">
																<input type="radio" name="playmode" value="2" checked> <spring:message code="global.daily"/>
															</label>
														</div>
													</div>
													<div class="form-group">
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
			
													<div class="form-group objtype-0">
														<label class="control-label col-md-3"><spring:message code="global.type"/></label>
														<div class="col-md-9 radio-list">
															<label class="radio-inline">
																<input type="radio" name="objtype" value="1" checked> <spring:message code="global.medialist"/>
															</label>
															<label class="radio-inline">
																<input type="radio" name="objtype" value="3"> <spring:message code="global.stream"/>
															</label>
															<label class="radio-inline hide-orgtype-2">
																<input type="radio" name="objtype" value="4"> <spring:message code="global.dvb"/>
															</label>
															<label class="radio-inline">
																<input type="radio" name="objtype" value="5"> <spring:message code="global.widget"/>
															</label>
														</div>
													</div>
													<div class="form-group objtype-1">
														<label class="control-label col-md-3"><spring:message code="global.type"/></label>
														<div class="col-md-9 radio-list">
															<label class="radio-inline">
																<input type="radio" name="objtype" value="2"> <spring:message code="global.text"/>
															</label>
														</div>
													</div>
													<div class="form-group">
														<label class="col-md-3 control-label"><spring:message code="global.detail"/><span class="required">*</span></label>
														<div class="col-md-9">
															<input type="hidden" id="RegionDtlSelect" class="form-control select2" name="objid" />
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
									<div class="portlet-body region-view">
										<div class="row">
											<div id="LeftTab" class="col-md-2 col-sm-2 col-xs-2">
											</div>
											<div class="col-md-10 col-sm-10 col-xs-10">
												<div class="tab-content">
													<div id="RegionScheduleDetail" class="tab-pane active">
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer region-view">
						<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
						<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
					</div>
				</div>
			</div>
		</div>


		<div class="page-content-wrapper">
			<div class="page-content">
				<h3 class="page-title"><spring:message code="menu.deviceschedule"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.deviceschedule"/></a>
						</li>
					</ul>
				</div>
			
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-desktop"></i><spring:message code="menu.deviceschedule"/></div>
								<div class="tools">
									<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
								</div>
							</div>
							<div class="portlet-body">
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

	</div>
	
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=2" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=1" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-preview.js?t=0"></script>
<script src="${base_ctx}/scripts/pix-device-schedule.js?t=2"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
