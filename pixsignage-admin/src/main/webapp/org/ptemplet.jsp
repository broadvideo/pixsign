<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>

<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<link href="${base_ctx}/wysiwyg/css/wysiwyg.css" rel="stylesheet"/>
</head>

<body>
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="global.ptemplet"/></h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
						<input type="hidden" name="ptemplet.ptempletid" value="0" />
						<input type="hidden" name="ptemplet.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.name"/><span
										class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="ptemplet.name" />
									</div>
								</div>
							</div>
							<div class="form-group hide-update">
								<label class="control-label col-md-3"><spring:message code="global.layout.ratio"/></label>
								<div class="col-md-9">
									<select class="form-control" name="ptemplet.ratio" tabindex="-1">
										<option value="1"><spring:message code="global.layout.ratio_1"/></option>
										<option value="2"><spring:message code="global.layout.ratio_2"/></option>
									</select>
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

	<div id="PtempletModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="global.template"/></h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12">
							<a href="javascript:;" class="icon-btn pix-addzone" zonetype="0">
								<i class="fa fa-font"></i><div>文本</div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone" zonetype="1">
								<i class="fa fa-image"></i><div>图片</div>
							</a>
						</div>
					</div>
					<div class="row">
						<div class="col-md-9">
							<div id="PtempletDiv"></div>
						</div>
						<div class="col-md-3">
							<div class="panel-group" id="PtempletzoneEditPanel">
								<div class="panel panel-default ptempletzone-ctl zonetype-0">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#PtempletzoneEditPanel" href="#Collapse1">字体样式</a>
										</h4>
									</div>
									<div id="Collapse1" class="panel-collapse collapse in">
										<form id="PtempletzoneEditForm1" class="form-horizontal pix-bordered">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">字体</label>
													<div class="col-md-9">
														<input type="hidden" id="FontFamilySelect" class="form-control select2" name="fontfamily">
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">颜色</label>
													<div class="col-md-9">
														<div class="input-group colorpicker-component colorPick">
															<input type="text" name="color" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
															<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">大小</label>
													<div class="col-md-9">
														<div id="spinner-fontsize">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="fontsize" >
																<div class="spinner-buttons input-group-btn btn-group-vertical">
																	<button type="button" class="btn spinner-up btn-xs blue">
																	<i class="fa fa-angle-up"></i>
																	</button>
																	<button type="button" class="btn spinner-down btn-xs blue">
																	<i class="fa fa-angle-down"></i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">样式</label>
													<div class="col-md-9">
														<a href="javascript:;" class="btn btn-icon-only default pix-bold"><i class="fa fa-bold"></i></a>
														<a href="javascript:;" class="btn btn-icon-only default pix-italic"><i class="fa fa-italic"></i></a>
														<a href="javascript:;" class="btn btn-icon-only default pix-underline"><i class="fa fa-underline"></i></a>
														<a href="javascript:;" class="btn btn-icon-only default pix-strikethrough"><i class="fa fa-strikethrough"></i></a>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">对齐</label>
													<div class="col-md-9">
														<a href="javascript:;" class="btn btn-icon-only default pix-align-left"><i class="fa fa-align-left"></i></a>
														<a href="javascript:;" class="btn btn-icon-only default pix-align-right"><i class="fa fa-align-right"></i></a>
														<a href="javascript:;" class="btn btn-icon-only default pix-align-center"><i class="fa fa-align-center"></i></a>
														<a href="javascript:;" class="btn btn-icon-only default pix-align-justify"><i class="fa fa-align-justify"></i></a>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">行距</label>
													<div class="col-md-9">
														<div id="spinner-lineheight">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="lineheight" >
																<div class="spinner-buttons input-group-btn btn-group-vertical">
																	<button type="button" class="btn spinner-up btn-xs blue">
																	<i class="fa fa-angle-up"></i>
																	</button>
																	<button type="button" class="btn spinner-down btn-xs blue">
																	<i class="fa fa-angle-down"></i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default ptempletzone-ctl zonetype-1">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#PtempletzoneEditPanel" href="#Collapse2">图片设置</a>
										</h4>
									</div>
									<div id="Collapse2" class="panel-collapse collapse in">
										<form id="PtempletzoneEditForm2" class="form-horizontal pix-bordered">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">图片</label>
													<div class="col-md-9">
														<a href="javascript:;" class="btn default btn-sm blue pix-image-library"><i class="fa fa-image"></i> 选择图片</a>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">透明</label>
													<div class="col-md-9">
														<input class="opacityRange" type="text" name="opacity" value=""/>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#PtempletzoneEditPanel" href="#Collapse3">背景阴影</a>
										</h4>
									</div>
									<div id="Collapse3" class="panel-collapse collapse">
										<form id="PtempletzoneEditForm3" class="form-horizontal pix-bordered">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">颜色</label>
													<div class="col-md-9">
														<div class="input-group colorpicker-component bgcolorPick">
															<input type="text" name="bgcolor" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
															<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">透明</label>
													<div class="col-md-9">
														<input class="bgopacityRange" type="text" name="bgopacity" value=""/>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#PtempletzoneEditPanel" href="#Collapse4">大小位置</a>
										</h4>
									</div>
									<div id="Collapse4" class="panel-collapse collapse">
										<form id="PtempletzoneEditForm4" class="form-horizontal pix-bordered">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">边距</label>
													<div class="col-md-9">
														<div id="spinner-padding">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="padding" >
																<div class="spinner-buttons input-group-btn btn-group-vertical">
																	<button type="button" class="btn spinner-up btn-xs blue">
																	<i class="fa fa-angle-up"></i>
																	</button>
																	<button type="button" class="btn spinner-down btn-xs blue">
																	<i class="fa fa-angle-down"></i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">X</label>
													<div class="col-md-9">
														<div id="spinner-x">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="leftoffset" >
																<div class="spinner-buttons input-group-btn btn-group-vertical">
																	<button type="button" class="btn spinner-up btn-xs blue">
																	<i class="fa fa-angle-up"></i>
																	</button>
																	<button type="button" class="btn spinner-down btn-xs blue">
																	<i class="fa fa-angle-down"></i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">Y</label>
													<div class="col-md-9">
														<div id="spinner-y">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="topoffset" >
																<div class="spinner-buttons input-group-btn btn-group-vertical">
																	<button type="button" class="btn spinner-up btn-xs blue">
																	<i class="fa fa-angle-up"></i>
																	</button>
																	<button type="button" class="btn spinner-down btn-xs blue">
																	<i class="fa fa-angle-down"></i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">W</label>
													<div class="col-md-9">
														<div id="spinner-w">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="width" >
																<div class="spinner-buttons input-group-btn btn-group-vertical">
																	<button type="button" class="btn spinner-up btn-xs blue">
																	<i class="fa fa-angle-up"></i>
																	</button>
																	<button type="button" class="btn spinner-down btn-xs blue">
																	<i class="fa fa-angle-down"></i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">H</label>
													<div class="col-md-9">
														<div id="spinner-h">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="height" >
																<div class="spinner-buttons input-group-btn btn-group-vertical">
																	<button type="button" class="btn spinner-up btn-xs blue">
																	<i class="fa fa-angle-up"></i>
																	</button>
																	<button type="button" class="btn spinner-down btn-xs blue">
																	<i class="fa fa-angle-down"></i>
																	</button>
																</div>
															</div>
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
				<div class="modal-footer">
					<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
					<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>
		
	<div id="ImageLibraryModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-8">
		
							<div class="portlet box blue">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.resource.warehouse"/></div>
									<ul class="nav nav-tabs" style="margin-left: 10px;">
										<li id="public_tab" class="active">
											<a href="#portlet_tab" data-toggle="tab"><spring:message code="global.image"/></a>
										</li>
									</ul>
								</div>
								<div class="portlet-body">
									<div class="tab-content">
										<div class="tab-pane active" id="portlet_tab">
											<div class="row">
												<div class="col-md-3">
													<div class="row"><div class="col-md-12" id="MediaBranchTreeDiv"></div></div>
													<hr/>
													<div class="row"><div class="col-md-12" id="MediaFolderTreeDiv"></div></div>
												</div>
												<div class="col-md-9">
													<div id="ImageDiv">
														<table id="ImageTable" class="table table-condensed table-hover">
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
						<div class="col-md-4">
							<h3 class="page-title">选择图片</h3>
							<div id="ImageLibraryPreview">
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
			<h3 class="page-title"><spring:message code="menu.ptemplet"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.ptemplet"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.ptemplet"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
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
			<div id="snapshot_div" style="position:relative; top:65px; display:none;"></div>
		</div>
	</div>
</body>

<div id="SiteMethJavaScript">
<!-- BEGIN PAGE LEVEL PLUGINS -->
	<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery.ui.rotatable.js"></script>
		
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=2" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fuelux/js/spinner.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/html2canvas.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-ptemplet.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-preview.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
