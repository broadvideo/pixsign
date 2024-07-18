<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="AllModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.playlog"/></div>
						</div>
						<div class="portlet-body">
							<div class="row">
							</div>
							<table id="AllTable" class="table table-condensed table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="PlaylogModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.playlog"/></div>
						</div>
						<div class="portlet-body">
							<div class="row">
								<!-- 
								<div class="col-md-3 stat-hour">
									<div class="input-group date form_datetime_hour">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.stathour">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								 -->
								<div class="col-md-3 stat-day">
									<div class="input-group date form_datetime_day">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.statday">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								<div class="col-md-3 stat-month">
									<div class="btn-group">
										<input type="hidden" id="MonthSelect" class="form-control select2">
									</div>
								</div>
								<div class="col-md-3 stat-period">
									<div class="input-group date form_datetime_day">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.statfrom">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								<div class="col-md-3 stat-period">
									<div class="input-group date form_datetime_day">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.statto">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								<div class="col-md-3">
									<div class="btn-group">
										<a href="" class="btn green pix-download"><spring:message code="global.export"/> <i class="fa fa-download"></i></a>
									</div>
								</div>
							</div>
							<table id="PlaylogTable" class="table table-condensed table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div class="page-content-wrapper">
		<div class="page-content">
			
			<h3 class="page-title"><spring:message code="menu.playlog"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.stat"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.playlog"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="pixsign.playlog"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="PlaylogModule.refresh();" class="reload"></a>
							</div>
							<ul class="nav nav-tabs" style="margin-right: 30px;">
								<li class="device-navigator" devicetype="13" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device13"/></a></li>
								<li class="device-navigator" devicetype="10" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device10"/></a></li>
								<li class="device-navigator" devicetype="7" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device7"/></a></li>
								<li class="device-navigator" devicetype="6" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device6"/></a></li>
								<li class="device-navigator" devicetype="2" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device2"/></a></li>
								<li class="device-navigator" devicetype="1" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device1"/></a></li>
							</ul>
						</div>
						<div class="portlet-body" id="DevicePortlet">
							<div class="table-toolbar">
								<div class="btn-group">
									<button class="btn green pix-statall"><spring:message code="pixsign.statall"/> <i class="fa fa-download"></i></button>
								</div>
							</div>
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-10">
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
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
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/stat/playlog.js?t=${timestamp}1"></script>
<script>
var Max1 = <%=session_org == null ? 0 : session_org.getMaxDevices("1")%>;
var Max2 = <%=session_org == null ? 0 : session_org.getMaxDevices("2")%>;
var Max6 = <%=session_org == null ? 0 : session_org.getMaxDevices("6")%>;
var Max7 = <%=session_org == null ? 0 : session_org.getMaxDevices("7")%>;
var Max10 = <%=session_org == null ? 0 : session_org.getMaxDevices("10")%>;
var Max13 = <%=session_org == null ? 0 : session_org.getMaxDevices("13")%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	PlaylogModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
