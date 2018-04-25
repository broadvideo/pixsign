<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="ConfigEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="global.config"/></h4>
				</div>
				<div class="modal-body">
					<form id="ConfigEditForm" class="form-horizontal" method="POST">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-4 control-label"><spring:message code="pixsign.config.server.ip"/><span class="required">*</span></label>
								<div class="col-md-8">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="serverip" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-4 control-label"><spring:message code="pixsign.config.server.port"/><span class="required">*</span></label>
								<div class="col-md-8">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="serverport" />
									</div>
								</div>
							</div>
							<div class="form-group calendar-ctrl">
								<label class="col-md-4 control-label"><spring:message code="pixsign.config.pixedx.ip"/></label>
								<div class="col-md-8">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="pixedxip" />
									</div>
								</div>
							</div>
							<div class="form-group calendar-ctrl">
								<label class="col-md-4 control-label"><spring:message code="pixsign.config.pixedx.port"/></label>
								<div class="col-md-8">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="pixedxport" />
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
			
	<div class="page-content-wrapper">
		<div class="page-content">
			<h3 class="page-title"><spring:message code="menu.config"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.systemmanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.config"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="global.config"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="ConfigModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button privilegeid="101010" class="btn blue pix-update"><spring:message code="global.update"/> <i class="fa fa-edit"></i></button>
								</div>
							</div>
							<table id="ConfigTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=0" type="text/javascript"></script>
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
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/system/config.js?t=${timestamp}"></script>
<script>
var SchoolCtrl = <%=(session_org != null && session_org.getSchoolflag().equals("1"))%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	ConfigModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
