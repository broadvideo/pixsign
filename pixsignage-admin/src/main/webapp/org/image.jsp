<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control","no-store");
response.setHeader("Pragrma","no-cache");
response.setDateHeader("Expires",0);
%>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>Pix Signage</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta content="" name="description" />
<meta content="" name="author" />
<meta name="MobileOptimized" content="320">
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="/pixsignage-static/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN PAGE LEVEL STYLES -->
<link href="/pixsignage-static/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="/pixsignage-static/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="/pixsignage-static/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="/pixsignage-static/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css" rel="stylesheet"/>
<link href="/pixsignage-static/global/plugins/jquery-file-upload/css/jquery.fileupload.css" rel="stylesheet"/>
<link href="/pixsignage-static/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css" rel="stylesheet"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

		<div class="page-content-wrapper">
			<div class="page-content">

				<div id="UploadModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 class="modal-title">图片</h4>
							</div>
							<div class="modal-body">
			
								<form id="UploadForm" class="form-horizontal" action="image!upload.action" method="POST" enctype="multipart/form-data">
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
					</div>
				</div>
			
				<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 class="modal-title">图片</h4>
							</div>
							<div class="modal-body">
								<form id="MyEditForm" class="form-horizontal" method="POST">
									<input type="hidden" name="image.imageid" value="0" />
									<div class="form-body">
										<div class="form-group">
											<label class="col-md-3 control-label">图片名称<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="image.name" placeholder="请输入图片名称" />
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
					</div>
				</div>
			
				<!-- BEGIN PAGE HEADER-->
				<h3 class="page-title">图片</h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#">素材管理</a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#">图片</a>
						</li>
					</ul>
				</div>
				<!-- END PAGE HEADER-->
			
				<!-- BEGIN PAGE CONTENT-->
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-video-camera"></i>图片</div>
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
					</div>
				</div>
				<!-- END PAGE CONTENT -->
			</div>
		</div>

	</div>
	<!-- END CONTAINER -->
	
	<!-- BEGIN FOOTER -->
	<div class="footer">
		<div class="footer-inner">
			<%if (org == null || org.getCopyright() == null || org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;&nbsp;明视迅达(VideoExpress)&nbsp;&nbsp;粤ICP备14037592号-1 <a href="http://www.miitbeian.gov.cn">工业和信息化部备案管理系统</a>
			<%} else { %>
			©<%=org.getCopyright()%>
			<%} %>
		</div>
		<div class="footer-tools">
			<span class="go-top">
			<i class="fa fa-angle-up"></i>
			</span>
		</div>
	</div>
	<!-- END FOOTER -->
	
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
			<div><span class="label label-danger error"></span></div>
			<span class="preview"></span>
		</td>
		<td>
			<p class="size">Processing...</p>
			<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
			<div class="progress-bar progress-bar-success" style="width:0%;"></div>
			</div>
		</td>
		<td>
			{% if (!i && !o.options.autoUpload) { %}
				<button class="btn blue start" disabled>
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
					<a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
				{% } else { %}
					<span>{%=file.name%}</span>
				{% } %}
			</p>
			{% if (file.error) { %}
				<div><span class="label label-danger">错误</span>上传失败</div>
			{% } %}
		</td>
		<td>
			<span class="size">{%=o.formatFileSize(file.size)%}</span>
		</td>
		<td>
			{% if (file.deleteUrl) { %}
				<button class="btn red delete btn-sm" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
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
	
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->   
<!--[if lt IE 9]>
<script src="/pixsignage-static/global/plugins/respond.min.js"></script>
<script src="/pixsignage-static/global/plugins/excanvas.min.js"></script> 
<![endif]-->   
<script src="/pixsignage-static/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="/pixsignage-static/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="/pixsignage-static/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-validation/localization/messages_zh.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="/pixsignage-static/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap-jstree/jquery.jstree.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN:File Upload Plugin JS files-->
<!-- The jQuery UI widget factory, can be omitted if jQuery UI is already included -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js"></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/vendor/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/vendor/load-image.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/vendor/canvas-to-blob.min.js"></script>
<!-- blueimp Gallery script -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/blueimp-gallery/jquery.blueimp-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>
<!-- The File Upload processing plugin -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>
<!-- The File Upload image preview & resize plugin -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.fileupload-image.js"></script>
<!-- The File Upload audio preview plugin -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.fileupload-audio.js"></script>
<!-- The File Upload video preview plugin -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.fileupload-video.js"></script>
<!-- The File Upload validation plugin -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.fileupload-validate.js"></script>
<!-- The File Upload user interface plugin -->
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>
<!-- The main application script -->
<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="/pixsignage-static/global/plugins/jquery-file-upload/js/cors/jquery.xdr-transport.js"></script>
<![endif]-->
<!-- END:File Upload Plugin JS files-->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/global/scripts/metronic.js" type="text/javascript"></script>
<script src="/pixsignage-static/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-image.js?t=2"></script>
<script>
//上传文件的后缀
var myBranchid = <%=((Staff)session.getAttribute(SessionConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init();
	initMyTable();
	initMyEditModal();
	initUploadModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
