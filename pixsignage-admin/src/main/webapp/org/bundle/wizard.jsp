<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>

<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<!-- <link href="${static_ctx}/global/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.css" rel="stylesheet"/>  -->
<link href="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css" rel="stylesheet" type="text/css"/>
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
	<div class="page-content-wrapper">
		<div class="page-content">
		
			<div id="MonitorDeviceModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-full">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title">发布成功</h4>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md-7">
									<div class="portlet box blue">
										<div class="portlet-title">
											<div class="caption"><i class="fa fa-picture"></i>设备列表</div>
											<div class="tools">
												<a href="javascript:;" onClick="$('#ScheduleTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
											</div>
										</div>
										<div class="portlet-body">
											<div class="table-responsive">
												<table id="MonitorDeviceTable" class="table table-condensed table-hover">
													<thead></thead>
													<tbody></tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-5">
									<div class="portlet box green">
										<div class="portlet-title">
											<div class="caption"><i class="fa fa-picture"></i>文件下载列表</div>
											<div class="tools">
												<a href="javascript:;" onClick="$('#SchedulefileTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
											</div>
										</div>
										<div class="portlet-body">
											<div class="table-responsive">
												<table id="DevicefileTable" class="table table-condensed table-hover">
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
							<button class="btn default" data-dismiss="modal">关闭</button>
						</div>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div id="MyWizard">
						<div class="form-wizard">
							<div class="form-body">
								<ul class="nav nav-pills nav-justified steps">
									<li>
										<a href="#tab1" data-toggle="tab" class="step">
											<span class="number">1</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.selecttemplate"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab2" data-toggle="tab" class="step">
											<span class="number">2</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.baseedit"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab3" data-toggle="tab" class="step">
											<span class="number">3</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.designlayout"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab4" data-toggle="tab" class="step">
											<span class="number">4</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.designcontent"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab5" data-toggle="tab" class="step">
											<span class="number">5</span>
											<span class="desc"><i class="fa fa-check"></i> <spring:message code="pixsign.tips.selectdevice"/></span>   
										</a>
									</li>
									<li>
										<a href="#tab6" data-toggle="tab" class="step">
											<span class="number">6</span>
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
										<form id="TempletOptionForm" class="form-horizontal" data-async method="POST">
											<div class="note note-success">
												<p><spring:message code="pixsign.tips_1"/></p>
												<p><spring:message code="pixsign.tips_3"/></p>
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
													<label class="radio-inline">
														<input type="radio" name="templetflag" value="2"> <spring:message code="pixsign.prop.templetflag_2"/>
													</label>
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
										<form id="BundleOptionForm" class="form-horizontal" data-async method="POST">
											<input type="hidden" name="homeidletime" value="0" />
											<div class="form-group">
												<label class="col-md-3 control-label"><spring:message code="global.name"/></label>
												<div class="col-md-6">
													<div class="input-icon right">
														<i class="fa"></i> <input type="text" class="form-control" name="name" />
													</div>
												</div>
											</div>
											<div class="form-group">
												<label class="col-md-3 control-label"><spring:message code="pixsign.prop.bgimage"/></label>
												<div class="col-md-6">
													<div class="input-group">
														<span class="input-group-btn">
															<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
															<ul class="dropdown-menu" role="menu">
																<div class="pre-scrollable foldertree">
																</div>
															</ul>
														</span>
														<input type="hidden" id="LayoutBgImageSelect2" class="form-control select2" name="bgimageid">
														<span class="input-group-btn">
															<button class="btn default" type="button" id="LayoutBgImageRemove"><i class="fa fa-trash-o"/></i></button>
														</span>
													</div>
												</div>
											</div>
											<div class="form-group">
												<label class="col-md-3 control-label"><spring:message code="pixsign.prop.description"/></label>
												<div class="col-md-6">
													<textarea class="form-control" rows="6" name="description"></textarea>
												</div>
											</div>
										</form>
									</div>

									<div class="tab-pane" id="tab3">
										<div class="row">
											<div class="col-md-12 col-sm-12">
												<div class="portlet box purple">
													<div class="portlet-title">
														<div class="caption"><i class="fa fa-calendar"></i><spring:message code="pixsign.layout"/></div>
														<div class="actions">
															<a href="javascript:;" regiontype="0" class="btn btn-sm yellow pix-addregion"><spring:message code="pixsign.bundledtl.type.play"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="1" class="btn btn-sm yellow pix-addregion"><spring:message code="pixsign.bundledtl.type.text"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="2" class="btn btn-sm yellow pix-addregion"><spring:message code="pixsign.bundledtl.type.date"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="3" class="btn btn-sm yellow pix-addregion"><spring:message code="pixsign.bundledtl.type.weather"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="6" class="btn btn-sm yellow pix-addregion stream-ctrl"><spring:message code="pixsign.bundledtl.type.stream"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="5" class="btn btn-sm yellow pix-addregion dvb-ctrl"><spring:message code="pixsign.bundledtl.type.dvb"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="4" class="btn btn-sm yellow pix-addregion videoin-ctrl"><spring:message code="pixsign.bundledtl.type.videoin"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="7" class="btn btn-sm yellow pix-addregion touch-ctrl"><spring:message code="pixsign.bundledtl.type.touch"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="8" class="btn btn-sm yellow pix-addregion touch-ctrl"><spring:message code="pixsign.bundledtl.type.navigate"/> <i class="fa fa-plus"></i></a>
															<!-- <a href="javascript:;" regiontype="9" class="btn btn-sm yellow pix-addregion"><spring:message code="pixsign.bundledtl.type.qrcode"/> <i class="fa fa-plus"></i></a> -->
															<a href="javascript:;" regiontype="10" class="btn btn-sm yellow pix-addregion calendar-ctrl"><spring:message code="pixsign.bundledtl.type.calendarlist"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="11" class="btn btn-sm yellow pix-addregion calendar-ctrl"><spring:message code="pixsign.bundledtl.type.calendartable"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="12" class="btn btn-sm yellow pix-addregion rss-ctrl"><spring:message code="pixsign.bundledtl.type.rss"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="13" class="btn btn-sm yellow pix-addregion audio-ctrl"><spring:message code="pixsign.bundledtl.type.audio"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="A1" class="btn btn-sm yellow pix-addregion lift-ctrl"><spring:message code="pixsign.bundledtl.type.a1"/> <i class="fa fa-plus"></i></a>
															<a href="javascript:;" regiontype="A2" class="btn btn-sm yellow pix-addregion lift-ctrl"><spring:message code="pixsign.bundledtl.type.a2"/> <i class="fa fa-plus"></i></a>
														</div>
													</div>
													<div class="portlet-body form">
														<div class="row">
															<div id="LayoutCol1">
																<div id="LayoutDiv" layoutid="0"></div>
															</div>
															<div id="LayoutCol2">
																<form id="LayoutdtlEditForm" class="form-horizontal pix-bordered">
																	<input type="hidden" name="regionid" value="0" />
																	<div class="form-body">
																		<div class="row">
																			<h3 class="col-md-6 page-title font-red-sunglo bundledtl-title"></h3>
																			<div class="col-md-6">
																				<a href="javascript:;" class="btn default btn-sm red pull-right pix-region-delete"><i class="fa fa-trash-o"></i> <spring:message code="global.remove"/></a>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-0">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.sleeptime"/></label>
																			<div class="col-md-9">
																				<input class="sleepRange" type="text" name="sleeptime" value="0"/>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-0 regiontype-6">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.intervaltime"/></label>
																			<div class="col-md-9">
																				<input class="intervalRange" type="text" name="intervaltime" value="10"/>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-0">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.animation"/></label>
																			<div class="col-md-9">
																				<input type="hidden" id="AnimationSelect" class="form-control select2" name="animation">
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-0">
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
																		<div class="form-group bundle-ctl regiontype-0 regiontype-6">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.volume"/></label>
																			<div class="col-md-9">
																				<input class="volumeRange" type="text" name="volume" value="50"/>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-1">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.direction"/></label>
																			<div class="col-md-9 radio-list">
																				<label class="radio-inline">
																					<input type="radio" name="direction" value="1"> <spring:message code="pixsign.prop.direction_1"/>
																				</label>
																				<label class="radio-inline">
																					<input type="radio" name="direction" value="4" checked> <spring:message code="pixsign.prop.direction_4"/>
																				</label>  
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-1">
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
																		<div class="form-group bundle-ctl regiontype-1 regiontype-2 regiontype-3 regiontype-7 regiontype-12">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.color"/></label>
																			<div class="col-md-9">
																				<div class="input-group colorpicker-component colorPick">
																					<input type="text" name="color" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
																					<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
																				</div>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-1 regiontype-2 regiontype-3 regiontype-7">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.size"/></label>
																			<div class="col-md-9">
																				<input class="sizeRange" type="text" name="size" value="50"/>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-2">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.dateformat"/></label>
																			<div class="col-md-9">
																				<select class="form-control" name="dateformat" tabindex="-1">
																					<option value="yyyy-MM-dd">2016-01-01</option>
																					<option value="HH:mm">12:00</option>
																					<option value="ww">星期五</option>
																					<option value="yyyy-MM-dd HH:mm">2016-01-01 12:00</option>
																					<option value="yyyy-MM-dd ww">2016-01-01 星期五</option>
																				</select>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-0 regiontype-7 regiontype-8 regiontype-10 regiontype-11">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.bgimage"/></label>
																			<div class="col-md-9">
																				<div class="input-group">
																					<span class="input-group-btn">
																						<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
																						<ul class="dropdown-menu" role="menu">
																							<div class="pre-scrollable foldertree">
																							</div>
																						</ul>
																					</span>
																					<input type="hidden" id="RegionBgImageSelect" class="form-control select2" name="bgimageid" />
																					<span class="input-group-btn">
																						<button class="btn default" type="button" id="RegionBgImageRemove"><i class="fa fa-trash-o"/></i></button>
																					</span>
																				</div>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-1 regiontype-2 regiontype-3 regiontype-7 regiontype-8 regiontype-10 regiontype-11 regiontype-12">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.bgcolor"/></label>
																			<div class="col-md-9">
																				<div class="input-group colorpicker-component bgcolorPick">
																					<input type="text" name="bgcolor" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
																					<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
																				</div>
																			</div>
																		</div>
																		<div class="form-group bundle-ctl regiontype-1 regiontype-2 regiontype-3 regiontype-7 regiontype-8 regiontype-10 regiontype-11 regiontype-12">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.opacity"/></label>
																			<div class="col-md-9">
																				<input class="opacityRange" type="text" name="opacity" value=""/>
																			</div>
																		</div>
																		<div class="form-group">
																			<label class="col-md-3 control-label"><spring:message code="pixsign.prop.zindex"/></label>
																			<div class="col-md-9 radio-list">
																				<label class="radio-inline">
																					<input type="radio" name="zindex" value="0"> <spring:message code="pixsign.prop.zindex_0"/>
																				</label>
																				<label class="radio-inline">
																					<input type="radio" name="zindex" value="1" checked> <spring:message code="pixsign.prop.zindex_1"/>
																				</label>
																				<label class="radio-inline">
																					<input type="radio" name="zindex" value="2"> <spring:message code="pixsign.prop.zindex_2"/>
																				</label>  
																			</div>
																		</div>
																		<div class="form-group">
																			<label class="col-md-1 control-label">X</label>
																			<div class="col-md-5">
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
																			<label class="col-md-1 control-label">Y</label>
																			<div class="col-md-5">
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
																		<div class="form-group last">
																			<label class="col-md-1 control-label">W</label>
																			<div class="col-md-5">
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
																			<label class="col-md-1 control-label">H</label>
																			<div class="col-md-5">
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
									</div>
										
									<div class="tab-pane" id="tab4">
										<div class="row">
											<div id="BundleCol1">
												<div id="BundleDiv" bundleid="0"></div>
											</div>
											<div id="BundleCol2">
												<form id="BundledtlEditForm" class="form-horizontal pix-bordered">
													<input type="hidden" name="bundledtl.bundledtlid" value="0" />
													<div class="form-body">
														<label class="page-title font-red-sunglo bundledtl-title"></label>
	
														<div class="form-group bundle-ctl regiontype-7">
															<label class="control-label col-md-3"><spring:message code="pixsign.prop.touchlabel"/></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundledtl.touchlabel" value=""/>
																</div>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-7">
															<label class="control-label col-md-3"><spring:message code="pixsign.prop.touchtype"/><span class="required">*</span></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="0"> <spring:message code="pixsign.prop.touchtype_0"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="1" checked> <spring:message code="pixsign.prop.touchtype_1"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="2"> <spring:message code="pixsign.prop.touchtype_2"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="3"> <spring:message code="pixsign.prop.touchtype_3"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="4"> <spring:message code="pixsign.prop.touchtype_4"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.touchtype" value="9"> <spring:message code="pixsign.prop.touchtype_9"/>
																</label>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-7 touchtype-2">
															<label class="col-md-3 control-label"><spring:message code="pixsign.prop.touchbundle"/><span class="required">*</span></label>
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
															<label class="control-label col-md-3"><spring:message code="global.type"/></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.objtype" value="1" checked> <spring:message code="pixsign.medialist"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.objtype" value="5"> <spring:message code="pixsign.widget"/>
																</label>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-1 touchtype-3">
															<label class="control-label col-md-3"><spring:message code="pixsign.prop.objtype"/></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.objtype" value="2" checked> <spring:message code="pixsign.text"/>
																</label>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-0 regiontype-1 regiontype-7 regiontype-12 touchtype-3">
															<label class="control-label col-md-3"><spring:message code="pixsign.prop.referflag"/><span class="required">*</span></label>
															<div class="col-md-9 radio-list">
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.referflag" value="0" checked> <spring:message code="pixsign.prop.referflag_0"/>
																</label>
																<label class="radio-inline">
																	<input type="radio" name="bundledtl.referflag" value="1"> <spring:message code="pixsign.prop.referflag_1"/>
																</label>
															</div>
														</div>																	
														<div class="form-group bundle-ctl regiontype-0 regiontype-1 regiontype-5 regiontype-7 regiontype-12 public-1 touchtype-3">
															<label class="col-md-3 control-label"><spring:message code="global.detail"/></label>
															<div class="col-md-9">
																<input type="hidden" id="BundledtlSelect" class="form-control select2" name="bundledtl.objid" />
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-1 objtype-2 public-0">
															<label class="col-md-3 control-label"><spring:message code="pixsign.prop.text"/></label>
															<div class="col-md-9">
																<textarea class="form-control" rows="10" name="bundledtl.text.text"></textarea>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-0 regiontype-7 objtype-5 public-0 touchtype-3">
															<label class="col-md-3 control-label"><spring:message code="pixsign.prop.url"/><span class="required">*</span></label>
															<div class="col-md-9">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="bundledtl.widget.url" />
																</div>
															</div>
														</div>
														<div class="form-group bundle-ctl regiontype-12 public-0">
															<label class="col-md-3 control-label"><spring:message code="pixsign.prop.url"/><span class="required">*</span></label>
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
																<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.prop.stream.warehouse"/></div>
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
	
												<div class="row bundle-ctl regiontype-13">
													<div class="col-md-7">
														<div class="portlet box blue">
															<div class="portlet-title">
																<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.warehouse"/></div>
															</div>
															<div class="portlet-body">
																<table id="AudioTable1" class="table table-condensed table-hover">
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
																	<table id="AudioTable2" class="table table-condensed table-hover">
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
														<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.warehouse"/></div>
														<ul class="nav nav-tabs">
															<li id="nav_tab2">
																<a href="#ImageTab" data-toggle="tab"><spring:message code="pixsign.image"/></a>
															</li>
															<li id="nav_tab1" class="active">
																<a href="#VideoTab" data-toggle="tab"><spring:message code="pixsign.video"/></a>
															</li>
														</ul>
													</div>
													<div class="portlet-body">
														<div class="tab-content">
															<div class="tab-pane active" id="VideoTab">
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
										
									<div class="tab-pane" id="tab5">
										<div class="col-md-7">
											<div class="portlet box blue tabbable">
												<div class="portlet-title">
													<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.tips.selectdevice"/></div>
													<ul class="nav nav-tabs">
														<li id="nav_dtab1" class="active">
															<a href="#DeviceTab" data-toggle="tab"><spring:message code="pixsign.device"/></a>
														</li>
														<li id="nav_dtab2">
															<a href="#DevicegroupTab" data-toggle="tab"><spring:message code="pixsign.devicegroup"/></a>
														</li>
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
														<table id="SelectedDeviceTable" class="table table-condensed table-hover">
															<thead></thead>
															<tbody></tbody>
														</table>
													</div>
												</div>
											</div>
											<div class="portlet box green">
												<div class="portlet-title">
													<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.devicegroup.selected"/></div>
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
			
									<div class="tab-pane" id="tab6">
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
			<div id="snapshot_div" style="position:relative; top:65px; display:none;"></div>
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
<!-- <script src="${static_ctx}/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js" type="text/javascript"></script> -->
<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fuelux/js/spinner.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/html2canvas.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-wizard.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-preview.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-bundle-design1.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/other/pix-bundle-design2.js?t=${timestamp}"></script>
<script>
var myBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;
var myUser = '<%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getLoginname() %>';

var TouchCtrl = <%=(session_org != null && session_org.getTouchflag().equals("1"))%>;
var CalendarCtrl = <%=(session_org != null && session_org.getCalendarflag().equals("1"))%>;
var LiftCtrl = <%=(session_org != null && session_org.getLiftflag().equals("1"))%>;
var StreamCtrl = <%=(session_org != null && session_org.getStreamflag().equals("1"))%>;
var DvbCtrl = <%=(session_org != null && session_org.getDvbflag().equals("1"))%>;
var VideoinCtrl = <%=(session_org != null && session_org.getVideoinflag().equals("1"))%>;

jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initWizard();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
