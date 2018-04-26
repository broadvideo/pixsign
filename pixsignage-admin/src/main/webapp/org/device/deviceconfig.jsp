<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="DeviceConfigModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="global.config"/></h4>
				</div>
				<div class="modal-body">
					<form id="DeviceConfigForm" class="form-horizontal" method="POST">
						<input type="hidden" name="org.orgid" value="0" />
						<div class="form-body">
							<!-- 
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.upgradeflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.upgradeflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.upgradeflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							 -->
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.volumeflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.volumeflag" value="0" checked> <spring:message code="pixsign.prop.volumeflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.volumeflag" value="1"> <spring:message code="pixsign.prop.volumeflag_1"/>
									</label>
								</div>
							</div>
							<div class="form-group volumeflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.volume"/></label>
								<div class="col-md-9">
									<input class="volumeRange" type="text" name="org.volume" value="50"/>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.devicepassflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.devicepassflag" value="0"> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.devicepassflag" value="1" checked> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group devicepassflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.devicepass"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.devicepass" />
									</div>
								</div>
							</div>
							<div class="form-group bundle-ctrl">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.backupvideo"/></label>
								<div class="col-md-9">
									<input type="hidden" id="BackupMediaSelect" class="form-control select2" name="org.backupvideoid">
								</div>
							</div>
							<!-- 
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.defaultpage"/></label>
								<div class="col-md-9">
									<input type="hidden" id="DefaultPageSelect" class="form-control select2" name="org.defaultpageid">
								</div>
							</div>
							 -->
							<div class="form-group sscreen-ctrl">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.powerflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.powerflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.powerflag" value="1" > <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group sscreen-ctrl powerflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.poweron"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_time">                                       
										<input type="text" size="16" readonly class="form-control" name="org.poweron">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group sscreen-ctrl powerflag">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.poweroff"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_time">                                       
										<input type="text" size="16" readonly class="form-control" name="org.poweroff">
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
			
	<div class="page-content-wrapper">
		<div class="page-content">
			<h3 class="page-title"><spring:message code="menu.deviceconfig"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.deviceconfig"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="global.config"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="DeviceConfigModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button privilegeid="101010" class="btn blue pix-update"><spring:message code="global.update"/> <i class="fa fa-edit"></i></button>
								</div>
								<div class="btn-group">
									<button privilegeid="101010" class="btn green pix-push"><spring:message code="pixsign.device.pushall"/> <i class="fa fa-cogs"></i></button>
								</div>
							</div>
							<table id="DeviceConfigTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/device/deviceconfig.js?t=${timestamp}"></script>
<script>
var BundleCtrl = <%=(session_org != null && session_org.getBundleflag().equals("1"))%>;
$('.bundle-ctrl').css('display', BundleCtrl?'':'none');
var SscreenCtrl = <%=(session_org != null && session_org.getSscreenflag().equals("1"))%>;
$('.sscreen-ctrl').css('display', SscreenCtrl?'':'none');

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	DeviceConfigModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
