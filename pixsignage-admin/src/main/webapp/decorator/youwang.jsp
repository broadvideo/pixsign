<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 
<%@include file="/common/session.jsp"%>

<%
response.setHeader("Cache-Control","no-store");
response.setHeader("Pragrma","no-cache");
response.setDateHeader("Expires",0);
%>

<%@page import="java.util.List"%> 
<%@page import="java.util.ArrayList"%> 
<%@page import="com.broadvideo.pixsignage.domain.Privilege"%>
<%@page import="com.broadvideo.pixsignage.common.CommonConfig"%> 

<%@page import="org.springframework.web.context.WebApplicationContext"%> 
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%> 
<%@page import="com.broadvideo.pixsignage.domain.Sdomain"%> 
<%@page import="com.broadvideo.pixsignage.service.SdomainService"%> 


<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>
<meta charset="utf-8" />
<title>Digital Signage</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta content="" name="description" />
<meta content="" name="author" />
<meta name="MobileOptimized" content="320">

<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>

<script type="text/javascript">
   var res="${static_ctx}";
   var ctx="${base_ctx}";
</script>

<sitemesh:write property='head'/>

<!-- BEGIN THEME STYLES -->
<link href="${static_ctx}/global/css/components.css" id="style_components" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/css/plugins.css" rel="stylesheet" type="text/css" />
<!-- END THEME STYLES -->

<style type="text/css">
.jstree-children li > a {
  padding: 0px !important; 
  display: inline !important;
}
</style>

</head>

<body>

<div class="container">
	<div class="right-pane">
		<div>
			<a href="logout.action">
				<img class="avatar" src="${base_ctx}/youwang/images/avatar.png">
				<p class="text-center avatar-title"><spring:message code="global.logout"/></p>
			</a>
		</div>
		<div>
			<img class="avatar" src="${base_ctx}/youwang/images/setting.png">
			<p class="text-center avatar-title"><spring:message code="global.setting"/></p>
		</div>
	</div>

	<div class="row left-pane">
		<img class="logo" src="${base_ctx}/youwang/images/logo.png">
		<div class="col-md-12">
			<div class="row colorful-menu">
				<div class="menu-item col-md-2" id="Menu1">
					<a href="main.jsp">
						<p class="text-center menu-label"><spring:message code="global.dashboard"/></p>
						<img class="underscore" src="${base_ctx}/youwang/images/underscore1.png">
					</a>
				</div>
				<div class="menu-item col-md-2" id="Menu2">
					<a href="image.jsp">
						<p class="text-center menu-label"><spring:message code="menu.resource"/></p>
						<img class="underscore" src="${base_ctx}/youwang/images/underscore2.png">
					</a>
				</div>
				<div class="menu-item col-md-2" id="Menu3">
					<a href="bundle.jsp">
						<p class="text-center menu-label"><spring:message code="menu.bundlemanage"/></p>
						<img class="underscore" src="${base_ctx}/youwang/images/underscore3.png">
					</a>
				</div>
				<div class="menu-item col-md-2" id="Menu4">
					<a href="plan.jsp">
						<p class="text-center menu-label"><spring:message code="menu.schedulemanage"/></p>
						<img class="underscore" src="${base_ctx}/youwang/images/underscore4.png">
					</a>
				</div>
				<div class="menu-item col-md-2" id="Menu5">
					<a href="device.jsp">
						<p class="text-center menu-label"><spring:message code="menu.devicemanage"/></p>
						<img class="underscore" src="${base_ctx}/youwang/images/underscore5.png">
					</a>
				</div>
				<div class="menu-item col-md-2" id="Menu6">
					<a href="onlinelog.jsp">
						<p class="text-center menu-label"><spring:message code="menu.stat"/></p>
						<img class="underscore" src="${base_ctx}/youwang/images/underscore6.png">
					</a>
				</div>
			</div>
			
			<sitemesh:write property='body'/>
		</div>
	</div>
</div>

<!-- BEGIN CORE PLUGINS -->   
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->

<sitemesh:write property='div.SiteMethJavaScript'/>

</body>
</html>
