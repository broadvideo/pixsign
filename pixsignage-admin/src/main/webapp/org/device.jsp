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
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
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
<link href="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div id="DeviceMapModal" class="modal fade modal-scroll" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div id="DeviceMapDiv" style="width:100%; height:600px;"></div>
					</div>
					<div class="modal-footer">
						<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
					</div>
				</div>
			</div>
		</div>

		<div id="ScreenModal" class="modal fade modal-scroll" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-md-5">
								<div class="portlet box blue">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.device.screenlist"/></div>
									</div>
									<div class="portlet-body">
										<table id="ScreenTable" class="table table-condensed table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
								</div>
							</div>
							<div class="col-md-7">
								<div class="portlet box green">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.detail"/></div>
									</div>
									<div id="ScreenPreview" class="portlet-body">
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
					</div>
				</div>
			</div>
		</div>

		<div id="DeviceFileModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
				<div class="row">
					<div class="col-md-12">
	
						<div class="portlet box blue tabbable">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.devicefile"/></div>
								<div class="tools">
									<a href="javascript:;" class="reload pix-DeviceFileReload"></a>
								</div>
								<ul class="nav nav-tabs" style="margin-right: 30px;">
									<li id="nav_tab2"><a href="#portlet_tab2" data-toggle="tab"><spring:message code="global.image"/></a></li>
									<li id="nav_tab1" class="active"><a href="#portlet_tab1" data-toggle="tab"><spring:message code="global.video"/></a></li>
								</ul>
							</div>
							<div class="portlet-body">
								<div class="tab-content">
									<div class="tab-pane active" id="portlet_tab1">
										<table id="DeviceVideoTable" class="table table-striped table-bordered table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
									<div class="tab-pane" id="portlet_tab2">
										<table id="DeviceImageTable" class="table table-striped table-bordered table-hover">
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
					<div class="modal-footer">
						<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
					</div>
				</div>
			</div>
		</div>
		
		<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						<h4 class="modal-title"><spring:message code="global.device"/></h4>
					</div>
					<div class="modal-body">
						<form id="MyEditForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
							<input type="hidden" name="device.deviceid" value="0" />
							<input type="hidden" name="device.branchid" value="0" />
							<input type="hidden" name="device.status" value="1" />
							<div class="form-body">
								<div class="form-group">
									<label class="col-md-3 control-label required"><spring:message code="global.terminalid"/></label>
									<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.terminalid"></label>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
									<div class="col-md-9">
										<div class="input-icon right">
											<i class="fa"></i> <input type="text" class="form-control" name="device.name" />
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.position"/></label>
									<div class="col-md-9">
										<div class="input-icon right">
											<i class="fa"></i> <input type="text" class="form-control" name="device.position" />
										</div>
									</div>
								</div>
								<div class="form-group option1">
									<label class="col-md-3 control-label"><spring:message code="global.branch"/><span class="required">*</span></label>
									<div class="col-md-9">
										<div class="pre-scrollable" id="EditFormBranchTree"></div>
									</div>	
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.description"/></label>
									<div class="col-md-9">
										<textarea class="form-control" rows="2" name="device.description"></textarea>
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

		<div id="UTextModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						<h4 class="modal-title"><spring:message code="global.device"/></h4>
					</div>
					<div class="modal-body">
						<form id="UTextForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
							<div class="form-body">
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.count"/><span class="required">*</span></label>
									<div class="col-md-9">
										<div class="input-icon right">
											<i class="fa"></i> <input type="text" class="form-control" name="count" value="0" />
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.position"/></label>
									<div class="col-md-9 radio-list">
										<label class="radio-inline">
											<input type="radio" name="position" value="top"> <spring:message code="global.position.top"/>
										</label>
										<label class="radio-inline">
											<input type="radio" name="position" value="center"> <spring:message code="global.position.center"/>
										</label>
										<label class="radio-inline">
											<input type="radio" name="position" value="bottom" checked> <spring:message code="global.position.bottom"/>
										</label>  
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.layout.region.speed"/></label>
									<div class="col-md-9 radio-list">
										<label class="radio-inline">
											<input type="radio" name="speed" value="1"> <spring:message code="global.layout.region.speed_1"/>
										</label>
										<label class="radio-inline">
											<input type="radio" name="speed" value="2" checked> <spring:message code="global.layout.region.speed_2"/>
										</label>
										<label class="radio-inline">
											<input type="radio" name="speed" value="3"> <spring:message code="global.layout.region.speed_3"/>
										</label>  
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.layout.region.color"/></label>
									<div class="col-md-9">
										<div class="input-group colorpicker-component colorPick">
											<input type="text" name="color" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
											<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.layout.region.size"/></label>
									<div class="col-md-9">
										<input class="sizeRange" type="text" name="size" value="50"/>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.layout.region.bgcolor"/></label>
									<div class="col-md-9">
										<div class="input-group colorpicker-component bgcolorPick">
											<input type="text" name="bgcolor" value="#000000" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
											<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.layout.region.opacity"/></label>
									<div class="col-md-9">
										<input class="opacityRange" type="text" name="opacity" value=""/>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.text"/><span class="required">*</span></label>
									<div class="col-md-9">
										<textarea class="form-control" rows="3" name="text"></textarea>
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

		<div class="page-content-wrapper">
			<div class="page-content">
				<h3 class="page-title"><spring:message code="menu.device"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.devicemanage"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.device"/></a>
						</li>
					</ul>
				</div>
			
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue tabbable">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-desktop"></i><spring:message code="global.device"/></div>
								<div class="tools">
									<a href="javascript:;" class="reload pix-DeviceReload"></a>
								</div>
								<ul class="nav nav-tabs" style="margin-right: 30px;">
									<li id="UnDeviceTab"><a href="#portlet_device2" data-toggle="tab"><spring:message code="global.device.unregister"/></a></li>
									<li class="active" id="DeviceTab"><a href="#portlet_device1" data-toggle="tab"><spring:message code="global.device.register"/></a></li>
								</ul>
							</div>
							<div class="portlet-body">
								<div class="row">
									<div class="col-md-2" id="BranchTreeDiv">
									</div>
									<div class="tab-content col-md-10" id="BranchContentDiv">
										<div class="tab-pane active" id="portlet_device1">
											<div class="table-toolbar">
												<div class="btn-group">
													<button class="btn red pix-utext"><spring:message code="global.utext"/> <i class="fa fa-bolt"></i></button>
												</div>
												<div class="btn-group">
													<button class="btn blue pix-ucancel"><spring:message code="global.ucancel"/> <i class="fa fa-circle-o-notch"></i></button>
												</div>
												<!-- 
												<div class="btn-group">
													<a class="btn default blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
													<spring:message code="global.branchselect"/>  <i class="fa fa-angle-down"></i></a>
													<ul class="dropdown-menu pull-right">
													</ul>
												</div>
												<div id="BranchBreadcrumb" class="page-breadcrumb breadcrumb">
												</div>
												-->
											</div>
											<table id="DeviceTable" class="table table-striped table-bordered table-hover">
												<thead></thead>
												<tbody></tbody>
											</table>
										</div>
										<div class="tab-pane" id="portlet_device2">
											<table id="UnDeviceTable" class="table table-striped table-bordered table-hover">
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
	
	<div class="page-footer">
		<div class="page-footer-inner">
			<%if (session_org == null || session_org.getCopyright() == null || session_org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;<spring:message code="global.copyright"/>
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="http://api.map.baidu.com/api?v=2.0&ak=vItwdDkCtAtruyhGGHxhkvlTTakaY9RO" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=3" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-branchtree.js?t=1"></script>
<script src="${base_ctx}/scripts/pix-device.js?t=5"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initBranchTree();
	initMyTable();
	initMyEditModal();
	initScreenModal();
	initDeviceFileModal();
	initMapModal();
	initUTextModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
