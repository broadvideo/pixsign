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

</head>

<body>
	<div id="LibraryModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
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
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.warehouse"/></div>
									<ul class="nav nav-tabs" style="margin-left: 10px;">
										<li id="ImageLiTab">
											<a href="#ImageLibraryTab" data-toggle="tab"><spring:message code="pixsign.image"/></a>
										</li>
										<li id="VideoLiTab" class="active">
											<a href="#VideoLibraryTab" data-toggle="tab"><spring:message code="pixsign.video"/></a>
										</li>
										<li id="StreamLiTab">
											<a href="#StreamLibraryTab" data-toggle="tab"><spring:message code="pixsign.stream"/></a>
										</li>
									</ul>
								</div>
								<div class="portlet-body">
									<div class="tab-content">
										<div class="tab-pane" id="ImageLibraryTab">
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
										<div class="tab-pane active" id="VideoLibraryTab">
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
										<div class="tab-pane active" id="StreamLibraryTab">
											<div class="row">
												<div class="col-md-3">
													<div class="row"><div class="col-md-12 branchtree"></div></div>
												</div>
												<div class="col-md-9">
													<table id="StreamTable" class="table table-condensed table-hover">
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
						<div class="col-md-4">
							<div class="portlet box green">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-picture"></i><spring:message code="global.detail"/></div>
								</div>
								<div class="portlet-body">
									<div class="table-responsive">
										<table id="BundlezonedtlTable" class="table table-condensed table-hover">
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
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="TextModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.text"/></div>
						</div>
						<div class="portlet-body">
							<form id="TextForm" class="form-horizontal" method="POST">
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.prop.text"/></label>
										<div class="col-md-9">
											<textarea class="form-control" rows="5" name="content"></textarea>
										</div>
									</div>
								</div>
							</form>
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

	<div id="WebModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.widget"/></div>
						</div>
						<div class="portlet-body">
							<form id="WebForm" class="form-horizontal" method="POST">
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label">URL<span class="required">*</span></label>
										<div class="col-md-9">
											<textarea class="form-control" rows="5" name="content"></textarea>
										</div>
									</div>
								</div>
							</form>
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

	<div id="TouchModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.button"/></div>
						</div>
						<div class="portlet-body">
							<form id="TouchForm" class="form-horizontal" method="POST">
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.prop.touchlabel"/></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="touchlabel" />
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.prop.touchtype"/></label>
										<div class="col-md-9">
											<input type="hidden" id="TouchtypeSelect" class="form-control select2" name="touchtype" />
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.prop.content"/></label>
										<div class="col-md-9">
											<div id="TouchobjGroup" class="input-group">
												<span class="input-group-btn">
													<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
													<ul class="dropdown-menu" role="menu">
														<div class="pre-scrollable foldertree"></div>
													</ul>
												</span>
												<input type="hidden" id="TouchobjSelect" class="form-control select2" name="touchobjid" />
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.prop.content"/></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="content" />
											</div>
										</div>
									</div>
								</div>
							</form>
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
		
			<div class="row">
				<div class="col-md-12">
					<div id="MyWizard">
						<div class="form-wizard">
							<div class="form-body">
								<ul class="nav nav-pills nav-justified steps">
									<li>
										<a href="#tab1" data-toggle="tab" class="step">
											<span class="number">1</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.baseedit"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab2" data-toggle="tab" class="step">
											<span class="number">2</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.designlayout"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab3" data-toggle="tab" class="step">
											<span class="number">3</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.selectdevice"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab4" data-toggle="tab" class="step">
											<span class="number">4</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.publish"/></span>   
										</a> 
									</li>
								</ul>
								<div id="bar" class="progress progress-striped" role="progressbar">
									<div class="progress-bar progress-bar-success"></div>
								</div>
													
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
										<form id="BundleForm" class="form-horizontal" data-async method="POST">
											<div class="note note-success">
												<p><spring:message code="pixsign.tips_1"/></p>
												<p><spring:message code="pixsign.tips_3"/></p>
											</div>
											<div class="form-group">
												<label class="col-md-2 control-label"><spring:message code="global.name"/></label>
												<div class="col-md-6">
													<div class="input-icon right">
														<i class="fa"></i> <input type="text" class="form-control" name="name" />
													</div>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-2"><spring:message code="pixsign.prop.ratio"/></label>
												<div class="col-md-6">
													<select class="form-control" name="bundle.ratio" tabindex="-1">
														<option value="1" selected="selected"><spring:message code="pixsign.prop.ratio_1"/></option>
														<option value="2"><spring:message code="pixsign.prop.ratio_2"/></option>
														<option value="3"><spring:message code="pixsign.prop.ratio_3"/></option>
														<option value="4"><spring:message code="pixsign.prop.ratio_4"/></option>
														<option value="5"><spring:message code="pixsign.prop.ratio_5"/></option>
														<option value="6"><spring:message code="pixsign.prop.ratio_6"/></option>
														<option value="7">1920 x 313</option>
														<option value="8">313 x 1920</option>
													</select>
												</div>
											</div>
											<div class="form-group">
												<label class="col-md-2 control-label"><spring:message code="pixsign.prop.templetflag"/></label>
												<div class="col-md-10 radio-list">
													<label class="radio-inline">
														<input type="radio" name="templetflag" value="0" checked> <spring:message code="pixsign.prop.templetflag_0"/>
													</label>
													<label class="radio-inline">
														<input type="radio" name="templetflag" value="1"> <spring:message code="pixsign.prop.templetflag_1"/>
													</label>
													<!-- 
													<label class="radio-inline">
														<input type="radio" name="templetflag" value="2"> <spring:message code="pixsign.prop.templetflag_2"/>
													</label>
													 -->
												</div>
											</div>
											<div class="form-group templet-ctrl">
												<label class="col-md-3 control-label"><spring:message code="pixsign.templet"/><span class="required">*</span></label>
												<div class="col-md-9 pre-scrollable">
													<table id="TempletTable" class="table table-condensed table-hover">
														<thead></thead>
														<tbody></tbody>
													</table>
												</div>
											</div>
										</form>
									</div>
										
									<div class="tab-pane" id="tab2">
										<div class="row">
											<div class="col-md-12 col-sm-12">
												<div class="portlet box purple">
													<div class="portlet-title">
														<div class="caption"><i class="fa fa-calendar"></i><spring:message code="pixsign.layout"/></div>
													</div>
													<div class="portlet-body">
														<div class="row">
															<div class="col-md-12">
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="1">
																	<i class="fa fa-video-camera"></i><div><spring:message code="pixsign.bundlezone.type.play"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="2">
																	<i class="fa fa-building"></i><div><spring:message code="pixsign.bundlezone.type.widget"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="3">
																	<i class="fa fa-font"></i><div><spring:message code="pixsign.bundlezone.type.text"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="4">
																	<i class="fa fa-long-arrow-left"></i><div><spring:message code="pixsign.bundlezone.type.scroll"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="5">
																	<i class="fa fa-history"></i><div><spring:message code="pixsign.bundlezone.type.date"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="6">
																	<i class="fa fa-sun-o"></i><div><spring:message code="pixsign.bundlezone.type.weather"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone touch-ctrl" zonetype="7">
																	<i class="fa fa-hand-o-up"></i><div><spring:message code="pixsign.bundlezone.type.button"/></div>
																</a>
																<!-- 
																<a href="javascript:;" class="icon-btn pix-addzone touch-ctrl" zonetype="8">
																	<i class="fa fa-road"></i><div><spring:message code="pixsign.bundlezone.type.navigate"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="9">
																	<i class="fa fa-cog"></i><div><spring:message code="pixsign.bundlezone.type.control"/></div>
																</a>
																 -->
																<a href="javascript:;" class="icon-btn pix-addzone stream-ctrl" zonetype="14">
																	<i class="fa fa-cubes"></i><div><spring:message code="pixsign.bundlezone.type.stream"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone videoin-ctrl" zonetype="15">
																	<i class="fa fa-desktop"></i><div><spring:message code="pixsign.bundlezone.type.videoin"/></div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone dvb-ctrl" zonetype="16">
																	<i class="fa fa-joomla"></i><div>DVB</div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone cloudia-ctrl" zonetype="103">
																	<i class="fa fa-cubes"></i><div>Cloudia</div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone cloudia-ctrl" zonetype="104">
																	<i class="fa fa-cubes"></i><div>定制区</div>
																</a>
																<a href="javascript:;" class="icon-btn pix-addzone" zonetype="105">
																	<i class="fa fa-cubes"></i><div>手势识别区</div>
																</a>
															</div>
														</div>
														<div class="row">
															<div class="col-md-9">
																<div style="text-align: center;">
																	<div id="BundleDiv"></div>
																</div>
															</div>
															<div class="col-md-3">
																<div class="row">
																	<h3 class="col-md-6 page-title font-red-sunglo bundlezone-title"></h3>
																	<!-- 
																	<div class="col-md-6">
																		<form method="post" target="_blank" id="PreviewForm" style="display:none" action="/pixsignage/preview/preview.jsp" >
																			<input type="hidden" name="content" value="{}" />
																		</form>
																		<a href="javascript:;" class="btn default blue pull-right pix-preview"><i class="fa fa-video-camera"></i> 预览</a>
																	</div>
																	-->
																</div>
																<div class="panel-group" id="ZoneEditPanel">
																	<div class="panel panel-default zone-ctl zonetype-1">
																		<div class="panel-heading">
																			<h4 class="panel-title">
																				<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse1"><spring:message code="pixsign.bundlezone.collapse1"/></a>
																			</h4>
																		</div>
																		<div id="Collapse1" class="panel-collapse collapse">
																			<form id="ZoneEditForm1" class="form-horizontal pix-bordered zoneform">
																				<div class="form-body">
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.bundlezone.main"/></label>
																						<div class="col-md-9 radio-list">
																							<label class="radio-inline">
																								<input type="radio" name="mainflag" value="0" checked> <spring:message code="global.no"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="mainflag" value="1"> <spring:message code="global.yes"/>
																							</label>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.intervaltime"/></label>
																						<div class="col-md-9">
																							<input class="intervalRange" type="text" name="intervaltime" value="10"/>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.sleeptime"/></label>
																						<div class="col-md-9">
																							<input class="sleepRange" type="text" name="sleeptime" value="0"/>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.fitflag"/></label>
																						<div class="col-md-9 radio-list">
																							<label class="radio-inline">
																								<input type="radio" name="fitflag" value="0"> <spring:message code="pixsign.prop.fitflag_0"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="fitflag" value="1" checked> <spring:message code="pixsign.prop.fitflag_1"/>
																							</label>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.animation"/></label>
																						<div class="col-md-9">
																							<input type="hidden" id="AnimationSelect" class="form-control select2" name="animation">
																						</div>
																					</div>
																				</div>
																			</form>
																		</div>
																	</div>
																	<div class="panel panel-default zone-ctl zonetype-3 zonetype-4 zonetype-5 zonetype-6 zonetype-7">
																		<div class="panel-heading">
																			<h4 class="panel-title">
																				<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse2"><spring:message code="pixsign.bundlezone.collapse2"/></a>
																			</h4>
																		</div>
																		<div id="Collapse2" class="panel-collapse collapse">
																			<form id="ZoneEditForm2" class="form-horizontal pix-bordered zoneform">
																				<div class="form-body">
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.color"/></label>
																						<div class="col-md-9">
																							<div class="input-group colorpicker-component colorPick">
																								<input type="text" name="color" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
																								<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
																							</div>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.size"/></label>
																						<div class="col-md-9">
																							<input class="sizeRange" type="text" name="size" value="50"/>
																						</div>
																					</div>
																				</div>
																			</form>
																		</div>
																	</div>
																	<div class="panel panel-default zone-ctl zonetype-4">
																		<div class="panel-heading">
																			<h4 class="panel-title">
																				<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse3"><spring:message code="pixsign.bundlezone.collapse3"/></a>
																			</h4>
																		</div>
																		<div id="Collapse3" class="panel-collapse collapse">
																			<form id="ZoneEditForm3" class="form-horizontal pix-bordered zoneform">
																				<div class="form-body">
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.speed"/></label>
																						<div class="col-md-9 radio-list">
																							<label class="radio-inline">
																								<input type="radio" name="speed" value="1"> <spring:message code="pixsign.prop.speed_1"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="speed" value="2" checked> <spring:message code="pixsign.prop.speed_2"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="speed" value="3"> <spring:message code="pixsign.prop.speed_3"/>
																							</label>  
																						</div>
																					</div>
																				</div>
																			</form>
																		</div>
																	</div>
																	<div class="panel panel-default zone-ctl zonetype-5">
																		<div class="panel-heading">
																			<h4 class="panel-title">
																				<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse4"><spring:message code="pixsign.bundlezone.collapse4"/></a>
																			</h4>
																		</div>
																		<div id="Collapse4" class="panel-collapse collapse">
																			<form id="ZoneEditForm4" class="form-horizontal pix-bordered zoneform">
																				<div class="form-body">
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.dateformat"/></label>
																						<div class="col-md-9">
																							<select class="form-control" name="dateformat" tabindex="-1">
																								<option value="yyyy-MM-dd">2017-01-01</option>
																								<option value="HH:mm:ss">12:00:00</option>
																								<option value="ww">星期日</option>
																								<option value="yyyy-MM-dd HH:mm:ss">2017-01-01 12:00:00</option>
																								<option value="yyyy-MM-dd ww">2017-01-01 星期日</option>
																							</select>
																						</div>
																					</div>
																				</div>
																			</form>
																		</div>
																	</div>
																	<div class="panel panel-default">
																		<div class="panel-heading">
																			<h4 class="panel-title">
																				<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse5"><spring:message code="pixsign.bundlezone.collapse5"/></a>
																			</h4>
																		</div>
																		<div id="Collapse5" class="panel-collapse collapse in">
																			<form id="ZoneEditForm5" class="form-horizontal pix-bordered zoneform">
																				<div class="form-body">
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.volume"/></label>
																						<div class="col-md-9">
																							<input class="volumeRange" type="text" name="volume" value="50"/>
																						</div>
																					</div>
																					<!-- 
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.bgimage"/></label>
																						<div class="col-md-9">
																							<div id="BgImageGroup" class="input-group">
																								<span class="input-group-btn">
																									<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
																									<ul class="dropdown-menu" role="menu">
																										<div class="pre-scrollable foldertree"></div>
																									</ul>
																								</span>
																								<input type="hidden" id="BgImageSelect" class="form-control select2" name="bgimageid" />
																								<span class="input-group-btn">
																									<button class="btn default" type="button" id="BgImageRemove"><i class="fa fa-trash-o"/></i></button>
																								</span>
																							</div>
																						</div>
																					</div>
																					 -->
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.bgcolor"/></label>
																						<div class="col-md-9">
																							<div class="input-group colorpicker-component bgcolorPick">
																								<input type="text" name="bgcolor" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
																								<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
																							</div>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.opacity"/></label>
																						<div class="col-md-9">
																							<input class="bgopacityRange" type="text" name="bgopacity" value=""/>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="pixsign.prop.zindex"/></label>
																						<div class="col-md-9">
																							<select class="form-control" name="zindex" tabindex="-1">
																								<option value="50"><spring:message code="pixsign.prop.zindex_0"/></option>
																								<option value="51"><spring:message code="pixsign.prop.zindex_1"/></option>
																								<option value="52"><spring:message code="pixsign.prop.zindex_2"/></option>
																							</select>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label">X</label>
																						<div class="col-md-9">
																							<div class="spinner" id="spinner-x">
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
																							<div class="spinner" id="spinner-y">
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
																							<div class="spinner" id="spinner-w">
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
																							<div class="spinner" id="spinner-h">
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
												</div>
											</div>
										</div>
									</div>
										
									<div class="tab-pane" id="tab3">
										<div class="row">
											<div class="col-md-7">
												<div class="portlet box blue tabbable">
													<div class="portlet-title">
														<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.selected"/></div>
														<ul class="nav nav-tabs" style="margin-right: 30px;">
															<li class="devicegroup-navigator"><a href="#DevicegroupTab" data-toggle="tab"><spring:message code="pixsign.devicegroup"/></a></li>
															<li class="device-navigator" devicetype="15" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device15"/></a></li>
															<li class="device-navigator" devicetype="13" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device13"/></a></li>
															<li class="device-navigator" devicetype="10" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device10"/></a></li>
															<li class="device-navigator" devicetype="7" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device7"/></a></li>
															<li class="device-navigator" devicetype="6" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device6"/></a></li>
															<li class="device-navigator" devicetype="2" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device2"/></a></li>
															<li class="device-navigator" devicetype="1" style="display:none;"><a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device1"/></a></li>
														</ul>
													</div>
													<div class="portlet-body">
														<div class="tab-content">
															<div class="tab-pane active" id="DeviceTab">
																<div class="row">
																	<div class="col-md-3">
																		<div class="row"><div class="col-md-12 branchtree"></div></div>
																	</div>
																	<div class="col-md-9">
																		<table id="DeviceTable" class="table table-condensed table-hover">
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
														<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.device.selected"/></div>
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
			
									<div class="tab-pane" id="tab4">
										<h3 class="block"><spring:message code="pixsign.tips.confirm"/></h3>
										<table id="ConfirmTable" class="table table-striped table-bordered table-hover"></table>
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
			<div id="snapshot_div" style="position:relative; display:none;"></div>
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
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fuelux/js/spinner.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/dom-to-image/dom-to-image.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/folder-video-select.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/folder-image-select.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/bundle/wizard.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/bundle/design.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/bundle/preview.js?t=${timestamp}"></script>
<script>
var TouchCtrl = <%=(session_org != null && session_org.getTouchflag().equals("1"))%>;
var RssCtrl = <%=(session_org != null && session_org.getRssflag().equals("1"))%>;
var StreamCtrl = <%=(session_org != null && session_org.getStreamflag().equals("1"))%>;
var DvbCtrl = <%=(session_org != null && session_org.getDvbflag().equals("1"))%>;
var VideoinCtrl = <%=(session_org != null && session_org.getVideoinflag().equals("1"))%>;
var CloudiaCtrl = <%=(session_org != null && session_org.getCloudiaflag().equals("1"))%>;

var Max1 = <%=session_org == null ? 0 : session_org.getMaxDevices("1")%>;
var Max2 = <%=session_org == null ? 0 : session_org.getMaxDevices("2")%>;
var Max6 = <%=session_org == null ? 0 : session_org.getMaxDevices("6")%>;
var Max7 = <%=session_org == null ? 0 : session_org.getMaxDevices("7")%>;
var Max10 = <%=session_org == null ? 0 : session_org.getMaxDevices("10")%>;
var Max13 = <%=session_org == null ? 0 : session_org.getMaxDevices("13")%>;
var Max15 = <%=session_org == null ? 0 : session_org.getMaxDevices("15")%>;

jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	WizardModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
