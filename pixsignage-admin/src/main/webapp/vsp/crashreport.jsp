<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">

	<div id="CrashDtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static" >
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="CrashDtlForm" class="form-horizontal form-bordered form-row-stripped" method="POST">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-2 control-label required">设备IP</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.clientip"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">设备名称</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.clientname"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">系统版本</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.os"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">应用名称</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.appname"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">版本名</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.vname"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">版本号</label>
								<label class="col-md-10 control-label" style="text-align: left;border-left: 1px solid #efefef;" name="crashreport.vcode"></label>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">堆栈信息</label>
								<div class="col-md-10">
									<textarea class="form-control" rows="16" name="crashreport.stack"></textarea>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">分辨率</label>
								<div class="col-md-10">
									<textarea class="form-control" rows="4" name="crashreport.resolution"></textarea>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-2 control-label required">其他信息</label>
								<div class="col-md-10">
									<textarea class="form-control" rows="3" name="crashreport.other"></textarea>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>

	<!-- BEGIN PAGE HEADER-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN PAGE TITLE & BREADCRUMB-->
			<h3 class="page-title">终端调试</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">系统管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">终端调试</a>
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
					<div class="caption"><i class="fa fa-cogs"></i>终端问题上报</div>
					<div class="tools">
						<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
					</div>
				</div>
				<div class="portlet-body">
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
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-jstree/jquery.jstree.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-crashreport.js?t=0"></script>
<script>
jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
});
</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
