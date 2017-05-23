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

<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
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

.dropdown-menu li > a {
  padding: 0px !important; 
  display: inline !important;
}
</style>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

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
									<label class="control-label col-md-3"><spring:message code="global.layout.ratio"/></label>
									<div class="col-md-9">
										<select class="form-control" name="bundle.ratio" tabindex="-1">
											<option value="1" selected="selected"><spring:message code="global.layout.ratio_1"/></option>
											<option value="2"><spring:message code="global.layout.ratio_2"/></option>
											<option value="3"><spring:message code="global.layout.ratio_3"/></option>
											<option value="4"><spring:message code="global.layout.ratio_4"/></option>
											<option value="5"><spring:message code="global.layout.ratio_5"/></option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-md-3 control-label"><spring:message code="global.bundle.templetflag"/></label>
									<div class="col-md-9 radio-list">
										<label class="radio-inline">
											<input type="radio" name="templetflag" value="0" checked> <spring:message code="global.bundle.templetflag_0"/>
										</label>
										<label class="radio-inline">
											<input type="radio" name="templetflag" value="1"> <spring:message code="global.bundle.templetflag_1"/>
										</label>
										<label class="radio-inline">
											<input type="radio" name="templetflag" value="2"> <spring:message code="global.bundle.templetflag_2"/>
										</label>
									</div>
								</div>
								<div class="form-group templet-ctrl">
									<label class="col-md-3 control-label"><spring:message code="global.templet"/><span class="required">*</span></label>
									<div class="col-md-9 pre-scrollable">
										<table id="TempletTable" class="table table-condensed table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
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

		<div id="SubbundleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						<h4 class="modal-title"><spring:message code="global.subbundle"/></h4>
					</div>
					<div class="modal-body">
						<form id="SubbundleForm" class="form-horizontal" data-async data-target="#SubbundleModal" method="POST">
							<input type="hidden" name="bundle.bundleid" value="0" />
							<input type="hidden" name="bundle.homebundleid" value="0" />
							<input type="hidden" name="bundle.touchflag" value="1" />
							<input type="hidden" name="bundle.homeflag" value="1" />
							<input type="hidden" name="bundle.status" value="1" />
							<input type="hidden" name="bundle.ratio" value="1" />
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
									<label class="col-md-3 control-label"><spring:message code="global.subtemplet"/></label>
									<div class="col-md-9 pre-scrollable">
										<table id="FromBundleTable">
										</table>
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

								<div id="MyWizard">
									<div class="form-wizard">
										<div class="form-body">
											<ul class="nav nav-pills nav-justified steps">
												<li>
													<a href="#tab1" data-toggle="tab" class="step">
														<span class="number">1</span>
														<span class="desc"><i class="fa fa-check"></i> <spring:message code="global.baseedit"/></span>   
													</a>
												</li>
												<li>
													<a href="#tab2" data-toggle="tab" class="step">
														<span class="number">2</span>
														<span class="desc"><i class="fa fa-check"></i> <spring:message code="global.designlayout"/></span>   
													</a>
												</li>
												<li>
													<a href="#tab3" data-toggle="tab" class="step">
														<span class="number">3</span>
														<span class="desc"><i class="fa fa-check"></i> <spring:message code="global.designcontent"/></span>   
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
													<form id="BundleOptionForm" class="form-horizontal" data-async method="POST">
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.name"/></label>
															<div class="col-md-6">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="name" />
																</div>
															</div>
														</div>
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.bundle.homeidletime"/></label>
															<div class="col-md-6">
																<div class="input-icon right">
																	<i class="fa"></i> <input type="text" class="form-control" name="homeidletime" value="0"/>
																</div>
															</div>
														</div>
														<div class="form-group">
															<label class="col-md-3 control-label"><spring:message code="global.layout.bgimage"/></label>
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
															<label class="col-md-3 control-label"><spring:message code="global.description"/></label>
															<div class="col-md-6">
																<textarea class="form-control" rows="6" name="description"></textarea>
															</div>
														</div>
													</form>
												</div>

												<div class="tab-pane" id="tab2">
													<div class="row">
														<div class="col-md-12 col-sm-12">
															<div class="portlet box purple">
																<div class="portlet-title">
																	<div class="caption"><i class="fa fa-calendar"></i><spring:message code="global.layout"/></div>
																	<div class="actions">
																		<!-- 
																		<div id="RegionBtn" class="btn-group">
																		</div>
																		 -->
																		<a href="javascript:;" regiontype="0" class="btn btn-sm yellow pix-addregion"><spring:message code="region.play"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="1" class="btn btn-sm yellow pix-addregion"><spring:message code="region.text"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="2" class="btn btn-sm yellow pix-addregion"><spring:message code="region.date"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="3" class="btn btn-sm yellow pix-addregion"><spring:message code="region.weather"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="6" class="btn btn-sm yellow pix-addregion stream-ctrl"><spring:message code="region.stream"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="5" class="btn btn-sm yellow pix-addregion dvb-ctrl"><spring:message code="region.dvb"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="4" class="btn btn-sm yellow pix-addregion videoin-ctrl"><spring:message code="region.videoin"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="7" class="btn btn-sm yellow pix-addregion touch-ctrl"><spring:message code="region.touch"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="8" class="btn btn-sm yellow pix-addregion touch-ctrl"><spring:message code="region.navigate"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="9" class="btn btn-sm yellow pix-addregion"><spring:message code="region.qrcode"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="10" class="btn btn-sm yellow pix-addregion calendar-ctrl"><spring:message code="region.calendarlist"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="11" class="btn btn-sm yellow pix-addregion calendar-ctrl"><spring:message code="region.calendartable"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="12" class="btn btn-sm yellow pix-addregion rss-ctrl"><spring:message code="region.rss"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="13" class="btn btn-sm yellow pix-addregion audio-ctrl"><spring:message code="region.audio"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="A1" class="btn btn-sm yellow pix-addregion lift-ctrl"><spring:message code="region.a1"/> <i class="fa fa-plus"></i></a>
																		<a href="javascript:;" regiontype="A2" class="btn btn-sm yellow pix-addregion lift-ctrl"><spring:message code="region.a2"/> <i class="fa fa-plus"></i></a>
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
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.sleeptime"/></label>
																						<div class="col-md-9">
																							<input class="sleepRange" type="text" name="sleeptime" value="0"/>
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-0 regiontype-6">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.intervaltime"/></label>
																						<div class="col-md-9">
																							<input class="intervalRange" type="text" name="intervaltime" value="10"/>
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-0">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.animation"/></label>
																						<div class="col-md-9">
																							<input type="hidden" id="AnimationSelect" class="form-control select2" name="animation">
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-0">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.fitflag"/></label>
																						<div class="col-md-9 radio-list">
																							<label class="radio-inline">
																								<input type="radio" name="fitflag" value="0"> <spring:message code="global.layout.region.fitflag_0"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="fitflag" value="1" checked> <spring:message code="global.layout.region.fitflag_1"/>
																							</label>
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-0 regiontype-6">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.volume"/></label>
																						<div class="col-md-9">
																							<input class="volumeRange" type="text" name="volume" value="50"/>
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-1">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.direction"/></label>
																						<div class="col-md-9 radio-list">
																							<label class="radio-inline">
																								<input type="radio" name="direction" value="1"> <spring:message code="global.layout.region.direction_1"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="direction" value="4" checked> <spring:message code="global.layout.region.direction_4"/>
																							</label>  
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-1">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.speed"/></label>
																						<div class="col-md-9 radio-list">
																							<label class="radio-inline">
																								<input type="radio" name="speed" value="1"> <spring:message code="global.layout.region.speed_1"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="speed" value="2" checked> <spring:message code="global.layout.region.speed_2"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="speed" value="3"> <spring:message code="global.layout.region.speed_3"/>
																							</label>  
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-1 regiontype-2 regiontype-3 regiontype-7 regiontype-12">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.color"/></label>
																						<div class="col-md-9">
																							<div class="input-group colorpicker-component colorPick">
																								<input type="text" name="color" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
																								<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
																							</div>
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-1 regiontype-2 regiontype-3 regiontype-7">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.size"/></label>
																						<div class="col-md-9">
																							<input class="sizeRange" type="text" name="size" value="50"/>
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-2">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.dateformat"/></label>
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
																						<label class="col-md-3 control-label"><spring:message code="global.layout.bgimage"/></label>
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
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.bgcolor"/></label>
																						<div class="col-md-9">
																							<div class="input-group colorpicker-component bgcolorPick">
																								<input type="text" name="bgcolor" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
																								<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
																							</div>
																						</div>
																					</div>
																					<div class="form-group bundle-ctl regiontype-1 regiontype-2 regiontype-3 regiontype-7 regiontype-8 regiontype-10 regiontype-11 regiontype-12">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.opacity"/></label>
																						<div class="col-md-9">
																							<input class="opacityRange" type="text" name="opacity" value=""/>
																						</div>
																					</div>
																					<div class="form-group">
																						<label class="col-md-3 control-label"><spring:message code="global.layout.region.zindex"/></label>
																						<div class="col-md-9 radio-list">
																							<label class="radio-inline">
																								<input type="radio" name="zindex" value="0"> <spring:message code="global.layout.region.zindex_0"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="zindex" value="1" checked> <spring:message code="global.layout.region.zindex_1"/>
																							</label>
																							<label class="radio-inline">
																								<input type="radio" name="zindex" value="2"> <spring:message code="global.layout.region.zindex_2"/>
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
												
												<div class="tab-pane" id="tab3">
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
																		<label class="control-label col-md-3"><spring:message code="global.type"/></label>
																		<div class="col-md-9 radio-list">
																			<label class="radio-inline">
																				<input type="radio" name="bundledtl.objtype" value="1" checked> <spring:message code="global.medialist"/>
																			</label>
																			<label class="radio-inline">
																				<input type="radio" name="bundledtl.objtype" value="5"> <spring:message code="global.widget"/>
																			</label>
																		</div>
																	</div>
																	<div class="form-group bundle-ctl regiontype-1 touchtype-3">
																		<label class="control-label col-md-3"><spring:message code="global.bundledtl.objtype"/></label>
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
																				<input type="radio" name="bundledtl.referflag" value="0" checked> <spring:message code="global.bundledtl.type_0"/>
																			</label>
																			<label class="radio-inline">
																				<input type="radio" name="bundledtl.referflag" value="1"> <spring:message code="global.bundledtl.type_1"/>
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
																		<label class="col-md-3 control-label"><spring:message code="global.resource.text"/></label>
																		<div class="col-md-9">
																			<textarea class="form-control" rows="10" name="bundledtl.text.text"></textarea>
																		</div>
																	</div>
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
		
															<div class="row bundle-ctl regiontype-13">
																<div class="col-md-7">
																	<div class="portlet box blue">
																		<div class="portlet-title">
																			<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.resource.warehouse"/></div>
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
														
										<div class="fluid">
											<div class="row">
												<div class="col-md-12">
													<div class="col-md-offset-9 col-md-3">
														<a href="javascript:;" class="btn default button-previous" style="display: none;"><i class="m-icon-swapleft"></i> <spring:message code="global.wizard.previous"/> </a>
														<a href="javascript:;" class="btn blue button-next"><spring:message code="global.wizard.next"/> <i class="m-icon-swapright m-icon-white"></i></a>
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
											<li id="nav_dtab1" class="active">
												<a href="#device_tab" data-toggle="tab"><spring:message code="global.device"/></a>
											</li>
											<li id="nav_dtab2">
												<a href="#device_tab" data-toggle="tab"><spring:message code="global.devicegroup"/></a>
											</li>
										</ul>
									</div>
									<div class="portlet-body">
										<div class="tab-content">
											<div class="tab-pane active" id="device_tab">
												<div class="row">
													<div class="col-md-3">
														<div id="DeviceBranchTreeDiv"></div>
													</div>
													<div class="col-md-9">
														<div id="DeviceDiv">
															<table id="DeviceTable" class="table table-condensed table-hover">
																<thead></thead>
																<tbody></tbody>
															</table>
														</div>
														<div id="DeviceGroupDiv" style="display:none">
															<table id="DeviceGroupTable" class="table table-condensed table-hover">
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
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;<%=CommonConfig.SYSTEM_COPYRIGHT%>
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

<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fuelux/js/spinner.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/html2canvas.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-branchtree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-bundle-touch.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-bundle-wizard.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-preview.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-bundle-design1.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-bundle-design2.js?t=${timestamp}"></script>
<script>
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
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
