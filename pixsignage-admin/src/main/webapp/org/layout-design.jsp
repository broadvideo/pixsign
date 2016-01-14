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

<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div class="page-content-wrapper">
			<div class="page-content">
				<!-- 布局设计对话框  -->
				<div id="LayoutModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							</div>
							<div class="modal-body">
								<div class="row">
									<div class="col-md-9 col-sm-9" style="width:852px;">
										<div class="portlet box purple">
											<div class="portlet-title">
												<div class="caption"><i class="fa fa-calendar"></i><spring:message code="global.layout"/></div>
												<div class="actions">
													<div id="RegionBtn" class="btn-group">
													</div>
												</div>
											</div>
											<div class="portlet-body">
												<div id="LayoutDiv" layoutid="0" style="position:relative; width:802px; height:602px; border: 1px solid #000; background:#000000;">
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
								<button class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 区域编辑对话框  -->
				<div id="LayoutdtlEditModal" class="modal fade modal-scroll" parent="LayoutModal" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							</div>
							<div class="modal-body">
								<form id="LayoutdtlEditForm" class="form-horizontal">
									<input type="hidden" name="regionid" value="0" />
									<div class="form-body">
										<input type="hidden" name="regionid" />
										<div class="form-group nontextflag">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.intervaltime"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="intervaltime" />
												</div>
											</div>
										</div>
										<div class="form-group nontextflag">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.fitflag"/></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="fitflag" value="0"> <spring:message code="global.layout.region.fitflag_0"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="fitflag" value="1" checked> <spring:message code="global.layout.region.fitflag_1"/>
												</label>
											</div>
										</div>
										<div class="form-group nontextflag">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.volume"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="volume" />
												</div>
											</div>
										</div>
										<div class="form-group textflag">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.direction"/></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="direction" value="1"> <spring:message code="global.layout.region.direction_1"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="direction" value="2" > <spring:message code="global.layout.region.direction_2"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="direction" value="3"> <spring:message code="global.layout.region.direction_3"/>
												</label>  
												<label class="radio-inline">
													<input type="radio" name="direction" value="4" checked> <spring:message code="global.layout.region.direction_4"/>
												</label>  
												<label class="radio-inline">
													<input type="radio" name="direction" value="5"> <spring:message code="global.layout.region.direction_5"/>
												</label>  
											</div>
										</div>
										<div class="form-group textflag">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.speed"/></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="speed" value="1"> <spring:message code="global.layout.region.speed_1"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="speed" value="2" checked> <spring:message code="global.layout.region.speed_2"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="speed" value="3"> <spring:message code="global.layout.region.speed_3"/>
												</label>  
											</div>
										</div>
										<div class="form-group textflag dateflag">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.color"/></label>
											<div class="col-md-9">
												<div class="input-group colorpicker-component colorPick">
													<input type="text" name="color" value="#FFFFFF" class="form-control" />
													<span class="input-group-addon"><i></i></span>
												</div>
											</div>
										</div>
										<div class="form-group textflag dateflag">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.size"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="size" />
												</div>
											</div>
										</div>
										<div class="form-group dateflag">
											<label class="control-label col-md-3"><spring:message code="global.layout.region.dateformat"/><span class="required">*</span></label>
											<div class="col-md-9">
												<select class="form-control" name="dateformat" tabindex="-1">
													<option value="yyyy-MM-dd HH:mm">yyyy-MM-dd HH:mm</option>
													<option value="yyyy-MM-dd">yyyy-MM-dd</option>
													<option value="HH:mm">HH:mm</option>
												</select>
											</div>
										</div>
										<hr/>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.bgimage"/></label>
											<div class="col-md-9">
												<input type="hidden" id="RegionBgImageSelect" class="form-control select2" name="bgimageid" />
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.bgcolor"/></label>
											<div class="col-md-9">
												<div class="input-group colorpicker-component bgcolorPick">
													<input type="text" name="bgcolor" value="#000000" class="form-control" />
													<span class="input-group-addon"><i></i></span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.opacity"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="opacity" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.zindex"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="zindex" />
												</div>
											</div>
										</div>
										<hr/>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.width"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="width" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.height"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="height" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.leftoffset"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="leftoffset" />
												</div>
											</div>
										</div>														
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.region.topoffset"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="topoffset" />
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
								<button class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 布局模板新增修改对话框  -->
				<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 class="modal-title"><spring:message code="global.layout"/></h4>
							</div>
							<div class="modal-body">
								<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
									<input type="hidden" name="layout.layoutid" value="0" />
									<input type="hidden" name="layout.status" value="1" />
									<div class="form-body">
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.name"/><span
												class="required">*</span>
											</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control"
														name="layout.name" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-md-3"><spring:message code="global.type"/></label>
											<div class="col-md-9">
												<select class="form-control" name="layout.type" tabindex="-1">
													<option value="0"><spring:message code="global.layout.type_0"/></option>
													<option value="1"><spring:message code="global.layout.type_1"/></option>
												</select>
											</div>
										</div>
										<div class="form-group layout-ratio">
											<label class="control-label col-md-3"><spring:message code="global.layout.ratio"/></label>
											<div class="col-md-9">
												<select class="form-control" name="layout.ratio" tabindex="-1">
													<option value="1"><spring:message code="global.layout.ratio_1"/></option>
													<option value="2"><spring:message code="global.layout.ratio_2"/></option>
													<option value="3"><spring:message code="global.layout.ratio_3"/></option>
													<option value="4"><spring:message code="global.layout.ratio_4"/></option>
												</select>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.layout.bgimage"/></label>
											<div class="col-md-9">
												<input type="hidden" id="LayoutBgImageSelect" class="form-control select2" name="layout.bgimageid">
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.description"/></label>
											<div class="col-md-9">
												<textarea class="form-control" rows="4" name="layout.description"></textarea>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
								<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
							</div>
						</div>
					</div>
				</div>
			
		
				<!-- BEGIN PAGE HEADER-->
				<h3 class="page-title"><spring:message code="menu.layout"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.schedulemanage"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.layout"/></a>
						</li>
					</ul>
				</div>
				<!-- END PAGE HEADER-->
			
				<!-- BEGIN PAGE CONTENT-->
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.layout"/></div>
								<div class="tools">
									<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
								</div>
							</div>
							<div class="portlet-body">
								<div class="table-toolbar">
									<div class="btn-group">
										<button privilegeid="101010" class="btn green pix-add">
											<spring:message code="global.add"/> <i class="fa fa-plus"></i>
										</button>
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
			<%if (session_org == null || session_org.getCopyright() == null || session_org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;&nbsp;${global_copyright}
			<%} else { %>
			©<%=session_org.getCopyright()%>
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
<script src="${static_ctx}/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-layout-design.js?t=6"></script>
<script>
jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	DataInit.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
