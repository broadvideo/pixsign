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
	<div id="RouteguideEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">导览</h4>
				</div>
				<div class="modal-body">
					<form id="RouteguideEditForm" class="form-horizontal" method="POST" enctype="multipart/form-data">
						<input type="hidden" name="routeguide.routeguideid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="routeguide.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.code"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="routeguide.code" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3">类型</label>
								<div class="col-md-9">
									<select class="form-control" name="routeguide.type" tabindex="-1">
										<option value="1" selected="selected">单层</option>
										<option value="2">双层</option>
									</select>
								</div>
							</div>
							<div class="form-group pix-control">
								<label class="col-md-3 control-label">背景图</label>
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
												<input type="file" class="default" name="pic" />
											</span>
											<a href="#" class="btn red fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash-o"></i> Remove</a>
										</div>
									</div>
								</div>
							</div>
							<div class="form-group pix-control">
								<label class="col-md-3 control-label">背景图2</label>
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
												<input type="file" class="default" name="pic2" />
											</span>
											<a href="#" class="btn red fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash-o"></i> Remove</a>
										</div>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.description"/></label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="routeguide.description"></textarea>
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
			
	<div id="RouteguidedtlEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">导览路径</h4>
				</div>
				<div class="modal-body">
					<form id="RouteguidedtlEditForm" class="form-horizontal" method="POST" enctype="multipart/form-data">
						<input type="hidden" name="routeguidedtl.routeguideid" value="0" />
						<input type="hidden" name="routeguidedtl.routeguidedtlid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">导航项</label>
								<div class="col-md-9">
									<input type="hidden" id="RouteSelect" class="form-control select2" name="routeguidedtl.routeid" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">路径</label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="routeguidedtl.routelines"></textarea>
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
			
	<div id="RouteguidedtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
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
									<div class="caption"><i class="fa fa-reorder"></i>导览路径</div>
									<div class="tools">
										<a href="javascript:;" class="reload"></a>
									</div>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
										<div class="btn-group">
											<form method="post" target="_blank" id="DesignForm" style="display:none" action="/pixsignage/routeguide/route-guide.jsp" >
												<input type="hidden" name="id" value="" />
												<input type="hidden" name="index" value="1" />
											</form>
											<a href="javascript:;" class="btn blue pix-routeguidedtl-design"><i class="fa fa-video-camera"></i> 第一层</a>&nbsp;
											<a href="javascript:;" class="btn blue pix-routeguidedtl-design2"><i class="fa fa-video-camera"></i> 第二层</a>&nbsp;
											<a href="javascript:;" class="btn green pix-routeguidedtl-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></a>
										</div>
									</div>
									<table id="RouteguidedtlTable" class="table table-striped table-bordered table-hover">
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
		
	<div class="page-content-wrapper">
		<div class="page-content">
			<h3 class="page-title">导览管理</h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.opmanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#">导览</a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i>导览</div>
							<div class="tools">
								<a href="javascript:;" onClick="RouteguideModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
								</div>
							</div>
							<table id="RouteguideTable" class="table table-striped table-bordered table-hover">
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
<script src="${base_ctx}/scripts/vsp/routeguide.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	RouteguideModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
