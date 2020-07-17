<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/admin/pages/css/timeline-old.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="PlandtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static" style="z-index: 10051;">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="PlandtlForm" class="form-horizontal" method="POST">
						<div class="form-body">
							<div class="form-group plandtl-duration">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.duration"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="duration" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.maxtimes"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="maxtimes" />
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

	<div id="PlanModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
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
													<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.plan.baseedit"/></span>   
												</a>
											</li>
											<li>
												<a href="#tab2" data-toggle="tab" class="step">
													<span class="number">2</span>
													<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.plan.programdetail"/></span>   
												</a>
											</li>
											<li>
												<a href="#tab3" data-toggle="tab" class="step">
													<span class="number">3</span>
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
												<form id="PlanOptionForm" class="form-horizontal" data-async method="POST">
													<div class="form-group plan-layout">
														<label class="col-md-3 control-label"><spring:message code="pixsign.layout"/><span class="required">*</span></label>
														<div class="col-md-9 pre-scrollable">
															<table id="GridlayoutTable" class="table-striped"></table>
														</div>
													</div>
													<div class="form-group">
														<label class="col-md-3 control-label"><spring:message code="pixsign.prop.priority"/><span class="required">*</span></label>
														<div class="col-md-9 radio-list">
															<label class="radio-inline">
																<input type="radio" name="plan.priority" value="0" checked> <spring:message code="pixsign.prop.planpriority_0"/>
															</label>
															<label class="radio-inline">
																<input type="radio" name="plan.priority" value="1"> <spring:message code="pixsign.prop.planpriority_1"/>
															</label>
														</div>
													</div>
													<div class="form-group">
														<label class="col-md-3 control-label"><spring:message code="pixsign.prop.startdate"/><span class="required">*</span></label>
														<div class="col-md-1 checkbox-list">
															<label class="checkbox-inline">
																<input type="checkbox" name="plan.startdate.unlimited" value="1"><spring:message code="pixsign.prop.unlimited"/>
															</label>
														</div>
														<div class="col-md-3">
															<div class="input-group date form_date">                                       
																<input type="text" size="16" readonly class="form-control" name="plan.startdate">
																<span class="input-group-btn">
																<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																</span>
															</div>
														</div>
													</div>
													<div class="form-group">
														<label class="col-md-3 control-label"><spring:message code="pixsign.prop.enddate"/><span class="required">*</span></label>
														<div class="col-md-1 checkbox-list">
															<label class="checkbox-inline">
																<input type="checkbox" name="plan.enddate.unlimited" value="1"><spring:message code="pixsign.prop.unlimited"/>
															</label>
														</div>
														<div class="col-md-3">
															<div class="input-group date form_date">                                       
																<input type="text" size="16" readonly class="form-control" name="plan.enddate">
																<span class="input-group-btn">
																<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																</span>
															</div>
														</div>
													</div>
													<div class="form-group">
														<label class="col-md-3 control-label"><spring:message code="pixsign.prop.playtime"/><span class="required">*</span></label>
														<div class="col-md-1 checkbox-list">
															<label class="checkbox-inline">
																<input type="checkbox" name="plan.fulltime" value="1"><spring:message code="pixsign.prop.fulltime"/>
															</label>
														</div>
														<div class="col-md-3">
															<div class="input-group date form_time">                                       
																<input type="text" size="16" readonly class="form-control" name="plan.starttime">
																<span class="input-group-btn">
																<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																</span>
															</div>
														</div>
														<div class="col-md-3">
															<div class="input-group date form_time">                                       
																<input type="text" size="16" readonly class="form-control" name="plan.endtime">
																<span class="input-group-btn">
																<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
																</span>
															</div>
														</div>
													</div>
												</form>
											</div>

											<div class="tab-pane" id="tab2">
												<div class="row">
													<div class="col-md-8 col-sm-12">
														<div class="portlet box blue">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.warehouse"/></div>
																<ul class="nav nav-tabs">
																	<li id="nav_tab4" class="pageflag">
																		<a href="#PageTab" data-toggle="tab"><spring:message code="pixsign.solopage"/></a>
																	</li>
																	<li id="nav_tab3" class="imageflag">
																		<a href="#ImageTab" data-toggle="tab"><spring:message code="pixsign.soloimage"/></a>
																	</li>
																	<li id="nav_tab2" class="videoflag">
																		<a href="#VideoTab" data-toggle="tab"><spring:message code="pixsign.solovideo"/></a>
																	</li>
																	<li id="nav_tab1" class="mediagridflag active">
																		<a href="#MediagridTab" data-toggle="tab"><spring:message code="pixsign.mediagrid"/></a>
																	</li>
																</ul>
															</div>
															<div class="portlet-body">
																<div class="tab-content">
																	<div class="tab-pane active" id="MediagridTab">
																		<div class="row">
																			<div class="col-md-3">
																				<div class="row"><div class="col-md-12 branchtree"></div></div>
																			</div>
																			<div class="col-md-9">
																				<table id="MediagridTable" class="table table-condensed table-hover">
																					<thead></thead>
																					<tbody></tbody>
																				</table>
																			</div>
																		</div>
																	</div>
																	<div class="tab-pane" id="VideoTab">
																		<div class="row">
																			<div class="col-md-3">
																				<div class="row"><div class="col-md-12 branchtree"></div></div>
																				<hr/>
																				<div class="row"><div class="col-md-12 foldertree"></div></div>
																			</div>
																			<div class="col-md-9">
																				<table id="VideoTable" class="table table-condensed table-hover">
																					<thead></thead>
																					<tbody></tbody>
																				</table>
																			</div>
																		</div>
																	</div>
																	<div class="tab-pane" id="ImageTab">
																		<div class="row">
																			<div class="col-md-3">
																				<div class="row"><div class="col-md-12 branchtree"></div></div>
																				<hr/>
																				<div class="row"><div class="col-md-12 foldertree"></div></div>
																			</div>
																			<div class="col-md-9">
																				<table id="ImageTable" class="table table-condensed table-hover">
																					<thead></thead>
																					<tbody></tbody>
																				</table>
																			</div>
																		</div>
																	</div>
																	<div class="tab-pane" id="PageTab">
																		<div class="row">
																			<div class="col-md-3">
																				<div class="row"><div class="col-md-12 branchtree"></div></div>
																			</div>
																			<div class="col-md-9">
																				<table id="PageTable" class="table table-condensed table-hover">
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
														
													<div class="col-md-4 col-sm-12">
														<div class="portlet box green">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.detail"/></div>
															</div>
															<div class="portlet-body">
																<div class="table-responsive">
																	<table id="SelectedDtlTable" class="table table-condensed table-hover">
																		<thead></thead>
																		<tbody></tbody>
																	</table>
																</div>
															</div>
														</div>
													</div>
														
												</div>
											</div>
												
											<div class="tab-pane" id="tab3">
												<div class="row">
													<div class="col-md-7">
														<div class="portlet box blue tabbable">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.plan.devicewarehouse"/></div>
																<ul class="nav nav-tabs">
																	<li id="nav_dtab1" class="active">
																		<a href="#DevicegridTab" data-toggle="tab"><spring:message code="pixsign.devicegrid"/></a>
																	</li>
																	<li id="nav_dtab2">
																		<a href="#DevicegroupTab" data-toggle="tab"><spring:message code="pixsign.devicegridgroup"/></a>
																	</li>
																</ul>
															</div>
															<div class="portlet-body">
																<div class="tab-content">
																	<div class="tab-pane active" id="DevicegridTab">
																		<div class="row">
																			<div class="col-md-3">
																				<div class="row"><div class="col-md-12 branchtree"></div></div>
																			</div>
																			<div class="col-md-9">
																				<table id="DevicegridTable" class="table table-condensed table-hover">
																					<thead></thead>
																					<tbody></tbody>
																				</table>
																			</div>
																		</div>
																	</div>
																	<div class="tab-pane" id="DevicegroupTab">
																		<div class="row">
																			<div class="col-md-3">
																				<div class="row"><div class="col-md-12 branchtree"></div></div>
																			</div>
																			<div class="col-md-9">
																				<table id="DevicegroupTable" class="table table-condensed table-hover">
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
													<div class="col-md-5">
														<div class="portlet box green">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.plan.deviceselected"/></div>
															</div>
															<div class="portlet-body">
																<div class="table-responsive">
																	<table id="SelectedBindTable" class="table table-condensed table-hover">
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

	<div class="page-content-wrapper">
		<div class="page-content">
			<h3 class="page-title"><spring:message code="menu.multiplan"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.mscreen"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.multiplan"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="pixsign.multiplan"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="refreshPlan();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button class="btn green pix-add">
										<spring:message code="global.add"/> <i class="fa fa-plus"></i>
									</button>
								</div>
							</div>
							<table id="PlanTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=2" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-preview.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-plan-multi.js?t=${timestamp}"></script>
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
