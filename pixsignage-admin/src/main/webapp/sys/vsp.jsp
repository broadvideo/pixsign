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
	<div id="VspEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="global.vsp"/></h4>
				</div>
				<div class="modal-body">
					<form id="VspEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="vsp.vspid" value="0" />
						<input type="hidden" name="vsp.status" value="1" />
						<input type="hidden" name="vsp.apps" value="" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="vsp.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.code"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="vsp.code" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">BUNDLE<span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.bundleflag" value="0"> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.bundleflag" value="1" checked> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">PAGE<span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.pageflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.pageflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.mscreenflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.mscreenflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.mscreenflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.reviewflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.reviewflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.reviewflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.touchflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.touchflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.touchflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.calendarflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.calendarflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.calendarflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.liftflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.liftflag" value="0" checked> <spring:message code="global.off"/>
									</label>
										<label class="radio-inline">
										<input type="radio" name="vsp.liftflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.flowrateflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.flowrateflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.flowrateflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.tagflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.tagflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.tagflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.diyflag"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="vsp.diyflag" value="0" checked> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="vsp.diyflag" value="1"> <spring:message code="global.on"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.media"/></label>
								<div class="col-md-9 checkbox-list">
									<label class="checkbox-inline">
										<input type="checkbox" name="vsp.streamflag" value="1"><spring:message code="pixsign.stream"/>
									</label>
									<label class="checkbox-inline">
										<input type="checkbox" name="vsp.dvbflag" value="1"><spring:message code="pixsign.dvb"/>
									</label>
									<label class="checkbox-inline">
										<input type="checkbox" name="vsp.videoinflag" value="1"><spring:message code="pixsign.videoin"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.maxdevices"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="vsp.maxdevices" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.storage"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="vsp.maxstorage" />
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
									<textarea class="form-control" rows="4" name="vsp.description"></textarea>
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
			<h3 class="page-title"><spring:message code="menu.vsp"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.opmanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.vsp"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.vsp"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="VspModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
								</div>
							</div>
							<table id="VspTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/sys/vsp.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	VspModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
