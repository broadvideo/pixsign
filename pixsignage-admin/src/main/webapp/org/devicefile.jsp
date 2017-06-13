<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/admin/pages/css/timeline-old.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div class="page-content-wrapper">
		<div class="page-content">
			
			<h3 class="page-title"><spring:message code="menu.devicefile"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicefile"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="global.devicefile"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="refreshDeviceDetail();" class="reload"></a>
							</div>
							<ul class="nav nav-tabs" style="margin-right: 30px;">
								<li><a id="DevicegroupTab" href="#TopTab" data-toggle="tab"><spring:message code="global.devicegroup"/></a></li>
								<li class="active"><a id="DeviceTab" href="#TopTab" data-toggle="tab"><spring:message code="global.device"/></a></li>
							</ul>
						</div>
						<div class="portlet-body">
							<div class="tab-content">
								<div class="tab-pane active" id="TopTab">
									<div id="DevicegroupSelectPanel" class="row">
										<div class="col-md1 col-sm-1">
											<h3 class="event-form-title"><spring:message code="global.select"/></h3>
										</div>
										<div class="col-md3 col-sm-3">
											<input type="hidden" id="DevicegroupSelect" class="form-control select2">
										</div>
									</div>
									<br/>
										
									<div class="row">
										<div id="LeftTab" class="col-md-2 col-sm-2 col-xs-2">
										</div>
										<div class="col-md-10 col-sm-10 col-xs-10">
											<div class="tab-content">
												<div id="DeviceDetail" class="tab-pane active">
													<h3><spring:message code="global.video"/></h3>
													<table id="DeviceVideoTable" class="table table-striped table-bordered table-hover">
														<thead></thead>
														<tbody></tbody>
													</table>
													<h3><spring:message code="global.image"/></h3>
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-devicefile.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initDevicefiles();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
