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
<script src="${base_ctx}/scripts/vsp/main.js?t=${timestamp}"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	License.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
