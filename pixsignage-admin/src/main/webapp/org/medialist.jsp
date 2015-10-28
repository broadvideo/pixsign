<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">

	<div id="MedialistDtlModal" class="modal fade modal-scroll" role="dialog" data-backdrop="static">
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
									<li id="nav_tab3" class="imageflag"><a href="#portlet_tab3" data-toggle="tab">图片</a></li>
									<li id="nav_tab2" class="videoflag"><a href="#portlet_tab2" data-toggle="tab">引入视频</a></li>
									<li id="nav_tab1" class="videoflag active"><a href="#portlet_tab1" data-toggle="tab">本地视频</a></li>
								</ul>
								<div class="tab-content">
									<div class="tab-pane active" id="portlet_tab1">
										<table id="IntVideoTable" class="table table-condensed table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
									<div class="tab-pane" id="portlet_tab2">
										<table id="ExtVideoTable" class="table table-condensed table-hover">
											<thead></thead>
											<tbody></tbody>
										</table>
									</div>
									<div class="tab-pane" id="portlet_tab3">
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
				<div class="col-md-5">
					<div class="portlet box green">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-picture"></i>播放列表明细</div>
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
				<div class="modal-footer">
					<button type="submit" class="btn blue">确定</button>
					<button class="btn default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>


	<!-- BEGIN EDIT MODAL FORM-->
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">播放列表</h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="medialist.medialistid" value="0" />
						<input type="hidden" name="medialist.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">列表名称<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="medialist.name" placeholder="请输入播放列表名称" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">描述</label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="medialist.description"></textarea>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue button-submit">提交</button>
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
			<h3 class="page-title">播放列表</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">素材管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">播放列表</a>
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
			<div class="portlet box blue">
				<div class="portlet-title">
					<div class="caption"><i class="fa fa-desktop"></i>播放列表</div>
					<div class="tools">
						<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
					</div>
				</div>
				<div class="portlet-body">
					<div class="table-toolbar">
						<div class="btn-group">
							<button privilegeid="101010" class="btn green pix-add">新增 <i class="fa fa-plus"></i></button>
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


<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-medialist.js?t=2"></script>
<script>
jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initMedialistDtlModal();
});
</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
