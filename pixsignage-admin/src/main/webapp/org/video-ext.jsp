<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/fancybox/source/jquery.fancybox.css"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">
	<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">视频</h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="video.videoid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">视频名称<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="video.name" placeholder="请输入视频名称" />
									</div>
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
			<h3 class="page-title">引入视频</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">素材管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">引入视频</a>
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
					<div class="caption"><i class="fa fa-video-camera"></i>引入视频</div>
					<div class="tools">
						<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
					</div>
				</div>
				<div class="portlet-body">
					<div class="table-toolbar">
						<div class="btn-group">
							<a class="btn default blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">切换部门  <i class="fa fa-angle-down"></i></a>
							<ul class="dropdown-menu pull-right">
								<div class="pre-scrollable" id="SelectBranchTree">
								</div>
							</ul>
						</div>
						<div id="BranchBreadcrumb" class="page-breadcrumb breadcrumb">
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
<script type="text/javascript" src="/pixsignage-static/plugins/fancybox/source/jquery.fancybox.pack.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-jstree/jquery.jstree.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-video.js?t=6"></script>
<script>
//上传文件的后缀
var myBranchid = <%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getBranchid() %>;
var myType = 2;

jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
