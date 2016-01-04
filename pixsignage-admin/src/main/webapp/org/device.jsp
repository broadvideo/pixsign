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
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div class="page-content-wrapper">
			<div class="page-content">
			
				<!-- 终端文件列表对话框  -->
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
											<li id="nav_tab2" class="imageflag"><a href="#portlet_tab2" data-toggle="tab"><spring:message code="global.image"/></a></li>
											<li id="nav_tab1" class="videoflag"><a href="#portlet_tab1" data-toggle="tab"><spring:message code="global.video"/></a></li>
										</ul>
									</div>
									<div class="portlet-body">
										<div class="tab-content">
											<div class="tab-pane" id="portlet_tab1">
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
			
				<!-- BEGIN PAGE HEADER-->
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
				<!-- END PAGE HEADER-->
			
				<!-- BEGIN PAGE CONTENT-->
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
								<div class="tab-content">
									<div class="tab-pane active" id="portlet_device1">
										<div class="table-toolbar">
											<div class="btn-group">
												<a class="btn default blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
												<spring:message code="global.branchselect"/>  <i class="fa fa-angle-down"></i></a>
												<ul class="dropdown-menu pull-right">
													<div class="pre-scrollable" id="SelectBranchTree">
													</div>
												</ul>
											</div>
											<div id="BranchBreadcrumb" class="page-breadcrumb breadcrumb">
											</div>
										</div>
										<table id="MyTable" class="table table-striped table-bordered table-hover">
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

<script src="${static_ctx}/global/plugins/bootstrap-jstree/jquery.jstree.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=0" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-device.js?t=8"></script>
<script>
var myBranchid = <%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getBranchid() %>;
var videoflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getVideoflag() %>;
var imageflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getImageflag() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initDeviceFileModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
