<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
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
								<i class="fa fa-bell-o"></i><spring:message code="pixsign.main.title1"/>
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
								<i class="fa fa-bar-chart-o"></i><spring:message code="pixsign.main.title2"/>
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
								<i class="fa fa-bar-chart-o"></i><spring:message code="pixsign.main.title3"/>
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
								<i class="fa fa-bar-chart-o"></i><spring:message code="pixsign.main.title4"/>
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
								<i class="fa fa-bar-chart-o"></i><spring:message code="pixsign.main.title5"/>
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

<script src="${static_ctx}/global/plugins/flot/jquery.flot.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/flot/jquery.flot.pie.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/main.js?t=${timestamp}"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	License.init();
	DeviceTable.init();
	DeviceChart.init();
	MediaChart.init();
	FileChart.init();
	APPTable.init();
})
</script>
</div>

</html>
