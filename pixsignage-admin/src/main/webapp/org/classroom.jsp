<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%> 
<html>
<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-toastr/toastr.min.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="${static_ctx}/global/plugins/data-tables/css/jquery.dataTables.min.css"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/css/custom.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet" type="text/css"/>

</head>
<!-- BEGIN BODY -->
<body>
<div class="page-content-wrapper">
		<div class="page-content">
		
					<h3 class="page-title"><spring:message code="menu.classroom"/></h3>
					<div class="page-bar">
						<ul class="page-breadcrumb">
							<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
									class="fa fa-angle-right"></i>
							</li>
							<li><a href="#"><spring:message code="menu.classcard"/></a><i class="fa fa-angle-right"></i>
							</li>
							<li><a href="#"><spring:message code="menu.classroom"/></a>
							</li>
						</ul>
					</div>
	
				      <!-- END PAGE HEADER--> 
				      <!-- BEGIN PAGE CONTENT-->
				      <div id="page">
				        <div class="row">
				          <div class="col-md-12"> 
				            <!-- BEGIN EXAMPLE TABLE PORTLET-->
				            <div class="portlet box blue">
				              <div class="portlet-title">
				                <div class="caption"> <i class="fa fa-list"></i> 教室列表 </div>
				                <div class="actions"> 
				                  <div class="btn-group"> 
				                  	<a href="javascript:;" id="action_add_classroom" class="btn green"> <i class="fa fa-plus"></i><spring:message  code="global.add"/> </a>
				                  </div>
				                </div>
				              </div>
				              <div class="portlet-body">
				                <table class="display" cellspacing="0" id="classroomList">
				                  <thead>
				                    <tr>
				                      <th style="width:120px">名称</th>
				                      <th>描述</th>
				                      <th>创建时间</th>
				                      <th style="width:60px">操作</th>
				                    </tr>
				                  </thead>
				                  <tfoot>
				                    <tr>
				                      <th style="width:120px">名称</th>
				                      <th>描述</th>
				                      <th>创建时间</th>
				                      <th style="width:60px">操作</th>
				                    </tr>
				                  </tfoot>
				                </table>
				              </div>
				            </div>
				            <!-- END EXAMPLE TABLE PORTLET--> 
				          </div>
				        </div>
				      </div>
				      <div id="nest_modal"></div>
				      <!-- END PAGE CONTENT--> 
				<!-- END CONTAINER --> 
				<!--BEGIN Template-->
				<p style="display:none"> 
				<textarea id="temp_add_classroom" rows="0" cols="0"><!--
				<div id="modal_add_classroom" class="modal fade" tabindex="-1" data-width="450px" data-backdrop="static" data-keyboard="false">
				      <div class="modal-header">
				        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				        <h4 id="myModalLabel" class="modal-title">新增教室</h4>
				      </div>
				      <div class="modal-body">
				        <form id="form_add_classroom" class="form-horizontal" method="post" action="" role="form">
				              <div class="row">
				              	<div class="col-md-12">
				                  <div class="form-group row">
				                    <label class="col-md-3 control-label">名称 *</label>
				                    <div class="col-md-9">
				                      <input type="text" class="form-control" name="classroom.name" value="" />
				                    </div>
				                  </div>
				                  <div class="form-group row">
				                    <label class="col-md-3 control-label">描述 </label>
				                    <div class="col-md-9">    
				                       <textarea rows="3"  maxlength="150" class="form-control" name="classroom.description" value=""/>                       
				                    </div>  
				                  </div>
				              </div>
				            </div>
				        </form>
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i> 关闭</button>
				        <button type="button" id="action_submit_add" class="btn blue"><i class="fa fa-check"></i> 保存</button>
				      </div>
				</div>
				--></textarea>
				</p>
				
				<p style="display:none"> 
				<textarea id="temp_edit_classroom" rows="0" cols="0"><!--
				<div id="modal_edit_classroom" class="modal fade" tabindex="-1" data-width="450px" data-backdrop="static" data-keyboard="false">
				      <div class="modal-header">
				        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				        <h4 class="modal-title">修改教室</h4>
				      </div>
				      <div class="modal-body">
				        <form id="form_edit_classroom" class="form-horizontal" method="post" action="" role="form">
				            
				            <div class="row">
				              	<div class="col-md-12">
				                  <div class="form-group row">
				                    <label class="col-md-3 control-label">名称 *</label>
				                    <div class="col-md-9">
				                     <input type="text" class="form-control" name="classroom.id" value="{$T.id}" style="display:none"/>
				                     <input type="text" class="form-control" name="classroom.name" value="{$T.name}" />
				                    </div>
				                  </div>
				                  <div class="form-group row">
				                    <label class="col-md-3 control-label">描述 </label>
				                    <div class="col-md-9">    
				                       <textarea rows="3"  maxlength="150" class="form-control" name="classroom.description" value="">{$T.description}&lt;/textarea>
				                                        
				                    </div>  
				                  </div>
				              </div>
				            </div>
				            
				        </form>
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i>关闭</button>
				        <button type="button" id="action_submit_edit" class="btn blue"><i class="fa fa-check"></i>保存</button>
				      </div>
				</div>
				--></textarea>
				</p>
				<!--BEGIN Template-->
		</div>
</div>

</body>
<!-- END BODY -->
<div id="SiteMethJavaScript">
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/moment/moment.min.js"></script>
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/lib/jquery.form.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-jtemplates/jquery-jtemplates.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-toastr/toastr.min.js"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox-v4.1.0.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript" ></script>
<script src="${static_ctx}/global/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript" ></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/tmp/${locale}.js"></script>
<script src="${base_ctx}/scripts/classroom.js?t=${timestamp}"></script>
<script>

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	Custom.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>


</html>