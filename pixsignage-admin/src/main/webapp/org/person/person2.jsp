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
							<h4 class="modal-title">新增员工</h4>
						</div>
						<div class="modal-body">
							<form id="MyEditForm" class="form-horizontal" method="POST" action="person!avatarupload.action"  ENCTYPE="multipart/form-data">
								<input type="hidden" name="person.personid"/>
								<div class="form-body">
								    <div class="form-group option1">
										<label class="col-md-3 control-label"><spring:message code="global.branch"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="pre-scrollable" id="BranchTree"></div>	
											
										</div>
										<input type="hidden" name="person.branchid"  value=""/>
								    </div>
									<div class="form-group">
										<label class="col-md-3 control-label">工号<span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="person.personno" />
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label">姓名<span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="person.name" />
												
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label">性别<span class="required">*</span></label>
										<div class="col-md-9">
											<i class="fa"></i><input type="hidden" id="ClassSelect" class="form-control select2" name="person.sex">
										</div>
									</div>
							
								  <div class="form-group">
										<label class="col-md-3 control-label">电话</label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="person.mobile" />
											</div>
										</div>
									</div>
								    <div class="form-group">
										<label class="col-md-3 control-label">邮箱</label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i> <input type="text" class="form-control" name="person.email" />
											</div>
										</div>
									</div>
								   <div class="form-group">
										<label class="col-md-3 control-label">语音提示语</label>
										<div class="col-md-9">
											<div class="input-icon right">
												<i class="fa"></i>
												<textarea class="form-control" rows="2" name="person.voiceprompt"></textarea> 
											</div>
										</div>
									</div>
									
									<div class="form-group">
									 <label class="col-md-3 control-label">头像<span class="required">*</span></label>

									  <div class="col-md-9">
									       <input type="file" id="avatarfile" name="avatarfile"  class="filestyle" data-buttonName="btn-primary" data-buttonText="上传" data-icon="false" data-badge="false" data-input="false" onchange="preview(this,'preview')"/>
							          </div>
									 </div>
									 <div class="form-group">
									    <div class="col-md-3">
										 &nbsp;
								        </div>
									 	<div id="preview" class="col-md-9">
									 	  <input type="hidden"  name="person.avatar" value="" />
									 	</div>
									 
									 </div>
									 <div class="form-group">
									 <label class="col-md-3 control-label">识别图片<span class="required">*</span></label>
									  <div class="col-md-9">
									        <input type="file" id="imagefile" name="imagefile"  class="filestyle" data-buttonName="btn-primary" data-buttonText="上传" data-icon="false" data-badge="false" data-input="false" onchange="preview(this,'preview2')"/>
							          </div>
									 </div>
									 <div class="form-group">
									    <div class="col-md-3">
										 &nbsp;
								        </div>
									 	<div id="preview2" class="col-md-9">
									 	  <input type="hidden"  name="person.imageurl" value="" />
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
			
		 <div id="PersonImportModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-wide">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title">员工导入</h4>
						</div>
						<div class="modal-body">
						    <div class="note note-info">
								<p> 1.点击页面上的链接下载zip模板，按照模板要求填写好数据</p>
							    <p> 2.通过界面的批量导入功能，上传填写的好的数据</p>
							</div>
							<form id="PersonImportForm" class="form-horizontal" method="POST" action="person!import.action"  ENCTYPE="multipart/form-data">
								<div class="form-body">
									<div class="form-group option1">
										<label class="col-md-3 control-label"><spring:message code="global.branch"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="pre-scrollable" id="BranchTree"></div>	
										</div>
										<input type="hidden" name="person.branchid" />
										
								    </div>
								    <div class="form-group">
											<label class="col-md-3 control-label"></label>
											<div class="col-md-9">
												<a href="/pixsignage/template/datatemplate.zip"><font color="red">请先下载zip模板包</font></a>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">上传文件<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="file" name="personZipFile" id="personZipFile" style="display:none;" />
												</div>
											</div>
										</div>
								
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button id="uploadFile" type="button" class="btn blue"><spring:message code="global.submit"/></button>
							<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
						</div>
					</div>
				</div>
			</div>
			
			<h3 class="page-title"><spring:message code="menu.staff2"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.staffattendance"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.staff2"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="menu.staff2"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="PersonPortlet">
							<div class="row">
							   <div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
							     <div class="col-md-10">
									<div class="table-toolbar">
										<div class="btn-group">
											<button id="MyEditModalBtn" privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
										</div>
										<div class="btn-group">
										   <a href="#" class="btn green pix-person-import"  target="_self">批量导入<i class="fa fa-file-zip-o"></i></a>									
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
<script src="${static_ctx}/global/plugins/jquery-validation/lib/jquery.form.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-filestyle/bootstrap-filestyle.min.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>

<!-- END PAGE LEVEL PLUGINS -->



<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/person/person.js?t=${timestamp}"></script>
<script>
var MyBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	PersonModule.init(2);
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
