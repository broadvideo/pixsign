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
<link href="${base_ctx}/css/pixpage.css" rel="stylesheet"/>
</head>

<body>
	<div id="StaffPageModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-6">
							<div class="portlet box blue">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.staff.selecting"/></div>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
										<div class="btn-group pull-right">
											<button class="btn btn-sm blue pix-addstaff"><spring:message code="global.add"/> <i class="fa fa-arrow-right"></i></button>
										</div>
									</div>
									<table id="StaffTable1" class="table table-striped table-bordered table-hover">
										<thead></thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="portlet box green">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-picture"></i><spring:message code="pixsign.staff.selected"/></div>
								</div>
								<div class="portlet-body">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn btn-sm red pix-deletestaff"><i class="fa fa-arrow-left"></i> <spring:message code="global.remove"/></button>
										</div>
									</div>
									<table id="StaffTable2" class="table table-striped table-bordered table-hover">
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
			
	<div id="PageEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.touchpage"/></h4>
				</div>
				<div class="modal-body">
					<form id="PageEditForm" class="form-horizontal" data-async data-target="#PageEditModal" method="POST">
						<input type="hidden" name="page.pageid" value="0" />
						<input type="hidden" name="page.homepageid" value="0" />
						<input type="hidden" name="page.touchflag" value="1" />
						<input type="hidden" name="page.homeflag" value="1" />
						<input type="hidden" name="page.status" value="1" />
						<input type="hidden" name="page.branchid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/><span
										class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="page.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.privilegeflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="page.privilegeflag" value="0" checked> <spring:message code="pixsign.prop.privilegeflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="page.privilegeflag" value="1"> <spring:message code="pixsign.prop.privilegeflag_1"/>
									</label>
								</div>
							</div>
							<div class="form-group hide-update">
								<label class="control-label col-md-3"><spring:message code="pixsign.prop.ratio"/></label>
								<div class="col-md-9">
									<select class="form-control" name="page.ratio" tabindex="-1">
										<option value="1"><spring:message code="pixsign.prop.ratio_1"/></option>
										<option value="2"><spring:message code="pixsign.prop.ratio_2"/></option>
									</select>
								</div>
							</div>
							<div class="form-group hide-update">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.templateflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="templateflag" value="0" checked> <spring:message code="pixsign.prop.templateflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="templateflag" value="1"> <spring:message code="pixsign.prop.templateflag_1"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="templateflag" value="2"> <spring:message code="pixsign.prop.templateflag_2"/>
									</label>
								</div>
							</div>
							<div class="form-group template-ctrl">
								<label class="col-md-3 control-label"><spring:message code="pixsign.touchtemplate"/><span class="required">*</span></label>
								<div class="col-md-9 pre-scrollable">
									<table id="TemplateTable" class="table table-condensed table-hover">
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

	<div id="SubpageModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.subpage"/></h4>
				</div>
				<div class="modal-body">
					<form id="SubpageForm" class="form-horizontal" data-async data-target="#SubpageModal" method="POST">
						<input type="hidden" name="page.pageid" value="0" />
						<input type="hidden" name="page.homepageid" value="0" />
						<input type="hidden" name="page.touchflag" value="1" />
						<input type="hidden" name="page.homeflag" value="0" />
						<input type="hidden" name="page.status" value="1" />
						<input type="hidden" name="page.ratio" value="1" />
						<input type="hidden" name="page.branchid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.name"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="page.name" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.privilegeflag"/></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="page.privilegeflag" value="0" checked> <spring:message code="pixsign.prop.privilegeflag_0"/>
									</label>
									<label class="radio-inline">
										<input type="radio" name="page.privilegeflag" value="1"> <spring:message code="pixsign.prop.privilegeflag_1"/>
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.prop.homeidletime"/></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="page.homeidletime" value="0"/>
									</div>
								</div>
							</div>
							<div class="form-group hide-update">
								<label class="col-md-3 control-label"><spring:message code="pixsign.subpage"/></label>
								<div class="col-md-9 pre-scrollable">
									<table id="FromPageTable">
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

	<div id="CopyModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
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
									<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.page"/></div>
									<ul class="nav nav-tabs" style="margin-left: 10px;">
										<li id="nav_tab1" class="active">
											<a href="#PageLibTab" data-toggle="tab"><spring:message code="pixsign.page"/></a>
										</li>
										<li id="nav_tab2" class="touch-ctl">
											<a href="#TouchpageLibTab" data-toggle="tab"><spring:message code="pixsign.touchpage"/></a>
										</li>
									</ul>
								</div>
								<div class="portlet-body">
									<div class="tab-content">
										<div class="tab-pane active" id="PageLibTab">
											<div class="row">
												<div class="col-md-3">
													<div class="row"><div class="col-md-12 branchtree"></div></div>
												</div>
												<div class="col-md-9">
													<div class="image-ctl">
														<table id="PageLibTable" class="table table-condensed table-hover">
															<thead></thead>
															<tbody></tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
										<div class="tab-pane touchpage-ctl" id="TouchpageLibTab">
											<div class="row">
												<div class="col-md-3">
													<div class="row"><div class="col-md-12 branchtree"></div></div>
												</div>
												<div class="col-md-9">
													<div class="video-ctl">
														<table id="TouchpageLibTable" class="table table-condensed table-hover">
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
										<table id="PageSelectedTable" class="table table-condensed table-hover">
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

	<div id="PageModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.touchpage"/></h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12">
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="1">
								<i class="fa fa-video-camera"></i><div><spring:message code="pixsign.zone.video"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="2">
								<i class="fa fa-image"></i><div><spring:message code="pixsign.zone.image"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="3">
								<i class="fa fa-font"></i><div><spring:message code="pixsign.zone.text"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="4">
								<i class="fa fa-long-arrow-left"></i><div><spring:message code="pixsign.zone.scroll"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="5">
								<i class="fa fa-history"></i><div><spring:message code="pixsign.zone.time"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="6">
								<i class="fa fa-building"></i><div><spring:message code="pixsign.zone.web"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone" zonetype="7">
								<i class="fa fa-hand-o-up"></i><div><spring:message code="pixsign.zone.button"/></div>
							</a>
							<!-- 
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="8">
								<i class="fa fa-sun-o"></i><div><spring:message code="pixsign.zone.weather"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="9">
								<i class="fa fa-steam"></i><div><spring:message code="pixsign.zone.stream"/></div>
							</a>
							<a href="javascript:;" class="icon-btn pix-addzone limit-1" zonetype="10">
								<i class="fa fa-camera"></i><div><spring:message code="pixsign.zone.camera"/></div>
							</a>
							 -->
						</div>
					</div>
					<div class="row">
						<div class="col-md-9">
							<div style="text-align: center;">
								<div id="PageDiv"></div>
							</div>
						</div>
						<div class="col-md-3">
							<div class="row">
								<div class="col-md-12">
									<form method="post" target="_blank" id="PreviewForm" style="display:none" action="/pixsign/preview/preview.jsp" >
										<input type="hidden" name="content" value="{}" />
										<input type="hidden" name="diycode" value="" />
									</form>
									<a href="javascript:;" class="btn default blue pull-right pix-preview"><i class="fa fa-video-camera"></i> 预览</a>
								</div>
							</div>
							<div class="panel-group" id="ZoneEditPanel">
								<div class="panel panel-default zone-ctl zonetype-1">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse1">视频设置</a>
										</h4>
									</div>
									<div id="Collapse1" class="panel-collapse collapse in">
										<form id="ZoneEditForm1" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">音量</label>
													<div class="col-md-9">
														<input class="volumeRange" type="text" name="volume" value=""/>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label"></label>
													<div class="col-md-9">
														<a href="javascript:;" class="btn default btn-xs blue pix-video-library"><i class="fa fa-video-camera"></i> 选择视频</a>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default zone-ctl zonetype-2">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse2">图片设置</a>
										</h4>
									</div>
									<div id="Collapse2" class="panel-collapse collapse in">
										<form id="ZoneEditForm2" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label"></label>
													<div class="col-md-9">
														<a href="javascript:;" class="btn default btn-xs blue pix-image-library"><i class="fa fa-image"></i> 选择图片</a>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">透明</label>
													<div class="col-md-9">
														<input class="opacityRange" type="text" name="opacity" value=""/>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">转场</label>
													<div class="col-md-9">
														<input type="hidden" id="EffectSelect" class="form-control select2" name="effect">
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">间隔</label>
													<div class="col-md-9">
														<input class="intervaltimeRange" type="text" name="intervaltime" value=""/>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default zone-ctl zonetype-5">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse3">日期时间</a>
										</h4>
									</div>
									<div id="Collapse3" class="panel-collapse collapse">
										<form id="ZoneEditForm3" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">格式</label>
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
								<div class="panel panel-default zone-ctl zonetype-7">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse4">按键设置</a>
										</h4>
									</div>
									<div id="Collapse4" class="panel-collapse collapse in">
										<form id="ZoneEditForm4" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label"></label>
													<div class="col-md-9">
														<a href="javascript:;" class="btn default btn-xs blue pix-bgimage-library"><i class="fa fa-image"></i> 选择图片</a>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">功能</label>
													<div class="col-md-9">
														<input type="hidden" id="TouchtypeSelect" class="form-control select2" name="touchtype" />
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">子页</label>
													<div class="col-md-9">
														<input type="hidden" id="SubObjectSelect" class="form-control select2" name="touchid" />
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">动作</label>
													<div class="col-md-9">
														<input type="hidden" id="DiyactionSelect" class="form-control select2" name="diyactionid" />
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default zone-ctl zonetype-3 zonetype-4 zonetype-5 zonetype-7 zonetype-8 zonetype-11 zonetype-12 zonetype-13 zonetype-14 zonetype-15 zonetype-31">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse5">字体样式</a>
										</h4>
									</div>
									<div id="Collapse5" class="panel-collapse collapse">
										<form id="ZoneEditForm5" class="form-horizontal pix-bordered zoneform">
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
														<div class="spinner" id="spinner-fontsize">
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
														<div class="spinner" id="spinner-lineheight">
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
												<div class="form-group">
													<label class="col-md-3 control-label">移速</label>
													<div class="col-md-9">
														<input class="speedRange" type="text" name="speed" value=""/>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default zone-ctl zonetype-11 zonetype-12 zonetype-31">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse6">表格设置</a>
										</h4>
									</div>
									<div id="Collapse6" class="panel-collapse collapse">
										<form id="ZoneEditForm6" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">行数</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-rows">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="rows" >
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
													<label class="col-md-3 control-label">列数</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-cols">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="cols" >
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
													<label class="col-md-3 control-label">分隔</label>
													<div class="col-md-9">
														<select class="form-control" name="rules" tabindex="-1">
															<option value="none">无分隔线</option>
															<option value="all">有分隔线</option>
															<option value="rows">行分隔线</option>
															<option value="cols">列分隔线</option>
														</select>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">颜色</label>
													<div class="col-md-9">
														<div class="input-group colorpicker-component rulecolorPick">
															<input type="text" name="rulecolor" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
															<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">线宽</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-rulewidth">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="rulewidth" >
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
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse7">背景阴影</a>
										</h4>
									</div>
									<div id="Collapse7" class="panel-collapse collapse">
										<form id="ZoneEditForm7" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">背景</label>
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
												<div class="form-group">
													<label class="col-md-3 control-label">阴影</label>
													<div class="col-md-9">
														<div class="input-group colorpicker-component shadowcolorPick">
															<input type="text" name="shadowcolor" value="#FFFFFF" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
															<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">水平</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-shadowh">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="shadowh" >
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
													<label class="col-md-3 control-label">垂直</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-shadowv">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="shadowv" >
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
													<label class="col-md-3 control-label">模糊</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-shadowblur">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="shadowblur" >
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
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse8">边框设置</a>
										</h4>
									</div>
									<div id="Collapse8" class="panel-collapse collapse">
										<form id="ZoneEditForm8" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">颜色</label>
													<div class="col-md-9">
														<div class="input-group colorpicker-component bdcolorPick">
															<input type="text" name="bdcolor" value="#000000" class="form-control" readonly="readonly" style="cursor:default; background:#FFFFFF;" />
															<span class="input-group-addon"><i style="display:inline-block;width:16px; height:16px;"></i></span>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">宽度</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-bdwidth">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="bdwidth" >
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
														<select class="form-control" name="bdstyle" tabindex="-1">
															<option value="solid">dotted</option>
															<option value="dashed">dashed</option>
															<option value="dotted">dotted</option>
														</select>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">圆角</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-bdradius">
															<div class="input-group input-small">
																<input type="text" class="spinner-input form-control" readonly name="bdradius" >
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
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse9">大小位置</a>
										</h4>
									</div>
									<div id="Collapse9" class="panel-collapse collapse">
										<form id="ZoneEditForm9" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
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
													<label class="col-md-3 control-label">边距</label>
													<div class="col-md-9">
														<div class="spinner" id="spinner-padding">
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
								<div class="panel panel-default zone-ctl zonetype-1 zonetype-2 zonetype-7">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse10">伸缩旋转</a>
										</h4>
									</div>
									<div id="Collapse10" class="panel-collapse collapse">
										<form id="ZoneEditForm10" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">开关</label>
													<div class="col-md-9 radio-list">
														<label class="radio-inline">
															<input type="radio" name="fixflag" value="0"> 打开
														</label>
														<label class="radio-inline">
															<input type="radio" name="fixflag" value="1" checked> 关闭
														</label>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default zone-ctl zonetype-2 zonetype-3 zonetype-7">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse11">动画效果</a>
										</h4>
									</div>
									<div id="Collapse11" class="panel-collapse collapse">
										<form id="ZoneEditForm11" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">初始</label>
													<div class="col-md-9">
														<input type="hidden" id="AnimationinitSelect" class="form-control select2" name="animationinit">
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">延迟</label>
													<div class="col-md-9">
														<input class="animationinitdelayRange" type="text" name="animationinitdelay" value="0"/>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">点击</label>
													<div class="col-md-9">
														<input type="hidden" id="AnimationclickSelect" class="form-control select2" name="animationclick">
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div class="panel panel-default zone-ctl zonetype-21">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#ZoneEditPanel" href="#Collapse12">互动素材</a>
										</h4>
									</div>
									<div id="Collapse12" class="panel-collapse collapse">
										<form id="ZoneEditForm12" class="form-horizontal pix-bordered zoneform">
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">互动</label>
													<div class="col-md-9">
														<input type="hidden" id="DiySelect" class="form-control select2" name="diyid">
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
										<li class="image-ctl">
											<a href="#ImageLibraryTab" data-toggle="tab"><spring:message code="pixsign.image"/></a>
										</li>
										<li class="video-ctl">
											<a href="#VideoLibraryTab" data-toggle="tab"><spring:message code="pixsign.video"/></a>
										</li>
									</ul>
								</div>
								<div class="portlet-body">
									<div class="tab-content">
										<div class="tab-pane image-ctl active" id="ImageLibraryTab">
											<div class="row">
												<div class="col-md-3">
													<div class="row"><div class="col-md-12 branchtree"></div></div>
													<hr/>
													<div class="row"><div class="col-md-12 foldertree"></div></div>
												</div>
												<div class="col-md-9">
													<div class="image-ctl">
														<table id="ImageTable" class="table table-condensed table-hover">
															<thead></thead>
															<tbody></tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
										<div class="tab-pane video-ctl active" id="VideoLibraryTab">
											<div class="row">
												<div class="col-md-3">
													<div class="row"><div class="col-md-12 branchtree"></div></div>
													<hr/>
													<div class="row"><div class="col-md-12 foldertree"></div></div>
												</div>
												<div class="col-md-9">
													<div class="video-ctl">
														<table id="VideoTable" class="table table-condensed table-hover">
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
										<table id="PagezonedtlTable" class="table table-condensed table-hover">
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

	<div id="ScrollModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i>滚动</div>
						</div>
						<div class="portlet-body">
							<form id="ScrollForm" class="form-horizontal" method="POST">
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label">内容来源</label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="sourcetype" value="0" checked> 自定义
											</label>
											<label class="radio-inline">
												<input type="radio" name="sourcetype" value="1"> 自动生成
											</label>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="pixsign.prop.text"/></label>
										<div class="col-md-9">
											<textarea class="form-control" rows="10" name="content"></textarea>
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

	<div id="ContentModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i>内容明细</div>
						</div>
						<div class="portlet-body">
							<form id="ContentForm" class="form-horizontal" method="POST">
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

	<div id="BGImageModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
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
								</div>
								<div class="portlet-body">
									<div class="tab-content">
										<div class="tab-pane active" id="portlet_tab">
											<div class="row">
												<div class="col-md-3">
													<div class="row"><div class="col-md-12 branchtree"></div></div>
													<hr/>
													<div class="row"><div class="col-md-12 foldertree"></div></div>
												</div>
												<div class="col-md-9">
													<div>
														<table id="BGImageTable" class="table table-condensed table-hover">
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
							<div id="BGImagePreview">
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
			<h3 class="page-title"><spring:message code="menu.touchpage"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.pagemanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.touchpage"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="pixsign.touchpage"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="PageModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="PagePortlet">
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-10">
									<div class="table-toolbar">
										<div class="btn-group">
											<button privilegeid="101010" class="btn green pix-add">
												<spring:message code="global.add"/> <i class="fa fa-plus"></i>
											</button>
										</div>
									</div>
									<table id="PageTable" class="table table-striped table-bordered table-hover">
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

<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fuelux/js/spinner.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/dom-to-image/dom-to-image.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/page/page-touch.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/page/page-design.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/page/page-preview.js?t=${timestamp}"></script>
<script>
var SchoolCtrl = <%=(session_org != null && !session_org.getSchoolflag().equals("0"))%>;
var DiyCtrl = <%=(session_org != null && !session_org.getDiyflag().equals("0"))%>;
var EstateCtrl = <%=(session_org != null && !session_org.getEstateflag().equals("0"))%>;

jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	PageModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
