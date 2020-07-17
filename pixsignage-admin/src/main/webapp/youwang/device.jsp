<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>

<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<link href="${base_ctx}/youwang/css/custom.css" rel="stylesheet" type="text/css"/>
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

	<div id="ScreenModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.device.screenlist"/></div>
							<div class="tools">
								<a href="javascript:;" class="reload pix-ScreenReload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<table id="ScreenTable" class="table table-condensed table-hover">
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
										<li id="nav_tab2"><a href="#portlet_tab2" data-toggle="tab"><spring:message code="pixsign.image"/></a></li>
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
										<div class="tab-pane" id="portlet_tab2">
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
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.volumeflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="device.volumeflag" value="0"> <spring:message code="pixsign.prop.volumeflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.volumeflag" value="1"> <spring:message code="pixsign.prop.volumeflag_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.volumeflag" value="2" checked> <spring:message code="pixsign.prop.volumeflag_2"/>
									</label>
								</div>
							</div>
							<div class="form-group volumeflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.volume"/></label>
								<div class="col-md-9">
									<input class="volumeRange" type="text" name="device.volume" value="50"/>
								</div>
							</div>
							<div class="form-group sscreen-ctrl">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.powerflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="device.powerflag" value="0"> <spring:message code="pixsign.prop.powerflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.powerflag" value="1" > <spring:message code="pixsign.prop.powerflag_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.powerflag" value="2" checked> <spring:message code="pixsign.prop.powerflag_2"/>
									</label>
								</div>
							</div>
							<div class="form-group sscreen-ctrl powerflag">
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
							<div class="form-group sscreen-ctrl powerflag">
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
						<input type="hidden" name="device.status" value="1" />
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

	<div class="row main-content">
		<div class="row content-bar">
		</div>
		<div class="row content-list">
			<table id="DeviceTable" class="table table-striped table-bordered table-hover">
				<thead></thead>
				<tbody></tbody>
			</table>
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
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/youwang/scripts/device.js?t=${timestamp}"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {
	Metronic.init();
	PixData.init('${locale}');
    $('.colorful-menu').find('.menu-item').removeClass('selected');
    $('#Menu5').addClass('selected');

    DeviceModule.init();
})
</script>
</div>

</html>
