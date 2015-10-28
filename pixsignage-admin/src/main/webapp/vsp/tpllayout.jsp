<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.css">
<link rel="stylesheet" type="text/css" href="../local/css/pix.css" />
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">
	<!-- 布局设计对话框  -->
	<div id="LayoutModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-large">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-9 col-sm-9" style="width:852px;">
							<div class="portlet box purple">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-calendar"></i>布局设计</div>
									<div class="actions">
										<a href="javascript:;" class="btn btn-sm yellow pix-addregion"><i class="fa fa-plus"></i> 新增区域</a>
									</div>
								</div>
								<div class="portlet-body">
									<div id="layout" layoutid="0" style="position:relative; width:802px; height:602px; border: 1px solid #000; background:#000000;">
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
								<label class="col-md-3 control-label">编码</label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="code" />
									</div>
								</div>
							</div>
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
	
	<!-- 布局模板新增修改对话框  -->
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">布局模板</h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
						<input type="hidden" name="tpllayout.tpllayoutid" value="0" />
						<input type="hidden" name="tpllayout.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">布局模板名称<span
									class="required">*</span>
								</label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control"
											name="tpllayout.name" placeholder="请输入布局模板名称" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3">布局类型</label>
								<div class="col-md-9">
									<select class="form-control" name="tpllayout.type" data-placeholder="请选择..." tabindex="-1">
										<option value="0">普通布局</option>
										<option value="1">紧急布局</option>
									</select>
								</div>
							</div>
							<div class="form-group tpllayout-ratio">
								<label class="control-label col-md-3">宽高比</label>
								<div class="col-md-9">
									<select class="form-control" name="tpllayout.ratio" data-placeholder="请选择..." tabindex="-1">
										<option value="1">宽屏 16:9</option>
										<option value="2">高屏 9:16</option>
										<option value="3">宽屏 4:3</option>
										<option value="4">高屏 3:4</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">描述</label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="tpllayout.description"></textarea>
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
			<h3 class="page-title">布局模板</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">企业管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">布局模板</a>
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
					<div class="caption"><i class="fa fa-cloud"></i>布局模板</div>
					<div class="tools">
						<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
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
<script type="text/javascript" src="/pixsignage-static/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-tpllayout.js"></script>
<script>
jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initLayoutModal();
	initRegionEditModal();
});
</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
