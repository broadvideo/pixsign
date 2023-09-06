<%@page import="com.broadvideo.pixsignage.servlet.SystemInitServlet"%>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>Welcome</title>
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
<link href="${static_ctx}/admin/pages/css/login-soft.css" rel="stylesheet" type="text/css" />
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

<body class="login" style="background-image: url(/pixsignage/img/bg-csig.jpg);background-size:cover;overflow-x:hidden;overflow-y:hidden">
	<!-- BEGIN LOGO -->
	<div align="center" style="margin-top:20px;">
		<img src="/pixsigdata/sdomain/csig/logo.png?t=1" height="100" alt="" />
	</div>
	
	<div class="row" style="margin-top:100px;">
		<div class="col-md-2">
		</div>
		<div class="col-md-8">
			<div class="row">
				<div class="col-md-4">
					<a href="http://csig.pixsign.net/pixsignage/index.jsp">
						<img src="/pixsignage/img/csig-button1.png" width="100%" />
					</a>
				</div>
				<div class="col-md-4">
					<a href="http://csig.pixsign.net/pixschool/index.jsp">
						<img src="/pixsignage/img/csig-button2.png" width="100%" />
					</a>
				</div>
				<div class="col-md-4">
					<a href="http://csig.pixsign.net/pixent/index.jsp">
						<img src="/pixsignage/img/csig-button3.png" width="100%" />
					</a>
				</div>
			</div>
		</div>
		<div class="col-md-2">
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
<!-- END PAGE LEVEL SCRIPTS -->
<script>
	jQuery(document).ready(function() {
	});
</script>
<!-- END JAVASCRIPTS -->
</body>
</html>