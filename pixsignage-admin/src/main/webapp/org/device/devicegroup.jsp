<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="BaiduMapModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div id="BaiduMapDiv" style="width:100%; height:600px;"></div>
				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="GoogleMapModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div id="GoogleMapDiv" style="width:100%; height:600px;"></div>
				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="DevicegpDtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-6">
							<div class="portlet box blue">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.device.selecting"/></div>
									<ul class="nav nav-tabs" style="margin-right: 30px;">
										<li class="device-navigator" devicetype="13" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device13"/></a></li>
										<li class="device-navigator" devicetype="10" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device10"/></a></li>
										<li class="device-navigator" devicetype="7" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device7"/></a></li>
										<li class="device-navigator" devicetype="6" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device6"/></a></li>
										<li class="device-navigator" devicetype="2" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device2"/></a></li>
										<li class="device-navigator" devicetype="1" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device1"/></a></li>
									</ul>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
										<div class="btn-group pull-right">
											<button class="btn btn-sm blue pix-adddevicegpdtl"><spring:message code="global.add"/> <i class="fa fa-arrow-right"></i></button>
										</div>
									</div>
									<table id="DeviceTable" class="table table-striped table-bordered table-hover">
										<thead></thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="portlet box green">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.device.selected"/></div>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn btn-sm red pix-deletedevicegpdtl"><i class="fa fa-arrow-left"></i> <spring:message code="global.remove"/></button>
										</div>
									</div>
									<table id="DevicegpDtlTable" class="table table-striped table-bordered table-hover">
										<thead></thead>
										<tbody></tbody>
									</table>
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
			
	<div id="DevicegroupEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.devicegroup"/></h4>
				</div>
				<div class="modal-body">
					<form id="DevicegroupEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="devicegroup.devicegroupid" value="0" />
						<input type="hidden" name="devicegroup.branchid" value="0" />
						<input type="hidden" name="devicegroup.type" value="1" />
						<input type="hidden" name="devicegroup.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="devicegroup.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.description"/></label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="devicegroup.description"></textarea>
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
			<h3 class="page-title"><spring:message code="menu.devicegroup"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicegroup"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="pixsign.devicegroup"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="DevicegroupModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="DevicegroupPortlet">
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-10">
									<div class="table-toolbar">
										<div class="btn-group">
											<button privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/><i class="fa fa-plus"></i></button>
										</div>
									</div>
									<table id="DevicegroupTable" class="table table-striped table-bordered table-hover">
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

<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<% if (session_org != null && !session_org.getTimezone().equals("Asia/Shanghai")) { %>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBEizW2Mbk5ln3x0Jgm4o3Jd6lIjPyOsU8"></script>
<% } else { %>
<script src="http://api.map.baidu.com/api?v=2.0&ak=vItwdDkCtAtruyhGGHxhkvlTTakaY9RO" type="text/javascript"></script>
<% } %>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/device/devicegroup.js?t=${timestamp}"></script>
<script>
var MapSource = <%=(session_org != null && !session_org.getTimezone().equals("Asia/Shanghai"))%>;
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
	DevicegroupModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
