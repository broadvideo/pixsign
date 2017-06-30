<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>    
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>PixBox CMS</title>
<meta content="" name="description"/>
<meta content="" name="author"/>
<c:set var="res" value="/pixschedule-res" />
<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="${res}/assets/plugins/bootstrap-select/bootstrap-select.min.css"/>
<link rel="stylesheet" type="text/css" href="${res}/assets/plugins/select2/select2.css"/>
<link rel="stylesheet" type="text/css" href="${res}/assets/plugins/select2/select2-metronic.css"/>
<link rel="stylesheet" type="text/css" href="${res}/assets/plugins/bootstrap-toastr/toastr.min.css"/>
<link rel="stylesheet" href="${res}/assets/plugins/data-tables/css/jquery.dataTables.min.css"/>
<link rel="stylesheet" href="${res}/assets/plugins/data-tables/css/DT_bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="${res}/assets/plugins/jquery-tags-input/jquery.tagsinput.css" />
<link rel="stylesheet" href="${res}/assets/plugins/bootstrap-switch/css/bootstrap-switch.min.css" type="text/css" media="screen"/>
<link rel="stylesheet" href="${res}/assets/plugins/jstree/dist/themes/default/style.min.css" type="text/css" media="screen"/>
<link href="${res}/assets/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet" type="text/css"/>
<link href="${res}/assets/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>
<link href="${res}/assets/plugins/jquery-file-upload/css/jquery.fileupload.css" rel="stylesheet"/>
<link href="${res}/assets/plugins/jquery-file-upload/css/jquery.fileupload-ui.css" rel="stylesheet"/>
<link href="${res}/assets/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE LEVEL STYLES -->
</head>
<!-- BEGIN BODY -->
<body class="page-header-fixed">
 <div class="row">
        <div class="col-md-12"> 
          <!-- BEGIN PAGE TITLE & BREADCRUMB-->
          <ul class="page-breadcrumb breadcrumb">
            <li> <i class="fa fa-home"></i> Home <i class="fa fa-angle-right"></i> </li>
          </ul>
          
          <!-- END PAGE TITLE & BREADCRUMB--> 
        </div>
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
                  	<a href="javascript:;" id="action_add_classroom" class="btn green"> <i class="fa fa-plus"></i> </a>
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
                      <th style="width:60px"></th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th style="width:120px">名称</th>
                      <th>描述</th>
                      <th>创建时间</th>
                      <th style="width:60px"></th>
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
        <button type="button" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i></button>
        <button type="button" id="action_submit_add" class="btn blue"><i class="fa fa-check"></i> </button>
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
        <button type="button" class="btn default" data-dismiss="modal"><i class="fa fa-times"></i> </button>
        <button type="button" id="action_submit_edit" class="btn blue"><i class="fa fa-check"></i></button>
      </div>
</div>
--></textarea>
</p>
<!--BEGIN Template-->
<script src="${res}/assets/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
		<script src="${res}/assets/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>
		<script src="${res}/assets/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
		<script src="${res}/assets/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
		<script src="${res}/assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
		<script src="${res}/assets/plugins/jquery.blockui.min.js" type="text/javascript"></script>
		<script src="${res}/assets/plugins/jquery.cokie.min.js" type="text/javascript"></script>
		<script src="${res}/assets/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<!-- BEGIN PAGE LEVEL PLUGINS --> 
<script src="${res}/assets/plugins/moment.min.js"></script>
<script src="${res}/assets/plugins/bootstrap-select/bootstrap-select.min.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/select2/select2.min.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/data-tables/js/jquery.dataTables.min.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/data-tables/js/DT_bootstrap.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/bootbox/bootbox.min.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/jquery-jtemplates.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/bootstrap-toastr/toastr.min.js"></script>
<script src="${res}/assets/plugins/jquery.form.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/jquery-tags-input/jquery.tagsinput.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<script src="${res}/assets/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${res}/assets/plugins/fancybox/source/jquery.fancybox.pack.js"></script> 
<script src="${res}/assets/plugins/fancybox/lib/jquery.mousewheel-3.0.6.pack.js"></script>
<script src="${res}/assets/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript" ></script>
<script src="${res}/assets/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript" ></script>
<!-- END PAGE LEVEL PLUGINS--> 
<!-- BEGIN PAGE LEVEL SCRIPTS --> 
<script src="${res}/assets/scripts/core/app.js"></script> 

<script src="${res}/assets/scripts/custom/lang/${locale}.js"></script>
<script>
$(document).ready(function(){ 
 alert("12123");
	var classroomid=12
    bootbox.confirm({
        buttons: {
            confirm: {label: common.tips.t03, className: 'default blue-stripe'},
            cancel: {label: common.tips.t04, className: 'default'}
        },
        message: "删除教室将清空教室关联的课表，确认是否删除:" + $(this).closest("tr").find("td:first").text(),
        callback: function (result) {
            if (result) {
                var jsonData = {ids: classroomId};
                $.ajax({
                    url: 'classroom!delete.action',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    data: jsonData,
                    dataType: 'json',
                    success: function (result) {
                        switch (result.retcode) {
                            case -90:
                                bootbox.alert(common.tips.t00, function () {
                                    document.location.href = "/login.action";
                                });
                                break;
                            case 1:
                                toastr.success("删除教室成功。");
                                var pageInfo = $('#classroomList').DataTable().page.info();
                                if (pageInfo.pages > 1 && pageInfo.pages == pageInfo.page + 1 && 1 == pageInfo.end - pageInfo.start) {
                                    $('#classroomList').DataTable().page(pageInfo.page - 1);
                                }
                                $('#classroomList').DataTable().ajax.reload(null, false);
                                break;
                            case -3:
                                toastr.error(common.tips.t01);
                                break;
                            case -4:
                                toastr.error(common.tips.t02);
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        toastr.warning("删除教室异常:" + textStatus);
                    }
                });
            }
        },
        //title: "bootbox confirm也可以添加标题哦",
    });
});


</script>
<!-- END PAGE LEVEL SCRIPTS -->
</body>
<!-- END BODY -->
</html>