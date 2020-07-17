<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-file-upload/css/jquery.fileupload.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>

	<div id="UploadModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.page"/></h4>
				</div>
				<div class="modal-body">
					<form id="UploadForm" class="form-horizontal" action="page!upload.action" method="POST" enctype="multipart/form-data">
						<!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
						<div class="row fileupload-buttonbar">
							<div class="col-lg-6">
								<!-- The fileinput-button span is used to style the file input field as button -->
								<span class="btn green fileinput-button">
								<i class="fa fa-plus"></i>
								<span><spring:message code="pixsign.page"/></span>
								<input type="file" name="mypage" multiple>
								</span>
								<button type="submit" class="btn blue start">
								<i class="fa fa-upload"></i>
								<span><spring:message code="global.uploadall"/></span>
								</button>
								<button type="reset" class="btn yellow cancel">
								<i class="fa fa-ban"></i>
								<span><spring:message code="global.uploadcancel"/></span>
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
		
	<div class="page-content-wrapper">
		<div class="page-content">
			<h3 class="page-title"><spring:message code="menu.page"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.opmanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.page"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="pixsign.page"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="PageModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="PagePortlet">
							<div class="table-toolbar">
								<div class="btn-group">
									<button privilegeid="201010" class="btn green pix-add"><spring:message code="global.upload"/> <i class="fa fa-plus"></i></button>
								</div>
							</div>
							<div class="row">
								<div class="col-md-6 col-sm-12"><input type="hidden" id="OrgSelect" class="form-control select2 input-medium"></div>
							</div>
							<br/>
							<table id="PageTable" class="table table-striped table-bordered table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div id="snapshot_div" style="position:relative; top:65px; display:none;"></div>
		</div>
	</div>
</body>

<div id="SiteMethJavaScript">
<spring:message code="pixsign.prop.name" var="global_name"/>
<spring:message code="global.upload" var="global_upload"/>
<spring:message code="global.cancel" var="global_cancel"/>
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
	<tr class="template-upload fade">
		<td>
			<input type="hidden" name="orgids" value="{%=_orgid%}" />
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
					<span>${global_upload}</span>
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
			<p class="name">
				{% if (file.url) { %}
					<a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
				{% } else { %}
					<span>{%=file.name%}</span>
				{% } %}
			</p>
			{% if (file.error) { %}
				<div><span class="label label-danger"><spring:message code="global.error"/></span><spring:message code="global.uploadfail"/></div>
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

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=2" type="text/javascript"></script>
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
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/page/page-preview.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/sys/page.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	PageModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
