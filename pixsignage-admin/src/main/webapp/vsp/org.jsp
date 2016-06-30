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
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>

<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="/common/common2.jsp"%>

		<div class="page-content-wrapper">
			<div class="page-content">
				<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 class="modal-title"><spring:message code="global.org"/></h4>
							</div>
							<div class="modal-body">
								<form id="MyEditForm" class="form-horizontal" method="POST">
									<input type="hidden" name="org.orgid" value="0" />
									<input type="hidden" name="org.status" value="1" />
									<div class="form-body">
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.name"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.name" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.code"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.code" />
												</div>
											</div>
										</div>
										<div class="form-group pix-control">
											<label class="col-md-3 control-label"><spring:message code="global.org.type"/><span class="required">*</span></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="org.orgtype" value="1"> <spring:message code="global.org.orgtype_1"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="org.orgtype" value="2" checked> <spring:message code="global.org.orgtype_2"/>
												</label>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.org.reviewflag"/><span class="required">*</span></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="org.reviewflag" value="0" checked> <spring:message code="global.off"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="org.reviewflag" value="1"> <spring:message code="global.on"/>
												</label>
											</div>
										</div>
										<div class="form-group pix-control">
											<label class="col-md-3 control-label"><spring:message code="global.org.media"/></label>
											<div class="col-md-9 checkbox-list">
												<label class="checkbox-inline">
													<input type="checkbox" name="org.videoflag" value="1" checked><spring:message code="global.video"/>
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.imageflag" value="1" checked><spring:message code="global.image"/>
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.textflag" value="1" checked><spring:message code="global.text"/>
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.streamflag" value="1" checked><spring:message code="global.stream"/>
												</label>
												<label class="checkbox-inline pix-control">
													<input type="checkbox" name="org.dvbflag" value="1"><spring:message code="global.dvb"/>
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.widgetflag" value="1" checked><spring:message code="global.widget"/>
												</label>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.org.expiretime"/><span class="required">*</span></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="org.expireflag" value="0" checked> <spring:message code="global.org.unlimited"/>
												</label>
												<label class="radio-inline">
													<input type="radio" name="org.expireflag" value="1" > <spring:message code="global.org.expire"/>
												</label>
											</div>
										</div>
										<div class="form-group expiretime">
											<label class="col-md-3 control-label"></label>
											<div class="col-md-9">
												<div class="input-group date form_datetime">                                       
													<input type="text" size="16" readonly class="form-control" name="org.expiretime" value="2037-01-01">
													<span class="input-group-btn">
													<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.org.maxdevices"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.maxdevices" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.org.storage"/><span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.maxstorage" />
												</div>
											</div>
										</div>
										<div class="form-group pix-control">
											<label class="col-md-3 control-label"><spring:message code="global.org.copyright"/></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.copyright" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label"><spring:message code="global.description"/></label>
											<div class="col-md-9">
												<textarea class="form-control" rows="4" name="org.description"></textarea>
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
			
				<!-- BEGIN PAGE HEADER-->
				<h3 class="page-title"><spring:message code="menu.org"/></h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.opmanage"/></a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#"><spring:message code="menu.org"/></a>
						</li>
					</ul>
				</div>
				<!-- END PAGE HEADER-->
			
				<!-- BEGIN PAGE CONTENT-->
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-cloud"></i><spring:message code="global.org"/></div>
								<div class="tools">
									<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
								</div>
							</div>
							<div class="portlet-body">
								<div class="table-toolbar">
									<div class="btn-group">
										<button privilegeid="101010" class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
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
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;&nbsp;<spring:message code="global.copyright"/>
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
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js"></script>
<script src="${base_ctx}/scripts/pix-org.js?t=2"></script>
<script>
var PixContral = 0;
<% if (session_vsp != null && session_vsp.getCode().equals("default")) {%>
PixContral = 1;
<% } %>  
var MaxOrgs = <%=com.broadvideo.pixsignage.common.CommonConfig.LICENSE_MaxOrgs%>;
var MaxDevicesPerSigOrg = <%=com.broadvideo.pixsignage.common.CommonConfig.LICENSE_MaxDevicesPerSigOrg%>;
var MaxStoragePerSigOrg = <%=com.broadvideo.pixsignage.common.CommonConfig.LICENSE_MaxStoragePerSigOrg%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init();
	initMyTable();
	initMyEditModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
