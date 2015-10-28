<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.css">
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.css">
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
										<div id="RegionBtn" class="btn-group">
										</div>
									</div>
								</div>
								<div class="portlet-body">
									<div id="LayoutDiv" layoutid="0" style="position:relative; width:802px; height:602px; border: 1px solid #000; background:#000000;">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue">提交</button>
					<button class="btn default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- 区域编辑对话框  -->
	<div id="LayoutdtlEditModal" class="modal fade modal-scroll" parent="LayoutModal" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-large">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="LayoutdtlEditForm" class="form-horizontal">
						<input type="hidden" name="regionid" value="0" />
						<div class="form-body">
							<input type="hidden" name="regionid" />
							<div class="form-group nontextflag">
								<label class="col-md-3 control-label">图片切换间隔(秒)<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="intervaltime" placeholder="请输入图片切换间隔(秒)" />
									</div>
								</div>
							</div>
							<div class="form-group textflag">
								<label class="col-md-3 control-label">文字移动方向</label>
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
							<div class="form-group textflag">
								<label class="col-md-3 control-label">文字移动速度</label>
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
							<div class="form-group textflag">
								<label class="col-md-3 control-label">文字颜色</label>
								<div class="col-md-9">
									<div class="input-group colorpicker-component colorPick">
										<input type="text" name="color" value="#FFFFFF" class="form-control" />
										<span class="input-group-addon"><i></i></span>
									</div>
								</div>
							</div>
							<div class="form-group textflag">
								<label class="col-md-3 control-label">文字大小<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="size" placeholder="请输入文字大小" />
									</div>
								</div>
							</div>
							<div class="form-group textflag">
								<label class="col-md-3 control-label">文字不透明度<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="opacity" placeholder="请输入文字不透明度" />
									</div>
								</div>
							</div>
							
							<div class="form-group">
								<label class="col-md-3 control-label">区域宽度<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="width" placeholder="请输入区域宽度" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">区域高度<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="height" placeholder="请输入区域高度" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">区域左偏移<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="leftoffset" placeholder="请输入左偏移量" />
									</div>
								</div>
							</div>														
							<div class="form-group">
								<label class="col-md-3 control-label">区域顶偏移<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="topoffset" placeholder="请输入顶偏移量" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">区域层叠顺序<span class="required">*</span></label>
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
					<button type="submit" class="btn blue">提交</button>
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
					<h4 class="modal-title">布局</h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
						<input type="hidden" name="layout.layoutid" value="0" />
						<input type="hidden" name="layout.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">布局名称<span
									class="required">*</span>
								</label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control"
											name="layout.name" placeholder="请输入布局名称" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3">布局类型</label>
								<div class="col-md-9">
									<select class="form-control" name="layout.type" data-placeholder="请选择..." tabindex="-1">
										<option value="0">普通布局</option>
										<option value="1">紧急布局</option>
									</select>
								</div>
							</div>
							<div class="form-group layout-ratio">
								<label class="control-label col-md-3">宽高比</label>
								<div class="col-md-9">
									<select class="form-control" name="layout.ratio" data-placeholder="请选择..." tabindex="-1">
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
			<h3 class="page-title">布局设计</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">播出管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">布局设计</a>
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
					<div class="caption"><i class="fa fa-cloud"></i>布局</div>
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
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-layout-design.js"></script>
<script>
jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initLayoutModal();
	initLayoutdtlEditModal();
});
</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>