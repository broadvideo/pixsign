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
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.backupvideo"/></label>
								<div class="col-md-9">
									<input type="hidden" id="BackupMediaSelect" class="form-control select2" name="device.backupvideoid">
								</div>
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
							<div class="form-group tag-ctrl">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.tagflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="device.tagflag" value="0"> <spring:message code="pixsign.prop.tagflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.tagflag" value="1"> <spring:message code="pixsign.prop.tagflag_1"/>
									</label>
								</div>
							</div>
							<div class="form-group tag-ctrl">
								<label class="col-md-3 control-label"><spring:message code="global.tag"/></label>
								<div class="col-md-9">
									<input type="hidden" id="TagSelect" class="form-control select2" name="device.tags">
								</div>
							</div>
							<!-- 
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.deviceinterval1"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="device.interval1" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.deviceinterval2"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="device.interval2" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.temperatureflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="device.temperatureflag" value="0"> <spring:message code="pixsign.prop.temperatureflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="device.temperatureflag" value="1"> <spring:message code="pixsign.prop.temperatureflag_1"/>
									</label>
								</div>
							</div>
							 -->
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
							<!-- 
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.city"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="device.city" />
									</div>
								</div>
							</div>
							 -->
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
							<div class="form-group option1">
								<label class="col-md-3 control-label"><spring:message code="global.branch"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="pre-scrollable" id="BranchTree"></div>
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

	<div id="DeviceBindModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.device"/></h4>
				</div>
				<div class="modal-body">
					<form id="DeviceBindForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<input type="hidden" name="device.deviceid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label required"><spring:message code="pixsign.prop.terminalid"/></label>
								<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.terminalid"></label>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.hardkey"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="device.hardkey" />
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

	<div id="UTextModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.device"/></h4>
				</div>
				<div class="modal-body">
					<form id="UTextForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.count"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="count" value="0" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.position"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="position" value="top"> <spring:message code="pixsign.prop.position.top"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="position" value="center"> <spring:message code="pixsign.prop.position.center"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="position" value="bottom" checked> <spring:message code="pixsign.prop.position.bottom"/>
									</label>  
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.speed"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="speed" value="1"> <spring:message code="pixsign.prop.speed_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="speed" value="2" checked> <spring:message code="pixsign.prop.speed_2"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="speed" value="3"> <spring:message code="pixsign.prop.speed_3"/>
									</label>  
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.color"/></label>
								<div class="col-md-9">
									<div class="input-group colorpicker-component colorPick">
										<input type="text" name="color" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
										<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.size"/></label>
								<div class="col-md-9">
									<input class="sizeRange" type="text" name="size" value="50"/>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.bgcolor"/></label>
								<div class="col-md-9">
									<div class="input-group colorpicker-component bgcolorPick">
										<input type="text" name="bgcolor" value="#000000" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
										<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.opacity"/></label>
								<div class="col-md-9">
									<input class="opacityRange" type="text" name="opacity" value=""/>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.text"/><span class="required">*</span></label>
								<div class="col-md-9">
									<textarea class="form-control" rows="3" name="text"></textarea>
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
			<h3 class="page-title"><spring:message code="pixsign.device1"/></h3>

			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="pixsign.device1"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="DeviceModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="DevicePortlet">
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-10">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn green pix-add"><spring:message code="global.add"/><i class="fa fa-plus"></i></button>
										</div>
										<!-- 
										<div class="btn-group">
											<button class="btn green pix-allmap"><spring:message code="pixsign.map"/> <i class="fa fa-map-marker"></i></button>
										</div>
										-->
										<!--
										<div class="btn-group">
											<button class="btn red pix-utext"><spring:message code="pixsign.utext"/> <i class="fa fa-bolt"></i></button>
										</div>
										<div class="btn-group">
											<button class="btn blue pix-ucancel"><spring:message code="pixsign.ucancel"/> <i class="fa fa-circle-o-notch"></i></button>
										</div>
										<div class="btn-group">
											<a href="device!export.action" class="btn blue pix-export"><spring:message code="global.export"/> <i class="fa fa-download"></i></a>
										</div>
										-->
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
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/device/device-xinfa.js?t=${timestamp}"></script>
<script>
var TagCtrl = <%=(session_org != null && !session_org.getTagflag().equals("0"))%>;
$('.tag-ctrl').css('display', TagCtrl?'':'none');
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	DeviceModule.init(1);
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
