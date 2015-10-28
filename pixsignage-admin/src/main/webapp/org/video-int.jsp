<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/fancybox/source/jquery.fancybox.css"/>
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/jquery-file-upload/css/jquery.fileupload-ui.css"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">
	<!-- BEGIN EDIT MODAL FORM-->
	<div id="UploadModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">本地视频</h4>
				</div>
				<div class="modal-body">

					<form id="UploadForm" class="form-horizontal" action="video!upload.action" method="POST" enctype="multipart/form-data">
						<!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
						<div class="row fileupload-buttonbar">
							<div class="col-lg-6">
								<!-- The fileinput-button span is used to style the file input field as button -->
								<span class="btn green fileinput-button">
								<i class="fa fa-plus"></i>
								<span>选择文件...</span>
								<input type="file" name="mymedia" multiple>
								</span>
								<button type="submit" class="btn blue start">
								<i class="fa fa-upload"></i>
								<span>全部上传</span>
								</button>
								<button type="reset" class="btn yellow cancel">
								<i class="fa fa-ban"></i>
								<span>取消上传</span>
								</button>
								<!-- The global file processing state -->
								<span class="fileupload-process"></span>
							</div>
							<!-- The global progress information -->
							<div class="col-lg-6 fileupload-progress fade">
								<!-- The global progress bar -->
								<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
									<div class="progress-bar progress-bar-success" style="width:0%;"></div>
								</div>
								<!-- The extended global progress information -->
								<div class="progress-extended">&nbsp;</div>
							</div>
						</div>
						<!-- The table listing the files available for upload/download -->
						<table role="presentation" class="table table-striped clearfix">
							<tbody class="files"></tbody>
						</table>
					</form>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn default pix-upload-close" data-dismiss="modal">关闭</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->

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
			<h3 class="page-title">本地视频</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">素材管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">本地视频</a>
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
					<div class="caption"><i class="fa fa-video-camera"></i>本地视频</div>
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
						<div class="btn-group">
						<%
							if (org.getCurrentstorage() >= org.getMaxstorage()) {
						%>
							<button privilegeid="201010" class="btn green pix-full">在线上传 <i class="fa fa-plus"></i></button>
						<%
							} else {
						%>
							<button privilegeid="201010" class="btn green pix-add">在线上传 <i class="fa fa-plus"></i></button>
						<%
							}
						%>
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

	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
	<script id="template-upload" type="text/x-tmpl">
		{% for (var i=0, file; file=o.files[i]; i++) { %}
		    <tr class="template-upload fade">
		        <td>
					<div class="input-icon right">
						<i class="fa"></i> <input type="text" class="form-control" name="name" placeholder="媒体名称" />
					</div>
		        </td>
		        <td>
		            <p class="name">{%=file.name%}</p>
		            {% if (file.error) { %}
		                <div><span class="label label-danger">错误</span> {%=file.error%}</div>
		            {% } %}
		            <span class="preview"></span>
		        </td>
		        <td>
		            <p class="size">{%=o.formatFileSize(file.size)%}</p>
		            {% if (!o.files.error) { %}
		                <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
		                <div class="progress-bar progress-bar-success" style="width:0%;"></div>
		                </div>
		            {% } %}
		        </td>
		        <td>
		            {% if (!o.files.error && !i && !o.options.autoUpload) { %}
		                <button class="btn blue start">
		                    <i class="fa fa-upload"></i>
		                    <span>上传</span>
		                </button>
		            {% } %}
		            {% if (!i) { %}
		                <button class="btn red cancel">
		                    <i class="fa fa-ban"></i>
		                    <span>取消</span>
		                </button>
		            {% } %}
		        </td>
		    </tr>
		{% } %}
	</script>
	<!-- The template to display files available for download -->
	<script id="template-download" type="text/x-tmpl">
		{% for (var i=0, file; file=o.files[i]; i++) { %}
		    <tr class="template-download fade">
		        <td>
					<span>{%=file.name%}</span>
		        </td>
		        <td>
		            <p class="name">
		                {% if (file.url) { %}
		                    <a href="{%=file.url%}" title="{%=file.filename%}" download="{%=file.filename%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.filename%}</a>
		                {% } else { %}
		                    <span>{%=file.filename%}</span>
		                {% } %}
		            </p>
		            {% if (file.error) { %}
		                <div><span class="label label-danger">错误</span>上传失败</div>
		            {% } %}
		            <span class="preview">
		                {% if (file.thumbnailUrl) { %}
		                    <a href="{%=file.url%}" title="{%=file.filename%}" download="{%=file.filename%}" data-gallery><img src="{%=file.thumbnailUrl%}"></a>
		                {% } %}
		            </span>
		        </td>
		        <td>
		            <span class="size">{%=o.formatFileSize(file.size)%}</span>
		        </td>
		        <td>
		            {% if (file.deleteUrl) { %}
		                <button class="btn red delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
		                    <i class="fa fa-trash-o"></i>
		                    <span>Delete</span>
		                </button>
		                <input type="checkbox" name="delete" value="1" class="toggle">
		            {% } else { %}
						{% if (file.error) { %}
		                <span class="badge badge-danger"><i class="fa fa-times"></i></span>
						{% } else { %}
		                <span class="badge badge-success"><i class="fa fa-check"></i></span>
						{% } %}
		            {% } %}
		        </td>
		    </tr>
		{% } %}
	</script>

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script type="text/javascript" src="/pixsignage-static/plugins/fancybox/source/jquery.fancybox.pack.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-jstree/jquery.jstree.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->
	<!-- BEGIN:File Upload Plugin JS files-->
	<!-- The jQuery UI widget factory, can be omitted if jQuery UI is already included -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js"></script>
	<!-- The Templates plugin is included to render the upload/download listings -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/vendor/tmpl.min.js"></script>
	<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/vendor/load-image.min.js"></script>
	<!-- The Canvas to Blob plugin is included for image resizing functionality -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/vendor/canvas-to-blob.min.js"></script>
	<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.iframe-transport.js"></script>
	<!-- The basic File Upload plugin -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>
	<!-- The File Upload processing plugin -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>
	<!-- The File Upload image preview & resize plugin -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.fileupload-image.js"></script>
	<!-- The File Upload audio preview plugin -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.fileupload-audio.js"></script>
	<!-- The File Upload video preview plugin -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.fileupload-video.js"></script>
	<!-- The File Upload validation plugin -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.fileupload-validate.js"></script>
	<!-- The File Upload user interface plugin -->
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>
	<!-- The main application script -->
	<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
	<!--[if (gte IE 8)&(lt IE 10)]>
	<script src="/pixsignage-static/plugins/jquery-file-upload/js/cors/jquery.xdr-transport.js"></script>
	<![endif]-->
	<!-- END:File Upload Plugin JS files-->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-video.js?t=6"></script>
<script>
//上传文件的后缀
var acceptFileTypes = /(\.|\/)(mp4|ts|mov|mkv)$/i;
var myBranchid = <%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getBranchid() %>;
var myType = 1;

jQuery(document).ready(function() {
	App.init(); // initlayout and core plugins
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initUploadModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

<%@ include file="../common/common4.jsp"%>
