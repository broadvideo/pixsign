<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">
	<!-- BEGIN EDIT MODAL FORM-->
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<input type="hidden" name="staff.staffid" value="0" />
						<div class="form-body">
							<div class="form-group option1">
								<label class="col-md-3 control-label">登录名<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="staff.loginname" placeholder="请输入登录名" />
									</div>
								</div>
							</div>
							<div class="form-group option2">
								<label class="col-md-3 control-label">新密码<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="password" id="StaffPassword" class="form-control" name="staff.password" placeholder="请输入新密码" />
									</div>
								</div>
							</div>
							<div class="form-group option2">
								<label class="col-md-3 control-label">密码确认<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="password" class="form-control" name="staff.password2" placeholder="请确认新密码" />
									</div>
								</div>
							</div>
							<div class="form-group option1">
								<label class="col-md-3 control-label">操作员姓名<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="staff.name" placeholder="请输入操作员姓名" />
									</div>
								</div>
							</div>
							<div class="form-group option1">
								<label class="col-md-3 control-label">部门<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="pre-scrollable" id="EditFormBranchTree"></div>	
								</div>
							</div>
							<div class="form-group option1">
								<label class="col-md-3 control-label">角色列表</label>
								<div class="col-md-9">
									<div class="col-md-9 pre-scrollable" id="RoleTree"></div>						
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
			<h3 class="page-title">操作员管理</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">系统管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">操作员管理</a>
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
					<div class="caption"><i class="fa fa-cogs"></i>操作员</div>
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

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script type="text/javascript" src="../assets/plugins/bootstrap-jstree/jquery.jstree.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="../assets/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js?t=2"></script>
<script src="../local/scripts/pix-orgstaff.js?t=3"></script>
<script>
//主对象名
jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
});
</script>

<%@ include file="../common/common4.jsp"%>
