<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="../assets/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.css">
<link rel="stylesheet" type="text/css" href="../assets/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.css">
<link rel="stylesheet" type="text/css" href="../assets/plugins/ion.rangeslider/css/ion.rangeSlider.css"/>
<link rel="stylesheet" type="text/css" href="../assets/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css"/>
<link rel="stylesheet" type="text/css" href="../assets/plugins/bootstrap-datetimepicker/css/datetimepicker.css" />

<link rel="stylesheet" type="text/css" href="../local/css/pix.css" />
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">
	<!-- 布局设计对话框  -->
	<div id="LayoutModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-7 col-sm-7" style="width:692px;">
							<div class="portlet box purple">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-calendar"></i>节目单设计</div>
									<!--  
									<div class="actions">
										<a href="javascript:;" class="btn btn-sm yellow pix-addregion"><i class="fa fa-plus"></i> 新增区域</a>
									</div>
									-->
								</div>
								<div class="portlet-body">
									<div id="layout" layoutid="6" style="position:relative; width:802px; height:602px; border: 1px solid #000; background:#000000;">
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-5">
							<div class="portlet box green">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-picture"></i>已编排媒体列表</div>
								</div>
								<div class="portlet-body">
									<div class="table-responsive">
										<table id="RegionDtlShowTable" class="table table-condensed table-hover">
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
					<button id="LayoutModal-Btn" class="btn blue">提交</button>
					<button class="btn default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- 区域编辑对话框  -->
	<!-- 
	<div id="RegionEditModal" class="modal fade modal-scroll" parent="LayoutModal" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="RegionEditForm" class="form-horizontal">
						<input type="hidden" name="regionid" value="0" />
						<div class="form-body">
							<input type="hidden" name="regionid" />
							<div class="form-group">
								<label class="col-md-3 control-label">宽度<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="width" placeholder="请输入宽度" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">高度<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="height" placeholder="请输入高度" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">左偏移<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="leftoffset" placeholder="请输入左偏移量" />
									</div>
								</div>
							</div>														
							<div class="form-group">
								<label class="col-md-3 control-label">顶偏移<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="topoffset" placeholder="请输入顶偏移量" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">层叠顺序<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="zindex" placeholder="请输入层叠顺序" />
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button id="RegionEditModal-Btn" class="btn blue">提交</button>
					<button class="btn default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	 -->

	<!-- 区域媒体列表对话框  -->
	<div id="RegionDtlModal" class="modal fade modal-scroll" parent="LayoutModal" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
			<div class="row">
				<div class="col-md-7">

					<div class="portlet box blue tabbable">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i>媒体库</div>
						</div>
						<div class="portlet-body">
							<div class="portlet-tabs">
								<ul class="nav nav-tabs">
									<li id="nav_tab7" class="widgetflag" ><a href="#portlet_tab7" data-toggle="tab">Widget</a></li>
									<li id="nav_tab6" class="liveflag" ><a href="#portlet_tab6" data-toggle="tab">直播</a></li>
									<li id="nav_tab5" class="textflag"><a href="#portlet_tab5" data-toggle="tab">文本</a></li>
									<li id="nav_tab2" class="imageflag"><a href="#portlet_tab2" data-toggle="tab">图片</a></li>
									<li id="nav_tab1" class="videoflag"><a href="#portlet_tab1" data-toggle="tab">视频</a></li>
								</ul>
								<div class="tab-content">
									<div class="tab-pane" id="portlet_tab1">
										<div id="BranchBreadcrumb-video" class="page-breadcrumb breadcrumb"></div>
										<table id="RegionDtlVideoTable" class="table table-condensed table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
									<div class="tab-pane" id="portlet_tab2">
										<div id="BranchBreadcrumb-image" class="page-breadcrumb breadcrumb"></div>
										<table id="RegionDtlImageTable" class="table table-condensed table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
									<div class="tab-pane" id="portlet_tab5">
										<form id="RegionDtlTextForm" class="form-horizontal">
											<input type="hidden" name="regiondtlindex" value="0" />
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">时长（秒）<span class="required">*</span></label>
													<div class="col-md-9">
														<div class="input-icon right">
															<i class="fa"></i> <input type="text" class="form-control" name="duration" value="0" placeholder="请输入时长（秒）" />
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">移动方向</label>
													<div class="col-md-9 radio-list">
														<label class="radio-inline">
															<input type="radio" name="direction" value="1"> 静止
														</label>
														<label class="radio-inline">
															<input type="radio" name="direction" value="2" > 向上
														</label>
														<label class="radio-inline">
															<input type="radio" name="direction" value="3"> 向下
														</label>  
														<label class="radio-inline">
															<input type="radio" name="direction" value="4" checked> 向左
														</label>  
														<label class="radio-inline">
															<input type="radio" name="direction" value="5"> 向右
														</label>  
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">移动速度</label>
													<div class="col-md-9 radio-list">
														<label class="radio-inline">
															<input type="radio" name="speed" value="1"> 慢
														</label>
														<label class="radio-inline">
															<input type="radio" name="speed" value="2" checked> 正常
														</label>
														<label class="radio-inline">
															<input type="radio" name="speed" value="3"> 快
														</label>  
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">文字颜色</label>
													<div class="col-md-9">
														<div class="input-group colorpicker-component colorPick">
															<input type="text" name="color" value="#FFFFFF" class="form-control" />
															<span class="input-group-addon"><i></i></span>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">文字大小</label>
													<div class="col-md-9">
														<input id="RegionDtlTextSize" type="text" name="size" />
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">不透明度</label>
													<div class="col-md-9">
														<input id="RegionDtlTextOpacity" type="text" name="opacity" />
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">文本内容<span class="required">*</span></label>
													<div class="col-md-9">
														<textarea class="form-control" rows="4" name="raw"></textarea>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-9 control-label"></label>
													<div class="col-md-3">
														<a class="btn blue pix-addregiontextdtl" href="javascript:;" ><i class="fa fa-plus"></i> 添加文本</a>
													</div>
												</div>
											</div>
										</form>
									</div>
									<div class="tab-pane" id="portlet_tab6">
										<form id="RegionDtlLiveForm" class="form-horizontal">
											<input type="hidden" name="regiondtlindex" value="0" />
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">直播地址<span class="required">*</span></label>
													<div class="col-md-9">
														<div class="input-icon right">
															<i class="fa"></i> <input type="text" class="form-control" name="uri" placeholder="请输入直播地址" />
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">开始时间<span class="required">*</span></label>
													<div class="col-md-9">
														<div class="input-group date form_datetime">                                       
															<input type="text" size="16" readonly class="form-control" name="starttime">
															<span class="input-group-btn">
															<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
															</span>
														</div>
													</div>
												</div>
												<div class="form-group">										
													<label class="control-label col-md-3">结束时间<span class="required">*</span></label>
													<div class="col-md-9">
														<div class="input-group date form_datetime">                                       
															<input type="text" size="16" readonly class="form-control" name="endtime">
															<span class="input-group-btn">
															<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
															</span>
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-9 control-label"></label>
													<div class="col-md-3">
														<a class="btn blue pix-addregionlivedtl" href="javascript:;" ><i class="fa fa-plus"></i> 添加直播</a>
													</div>
												</div>
											</div>
										</form>
									</div>
									<div class="tab-pane" id="portlet_tab7">
										<form id="RegionDtlWidgetForm" class="form-horizontal">
											<input type="hidden" name="regiondtlindex" value="0" />
											<div class="form-body">
												<div class="form-group">
													<label class="col-md-3 control-label">Widget地址<span class="required">*</span></label>
													<div class="col-md-9">
														<div class="input-icon right">
															<i class="fa"></i> <input type="text" class="form-control" name="uri" placeholder="请输入Widget地址" />
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-3 control-label">时长（秒）<span class="required">*</span></label>
													<div class="col-md-9">
														<div class="input-icon right">
															<i class="fa"></i> <input type="text" class="form-control" name="duration" value="0" placeholder="请输入时长（秒）" />
														</div>
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-9 control-label"></label>
													<div class="col-md-3">
														<a class="btn blue pix-addregionwidgetdtl" href="javascript:;" ><i class="fa fa-plus"></i> 添加Widget</a>
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
				<div class="col-md-5">
					<div class="portlet box green">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-picture"></i>已编排媒体列表</div>
						</div>
						<div class="portlet-body">
							<div class="table-responsive">
								<table id="RegionDtlTable" class="table table-condensed table-hover">
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
					<button id="RegionDtlModal-Btn" class="btn blue">提交</button>
					<button class="btn default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	

	<!-- 编制播放计划对话框  -->
	<div id="ScheduleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
			<div class="row">
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
					<div class="portlet box purple tabbable">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-picture"></i>任务属性</div>
						</div>
						<div class="portlet-body">
							<div class="portlet-tabs">
								<ul class="nav nav-tabs">
									<li class="active"><a id="Task1" href="#" data-toggle="tab">排期任务</a></li>
									<li><a id="Task2" href="#" data-toggle="tab">即时任务</a></li>
								</ul>
								<div class="tab-content">
								</div>
							</div>
							<form id="ScheduleForm" class="form-horizontal">
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label">任务名称<span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control"
													name="task.name" placeholder="请输入任务名称" />
											</div>
										</div>
									</div>
									<div class="form-group schedule-time">
										<label class="col-md-3 control-label">开始时间<span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-group date form_datetime">                                       
												<input type="text" size="16" readonly class="form-control" name="starttime">
												<span class="input-group-btn">
												<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
												</span>
											</div>
										</div>
									</div>
									<div class="form-group">										
										<label class="control-label col-md-3">结束时间<span class="required schedule-time">*</span></label>
										<div class="col-md-9">
											<div class="input-group date form_datetime">                                       
												<input type="text" size="16" readonly class="form-control" name="endtime">
												<span class="input-group-btn">
												<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
												</span>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div class="portlet box green">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-picture"></i>已选择终端</div>
						</div>
						<div class="portlet-body">
							<div class="table-responsive">
								<table id="DeviceSelectedTable" class="table table-condensed table-hover">
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
								<table id="DeviceGroupSelectedTable" class="table table-condensed table-hover">
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
					<button id="ScheduleModal-Btn" class="btn blue">提交</button>
					<button class="btn default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>


	<!-- 布局新增修改对话框  -->
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true"></button>
					<h4 class="modal-title">节目单</h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
						<input type="hidden" name="layout.layoutid" value="0" /> <input
							type="hidden" name="layout.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">节目单名称<span class="required">*</span>
								</label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control"
											name="layout.name" placeholder="请输入节目单名称" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3">布局模板</label>
								<div class="col-md-9">
									<select id="TpllayoutSelect" class="form-control" name="tpllayoutid"
										data-placeholder="请选择..." tabindex="-1">
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">描述</label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="layout.description"></textarea>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue">提交</button>
					<button type="button" class="btn default" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>
	<!-- END END MODAL FORM-->

	<!-- BEGIN PAGE HEADER-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN PAGE TITLE & BREADCRUMB-->
			<h3 class="page-title">节目单管理</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i></li>
				<li><a href="#">播出管理</a><i class="fa fa-angle-right"></i></li>
				<li><a href="#">节目单管理</a></li>
			</ul>
			<!-- END PAGE TITLE & BREADCRUMB-->
		</div>
	</div>
	<!-- END PAGE HEADER-->


	<!-- BEGIN PAGE CONTENT-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN TABLE PORTLET-->
			<div class="portlet box blue">
				<div class="portlet-title">
					<div class="caption">
						<i class="fa fa-calendar"></i>节目单
					</div>
					<div class="tools">
						<a href="javascript:;"
							onClick="$('#MyTable').dataTable()._fnAjaxUpdate();"
							class="reload"></a>
					</div>
				</div>
				<div class="portlet-body">
					<div class="table-toolbar">
						<div class="btn-group">
							<button privilegeid="101010" class="btn green pix-add">
								新增 <i class="fa fa-plus"></i>
							</button>
						</div>
					</div>
					<table id="MyTable" class="table table-striped table-bordered table-hover">
						<thead></thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
			<!-- END TABLE PORTLET-->
		</div>
	</div>
	<!-- END PAGE CONTENT -->

</div>
<!-- END PAGE -->


<%@ include file="../common/common3.jsp"%>

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script type="text/javascript" src="../assets/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="../assets/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js"></script>
<script type="text/javascript" src="../assets/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js"></script>
<script type="text/javascript" src="../assets/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="../assets/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="../assets/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-layout.js?t=8"></script>
<script>
var myBranchid = <%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getBranchid() %>;
var videoflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getVideoflag() %>;
var imageflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getImageflag() %>;
var textflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getTextflag() %>;
var liveflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getLiveflag() %>;
var widgetflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getWidgetflag() %>;

jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initLayoutModal();
	initRegionEditModal();
	initRegionDtlModal();
	initScheduleModal();
});
</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
