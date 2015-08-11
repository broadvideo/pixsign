<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="../assets/plugins/bootstrap-datetimepicker/css/datetimepicker.css" />
<link rel="stylesheet" type="text/css" href="../local/css/pix.css" />
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">
	<!-- BEGIN EDIT MODAL FORM-->
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">企业</h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="org.orgid" value="0" /> <input type="hidden" name="org.status" value="1" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">企业名称<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.name" placeholder="请输入企业名称" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">企业编码<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.code" placeholder="请输入企业编码" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">类型<span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.orgtype" value="1" checked> 通用版
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.orgtype" value="3" > PIDS
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">媒体范围</label>
								<div class="col-md-9 checkbox-list">
									<label class="checkbox-inline">
										<input type="checkbox" name="org.videoflag" value="1" checked>视频
									</label>
									<label class="checkbox-inline">
										<input type="checkbox" name="org.imageflag" value="1" checked>图片
									</label>
									<label class="checkbox-inline">
										<input type="checkbox" name="org.textflag" value="1" checked>文本
									</label>
									<label class="checkbox-inline">
										<input type="checkbox" name="org.liveflag" value="1" checked>直播
									</label>
									<label class="checkbox-inline">
										<input type="checkbox" name="org.widgetflag" value="1" checked>Widget
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">生效时限<span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.expireflag" value="0" checked> 永不过期
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.expireflag" value="1" > 过期
									</label>
								</div>
							</div>
							<div class="form-group expiretime">
								<label class="col-md-3 control-label"></label>
								<div class="col-md-9">
									<div class="input-group date form_datetime">                                       
										<input type="text" size="16" readonly class="form-control" name="org.expiretime" value="2037-01-01">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">最大终端数<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.maxdevices" placeholder="请输入最大终端数" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">最大存储容量(MB)<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.maxstorage" placeholder="请输入最大存储容量" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">媒体上载方式<span class="required">*</span></label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="org.uploadflag" value="1" > 仅在线上传
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.uploadflag" value="2" > 仅PixTrans上传
									</label>
									<label class="radio-inline">
										<input type="radio" name="org.uploadflag" value="0" checked> 两者皆可
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">版权说明</label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="org.copyright" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">描述</label>
								<div class="col-md-9">
									<textarea class="form-control" rows="4" name="org.description"></textarea>
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
			<h3 class="page-title">企业管理</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">企业管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">企业管理</a>
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
					<div class="caption"><i class="fa fa-cloud"></i>企业</div>
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
<script type="text/javascript" src="../assets/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="../assets/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="../assets/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-org.js?t=2"></script>
<script>
var MaxOrgs = <%=com.broadvideo.signage.common.CommonConfig.LICENSE_MaxOrgs%>;
var MaxDevicesPerSigOrg = <%=com.broadvideo.signage.common.CommonConfig.LICENSE_MaxDevicesPerSigOrg%>;
var MaxStoragePerSigOrg = <%=com.broadvideo.signage.common.CommonConfig.LICENSE_MaxStoragePerSigOrg%>;

jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
});
</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
