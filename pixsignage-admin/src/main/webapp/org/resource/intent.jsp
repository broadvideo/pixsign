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
	<div id="IntentEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">Intent</h4>
				</div>
				<div class="modal-body">
					<form id="IntentEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="intent.intentid" value="0" />
						<input type="hidden" name="intent.relateid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">Key<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="intent.intentkey" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.org.relatetype"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="intent.relatetype" value="1" checked> <spring:message code="pixsign.org.relatetype_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="intent.relatetype" value="2" checked> <spring:message code="pixsign.org.relatetype_2"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="intent.relatetype" value="3" > <spring:message code="pixsign.org.relatetype_3"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="intent.relatetype" value="4" > Page
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.relatecontent"/></label>
								<div class="col-md-9">
									<div id="RelateVideoSelect" class="input-group">
										<span class="input-group-btn">
											<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
											<ul class="dropdown-menu" role="menu">
												<div class="pre-scrollable foldertree">
												</div>
											</ul>
										</span>
										<input type="hidden" class="form-control select2">
										<span class="input-group-btn">
											<button class="btn default remove" type="button"><i class="fa fa-trash-o"/></i></button>
										</span>
									</div>
									<div id="RelateImageSelect" class="input-group">
										<span class="input-group-btn">
											<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
											<ul class="dropdown-menu" role="menu">
												<div class="pre-scrollable foldertree">
												</div>
											</ul>
										</span>
										<input type="hidden" class="form-control select2">
										<span class="input-group-btn">
											<button class="btn default remove" type="button"><i class="fa fa-trash-o"/></i></button>
										</span>
									</div>
									<div id="RelatePageSelect">
										<input type="hidden" class="form-control select2">
									</div>
									<div id="RelateText" class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="intent.relateurl" />
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
			<h3 class="page-title">Intent</h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.resource"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#">Intent</a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i>Intent</div>
							<div class="tools">
								<a href="javascript:;" onClick="IntentModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="IntentPortlet">
							<div class="table-toolbar">
								<div class="btn-group">
									<button class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
								</div>
								<div class="btn-group">
									<button class="btn green pix-push">Sync to all <i class="fa fa-cogs"></i></button>
								</div>
							</div>
							<table id="IntentTable" class="table table-striped table-bordered table-hover">
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
<script src="${base_ctx}/scripts/common/folder-video-select.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/folder-image-select.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/resource/intent.js?t=${timestamp}1"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	IntentModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
