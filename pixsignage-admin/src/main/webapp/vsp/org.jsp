<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>

<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-fileupload/bootstrap-fileupload.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div class="page-content-wrapper">
		<div class="page-content">
			<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title"><spring:message code="global.org"/></h4>
						</div>
						<div class="modal-body">
							<form id="MyEditForm" class="form-horizontal" method="POST" enctype="multipart/form-data">
								<input type="hidden" name="org.orgid" value="0" />
								<input type="hidden" name="org.status" value="1" />
								<input type="hidden" name="org.apps" value="" />
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="org.name" />
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="global.code"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="org.code" />
											</div>
										</div>
									</div>
									<div class="form-group bundle-ctrl">
										<label class="col-md-3 control-label">BUNDLE<span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.bundleflag" value="0"> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.bundleflag" value="1" checked> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group page-ctrl">
										<label class="col-md-3 control-label">PAGE<span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.pageflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.pageflag" value="1"> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.sscreenflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.sscreenflag" value="0"> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.sscreenflag" value="1" checked> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group mscreen-ctrl">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.mscreenflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.mscreenflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.mscreenflag" value="1"> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group review-ctrl">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.reviewflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.reviewflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.reviewflag" value="1"> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group touch-ctrl">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.touchflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.touchflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.touchflag" value="1"> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group calendar-ctrl">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.calendarflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.calendarflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.calendarflag" value="1"> <spring:message code="pixsign.org.calendarflag_1"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.calendarflag" value="2"> <spring:message code="pixsign.org.calendarflag_2"/>
											</label>
										</div>
									</div>
									<div class="form-group lift-ctrl">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.liftflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.liftflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.liftflag" value="1"> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group flowrate-ctrl">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.flowrateflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.flowrateflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.flowrateflag" value="1"> <spring:message code="pixsign.org.flowrate_1"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.flowrateflag" value="2"> <spring:message code="pixsign.org.flowrate_2"/>
											</label>
										</div>
									</div>
									<div class="form-group tag-ctrl">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.tagflag"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.tagflag" value="0" checked> <spring:message code="global.off"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.tagflag" value="1"> <spring:message code="global.on"/>
											</label>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.media"/></label>
										<div class="col-md-9 checkbox-list">
											<label class="checkbox-inline stream-ctrl">
												<input type="checkbox" name="org.streamflag" value="1"><spring:message code="pixsign.stream"/>
											</label>
											<label class="checkbox-inline dvb-ctrl">
												<input type="checkbox" name="org.dvbflag" value="1"><spring:message code="pixsign.dvb"/>
											</label>
											<label class="checkbox-inline videoin-ctrl">
												<input type="checkbox" name="org.videoinflag" value="1"><spring:message code="pixsign.videoin"/>
											</label>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.expiretime"/><span class="required">*</span></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="org.expireflag" value="0" checked> <spring:message code="pixsign.org.unlimited"/>
											</label>
											<label class="radio-inline">
												<input type="radio" name="org.expireflag" value="1" > <spring:message code="pixsign.org.expire"/>
											</label>
										</div>
									</div>
									<div class="form-group expiretime">
										<label class="col-md-3 control-label"></label>
										<div class="col-md-9">
											<div class="input-group date form_datetime">                                       
												<input type="text" size="16" readonly class="form-control" name="org.expiretime" value="2037-01-01">
												<span class="input-group-btn">
												<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
												</span>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.maxdevices"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="org.maxdevices" value="0" />
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.storage"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="org.maxstorage" value="0" />
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.timezone"/></label>
										<div class="col-md-9">
											<input type="hidden" id="TimezoneSelect" class="form-control select2" name="org.timezone">
										</div>
									</div>
									<div class="form-group pix-control">
										<label class="col-md-3 control-label"><spring:message code="pixsign.org.copyright"/></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="org.copyright" />
											</div>
										</div>
									</div>
									<div class="form-group pix-control">
										<label class="col-md-3 control-label">Logo</label>
										<div class="col-md-9">
											<div class="fileupload fileupload-new" data-provides="fileupload">
												<div class="input-group">
													<span class="input-group-btn">
														<span class="uneditable-input">
															<i class="fa fa-file fileupload-exists"></i>
															<span class="fileupload-preview"></span>
														</span>
													</span>
													<span class="btn default btn-file">
														<span class="fileupload-new"><i class="fa fa-paper-clip"></i> Select</span>
														<span class="fileupload-exists"><i class="fa fa-undo"></i> Change</span>
														<input type="file" class="default" name="logo" />
													</span>
													<a href="#" class="btn red fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash-o"></i> Remove</a>
												</div>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.appfile"/></label>
										<div class="col-md-9">
											<div class="col-md-9 pre-scrollable" id="AppTree"></div>						
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.prop.description"/></label>
										<div class="col-md-9">
											<textarea class="form-control" rows="4" name="org.description"></textarea>
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
			
			<!-- BEGIN PAGE HEADER-->
			<h3 class="page-title"><spring:message code="menu.org"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.opmanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.org"/></a>
					</li>
				</ul>
			</div>
			<!-- END PAGE HEADER-->
			
			<!-- BEGIN PAGE CONTENT-->
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.org"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
								</div>
							</div>
							<table id="MyTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-fileupload/bootstrap-fileupload.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-org.js?t=${timestamp}"></script>
<script>
var PixCtrl = <%=(session_vsp != null && session_vsp.getCode().equals("default"))%>;
var BundleCtrl = <%=(session_vsp != null && session_vsp.getBundleflag().equals("1"))%>;
var PageCtrl = <%=(session_vsp != null && session_vsp.getPageflag().equals("1"))%>;
var ReviewCtrl = <%=(session_vsp != null && session_vsp.getReviewflag().equals("1"))%>;
var TouchCtrl = <%=(session_vsp != null && session_vsp.getTouchflag().equals("1"))%>;
var CalendarCtrl = <%=(session_vsp != null && session_vsp.getCalendarflag().equals("1"))%>;
var MscreenCtrl = <%=(session_vsp != null && session_vsp.getMscreenflag().equals("1"))%>;
var LiftCtrl = <%=(session_vsp != null && session_vsp.getLiftflag().equals("1"))%>;
var FlowrateCtrl = <%=(session_vsp != null && session_vsp.getFlowrateflag().equals("1"))%>;
var TagCtrl = <%=(session_vsp != null && session_vsp.getTagflag().equals("1"))%>;
var StreamCtrl = <%=(session_vsp != null && session_vsp.getStreamflag().equals("1"))%>;
var DvbCtrl = <%=(session_vsp != null && session_vsp.getDvbflag().equals("1"))%>;
var VideoinCtrl = <%=(session_vsp != null && session_vsp.getVideoinflag().equals("1"))%>;

var MaxDevices = <%=session_vsp.getMaxdevices()%>;
var CurrentDevices = <%=session_vsp.getCurrentdevices()%>;
var MaxStorage = <%=session_vsp.getMaxstorage()%>;
var CurrentStorage = <%=session_vsp.getCurrentstorage()%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initMyTable();
	initMyEditModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
