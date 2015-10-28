<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.css">
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.css">
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/ion.rangeslider/css/ion.rangeSlider.css"/>
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css"/>
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/bootstrap-datetimepicker/css/datetimepicker.css?t=1" />

<link rel="stylesheet" type="text/css" href="../local/css/pix.css" />
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
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

	<div id="RegionDtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-large">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="RegionDtlForm" class="form-horizontal">
						<div class="form-body">
							<input type="hidden" name="regiondtl.regionid" />
							<div class="form-group">
								<label class="control-label col-md-3">选项</label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="regiondtl.playmode" value="1" checked> 单次播放
									</label>
									<label class="radio-inline">
										<input type="radio" name="regiondtl.playmode" value="2"> 按日播放
									</label>
								</div>
							</div>
							<div class="form-group playmode-1">
								<label class="col-md-3 control-label">播放日期<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_date">                                       
										<input type="text" size="16" readonly class="form-control" name="regiondtl.playdate">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">开始时间<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_time">                                       
										<input type="text" size="16" readonly class="form-control" name="regiondtl.starttime">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group playmode-1">
								<label class="col-md-3 control-label">结束时间<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_time">                                       
										<input type="text" size="16" readonly class="form-control" name="regiondtl.endtime">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>

							<div class="form-group objtype-0">
								<label class="control-label col-md-3">类型</label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="regiondtl.objtype" value="1" checked> 列表
									</label>
									<label class="radio-inline">
										<input type="radio" name="regiondtl.objtype" value="3"> 视频流
									</label>
									<label class="radio-inline">
										<input type="radio" name="regiondtl.objtype" value="4"> 数字频道
									</label>
									<label class="radio-inline">
										<input type="radio" name="regiondtl.objtype" value="5"> Widget
									</label>
								</div>
							</div>
							<div class="form-group objtype-1">
								<label class="control-label col-md-3">类型</label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="regiondtl.objtype" value="2"> 文本
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">内容<span class="required">*</span></label>
								<div class="col-md-9">
									<input type="hidden" id="RegionDtlSelect" class="form-control select2" name="regiondtl.objid" />
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue">提交</button>
					<button class="btn default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>

	<!-- BEGIN PAGE HEADER-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN PAGE TITLE & BREADCRUMB-->
			<h3 class="page-title">快速发布</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">快速发布</a>
				</li>
			</ul>
			<!-- END PAGE TITLE & BREADCRUMB-->
		</div>
	</div>
	<!-- END PAGE HEADER-->

	<!-- BEGIN PAGE CONTENT-->
	<div class="row">
		<div class="col-md-12">
			<div id="MyWizard">
				<div class="form-wizard">
					<div class="form-body">
						<ul class="nav nav-pills nav-justified steps">
							<li>
								<a href="#tab1" data-toggle="tab" class="step">
									<span class="number">1</span>
									<span class="desc"><i class="fa fa-check"></i> 选择布局</span>   
								</a>
							</li>
							<li>
								<a href="#tab2" data-toggle="tab" class="step">
									<span class="number">2</span>
									<span class="desc"><i class="fa fa-check"></i> 播出明细</span>   
								</a>
							</li>
							<li>
								<a href="#tab3" data-toggle="tab" class="step">
									<span class="number">3</span>
									<span class="desc"><i class="fa fa-check"></i> 选择终端</span>   
								</a>
							</li>
							<li>
								<a href="#tab4" data-toggle="tab" class="step">
									<span class="number">4</span>
									<span class="desc"><i class="fa fa-check"></i> 发布</span>   
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
								<form id="LayoutOptionForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
									<div class="form-group">
										<label class="control-label col-md-2">选择布局</label>
										<div class="col-md-10 pre-scrollable">
											<table id="LayoutTable" class="table-striped"></table>
										</div>
									</div>
								</form>
							</div>
							
							<div class="tab-pane" id="tab2">
								<div class="row">
									<div class="col-md-12 col-sm-12">
										<div class="portlet box purple">
											<div class="portlet-title">
												<div class="caption"><i class="fa fa-calendar"></i>主区域</div>
												<div class="actions">
													<a href="javascript:;" region-id="1" region-type="0" class="btn btn-sm yellow pix-regiondtl-add"><i class="fa fa-plus"></i> 新增明细</a>
												</div>
											</div>
											<div class="portlet-body">
												<div class="row">
													<div class="col-md-3 col-sm-3">
														<canvas id="LayoutCanvas-1"></canvas>
													</div>
													<div class="col-md-9 col-sm-9">
														<div class="table-responsive">
															<table id="RegionDtlTable-1" class="table table-condensed table-hover">
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
											
							<div class="tab-pane" id="tab3">
								<div class="col-md-7">
									<div class="portlet box blue tabbable">
										<div class="portlet-title">
											<div class="caption"><i class="fa fa-reorder"></i>选择终端</div>
										</div>
										<div class="portlet-body">
											<div class=" portlet-tabs">
												<ul class="nav nav-tabs">
													<li class="active"><a href="#device_tab1" data-toggle="tab">终端</a></li>
													<li><a href="#device_tab2" data-toggle="tab">终端组</a></li>
												</ul>
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
								</div>
								<div class="col-md-5">
									<div class="portlet box green">
										<div class="portlet-title">
											<div class="caption"><i class="fa fa-picture"></i>已选择终端</div>
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
											<div class="caption"><i class="fa fa-picture"></i>已选择终端组</div>
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

							<div class="tab-pane" id="tab4">
								<h3 class="block">请确认你的操作：</h3>
								<table id="ConfirmTable" class="table table-striped table-bordered table-hover"></table>
							</div>
							
						</div>
					</div>
									
					<div class="fluid">
						<div class="row">
							<div class="col-md-12">
								<div class="col-md-offset-9 col-md-3">
									<a href="javascript:;" class="btn default button-previous" style="display: none;"><i class="m-icon-swapleft"></i> 上一步 </a>
									<a href="javascript:;" class="btn blue button-next">下一步 <i class="m-icon-swapright m-icon-white"></i></a>
									<a href="javascript:;" class="btn green button-submit" style="display: none;">提交 <i class="m-icon-swapright m-icon-white"></i></a>                            
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- END PAGE CONTENT-->  
</div>
<!-- END PAGE -->


<%@ include file="../common/common3.jsp"%>

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script type="text/javascript" src="/pixsignage-static/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/jquery-validation/dist/additional-methods.min.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js?t=2"></script>
<script src="../local/scripts/pix-wizard.js?t=22"></script>
<!-- END PAGE LEVEL SCRIPTS -->  
<script>
var myBranchid = <%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getBranchid() %>;
var myUser = '<%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getLoginname() %>';

var videoflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getVideoflag() %>;
var imageflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getImageflag() %>;
var textflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getTextflag() %>;
var streamflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getStreamflag() %>;
var dvbflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getDvbflag() %>;
var widgetflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getWidgetflag() %>;

	jQuery(document).ready(function() {    
	   App.init(); // initlayout and core plugins
	   DataInit.init();
	   initWizard();
	});
</script>

<%@ include file="../common/common4.jsp"%>
