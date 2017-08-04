<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/admin/pages/css/timeline-old.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="AllDeviceModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.device"/></h4>
				</div>
				<div class="modal-body">
					<div class="note note-success">
						<p><spring:message code="pixsign.tips_4"/></p>
					</div>
					<form id="AllDeviceForm" class="form-horizontal" method="POST">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.upgradeflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="upgradeflag" value="0" checked> <spring:message code="pixsign.prop.upgradeflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="upgradeflag" value="1"> <spring:message code="pixsign.prop.upgradeflag_1"/>
									</label>
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

	<div id="SoloDeviceModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.device"/></h4>
				</div>
				<div class="modal-body">
					<form id="SoloDeviceForm" class="form-horizontal" method="POST">
						<input type="hidden" name="device.deviceid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label required"><spring:message code="pixsign.prop.terminalid"/></label>
								<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.terminalid"></label>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label required"><spring:message code="pixsign.prop.mtype"/></label>
								<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.mtype"></label>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label required"><spring:message code="pixsign.prop.appname"/></label>
								<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.appname"></label>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.upgradeflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="device.upgradeflag" value="0" checked> <spring:message code="pixsign.prop.upgradeflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.upgradeflag" value="1"> <spring:message code="pixsign.prop.upgradeflag_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.upgradeflag" value="2"> <spring:message code="pixsign.prop.upgradeflag_2"/>
									</label>
								</div>
							</div>
							<div class="form-group upgradeflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.appfile"/></label>
								<div class="col-md-9">
									<input type="hidden" id="AppfileSelect" class="form-control select2" name="device.appfileid">
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
			<h3 class="page-title"><spring:message code="menu.deviceversion"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.deviceversion"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="pixsign.deviceversion"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="refreshMyTable();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="row">
								<div class="col-md-2" id="BranchTreeDiv">
								</div>
								<div class="col-md-10" id="BranchContentDiv">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn green pix-all-upgrade">
												<spring:message code="pixsign.upgradepolicy"/> <i class="fa fa-delicious"></i>
											</button>
										</div>
									</div>
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
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-branchtree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-deviceversion.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initBranchTree();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
