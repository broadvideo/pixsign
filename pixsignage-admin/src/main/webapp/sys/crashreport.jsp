<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
</head>

<body>
	<div id="CrashDtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static" >
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="CrashDtlForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-2 control-label required">IP</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.clientip"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required"><spring:message code="global.name"/></label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.clientname"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">OS</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.os"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">APP</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.appname"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required"><spring:message code="pixsign.crash.vname"/><</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.vname"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required"><spring:message code="pixsign.crash.vcode"/><</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.vcode"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required"><spring:message code="pixsign.crash.stack"/><</label>
								<div class="col-md-10">
									<textarea class="form-control" rows="16" name="crashreport.stack"></textarea>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required"><spring:message code="pixsign.crash.resolution"/><</label>
								<div class="col-md-10">
									<textarea class="form-control" rows="4" name="crashreport.resolution"></textarea>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required"><spring:message code="pixsign.crash.other"/></label>
								<div class="col-md-10">
									<textarea class="form-control" rows="3" name="crashreport.other"></textarea>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>
			
	<div class="page-content-wrapper">
		<div class="page-content">
			<h3 class="page-title"><spring:message code="menu.debug"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.systemmanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.debug"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="pixsign.crash"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="CrashreportModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<table id="CrashreportTable" class="table table-striped table-bordered table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<!-- END PAGE CONTENT -->
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
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/sys/crashreport.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	CrashreportModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
