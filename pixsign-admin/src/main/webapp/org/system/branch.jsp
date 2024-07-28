<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-treegrid/css/jquery.treegrid.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="DeviceModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<ul class="nav nav-tabs">
					<li class="device-navigator" devicetype="3"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device3"/></a></li>
					<li class="device-navigator" devicetype="1"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device1"/></a></li>
				</ul>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-6">
							<div class="portlet box blue">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.device"/></div>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
										<div class="btn-group pull-right">
											<button class="btn btn-sm blue pix-left2right"><spring:message code="pixsign.tips.right"/> <i class="fa fa-arrow-right"></i></button>
										</div>
									</div>
									<div class="row" id="LeftTreeDiv">
										<div class="col-md-3 branchtree">
										</div>
										<div class="col-md-9">
											<table id="LeftTable" class="table table-striped table-bordered table-hover">
												<thead></thead>
												<tbody></tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="portlet box green">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.device"/></div>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn btn-sm green pix-right2left"><i class="fa fa-arrow-left"></i> <spring:message code="pixsign.tips.left"/></button>
										</div>
									</div>
									<div class="row" id="RightTreeDiv">
										<div class="col-md-3 branchtree">
										</div>
										<div class="col-md-9">
											<table id="RightTable" class="table table-striped table-bordered table-hover">
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

	<div id="BranchEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="global.branch"/></h4>
				</div>
				<div class="modal-body">
					<form id="BranchEditForm" class="form-horizontal" data-async data-target="#BranchEditModal" method="POST">
						<input type="hidden" name="branch.branchid" value="0" />
						<input type="hidden" name="branch.status" value="1" />
						<input type="hidden" name="branch.parentid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="branch.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.code"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="branch.code" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.description"/></label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="branch.description"></textarea>
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
			<h3 class="page-title"><spring:message code="menu.branch"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
						class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.systemmanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.branch"/></a>
					</li>
				</ul>
			</div>
		
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cogs"></i><spring:message code="global.branch"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="BranchModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="BranchPortlet">
							<div class="row">
								<div class="col-md-3">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-9">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
										</div>
										<div class="btn-group">
											<button class="btn yellow pix-device"><spring:message code="pixsign.device"/> <i class="fa fa-desktop"></i></button>
										</div>
									</div>
									<table id="BranchTable" class="table table-striped table-bordered table-hover tree">
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
<script src="${base_ctx}/scripts/org/system/branch.js?t=${timestamp}1"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	BranchModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
