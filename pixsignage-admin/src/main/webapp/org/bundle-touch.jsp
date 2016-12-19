<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

<%
response.setHeader("Cache-Control","no-store");
response.setHeader("Pragrma","no-cache");
response.setDateHeader("Expires",0);
%>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>Digital Signage</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta content="" name="description" />
<meta content="" name="author" />
<meta name="MobileOptimized" content="320">
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN PAGE LEVEL STYLES -->
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>

</style>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<!-- 节目新增修改对话框  -->
		<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						<h4 class="modal-title"><spring:message code="global.touchbundle"/></h4>
					</div>
					<div class="modal-body">
						<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
							<input type="hidden" name="bundle.bundleid" value="0" />
							<input type="hidden" name="bundle.homebundleid" value="0" />
							<input type="hidden" name="bundle.touchflag" value="1" />
							<input type="hidden" name="bundle.homeflag" value="1" />
							<input type="hidden" name="bundle.status" value="1" />
							<div class="form-body">
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.name"/></label>
									<div class="col-md-9">
										<div class="input-icon right">
											<i class="fa"></i> <input type="text" class="form-control" name="bundle.name" />
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.bundle.homeidletime"/></label>
									<div class="col-md-9">
										<div class="input-icon right">
											<i class="fa"></i> <input type="text" class="form-control" name="bundle.homeidletime" value="0"/>
										</div>
									</div>
								</div>
								<div class="form-group bundle-layout">
									<label class="col-md-3 control-label"><spring:message code="global.layout"/><span class="required">*</span></label>
									<div class="col-md-9 pre-scrollable">
										<table id="LayoutTable" class="table-striped"></table>
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

		<!-- 内容包设计对话框  -->
		<div id="BundleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
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
										<div class="caption"><i class="fa fa-calendar"></i><spring:message code="global.touchbundle"/></div>
									</div>
									<div class="portlet-body form">
										<div class="row">
											<div id="BundleCol1">
												<div id="BundleDiv" bundleid="0"></div>
											</div>
											<div id="BundleCol2">
												<form id="BundledtlEditForm" class="form-horizontal">
													<input type="hidden" name="bundledtl.bundledtlid" value="0" />
													<input type="hidden" name="bundledtl.layoutdtlid" value="0" />
													<div class="form-body">
														<label class="page-title font-red-sunglo bundledtl-title"></label>
	
														<div class="form-group bundle-ctl homeflag-0">
															<label class="col-md-3 control-label"><spring:message code="global.bundle.homeidletime"/></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundle.homeidletime" value="0"/>
																</div>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-7">
															<label class="control-label col-md-3"><spring:message code="global.bundledtl.touchlabel"/></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundledtl.touchlabel" value=""/>
																</div>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-7">
															<label class="control-label col-md-3"><spring:message code="global.bundledtl.touchtype"/><span class="required">*</span></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="0"> <spring:message code="global.bundledtl.touchtype_0"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="1" checked> <spring:message code="global.bundledtl.touchtype_1"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="2"> <spring:message code="global.bundledtl.touchtype_2"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="3"> <spring:message code="global.bundledtl.touchtype_3"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="4"> <spring:message code="global.bundledtl.touchtype_4"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="9"> <spring:message code="global.bundledtl.touchtype_9"/>
																</label>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-7 touchtype-2">
															<label class="col-md-3 control-label"><spring:message code="global.bundledtl.touchbundle"/><span class="required">*</span></label>
															<div class="col-md-9">
																<input type="hidden" id="SubBundleSelect" class="form-control select2" name="bundledtl.touchbundleid" />
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-7 touchtype-4">
															<label class="col-md-3 control-label">APK<span class="required">*</span></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundledtl.touchapk" />
																</div>
															</div>
														</div>

														<div class="form-group bundle-ctl regiontype-0 regiontype-7 touchtype-3">
															<label class="control-label col-md-3"><spring:message code="global.type"/><span class="required">*</span></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.objtype" value="1" checked> <spring:message code="global.medialist"/>
																</label>
																<!-- 
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.objtype" value="3"> <spring:message code="global.stream"/>
																</label>
																 -->
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.objtype" value="5"> <spring:message code="global.widget"/>
																</label>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-1 touchtype-3">
															<label class="control-label col-md-3"><spring:message code="global.bundledtl.objtype"/><span class="required">*</span></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.objtype" value="2" checked> <spring:message code="global.text"/>
																</label>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-0 regiontype-1 regiontype-7 regiontype-12 touchtype-3">
															<label class="control-label col-md-3"><spring:message code="global.bundledtl.scope"/><span class="required">*</span></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.type" value="0" checked> <spring:message code="global.bundledtl.type_0"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.type" value="1"> <spring:message code="global.bundledtl.type_1"/>
																</label>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-0 regiontype-1 regiontype-5 regiontype-7 regiontype-12 public-1 touchtype-3">
															<label class="col-md-3 control-label"><spring:message code="global.detail"/><span class="required">*</span></label>
															<div class="col-md-9">
																<input type="hidden" id="BundledtlSelect" class="form-control select2" name="bundledtl.objid" />
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-1 objtype-2 public-0">
															<label class="col-md-3 control-label"><spring:message code="global.resource.text"/><span class="required">*</span></label>
															<div class="col-md-9">
																<textarea class="form-control" rows="10" name="bundledtl.text.text"></textarea>
															</div>
														</div>
														<!-- 
														<div class="form-group bundle-ctl regiontype-0 objtype-3 public-0">
															<label class="col-md-3 control-label"><spring:message code="global.url"/><span class="required">*</span></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundledtl.stream.url" />
																</div>
															</div>
														</div>
														-->
														<div class="form-group bundle-ctl regiontype-0 regiontype-7 objtype-5 public-0 touchtype-3">
															<label class="col-md-3 control-label"><spring:message code="global.url"/><span class="required">*</span></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundledtl.widget.url" />
																</div>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-12 public-0">
															<label class="col-md-3 control-label"><spring:message code="global.url"/><span class="required">*</span></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundledtl.rss.url" />
																</div>
															</div>
														</div>
													</div>
												</form>
													
												<div class="row bundle-ctl regiontype-6">
													<div class="col-md-7">
														<div class="portlet box blue">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.bundledtl.stream.warehouse"/></div>
															</div>
															<div class="portlet-body">
																<table id="StreamTable1" class="table table-condensed table-hover">
																	<thead></thead>
																	<tbody></tbody>
																</table>																		
															</div>
														</div>
													</div>
													<div class="col-md-5">
														<div class="portlet box green">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.selected"/></div>
															</div>
															<div class="portlet-body">
																<div class="table-responsive">
																	<table id="StreamTable2" class="table table-condensed table-hover">
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
										
										<div class="row bundle-ctl regiontype-0 regiontype-7 objtype-1 public-0 touchtype-3">
											<div class="col-md-8">
												<div class="portlet box blue">
													<div class="portlet-title">
														<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.resource.warehouse"/></div>
														<ul class="nav nav-tabs">
															<li id="nav_tab3" class="imageflag">
																<a href="#portlet_tab" data-toggle="tab"><spring:message code="global.image"/></a>
															</li>
															<li id="nav_tab2" class="hide-orgtype-2">
																<a href="#portlet_tab" data-toggle="tab"><spring:message code="global.extvideo"/></a>
															</li>
															<li id="nav_tab1" class="videoflag active">
																<a href="#portlet_tab" data-toggle="tab"><spring:message code="global.intvideo"/></a>
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
																		<div id="IntVideoDiv">
																			<table id="IntVideoTable" class="table table-condensed table-hover">
																				<thead></thead>
																				<tbody></tbody>
																			</table>
																		</div>
																		<div id="ExtVideoDiv" style="display:none">
																			<table id="ExtVideoTable" class="table table-condensed table-hover">
																				<thead></thead>
																				<tbody></tbody>
																			</table>
																		</div>
																		<div id="ImageDiv" style="display:none">
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
												<div class="portlet box green">
													<div class="portlet-title">
														<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.detail"/></div>
													</div>
													<div class="portlet-body">
														<div class="table-responsive">
															<table id="MedialistDtlTable" class="table table-condensed table-hover">
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
					<div class="modal-footer">
						<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
						<button class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 推送对话框  -->
		<div id="PushModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-full">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						<h4 class="modal-title"><spring:message code="global.bundle"/></h4>
					</div>
					<div class="modal-body">
						<div class="note note-success">
							<p><spring:message code="global.tips_2"/></p>
							<p><spring:message code="global.tips_3"/></p>
						</div>
						<div class="row">
							<div class="col-md-7">
								<div class="portlet box blue tabbable">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.wizard.selectdevice"/></div>
										<ul class="nav nav-tabs">
											<li class="active"><a href="#device_tab1" data-toggle="tab"><spring:message code="global.device"/></a></li>
											<li><a href="#device_tab2" data-toggle="tab"><spring:message code="global.devicegroup"/></a></li>
										</ul>
									</div>
									<div class="portlet-body">
										<div class="tab-content">
											<div class="tab-pane active" id="device_tab1">
												<table id="DeviceTable" class="table table-condensed table-hover">
													<thead></thead>
													<tbody></tbody>
												</table>
											</div>
											<div class="tab-pane" id="device_tab2">
												<table id="DeviceGroupTable" class="table table-condensed table-hover">
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
										<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.device.selected"/></div>
									</div>
									<div class="portlet-body">
										<div class="table-responsive">
											<table id="SelectedDeviceTable" class="table table-condensed table-hover">
												<thead></thead>
												<tbody></tbody>
											</table>
										</div>
									</div>
								</div>
								<div class="portlet box green">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.devicegroup.selected"/></div>
									</div>
									<div class="portlet-body">
										<div class="table-responsive">
											<table id="SelectedDevicegroupTable" class="table table-condensed table-hover">
												<thead></thead>
												<tbody></tbody>
											</table>
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

		<div class="page-content-wrapper">
			<div class="page-content">
				<!-- BEGIN PAGE HEADER-->
				<h3 class="page-title"><spring:message code="menu.touchbundle"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.touchbundle"/></a>
						</li>
					</ul>
				</div>
			
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.touchbundle"/></div>
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

	</div>
	
	<div class="page-footer">
		<div class="page-footer-inner">
			<%if (session_org == null || session_org.getCopyright() == null || session_org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;<spring:message code="global.copyright"/>
			<%} else { %>
			©<%=session_org.getCopyright()%>
			<%} %>
		</div>
		<div class="scroll-to-top">
			<i class="icon-arrow-up"></i>
		</div>
	</div>
	
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->   
<!--[if lt IE 9]>
<script src="${static_ctx}/global/plugins/respond.min.js"></script>
<script src="${static_ctx}/global/plugins/excanvas.min.js"></script> 
<![endif]-->   
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->

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
<script src="${static_ctx}/global/plugins/html2canvas.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=1" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=1"></script>
<script src="${base_ctx}/scripts/pix-branchtree.js?t=0"></script>
<script src="${base_ctx}/scripts/pix-preview.js?t=0"></script>
<script src="${base_ctx}/scripts/pix-bundle-design.js?t=3"></script>
<script src="${base_ctx}/scripts/pix-bundle-touch.js?t=2"></script>
<script>
jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
