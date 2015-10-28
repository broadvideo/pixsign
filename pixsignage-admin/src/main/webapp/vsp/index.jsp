<%@page import="com.broadvideo.pixsignage.servlet.SystemInitServlet"%>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
	SystemInitServlet.updateLicense(this.getServletContext());
%>

<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
	<meta charset="utf-8" />
	<title>Pix Signage</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<meta content="" name="description" />
	<meta content="" name="author" />
	<meta name="MobileOptimized" content="320">
	<!-- BEGIN GLOBAL MANDATORY STYLES -->          
	<link href="/pixsignage-static/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
	<link href="/pixsignage-static/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
	<link href="/pixsignage-static/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
	<!-- END GLOBAL MANDATORY STYLES -->
	<!-- BEGIN PAGE LEVEL STYLES --> 
	<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/select2/select2_metro.css" />
	<!-- END PAGE LEVEL SCRIPTS -->
	<!-- BEGIN THEME STYLES --> 
	<link href="/pixsignage-static/css/style-metronic.css" rel="stylesheet" type="text/css"/>
	<link href="/pixsignage-static/css/style.css" rel="stylesheet" type="text/css"/>
	<link href="/pixsignage-static/css/style-responsive.css" rel="stylesheet" type="text/css"/>
	<link href="/pixsignage-static/css/plugins.css" rel="stylesheet" type="text/css"/>
	<link href="/pixsignage-static/css/themes/default.css" rel="stylesheet" type="text/css" id="style_color"/>
	<link href="/pixsignage-static/css/pages/login-soft.css" rel="stylesheet" type="text/css"/>
	<link href="/pixsignage-static/css/custom.css" rel="stylesheet" type="text/css"/>
	<!-- END THEME STYLES -->
	<link rel="shortcut icon" href="../favicon.ico" />
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="login">

	<!-- BEGIN LOGO -->
	<div class="logo">
		<img src="../local/img/logo-big.png" alt="" />  
	</div>
	<!-- END LOGO -->
	<!-- BEGIN LOGIN -->
	<div class="content">
		<!-- 
		<ul  class="nav nav-tabs">
			<li id="li_org" class="active"><a href="#tab_org" data-toggle="tab">企业</a></li>
			<li id="li_vsp" class=""><a href="#tab_vsp" data-toggle="tab">运营商</a></li>
		</ul>
		 -->
		<div  class="tab-content">
			<div class="tab-pane fade" id="tab_org">
				<!-- BEGIN LOGIN FORM -->
				<form id="OrgLoginForm" class="login-form" action="org/login!org" method="post">
					<input type="hidden" name="subsystem" value="2" />
					<h3 class="form-title">企业用户登录：</h3>
					<div class="alert alert-danger display-hide">
						<button class="close" data-close="alert"></button>
						<span>请输入用户名和密码</span>
					</div>
					<div class="form-group">
						<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
						<label class="control-label visible-ie8 visible-ie9">用户名</label>
						<div class="input-icon">
							<i class="fa fa-user"></i>
							<input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="用户名" name="username"/>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label visible-ie8 visible-ie9">密码</label>
						<div class="input-icon">
							<i class="fa fa-lock"></i>
							<input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="密码" name="password"/>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label visible-ie8 visible-ie9">企业编码</label>
						<div class="input-icon">
							<i class="fa fa-lock"></i>
							<input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="企业编码" name="code"/>
						</div>
					</div>
					<div class="form-actions">
						<label class="checkbox"><input type="checkbox" name="remember" value="1"/>记住我</label>
						<button type="submit" class="btn blue pull-right">登录 <i class="m-icon-swapright m-icon-white"></i>
						</button>            
					</div><br></form>
				<!-- END LOGIN FORM -->        
			</div>
			<div class="tab-pane fade active in" id="tab_vsp">
				<!-- BEGIN LOGIN FORM -->
				<form id="VspLoginForm" class="login-form" action="vsp/login!vsp" method="post">
					<input type="hidden" name="subsystem" value="1" />
					<h3 class="form-title">运营商登录：</h3>
					<div class="alert alert-danger display-hide">
						<button class="close" data-close="alert"></button>
						<span>请输入用户名和密码</span>
					</div>
					<div class="form-group">
						<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
						<label class="control-label visible-ie8 visible-ie9">用户名</label>
						<div class="input-icon">
							<i class="fa fa-user"></i>
							<input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="用户名" name="username"/>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label visible-ie8 visible-ie9">密码</label>
						<div class="input-icon">
							<i class="fa fa-lock"></i>
							<input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="密码" name="password"/>
						</div>
					</div>
					<!-- 
					<div class="form-group">
						<label class="control-label visible-ie8 visible-ie9">运营商编码</label>
						<div class="input-icon">
							<i class="fa fa-lock"></i>
							<input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="运营商编码" name="code"/>
						</div>
					</div>
					 -->
					<div class="form-actions">
						<label class="checkbox"><input type="checkbox" name="remember" value="1"/>记住我</label>
						<button type="submit" class="btn blue pull-right">登录 <i class="m-icon-swapright m-icon-white"></i>
						</button>            
					</div><br></form>
				<!-- END LOGIN FORM -->        
			</div>
		</div>					
	</div>
	<!-- END LOGIN -->
	<!-- BEGIN COPYRIGHT -->
	<div class="copyright">
		©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;&nbsp;明视迅达(VideoExpress)&nbsp;&nbsp;粤ICP备14037592号-1
	</div>
	<!-- END COPYRIGHT -->
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
	<!-- BEGIN CORE PLUGINS -->   
	<!--[if lt IE 9]>
	<script src="/pixsignage-static/plugins/respond.min.js"></script>
	<script src="/pixsignage-static/plugins/excanvas.min.js"></script> 
	<![endif]-->   
	<script src="/pixsignage-static/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/bootstrap-hover-dropdown/twitter-bootstrap-hover-dropdown.min.js" type="text/javascript" ></script>
	<script src="/pixsignage-static/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/jquery.blockui.min.js" type="text/javascript"></script>  
	<script src="/pixsignage-static/plugins/jquery.cookie.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/uniform/jquery.uniform.min.js" type="text/javascript" ></script>
	<!-- END CORE PLUGINS -->
	<!-- BEGIN PAGE LEVEL PLUGINS -->
	<script src="/pixsignage-static/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/backstretch/jquery.backstretch.min.js" type="text/javascript"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/select2/select2.min.js"></script>
	<!-- END PAGE LEVEL PLUGINS -->
	<!-- BEGIN PAGE LEVEL SCRIPTS -->
	<script src="/pixsignage-static/scripts/app.js" type="text/javascript"></script>
	<script src="../local/scripts/pix-login.js" type="text/javascript"></script>      
	<!-- END PAGE LEVEL SCRIPTS --> 
	<script>
		jQuery(document).ready(function() {     
		  App.init();
		  Login.init();
		});
	</script>
	<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>