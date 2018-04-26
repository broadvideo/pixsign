<%@page import="com.broadvideo.pixsignage.servlet.SystemInitServlet"%>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

<%@page import="org.springframework.web.context.WebApplicationContext"%> 
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%> 
<%@page import="com.broadvideo.pixsignage.domain.Sdomain"%> 
<%@page import="com.broadvideo.pixsignage.service.SdomainService"%> 
<%@page import="com.broadvideo.pixsignage.common.CommonConfig"%> 
<%@page import="com.broadvideo.pixsignage.common.CommonConstants"%> 
<%@page import="com.broadvideo.pixsignage.domain.Staff"%> 

<%
	ServletContext servletContext = this.getServletContext();
	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
	SdomainService sdomainService = (SdomainService) ctx.getBean("sdomainService");
	Sdomain sdomain = sdomainService.selectByServername(request.getServerName());
	if (sdomain == null) {
		sdomain = sdomainService.selectByServername("default");
	}
	String title = sdomain.getName();

	Staff session_staff = (Staff)session.getAttribute(CommonConstants.SESSION_STAFF);
	String subsystem = "";
	if (session_staff != null && session_staff.getSubsystem().equals("0")) {
		subsystem = "sys";
	} else if (session_staff != null && session_staff.getSubsystem().equals("1")) {
		subsystem = "vsp";
	} else if (session_staff != null && session_staff.getSubsystem().equals("2")) {
		subsystem = "org";
	}
%>

<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>Digital Signage</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description" />
<meta content="" name="author" />

<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${base_ctx}/youwang/css/custom.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/youwang/css/mt-custom.css" rel="stylesheet" type="text/css"/>
<style type="text/css">
.display-hide {
  display: none;
}
</style>

</head>
<!-- END HEAD -->

<body>
<div class="login-box">
	<img class="logo" src="${base_ctx}/youwang/images/logo.png">
	<div class="form" style="margin-top: 60px;">
		<form id="RegisterForm" class="form-horizontal" method="post">
			<input type="hidden" name="vspid" value="2" />
			<div class="form-body">
				<div class="alert alert-danger display-hide">
					<button class="close" data-close="alert"></button>
					<span></span>
				</div>
				<div class="form-group">
					<label class="col-md-3 control-label"><spring:message code="global.username"/><span
							class="required">*</span></label>
					<div class="col-md-9">
						<div class="input-icon right">
							<i class="fa"></i> <input type="text" class="form-control" name="username" />
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="col-md-3 control-label"><spring:message code="global.password"/><span
							class="required">*</span></label>
					<div class="col-md-9">
						<div class="input-icon right">
						<input type="hidden"/>
							<i class="fa"></i> <input type="password" class="form-control" name="password" autocomplete="new-password" />
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="col-md-3 control-label">手机号<span class="required">*</span></label>
					<div class="col-md-9">
						<div class="input-icon right">
							<i class="fa"></i> <input type="text" class="form-control" name="phone" />
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="col-md-3 control-label">验证码<span class="required">*</span></label>
					<div class="col-md-9">
						<div class="input-group">
							<div class="input-icon">
								<input id="newpassword" class="form-control" type="text" name="vcode">
							</div>
							<span class="input-group-btn">
								<button id="GetVCode" class="btn btn-success" type="button"><i class="fa fa-lock fa-fw"></i> </button>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="form-actions" align="center">
				<button type="submit" class="btn btn-danger"><spring:message code="global.submit"/></button>
				<button type="button" onclick="javascript:history.back();" class="btn btn-default"><spring:message code="global.cancel"/></button>
			</div>
		</form>
	</div>
</div>
 
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/youwang/scripts/app.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/youwang/scripts/register.js?t=${timestamp}" type="text/javascript"></script>
<script>
	jQuery(document).ready(function() {
		Metronic.init();
		Register.init();
	});
</script>
<!-- END JAVASCRIPTS -->
</body>
</html>