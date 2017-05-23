<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

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
<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN PAGE LEVEL STYLES -->
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-file-upload/css/jquery.fileupload.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<style type="text/css">
.dropdown-menu li > a {
  padding: 0px !important; 
  display: inline !important;
}
</style>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div class="page-content-wrapper">
			<div class="page-content">

				<div id="UploadModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 class="modal-title"><spring:message code="global.image"/></h4>
							</div>
							<div class="modal-body">
			
								<form id="UploadForm" class="form-horizontal" action="image!upload.action" method="POST" enctype="multipart/form-data">
									<!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
									<div class="row fileupload-buttonbar">
										<div class="col-lg-6">
											<!-- The fileinput-button span is used to style the file input field as button -->
											<span class="btn green fileinput-button">
											<i class="fa fa-plus"></i>
											<span><spring:message code="global.resource.choose"/></span>
											<input type="file" name="mymedia" multiple>
											</span>
											<button type="submit" class="btn blue start">
											<i class="fa fa-upload"></i>
											<span><spring:message code="global.resource.uploadall"/></span>
											</button>
											<button type="reset" class="btn yellow cancel">
											<i class="fa fa-ban"></i>
											<span><spring:message code="global.resource.uploadcancel"/></span>
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
								<button type="button" class="btn default pix-upload-close" data-dismiss="modal"><spring:message code="global.close"/></button>
							</div>
						</div>
					</div>
				</div>
			
				<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 class="modal-title"><spring:message code="global.image"/></h4>
							</div>
							<div class="modal-body">
								<form id="MyEditForm" class="form-horizontal" method="POST">
									<input type="hidden" name="image.imageid" value="0" />
									<input type="hidden" name="image.folderid" value="0" />
									<div class="form-body">
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="image.name" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.folder"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="pre-scrollable" id="EditFormFolderTree"></div>	
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.relateimage"/></label>
											<div class="col-md-9">
												<div class="input-group">
													<span class="input-group-btn">
														<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
														<ul class="dropdown-menu" role="menu">
															<div class="pre-scrollable foldertree">
															</div>
														</ul>
													</span>
													<input type="hidden" id="RelateImageSelect" class="form-control select2" name="image.relateid">
													<span class="input-group-btn">
														<button class="btn default" type="button" id="RelateImageRemove"><i class="fa fa-trash-o"/></i></button>
													</span>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
								<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
							</div>
						</div>
					</div>
				</div>
			
				<h3 class="page-title"><spring:message code="menu.image"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.resource"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.image"/></a>
						</li>
					</ul>
				</div>
			
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="global.image"/></div>
								<div class="tools">
									<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
								</div>
							</div>
							<div class="portlet-body">
								<div class="row">
									<div class="col-md-2">
										<div class="row"><div class="col-md-12" id="BranchTreeDiv"></div></div>
										<hr/>
										<div class="row"><div class="col-md-12" id="FolderTreeDiv"></div></div>
									</div>
									<div class="col-md-10">
										<div class="table-toolbar">
											<!-- 
											<div class="btn-group">
												<a class="btn default blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><spring:message code="global.branchselect"/> <i class="fa fa-angle-down"></i></a>
												<ul class="dropdown-menu pull-right">
													<div class="pre-scrollable" id="SelectBranchTree">
													</div>
												</ul>
											</div>
											-->
											<div class="btn-group">
											<%
												if (session_org.getCurrentstorage() >= session_org.getMaxstorage()) {
											%>
												<button privilegeid="201010" class="btn green pix-full"><spring:message code="global.resource.upload"/> <i class="fa fa-plus"></i></button>
											<%
												} else {
											%>
												<button privilegeid="201010" class="btn green pix-add"><spring:message code="global.resource.upload"/> <i class="fa fa-plus"></i></button>
											<%
												}
											%>
											</div>
											<!-- 
											<div id="BranchBreadcrumb" class="page-breadcrumb breadcrumb">
											</div>
											-->
										</div>
										<table id="MyTable" class="table table-striped table-bordered table-hover">
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

	</div>
	
	<div class="page-footer">
		<div class="page-footer-inner">
			<%if (session_org == null || session_org.getCopyright() == null || session_org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;<%=CommonConfig.SYSTEM_COPYRIGHT%>
			<%} else { %>
			©<%=session_org.getCopyright()%>
			<%} %>
		</div>
		<div class="scroll-to-top">
			<i class="icon-arrow-up"></i>
		</div>
	</div>
	
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<spring:message code="global.name" var="global_name"/>
<spring:message code="global.resource.upload" var="global_resource_upload"/>
<spring:message code="global.cancel" var="global_cancel"/>
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
	<tr class="template-upload fade">
		<td>
			<div class="input-icon right">
				<i class="fa"></i>
				<input type="text" class="form-control" name="names" placeholder="${global_name}" />
				<input type="hidden" name="branchids" value="{%=CurBranchid%}" />
				<input type="hidden" name="folderids" value="{%=CurFolderid%}" />
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
					<span>${global_resource_upload}</span>
				</button>
			{% } %}
			{% if (!i) { %}
				<button class="btn red cancel">
					<i class="fa fa-ban"></i>
					<span>${global_cancel}</span>
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
				<div><span class="label label-danger"><spring:message code="global.error"/></span><spring:message code="global.resource.uploadfail"/></div>
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
<script src="${static_ctx}/global/plugins/respond.min.js"></script>
<script src="${static_ctx}/global/plugins/excanvas.min.js"></script> 
<![endif]-->   
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN:File Upload Plugin JS files-->
<!-- The jQuery UI widget factory, can be omitted if jQuery UI is already included -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js"></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/vendor/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/vendor/load-image.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/vendor/canvas-to-blob.min.js"></script>
<!-- blueimp Gallery script -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/blueimp-gallery/jquery.blueimp-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>
<!-- The File Upload processing plugin -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>
<!-- The File Upload image preview & resize plugin -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.fileupload-image.js"></script>
<!-- The File Upload audio preview plugin -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.fileupload-audio.js"></script>
<!-- The File Upload video preview plugin -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.fileupload-video.js"></script>
<!-- The File Upload validation plugin -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.fileupload-validate.js"></script>
<!-- The File Upload user interface plugin -->
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>
<!-- The main application script -->
<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="${static_ctx}/global/plugins/jquery-file-upload/js/cors/jquery.xdr-transport.js"></script>
<![endif]-->
<!-- END:File Upload Plugin JS files-->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-branchtree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-foldertree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-image.js?t=${timestamp}"></script>
<script>
var MyBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initBranchTree();
	initFolderTree();
	initMyTable();
	initMyEditModal();
	initUploadModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
