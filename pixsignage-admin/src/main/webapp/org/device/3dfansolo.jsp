<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>

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
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.devicefile"/></div>
									<div class="tools">
										<a href="javascript:;" class="reload pix-DeviceFileReload"></a>
									</div>
									<ul class="nav nav-tabs" style="margin-right: 30px;">
										<li id="nav_tab1" class="active"><a href="#portlet_tab1" data-toggle="tab"><spring:message code="pixsign.video"/></a></li>
									</ul>
								</div>
								<div class="portlet-body">
									<div class="tab-content">
										<div class="tab-pane active" id="portlet_tab1">
											<table id="DeviceVideoTable" class="table table-striped table-bordered table-hover">
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
		
	<div id="ConfigModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.device"/></h4>
				</div>
				<div class="modal-body">
					<form id="ConfigForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<input type="hidden" name="device.deviceid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label required"><spring:message code="pixsign.prop.terminalid"/></label>
								<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.terminalid"></label>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.powerflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="device.powerflag" value="0"> <spring:message code="pixsign.prop.powerflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.powerflag" value="1" > <spring:message code="pixsign.prop.powerflag_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.powerflag" value="9" checked> <spring:message code="pixsign.prop.powerflag_9"/>
									</label>
								</div>
							</div>
							<div class="form-group powerflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.poweron"/></label>
								<div class="col-md-9">
									<div class="input-group date form_time">                                       
										<input type="text" size="16" readonly class="form-control" name="device.poweron">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group powerflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.poweroff"/></label>
								<div class="col-md-9">
									<div class="input-group date form_time">                                       
										<input type="text" size="16" readonly class="form-control" name="device.poweroff">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
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

	<div id="DeviceEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.device"/></h4>
				</div>
				<div class="modal-body">
					<form id="DeviceEditForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<input type="hidden" name="device.deviceid" value="0" />
						<input type="hidden" name="device.branchid" value="0" />
						<input type="hidden" name="device.type" value="0" />
						<input type="hidden" name="device.status" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label required"><spring:message code="pixsign.prop.terminalid"/></label>
								<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.terminalid"></label>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="device.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.position"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="device.position" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.boardtype"/></label>
								<div class="col-md-9">
									<input type="hidden" id="BoardtypeSelect" class="form-control select2" name="device.boardtype">
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.description"/></label>
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

	<div id="MedialistModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12">
							<div class="portlet box blue">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-reorder"></i>请选择</div>
								</div>
								<div class="portlet-body">
									<table id="MedialistTable" class="table table-striped table-bordered table-hover">
										<thead></thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
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
			<h3 class="page-title"><spring:message code="menu.3dfansolo"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.3dfansolo"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue tabbable">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="pixsign.3dfansolo"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="DeviceModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="DevicePortlet">
							<div class="row">
								<div class="col-md-12">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn green pix-add"><spring:message code="global.add"/><i class="fa fa-plus"></i></button>
										</div>
									</div>
									<div class="row">
										<div class="col-md-6 col-sm-12"><input type="hidden" id="OnlineSelect" class="form-control select2 input-medium"></div>
									</div>
									<br/>
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
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<script src="http://api.map.baidu.com/api?v=2.0&ak=vItwdDkCtAtruyhGGHxhkvlTTakaY9RO" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/device/3dfansolo.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	DeviceModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
