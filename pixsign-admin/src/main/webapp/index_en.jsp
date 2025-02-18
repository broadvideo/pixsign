<%@page import="com.broadvideo.pixsign.servlet.SystemInitServlet"%>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

<%@page import="org.springframework.web.context.WebApplicationContext"%> 
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%> 
<%@page import="com.broadvideo.pixsign.domain.Sdomain"%> 
<%@page import="com.broadvideo.pixsign.service.SdomainService"%> 
<%@page import="com.broadvideo.pixsign.common.CommonConfig"%> 

<%
 	ServletContext servletContext = this.getServletContext();
 	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
 	SdomainService sdomainService = (SdomainService) ctx.getBean("sdomainService");
 	String servername = request.getServerName();
 	Sdomain sdomain = sdomainService.selectByServername(servername);
 	if (sdomain == null) {
 		servername = "default";
 		sdomain = sdomainService.selectByServername("default");
 	}
 	
 	String title = "";
 	String css = "login3.css";
 	String bgcolor = "#E1E1E1";
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
<title><%=title%> Digital Signage</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description" />
<meta content="" name="author" />
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN PAGE LEVEL STYLES -->
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/admin/pages/css/<%=css%>" rel="stylesheet" type="text/css" />
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN THEME STYLES -->
<link href="${static_ctx}/global/css/components.css" id="style_components" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/css/plugins.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/admin/layout/css/layout.css" rel="stylesheet" type="text/css" />
<link id="style_color" href="${static_ctx}/admin/layout/css/themes/darkblue.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/admin/layout/css/custom.css" rel="stylesheet" type="text/css" />
<!-- END THEME STYLES -->
<link rel="shortcut icon" href="${base_ctx}/favicon.ico" />
</head>
<!-- END HEAD -->

<body class="login" style="background-image: url(/pixsign/img/bg.jpg);background-size: cover;">
	<!-- BEGIN LOGO -->
	<div class="logo">
		<img src="/pixsigndata/sdomain/<%=sdomain.getCode()%>/logo.png?t=1" height="100" alt="" />
	</div>
	
	<!-- END LOGO -->
	<!-- BEGIN LOGIN -->
	<div class="content">
		<!-- BEGIN LOGIN FORM -->
		<form id="LoginForm" class="login-form" method="post">
			<h3 class="form-title"><spring:message code="global.login.hint"/></h3>
			<div class="alert alert-danger display-hide">
				<button class="close" data-close="alert"></button>
				<span></span>
			</div>
			<div class="form-group">
				<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
				<spring:message code="global.username" var="global_username"/>
				<label class="control-label visible-ie8 visible-ie9">${global_username}</label>
				<div class="input-icon">
					<i class="fa fa-user"></i>
					<input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="${global_username}" name="username"/>
				</div>
			</div>
			<div class="form-group">
				<spring:message code="global.password" var="global_password"/>
				<label class="control-label visible-ie8 visible-ie9">${global_password}</label>
				<div class="input-icon">
					<i class="fa fa-lock"></i>
					<input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="${global_password}" name="password"/>
				</div>
			</div>
			<div class="form-actions">
				<label class="checkbox"><input type="checkbox" name="remember" value="1"/><spring:message code="global.login.remember"/></label>
				<button type="submit" class="btn blue pull-right"><spring:message code="global.login.login"/><i class="m-icon-swapright m-icon-white"></i>
				</button>
			</div>
			<br/>
		</form>
		<!-- END LOGIN FORM -->
	</div>
	<!-- END LOGIN -->
	<!-- BEGIN COPYRIGHT -->
	<div class="copyright">
		<%
			if (sdomain == null || sdomain.getDescription() == null) {
		%>
		<%=CommonConfig.CURRENT_APPVERSION + "(" + CommonConfig.CURRENT_DBVERSION + ")"%>, S/N：<%=com.broadvideo.pixsign.common.CommonConfig.SYSTEM_ID%><br/>
		<%=CommonConfig.SYSTEM_COPYRIGHT%> <%=CommonConfig.SYSTEM_ICP%><br/>	
		<%} else { %>
		©<%=sdomain.getDescription()%>
		<%} %>
	</div>
	<!-- END COPYRIGHT -->

<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src="${static_ctx}/global/plugins/respond.min.js"></script>
<script src="${static_ctx}/global/plugins/excanvas.min.js"></script> 
<![endif]-->
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/backstretch/jquery.backstretch.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-login.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
	jQuery(document).ready(function() {
		Metronic.init();
		Login.init('org/main.jsp');
	});
</script>
<!-- END JAVASCRIPTS -->
</body>
</html>