<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>

	<div id="BatchModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12 col-sm-12">

							<div id="MyWizard">
								<div class="form-wizard">
									<div class="form-body">
										<ul class="nav nav-pills nav-justified steps">
											<li>
												<a href="#tab1" data-toggle="tab" class="step">
													<span class="number">1</span>
													<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.plan.programdetail"/></span>   
												</a>
											</li>
											<li>
												<a href="#tab2" data-toggle="tab" class="step">
													<span class="number">2</span>
													<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.plan.devicedetail"/></span>   
												</a>
											</li>
										</ul>
															
										<div class="tab-content">
											<div class="alert alert-danger display-none">
												<button class="close" data-dismiss="alert"></button>
													You have some form errors. Please check below.
											</div>
											<div class="alert alert-success display-none">
												<button class="close" data-dismiss="alert"></button>
													Your form validation is successful!
											</div>
																
											<div class="tab-pane" id="tab1">
												<div class="row">
													<div class="col-md-9 col-sm-12">
														<div class="portlet box blue">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.warehouse"/></div>
																<ul class="nav nav-tabs">
																	<li id="nav_tab2" class="touch-ctrl" style="display:none">
																		<a href="#portlet_tab" data-toggle="tab"><spring:message code="pixsign.touchbundle"/></a>
																	</li>
																	<li id="nav_tab1" class="active">
																		<a href="#portlet_tab" data-toggle="tab"><spring:message code="pixsign.bundle"/></a>
																	</li>
																</ul>
															</div>
															<div class="portlet-body">
																<div class="tab-content">
																	<div class="tab-pane active" id="portlet_tab">
																		<div class="row">
																			<div class="col-md-12">
																				<div id="BundleDiv">
																					<div class="row">
																						<div class="col-md-3">
																							<div class="row"><div class="col-md-12 branchtree"></div></div>
																						</div>
																						<div class="col-md-9">
																							<table class="table table-condensed table-hover bundletable">
																								<thead></thead>
																								<tbody></tbody>
																							</table>
																						</div>
																					</div>
																				</div>
																				<div id="TouchbundleDiv" style="display:none">
																					<div class="row">
																						<div class="col-md-3">
																							<div class="row"><div class="col-md-12 branchtree"></div></div>
																						</div>
																						<div class="col-md-9">
																							<table class="table table-condensed table-hover touchbundletable">
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
														</div>
													</div>
														
													<div class="col-md-3 col-sm-12">
														<h3 class="page-title">选择节目</h3>
														<div id="BundleSnapshot">
														</div>
													</div>
														
												</div>
											</div>
												
											<div class="tab-pane" id="tab2">
												<div class="row">
													<div class="col-md-7">
														<div id="LeftPorlet" class="portlet box blue">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.plan.devicewarehouse"/></div>
															</div>
															<div class="portlet-body">
																<div class="table-toolbar">
																	<div class="btn-group pull-right">
																		<button class="btn btn-sm blue pix-left2right"><spring:message code="global.add"/> <i class="fa fa-arrow-right"></i></button>
																	</div>
																</div>
																<div class="row">
																	<div class="col-md-3">
																		<div class="row"><div class="col-md-12 branchtree"></div></div>
																	</div>
																	<div class="col-md-9">
																		<table id="LeftDevicegroupTable" class="table table-condensed table-hover">
																			<thead></thead>
																			<tbody></tbody>
																		</table>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="col-md-5">
														<div id="RightPorlet" class="portlet box green">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.plan.deviceselected"/></div>
															</div>
															<div class="portlet-body">
																<div class="table-toolbar">
																	<div class="btn-group">
																		<button class="btn btn-sm green pix-right2left"><i class="fa fa-arrow-left"></i> <spring:message code="global.remove"/></button>
																	</div>
																</div>
																<div class="table-responsive">
																	<table id="RightDevicegroupTable" class="table table-condensed table-hover">
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
														
									<div class="fluid">
										<div class="row">
											<div class="col-md-12">
												<div class="col-md-offset-9 col-md-3">
													<a href="javascript:;" class="btn default button-previous" style="display: none;"><i class="m-icon-swapleft"></i> <spring:message code="global.previous"/> </a>
													<a href="javascript:;" class="btn blue button-next"><spring:message code="global.next"/> <i class="m-icon-swapright m-icon-white"></i></a>
													<a href="javascript:;" class="btn green button-submit" style="display: none;"><spring:message code="global.submit"/> <i class="m-icon-swapright m-icon-white"></i></a>                            
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="BundleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-9">
		
							<div class="portlet box blue">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.warehouse"/></div>
									<ul class="nav nav-tabs">
										<li id="nav_tab2" class="touch-ctrl" style="display:none">
											<a href="#portlet_tab" data-toggle="tab"><spring:message code="pixsign.touchbundle"/></a>
										</li>
										<li id="nav_tab1" class="active">
											<a href="#portlet_tab" data-toggle="tab"><spring:message code="pixsign.bundle"/></a>
										</li>
									</ul>
								</div>
								<div class="portlet-body">
									<div class="tab-content">
										<div class="tab-pane active" id="portlet_tab">
											<div class="row">
												<div class="col-md-12">
													<div id="BundleDiv">
														<div class="row">
															<div class="col-md-3">
																<div class="row"><div class="col-md-12 branchtree"></div></div>
															</div>
															<div class="col-md-9">
																<table class="table table-condensed table-hover bundletable">
																	<thead></thead>
																	<tbody></tbody>
																</table>
															</div>
														</div>
													</div>
													<div id="TouchbundleDiv" style="display:none">
														<div class="row">
															<div class="col-md-3">
																<div class="row"><div class="col-md-12 branchtree"></div></div>
															</div>
															<div class="col-md-9">
																<table class="table table-condensed table-hover touchbundletable">
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
							</div>
						</div>
						<div class="col-md-3">
							<h3 class="page-title">选择节目</h3>
							<div id="BundleSnapshot">
							</div>
						</div>
					</div>
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
			<h3 class="page-title"><spring:message code="menu.bundleplan"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
						class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.bundleplan"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="pixsign.devicegroup"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="DevicegroupModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="DevicegroupPortlet">
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-10">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn green pix-batch">
												<spring:message code="menu.bundleplan"/> <i class="fa fa-cubes"></i>
											</button>
										</div>
									</div>
									<table id="DevicegroupTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/bundle-select.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/devicegroup-select.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/plan/devicegroup-bundle.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/bundle/preview.js?t=${timestamp}"></script>
<script>
var TouchCtrl = <%=(session_org != null && session_org.getTouchflag().equals("1"))%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	DevicegroupModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
