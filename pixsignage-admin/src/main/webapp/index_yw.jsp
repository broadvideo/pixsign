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

</head>
<!-- END HEAD -->

<body>
<div class="login-box">
	<img class="logo" src="${base_ctx}/youwang/images/logo.png">
	<div class="form" style="margin-top: 60px;">
		<form id="LoginForm" class="login-form" method="post">
			<div class="form-body">
				<div class="form-group">
					<label>帐号</label>
					<div class="input">
						<input class="form-control input-circle-right" placeholder="Account" type="text" name="username">
					</div>
				</div>
				<div class="form-group">
					<label>密码</label>
					<div class="input">
						<input class="form-control" placeholder="Password" type="text" name="password">
					</div>
				</div>
				<div class="form-group">
					<div class="mt-checkbox-inline">
						<label class="mt-checkbox">
							<input type="checkbox" name="remember" value="1"> 记住用户名
							<span></span>
						</label>
					</div>
				</div>
			</div>
			<div class="form-actions" style="margin-left: 120px;">
				<button type="button" class="btn btn-info">注册</button>
				<button type="submit" class="btn btn-danger">登入</button>
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
<script src="${base_ctx}/scripts/lang/${locale}.js" type="text/javascript"></script>
<script src="${base_ctx}/youwang/scripts/app.js" type="text/javascript"></script>
<script src="${base_ctx}/youwang/scripts/login.js" type="text/javascript"></script>
<script>
	jQuery(document).ready(function() {
		Metronic.init();
		Login.init('youwang/main.jsp');
		$('.pix-language').click(function(event){
			event.preventDefault();
			var language = $(event.target).attr('data-id');
			document.location.href="index_yw.jsp?locale=" + language;
		});
	});
</script>
<!-- END JAVASCRIPTS -->
</body>
</html>