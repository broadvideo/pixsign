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
<title>Digital Signage</title>
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
		
				<div class="row">
					<div class="col-md-12">
						<h3 class="page-title"><spring:message code="global.dashboard"/></h3>
					</div>
				</div>
		
				<div class="row ">
					<div class="col-md-12 col-sm-12">
						<span id="ExpireTime"></span>
					</div>
				</div>
				<div class="clearfix"></div>
		
				<div class="row ">
					<div class="col-md-6 col-sm-6">
						<span id="CurrentDevices"></span><span id="MaxDevices" class="badge badge-danger" style="float: right;"></span>
						<div class="progress">
							<div id="CurrentDevicesProgress" class="progress-bar " role="progressbar" style="width: 0%"></div>
						</div>
					</div>
		
					<div class="col-md-6 col-sm-6">
						<span id="CurrentStorage"></span><span id="MaxStorage" class="badge badge-danger" style="float: right;"></span>
						<div class="progress">
							<div id="CurrentStorageProgress" class="progress-bar " role="progressbar" style="width: 0%"></div>
						</div>
					</div>
		
				</div>
		
				<div class="row ">
					<div class="col-md-6 col-sm-6">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-bell-o"></i><spring:message code="global.main.title1"/>
								</div>
								<div class="actions">
									<a href="device.jsp?CurrentP=30201&ParentP=302" class="btn btn-sm default easy-pie-chart-reload"><i
										class="m-icon-swapright"></i> <spring:message code="global.more"/></a>
								</div>
							</div>
							<div class="portlet-body">
								<table id="DeviceTable" class="table table-striped">
									<thead></thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
					</div>
		
					<div class="col-md-6 col-sm-6">
						<div class="portlet solid bordered light-grey">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-bar-chart-o"></i><spring:message code="global.main.title2"/>
								</div>
							</div>
							<div class="portlet-body">
								<div id="DeviceChart" class="chart"></div>
							</div>
						</div>
					</div>
		
				</div>
		
				<div class="clearfix"></div>
				<div class="row">
					<div class="col-md-6 col-sm-6">
						<div class="portlet solid bordered light-grey">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-bar-chart-o"></i><spring:message code="global.main.title3"/>
								</div>
							</div>
							<div class="portlet-body">
								<div id="MediaStatLoding">
									<img src="${static_ctx}/admin/layout/img/loading.gif" alt="loading" />
								</div>
								<div id="MediaStat" class="display-none">
									<div id="MediaStatPlot" class="chart"></div>
								</div>
							</div>
						</div>
					</div>
		
					<div class="col-md-6 col-sm-6">
						<div class="portlet solid bordered light-grey">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-bar-chart-o"></i><spring:message code="global.main.title4"/>
								</div>
							</div>
							<div class="portlet-body">
								<div id="FileStatLoding">
									<img src="${static_ctx}/admin/layout/img/loading.gif" alt="loading" />
								</div>
								<div id="FileStat" class="display-none">
									<div id="FileStatPlot" class="chart"></div>
								</div>
							</div>
						</div>
					</div>
		
				</div>

				<div class="clearfix"></div>
				<div class="row">
					<div class="col-md-12 col-sm-12">
						<div class="portlet solid bordered light-grey">
							<div class="portlet-title">
								<div class="caption">
									<i class="fa fa-bar-chart-o"></i><spring:message code="global.main.title5"/>
								</div>
							</div>
							<div class="portlet-body">
								<table id="APPTable" class="table table-striped table-bordered table-hover">
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

<script src="${static_ctx}/global/plugins/flot/jquery.flot.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/flot/jquery.flot.pie.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=2" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-orgmain.js?t=0"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init();
	initLicense();
	initDeviceTable();
	initDeviceChart();
	initMediaChart();
	initFileChart();
	initAPPTable();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
