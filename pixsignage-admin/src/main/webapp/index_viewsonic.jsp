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
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN THEME STYLES -->
<link href="${static_ctx}/global/css/components.css" id="style_components" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/metro-ui/css/metro.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/metro-ui/css/metro-schemes.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/metro-ui/css/metro-colors.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/metro-ui/css/metro-icons.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/metro-ui/css/metro-responsive.css" rel="stylesheet" type="text/css"/>

<style>
  .logo {
	margin: 20px auto 20px auto;
	text-align: center;
  }
  
  .login {
	background-color: #fff;
	width: 360px;
	margin: 0 auto;
	margin-bottom: 0px;
	padding: 30px;
	-webkit-border-radius: 7px;
	-moz-border-radius: 7px;
	-ms-border-radius: 7px;
	-o-border-radius: 7px;
	border-radius: 7px;
  }
  
  .metro {
	width: 1024px;
	margin: 0 auto;
	margin-bottom: 0px;
	padding: 30px;
	padding-top: 20px;
	padding-bottom: 15px;
  }

  .copyright {
	text-align: center;
	margin: 0 auto;
	padding: 10px;
	color: #999;
	font-size: 13px;
  }
 </style>
</head>
<!-- END HEAD -->

<body style="background-color: #E1E1E1 !important;">
	<div class="logo">
		<img src="/pixsigdata/sdomain/<%=sdomain.getCode()%>/logo.png?t=1" height="100" alt="" />
	</div>
	
	<div class="login" style="display: none;">
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
				<!-- 
				<a class="btn btn-xs green pix-language" data-id="zh_CN">中文</a>
				<a class="btn btn-xs purple pix-language" data-id="en_US">ENG</a>
				-->
			</div>
			<br/>
		</form>
	</div>
	
	<div class="metro level-1" style="display: none">
			<div class="tile-wide tile-big-y bg-teal menu-devicemanage">
				<div class="tile-content iconic">
					<span class="mif-display mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">终端</div>
				</div>
			</div>
			<div class="tile tile-wide-y tile-super-x bg-amber menu-program">
				<div class="tile-content iconic">
					<span class="mif-paint mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">制作</div>
				</div>
			</div>
			<div class="tile tile-wide-x bg-magenta menu-stat">
				<div class="tile-content iconic">
					<span class="mif-chart-dots mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">统计</div>
				</div>
			</div>
			<div class="tile tile-wide-x bg-olive menu-system">
				<div class="tile-content iconic">
					<span class="mif-windows mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">系统</div>
				</div>
			</div>
	</div>

	<div class="metro level-2-1" style="display: none">
			<div class="tile tile-wide-x tile-wide-y bg-cobalt submenu" privilegeid="30201">
				<div class="tile-content iconic">
					<span class="mif-display mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">终端</div>
				</div>
			</div>
			<div class="tile tile-wide bg-lime submenu-image submenu" privilegeid="30202">
				<div class="tile-content iconic">
					<span class="mif-versions mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">终端租</div>
				</div>
			</div>
			<div class="tile tile-wide bg-yellow submenu-return">
				<div class="tile-content iconic">
					<span class="mif-undo mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">返回</div>
				</div>
			</div>
			<div class="tile tile-super-x bg-magenta submenu" privilegeid="30207">
				<div class="tile-content iconic">
					<span class="mif-insert-template mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">分类</div>
				</div>
			</div>
			<div class="tile tile-wide bg-violet submenu" privilegeid="30204">
				<div class="tile-content iconic">
					<span class="mif-cog mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">配置</div>
				</div>
			</div>
			<div class="tile tile-wide bg-orange submenu" privilegeid="30205">
				<div class="tile-content iconic">
					<span class="mif-android mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">软件</div>
				</div>
			</div>
			<div class="tile tile-wide bg-darkGreen submenu" privilegeid="30206">
				<div class="tile-content iconic">
					<span class="mif-tools mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">升级</div>
				</div>
			</div>
	</div>

	<div class="metro level-2-2" style="display: none">
			<div class="tile tile-wide bg-cobalt submenu" privilegeid="30102">
				<div class="tile-content iconic">
					<span class="mif-film mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">视频</div>
				</div>
			</div>
			<div class="tile tile-wide bg-lime submenu" privilegeid="30104">
				<div class="tile-content iconic">
					<span class="mif-image mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">图片</div>
				</div>
			</div>
			<div class="tile tile-wide bg-yellow submenu-return">
				<div class="tile-content iconic">
					<span class="mif-undo mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">返回</div>
				</div>
			</div>

			<div class="tile tile-wide-x tile-wide-y bg-violet submenu" privilegeid="30301">
				<div class="tile-content iconic">
					<span class="mif-palette mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">节目</div>
				</div>
			</div>
			<div class="tile tile-super-x bg-orange submenu" privilegeid="30501">
				<div class="tile-content iconic">
					<span class="mif-calendar mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">计划</div>
				</div>
			</div>
			<div class="tile tile-super-x bg-darkGreen submenu" privilegeid="30309">
				<div class="tile-content iconic">
					<span class="mif-thumbs-up mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">审计</div>
				</div>
			</div>
	</div>

	<div class="metro level-2-3" style="display: none">
			<div class="tile tile-wide tile-big-y bg-lightOlive submenu" privilegeid="30801">
				<div class="tile-content iconic">
					<span class="mif-wifi-connect mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">在线统计</div>
				</div>
			</div>
			<div class="tile tile-wide tile-big-y bg-lightRed submenu" privilegeid="30802">
				<div class="tile-content iconic">
					<span class="mif-play mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">播放统计</div>
				</div>
			</div>
			<div class="tile tile-wide tile-big-y bg-yellow submenu-return">
				<div class="tile-content iconic">
					<span class="mif-undo mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">返回</div>
				</div>
			</div>
	</div>

	<div class="metro level-2-4" style="display: none">
			<div class="tile tile-wide-x tile-big-y bg-cobalt submenu" privilegeid="30901">
				<div class="tile-content iconic">
					<span class="mif-display mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">操作员</div>
				</div>
			</div>
			<div class="tile tile-wide tile-wide-y bg-lime submenu-image submenu" privilegeid="30903">
				<div class="tile-content iconic">
					<span class="mif-versions mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">分支机构</div>
				</div>
			</div>
			<div class="tile tile-wide tile-wide-y bg-yellow submenu-return">
				<div class="tile-content iconic">
					<span class="mif-undo mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">返回</div>
				</div>
			</div>
			<div class="tile tile-wide bg-magenta submenu" privilegeid="30902">
				<div class="tile-content iconic">
					<span class="mif-insert-template mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">角色</div>
				</div>
			</div>
			<div class="tile tile-wide bg-violet submenu" privilegeid="30909">
				<div class="tile-content iconic">
					<span class="mif-cog mif-2x fg-white icon"></span>
					<div class="tile-label fg-white">配置</div>
				</div>
			</div>
	</div>

<!-- 
	<div class="copyright">
		<%if (sdomain == null || sdomain.getDescription() == null) { %>
		<%=CommonConfig.CURRENT_APPVERSION + "(" + CommonConfig.CURRENT_DBVERSION + ")"%>, S/N：<%=com.broadvideo.pixsignage.common.CommonConfig.SYSTEM_ID %><br/>
		<%=CommonConfig.SYSTEM_COPYRIGHT%> <%=CommonConfig.SYSTEM_ICP%><br/>	
		<%} else { %>
		©<%=sdomain.getDescription()%>
		<%} %>
	</div>
 -->
 
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
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-login-viewsonic.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
	jQuery(document).ready(function() {
		Metronic.init();
		Login.init('<%=subsystem%>');
		$('.pix-language').click(function(event){
			event.preventDefault();
			var language = $(event.target).attr('data-id');
			document.location.href="index_viewsonic.jsp?locale=" + language;
		});
	});
</script>
<!-- END JAVASCRIPTS -->
</body>
</html>