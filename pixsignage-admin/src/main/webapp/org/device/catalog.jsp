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
	<div id="CatalogEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.catalog"/></h4>
				</div>
				<div class="modal-body">
					<form id="CatalogEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="catalog.catalogid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="catalog.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.status"/><span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="catalog.status" value="0"> <spring:message code="global.off"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="catalog.status" value="1"> <spring:message code="global.on"/>
									</label>
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
			
	<div id="CataitemEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.catalog"/></h4>
				</div>
				<div class="modal-body">
					<form id="CataitemEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="cataitem.cataitemid" value="0" />
						<input type="hidden" name="cataitem.catalogid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="cataitem.name" />
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

	<div id="CataitemDtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-7">
							<div class="portlet box blue">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.device.selecting"/></div>
								</div>
								<div class="portlet-body" id="DevicePortlet">
									<div class="row">
										<div class="col-md-3">
											<div class="row"><div class="col-md-12 branchtree"></div></div>
										</div>
										<div class="col-md-9">
											<div class="table-toolbar">
												<div class="btn-group pull-right">
													<button class="btn btn-sm blue pix-adddevice"><spring:message code="global.add"/> <i class="fa fa-arrow-right"></i></button>
												</div>
											</div>
											<table id="LeftDeviceTable" class="table table-striped table-bordered table-hover">
												<thead></thead>
												<tbody></tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-5">
							<div class="portlet box green">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.device.selected"/></div>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
									</div>
									<table id="RightDeviceTable" class="table table-striped table-bordered table-hover">
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
			<h3 class="page-title"><spring:message code="menu.catalog"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.devicemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.catalog"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-6">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cubes"></i><span class="catalog-name1"></span></div>
							<div class="tools">
								<a href="javascript:;" onClick="CatalogModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button class="btn blue pix-catalog-update1"><spring:message code="pixsign.catalog.update"/> <i class="fa fa-edit"></i></button>
								</div>
								<div class="btn-group">
									<button class="btn green pix-cataitem-add1"><spring:message code="pixsign.cataitem.add"/> <i class="fa fa-plus"></i></button>
								</div>
								<span class="badge badge-default pull-right catalog-status1"></span>
							</div>
							<table id="CataitemTable1" class="table table-striped table-bordered table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cubes"></i><span class="catalog-name2"></span></div>
							<div class="tools">
								<a href="javascript:;" onClick="CatalogModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button class="btn blue pix-catalog-update2"><spring:message code="pixsign.catalog.update"/> <i class="fa fa-edit"></i></button>
								</div>
								<div class="btn-group">
									<button class="btn green pix-cataitem-add2"><spring:message code="pixsign.cataitem.add"/> <i class="fa fa-plus"></i></button>
								</div>
								<span class="badge badge-default pull-right catalog-status2"></span>
							</div>
							<table id="CataitemTable2" class="table table-striped table-bordered table-hover">
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
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/device/catalog.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	CatalogModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
