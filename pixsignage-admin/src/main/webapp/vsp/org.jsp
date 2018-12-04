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
	<div id="OrgEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="global.org"/></h4>
				</div>
				<div class="modal-body">
					<form id="OrgEditForm" class="form-horizontal" method="POST" enctype="multipart/form-data">
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
							<div class="form-group">
								<label class="col-md-3 control-label">基本功能</label>
								<div class="col-md-9 checkbox-list">
									<label class="checkbox-inline bundle-ctrl">
										<input type="checkbox" name="org.bundleflag" value="1">BUNDLE
									</label>
									<label class="checkbox-inline page-ctrl">
										<input type="checkbox" name="org.pageflag" value="0">PAGE
									</label>
									<label class="checkbox-inline sscreen-ctrl">
										<input type="checkbox" name="org.sscreenflag" value="1"><spring:message code="pixsign.org.sscreenflag"/>
									</label>
									<label class="checkbox-inline mscreen-ctrl">
										<input type="checkbox" name="org.mscreenflag" value="0"><spring:message code="pixsign.org.mscreenflag"/>
									</label>
									<label class="checkbox-inline review-ctrl">
										<input type="checkbox" name="org.reviewflag" value="0"><spring:message code="pixsign.org.reviewflag"/>
									</label>
									<label class="checkbox-inline touch-ctrl">
										<input type="checkbox" name="org.touchflag" value="0"><spring:message code="pixsign.org.touchflag"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.media"/></label>
								<div class="col-md-9 checkbox-list">
									<label class="checkbox-inline stream-ctrl">
										<input type="checkbox" name="org.streamflag" value="0"><spring:message code="pixsign.stream"/>
									</label>
									<label class="checkbox-inline dvb-ctrl">
										<input type="checkbox" name="org.dvbflag" value="0"><spring:message code="pixsign.dvb"/>
									</label>
									<label class="checkbox-inline videoin-ctrl">
										<input type="checkbox" name="org.videoinflag" value="0"><spring:message code="pixsign.videoin"/>
									</label>
									<label class="checkbox-inline widget-ctrl">
										<input type="checkbox" name="org.widgetflag" value="0">Widget
									</label>
									<label class="checkbox-inline rss-ctrl">
										<input type="checkbox" name="org.rssflag" value="0">RSS
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">业务功能</label>
								<div class="col-md-9 checkbox-list">
									<label class="checkbox-inline tag-ctrl">
										<input type="checkbox" name="org.tagflag" value="0"><spring:message code="pixsign.org.tagflag"/>
									</label>
									<label class="checkbox-inline diy-ctrl">
										<input type="checkbox" name="org.diyflag" value="0"><spring:message code="pixsign.org.diyflag"/>
									</label>
									<label class="checkbox-inline advert-ctrl">
										<input type="checkbox" name="org.advertflag" value="0"><spring:message code="pixsign.org.advertflag"/>
									</label>
									<label class="checkbox-inline vip-ctrl">
										<input type="checkbox" name="org.vipflag" value="0">VIP识别
									</label>
									<label class="checkbox-inline estate-ctrl">
										<input type="checkbox" name="org.estateflag" value="0">地产
									</label>
									<label class="checkbox-inline lift-ctrl">
										<input type="checkbox" name="org.liftflag" value="0">电梯
									</label>
									<label class="checkbox-inline massage-ctrl">
										<input type="checkbox" name="org.massageflag" value="0">按摩椅
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.bundleplanflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.bundleplanflag" value="0"> <spring:message code="pixsign.org.planflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.bundleplanflag" value="1"> <spring:message code="pixsign.org.planflag_1"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.pageplanflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.pageplanflag" value="0"> <spring:message code="pixsign.org.planflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.pageplanflag" value="1"> <spring:message code="pixsign.org.planflag_1"/>
									</label>
								</div>
							</div>
							<div class="form-group school-ctrl">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.schoolflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.schoolflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.schoolflag" value="1"> <spring:message code="pixsign.org.schoolflag_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.schoolflag" value="2"> <spring:message code="pixsign.org.schoolflag_2"/>
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
							<div class="form-group">
								<label class="col-md-3 control-label">主板类型</label>
								<div class="col-md-9">
									<input type="hidden" id="BoardtypeSelect" class="form-control select2" name="org.boardtype">
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
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.max1"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.max1" value="0" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.max2"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.max2" value="0" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.max3"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.max3" value="0" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.max4"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.max4" value="0" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.max5"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.max5" value="0" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.max6"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.max6" value="0" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.max7"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.max7" value="0" />
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
			
	<div class="page-content-wrapper">
		<div class="page-content">
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
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.org"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="OrgModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
								</div>
							</div>
							<table id="OrgTable" class="table table-striped table-bordered table-hover">
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
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/vsp/org.js?t=${timestamp}"></script>
<script>
var PixCtrl = <%=(session_vsp != null && session_vsp.getCode().equals("default"))%>;

var BundleCtrl = <%=(session_vsp != null && session_vsp.getBundleflag().equals("1"))%>;
var PageCtrl = <%=(session_vsp != null && session_vsp.getPageflag().equals("1"))%>;
var SscreenCtrl = <%=(session_vsp != null && session_vsp.getSscreenflag().equals("1"))%>;
var MscreenCtrl = <%=(session_vsp != null && session_vsp.getMscreenflag().equals("1"))%>;
var ReviewCtrl = <%=(session_vsp != null && session_vsp.getReviewflag().equals("1"))%>;
var TouchCtrl = <%=(session_vsp != null && session_vsp.getTouchflag().equals("1"))%>;

var StreamCtrl = <%=(session_vsp != null && session_vsp.getStreamflag().equals("1"))%>;
var DvbCtrl = <%=(session_vsp != null && session_vsp.getDvbflag().equals("1"))%>;
var VideoinCtrl = <%=(session_vsp != null && session_vsp.getVideoinflag().equals("1"))%>;
var WidgetCtrl = <%=(session_vsp != null && session_vsp.getWidgetflag().equals("1"))%>;
var RssCtrl = <%=(session_vsp != null && session_vsp.getRssflag().equals("1"))%>;

var DiyCtrl = <%=(session_vsp != null && session_vsp.getDiyflag().equals("1"))%>;
var FlowrateCtrl = <%=(session_vsp != null && session_vsp.getFlowrateflag().equals("1"))%>;
var TagCtrl = <%=(session_vsp != null && session_vsp.getTagflag().equals("1"))%>;
var SchoolCtrl = <%=(session_vsp != null && session_vsp.getSchoolflag().equals("1"))%>;
var AdvertCtrl = <%=(session_vsp != null && session_vsp.getAdvertflag().equals("1"))%>;
var VipCtrl = <%=(session_vsp != null && session_vsp.getVipflag().equals("1"))%>;
var EstateCtrl = <%=(session_vsp != null && session_vsp.getEstateflag().equals("1"))%>;
var LiftCtrl = <%=(session_vsp != null && session_vsp.getLiftflag().equals("1"))%>;
var MassageCtrl = <%=(session_vsp != null && session_vsp.getMassageflag().equals("1"))%>;

var MaxDevices = <%=session_vsp.getMaxdevices()%>;
var CurrentDevices = <%=session_vsp.getCurrentdevices()%>;
var MaxStorage = <%=session_vsp.getMaxstorage()%>;
var CurrentStorage = <%=session_vsp.getCurrentstorage()%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	OrgModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
