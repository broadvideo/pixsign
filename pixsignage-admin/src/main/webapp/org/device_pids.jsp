<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">

	<!-- 终端文件列表对话框  -->
	<div id="DeviceFileModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
			<div class="row">
				<div class="col-md-12">

					<div class="portlet box blue tabbable">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i>终端文件列表</div>
							<div class="tools">
								<a href="javascript:;" class="reload pix-DeviceFileReload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="portlet-tabs">
								<ul class="nav nav-tabs" style="margin-right: 30px;">
									<li id="nav_tab3"><a href="#portlet_tab3" data-toggle="tab">布局</a></li>
									<li id="nav_tab2" class="imageflag"><a href="#portlet_tab2" data-toggle="tab">图片</a></li>
									<li id="nav_tab1" class="videoflag"><a href="#portlet_tab1" data-toggle="tab">视频</a></li>
								</ul>
								<div class="tab-content">
									<div class="tab-pane" id="portlet_tab1">
										<table id="DeviceVideoTable" class="table table-striped table-bordered table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
									<div class="tab-pane" id="portlet_tab2">
										<table id="DeviceImageTable" class="table table-striped table-bordered table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
									<div class="tab-pane" id="portlet_tab3">
										<table id="DeviceLayoutTable" class="table table-striped table-bordered table-hover">
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
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>

	<!-- BEGIN EDIT MODAL FORM-->
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static" >
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<input type="hidden" name="device.deviceid" value="0" />
						<input type="hidden" name="device.branchid" value="0" />
						<input type="hidden" name="device.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label required">终端ID</label>
								<label class="col-md-9 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="device.terminalid"></label>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">终端名称<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="device.name" placeholder="请输入终端名称" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">线路</label>
								<div class="col-md-9">
									<select id="MetrolineEDSelect" class="form-control" name="device.metrolineid" placeholder="请选择地铁线路" >
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">车站</label>
								<div class="col-md-9">
									<select id="MetrostationEDSelect" class="form-control" name="device.metrostationid" placeholder="请选择地铁车站" >
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">位置</label>
								<div class="col-md-9">
									<select id="MetrotypeEDSelect" class="form-control" name="device.metrotype" placeholder="请选择类型" >
										<option value="0">站厅</option>
										<option value="1">站台</option>
									</select>
								</div>
							</div>
							<div id="MetrodirectionED" class="form-group">
								<label class="col-md-3 control-label">方向</label>
								<div class="col-md-9">
									<select id="MetrodirectionEDSelect" class="form-control" name="device.metrodirection" placeholder="请选择方向" >
										<option value="0">上行</option>
										<option value="1">下行</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">描述</label>
								<div class="col-md-9">
									<textarea class="form-control" rows="2" name="device.description"></textarea>
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
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
	<!-- END END MODAL FORM-->


	<!-- BEGIN PAGE HEADER-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN PAGE TITLE & BREADCRUMB-->
			<h3 class="page-title">终端管理</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">终端管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">终端管理</a>
				</li>
			</ul>
			<!-- END PAGE TITLE & BREADCRUMB-->
		</div>
	</div>
	<!-- END PAGE HEADER-->

	<!-- BEGIN PAGE CONTENT-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN TABLE PORTLET-->
			<div class="portlet box blue tabbable">
				<div class="portlet-title">
					<div class="caption"><i class="fa fa-desktop"></i>终端</div>
					<div class="tools">
						<a href="javascript:;" class="reload pix-DeviceReload"></a>
					</div>
				</div>
				<div class="portlet-body">
					<div class="portlet-tabs">
						<ul class="nav nav-tabs" style="margin-right: 30px;">
							<li id="nav_device2"><a href="#portlet_device2" data-toggle="tab">未注册</a></li>
							<li class="active" id="nav_device1"><a href="#portlet_device1" data-toggle="tab">已注册</a></li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane active" id="portlet_device1">
								<div class="table-toolbar">
									<div class="row">
										<div class="col-md-3 form-group">
											<label>线路：</label>
											<select id="MetrolineSelect" class="form-control">
												<option value="-1">全部</option>
											</select>
										</div>
										<div class="col-md-3 form-group">
											<label>车站：</label>
											<select id="MetrostationSelect" class="form-control">
												<option value="-1">全部</option>
											</select>
										</div>
										<div class="col-md-3 form-group">
											<label>位置：</label>
											<select id="MetrotypeSelect" class="form-control">
												<option value="-1">全部</option>
												<option value="0">站厅</option>
												<option value="1">站台</option>
											</select>
										</div>
										<div class="col-md-3 form-group">
											<label>方向：</label>
											<select id="MetrodirectionSelect" class="form-control">
												<option value="-1">全部</option>
											</select>
										</div>
									</div>
								</div>
								
								<table id="MyTable" class="table table-striped table-bordered table-hover">
									<thead></thead>
									<tbody></tbody>
								</table>
							</div>
							<div class="tab-pane" id="portlet_device2">
								<table id="UnDeviceTable" class="table table-striped table-bordered table-hover">
									<thead></thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
					</div>
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
<script type="text/javascript" src="../assets/plugins/bootstrap-jstree/jquery.jstree.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="../assets/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js?t=3"></script>
<script src="../local/scripts/pix-device-pids.js?t=6"></script>
<script>
var myBranchid = <%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getBranchid() %>;
var videoflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getVideoflag() %>;
var imageflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getImageflag() %>;

jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initDeviceFileModal();
});
</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
