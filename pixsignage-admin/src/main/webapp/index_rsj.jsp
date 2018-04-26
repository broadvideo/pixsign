<%@page import="com.broadvideo.pixsignage.servlet.SystemInitServlet"%>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

<%@page import="org.springframework.web.context.WebApplicationContext"%> 
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%> 
<%@page import="com.broadvideo.pixsignage.domain.Sdomain"%> 
<%@page import="com.broadvideo.pixsignage.service.SdomainService"%> 
<%@page import="com.broadvideo.pixsignage.common.CommonConfig"%> 

<%
	ServletContext servletContext = this.getServletContext();
	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
	SdomainService sdomainService = (SdomainService) ctx.getBean("sdomainService");
	Sdomain sdomain = sdomainService.selectByServername(request.getServerName());
	if (sdomain == null) {
		sdomain = sdomainService.selectByServername("default");
	}
	
	String title = "";
	String css = "login-soft.css";
	String bgcolor = "#666";
	if (sdomain != null) {
		title = sdomain.getName();
		css = "login3.css";
		bgcolor = "#E1E1E1";
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
<link href="${static_ctx}/global/css/components.css" id="style_components" rel="stylesheet" type="text/css" />

<style>
	.panel {
		margin: 80px auto;
		width: 400px;
		border: 0 solid #ccc !important;
		background-color: whitesmoke;
		border-radius: 20px !important;
		box-shadow: 0px 0px 30px #444 !important;
	}
	.panel-body .title {
		margin: 0;
		text-align: center;
		font-size: 32px;
		font-weight: 600;
	}
	.panel-body form {
		padding: 10px 45px;
	}
	.panel-body form label {
		color: #888;
		font-weight: 400;
	}
	.panel-body form input {
		border: 0px solid #ccc !important;
		border-radius: 20px;
	}
	.panel-body form button.btn {
		border-radius: 20px !important;
		color: white;
		margin-top: 30px;
	}
	.panel-body form .btn.btn-block {
		background-color: #F39500;
	}
	.panel-body form .lang .btn {
		background-color: #ccc;
	}
	.panel-body form .lang .btn.checked {
		background-color: #F39500;
	}
	.panel-footer {
		background-color: #F39500;
		padding: 20px 40px;
		border-radius: 0 0 20px 20px;
	}
	.panel-footer img {
		width: 100%
	}
</style>
</head>

<!-- BEGIN BODY -->
<body>
<div class="panel panel-default">
	<div class="panel-body">
		<p class="title"><spring:message code="global.login.hint.rsj1"/></p>
		<p class="title"><spring:message code="global.login.hint.rsj2"/></p>
		<form id="LoginForm" class="login-form" method="post">
			<div class="alert alert-danger display-hide">
				<button class="close" data-close="alert"></button>
				<span></span>
			</div>
			<div class="form-group">
				<label for="username"><spring:message code="global.username"/></label>
				<input type="text" class="form-control" name="username">
			</div>
			<div class="form-group">
				<label for="password"><spring:message code="global.password"/></label>
				<input type="password" class="form-control" name="password">
			</div>
			<button type="submit" class="submit btn btn-default btn-block"><spring:message code="global.login.login"/></button>
			<div class="lang">
				<button class="btn checked pix-language" data-id="zh_CN">简体中文</button>
				<button class="btn pull-right pix-language" data-id="en_US">English</button>
			</div>
		</form>
	</div>
	<div class="panel-footer">
		<img src="/pixsigdata/sdomain/<%=sdomain.getCode()%>/logo.png?t=1" />
	</div>
</div>

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
		Login.init();
		$('.pix-language').removeClass('checked');
		$('.pix-language[data-id=${locale}]').addClass('checked');
		$('.pix-language').click(function(event){
			event.preventDefault();
			var language = $(event.target).attr('data-id');
			document.location.href="index_rsj.jsp?locale=" + language;
		});
	});
</script>
<!-- END JAVASCRIPTS -->
</body>
</html>
