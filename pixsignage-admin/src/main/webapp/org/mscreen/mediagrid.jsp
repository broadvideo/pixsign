<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>

<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<!-- <link href="${static_ctx}/global/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.css" rel="stylesheet"/>  -->
<link href="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>

<style type="text/css">
.modal-layout1 { 
  width: 99%;
} 
.modal-layout2 { 
  width: 1000px;
}

.form .pix-bordered .form-group {
  margin: 0;
  border-top: 1px solid;
  border-left: 1px solid;
}
.form .pix-bordered .form-group.last {
  border-bottom: 1px solid;
}
.form .pix-bordered .form-group .control-label {
  padding-top: 10px;
}
.form .pix-bordered .form-group > div {
  padding: 10px;
  border-left: 1px solid;
  border-right: 1px solid;
}

.jstree-children li > a {
  padding: 0px !important; 
  display: inline !important;
}
</style>
</head>

<body>
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.mediagrid"/></h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
						<input type="hidden" name="mediagrid.mediagridid" value="0" />
						<input type="hidden" name="mediagrid.branchid" value="0" />
						<input type="hidden" name="mediagrid.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="mediagrid.name" />
									</div>
								</div>
							</div>
							<div class="form-group mediagrid-layout">
								<label class="col-md-3 control-label"><spring:message code="pixsign.layout"/><span class="required">*</span></label>
								<div class="col-md-9 pre-scrollable">
									<table id="GridlayoutTable" class="table-striped"></table>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
					<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<!-- 设计对话框  -->
	<div id="MediagridModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12 col-sm-12">
							<div class="portlet box purple">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-calendar"></i><spring:message code="pixsign.mediagrid"/></div>
									<div class="actions">
										<a href="javascript:;" class="btn btn-sm yellow pix-dtl-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></a>
									</div>
								</div>
								<div class="portlet-body form">
									<div class="row">
										<div id="MediagridCol1" class="col-md-8 col-sm-8">
											<div id="MediagridDiv" mediagridid="0"></div>
										</div>
										<div id="MediagridCol2" class="col-md-4 col-sm-4">
											<form id="MediagridEditForm" class="form-horizontal pix-bordered">
												<input type="hidden" name="mediagrid.mediagridid" value="0" />
												<input type="hidden" name="mediagrid.status" value="1" />
												<div class="form-body">
													<label class="page-title mediagrid-title"></label>
													<div class="form-group last">
														<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/></label>
														<div class="col-md-9">
															<div class="input-icon right">
																<i class="fa"></i> <input type="text" class="form-control" name="name" />
															</div>
														</div>
													</div>
													<div class="form-group last tag-ctrl">
														<label class="col-md-3 control-label"><spring:message code="global.tag"/></label>
														<div class="col-md-9">
															<input type="hidden" id="TagSelect" class="form-control select2" name="tags">
														</div>
													</div>
												</div>
											</form>
												
											<form id="MediagriddtlEditForm" class="form-horizontal pix-bordered">
												<div class="form-body">
													<div class="row">
														<h3 class="col-md-6 page-title font-red-sunglo mediagriddtl-title"></h3>
														<div class="col-md-6">
															<a href="javascript:;" class="btn default btn-sm red pull-right pix-dtl-delete"><i class="fa fa-trash-o"></i> <spring:message code="global.remove"/></a>
														</div>
													</div>
													<div class="form-group mediagrid-ctl">
														<label class="col-md-3 control-label"><spring:message code="pixsign.mediagrid"/></label>
														<div class="col-md-9 radio-list">
															<label class="radio-inline">
																<input type="radio" name="objtype" value="1" checked> <spring:message code="pixsign.video"/>
															</label>
															<label class="radio-inline">
																<input type="radio" name="objtype" value="2"> <spring:message code="pixsign.image"/>
															</label>
															<label class="radio-inline page-ctrl">
																<input type="radio" name="objtype" value="3"> <spring:message code="pixsign.page"/>
															</label>
															<!-- 
															<label class="radio-inline bundle-ctrl">
																<input type="radio" name="objtype" value="4"> <spring:message code="pixsign.bundle"/>
															</label>
																 -->
														</div>
													</div>
													<div class="form-group mediagrid-ctl last">
														<label class="col-md-3 control-label"><spring:message code="pixsign.mediagrid"/></label>
														<div class="col-md-9">
															<div class="input-group">
																<span class="input-group-btn">
																	<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
																	<ul class="dropdown-menu" role="menu">
																		<div class="pre-scrollable foldertree">
																		</div>
																	</ul>
																</span>
																<input type="hidden" id="MediaSelect" class="form-control select2" name="objid" />
															</div>
														</div>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
					<button class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
				</div>
			</div>
		</div>
	</div>

	<div class="page-content-wrapper">
		<div class="page-content">
			<!-- BEGIN PAGE HEADER-->
			<h3 class="page-title"><spring:message code="menu.mediagrid"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.mscreen"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.mediagrid"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="pixsign.mediagrid"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="row">
								<div class="col-md-2" id="BranchTreeDiv">
								</div>
								<div class="col-md-10" id="BranchContentDiv">
									<div class="table-toolbar">
										<div class="btn-group">
											<button privilegeid="101010" class="btn green pix-add">
												<spring:message code="global.add"/> <i class="fa fa-plus"></i>
											</button>
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
				</div>
			</div>
			<div id="snapshot_div" style="position:relative; display:none;"></div>
		</div>
	</div>
</body>

<div id="SiteMethJavaScript">
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=2" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/html2canvas/html2canvas.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-branchtree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-preview.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-mediagrid.js?t=${timestamp}"></script>
<script>
var TagCtrl = <%=(session_org != null && !session_org.getTagflag().equals("0"))%>;
$('.tag-ctrl').css('display', TagCtrl?'':'none');

jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initBranchTree();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
