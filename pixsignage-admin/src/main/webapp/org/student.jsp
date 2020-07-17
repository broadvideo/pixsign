<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<style type="text/css">
  #preview,
  .img,
  img{
    width: 100px;
    height: 100px;
   }
   
  #preview {
    border: 1px solid #000;
  }
</style>
</head>
<body>
	<div class="page-content-wrapper">
		<div class="page-content">
			<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-wide">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title">学生</h4>
						</div>
						<div class="modal-body">
							<form id="MyEditForm" class="form-horizontal" method="POST" action="student!avatarupload.action"  ENCTYPE="multipart/form-data">
								<input type="hidden" name="student.studentid" value="0" />
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label">班级</label>
										<div class="col-md-9">
											<input type="hidden" id="ClassSelect" class="form-control select2" name="student.schoolclassid">
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label">学号<span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="student.studentno" />
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="student.name" />
											</div>
										</div>
									</div>
								    <div class="form-group">
										<label class="col-md-3 control-label">硬件id<span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="student.hardid" />
											</div>
										</div>
									</div>
									<div class="form-group">
									  <div class="col-md-3">
										 &nbsp;
								      </div>
									  <div class="col-md-9">
									        <input type="file" id="avatarfile" name="avatarfile"  class="filestyle" data-buttonName="btn-primary" data-buttonText="上传头像" data-icon="false" data-badge="false" data-input="false" onchange="preview(this)"/>
							          </div>
									 </div>
									 <div class="form-group">
									    <div class="col-md-3">
										 &nbsp;
								        </div>
									 	<div id="preview" class="col-md-9">
									 	  <input type="hidden"  name="student.avatar" value="" />
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
			
			<h3 class="page-title"><spring:message code="menu.student"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.classcard"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.student"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="menu.student"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button id="MyEditModalBtn" privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
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
		</div>
	</div>
</body>

<div id="SiteMethJavaScript">


<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-filestyle/bootstrap-filestyle.min.js" type="text/javascript"></script>

<!-- END PAGE LEVEL PLUGINS -->



<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-student.js?t=${timestamp}"></script>
<script>
var MyBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
s
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
