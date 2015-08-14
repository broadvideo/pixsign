<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String layoutid = request.getParameter("layoutid");
if (layoutid == null || layoutid.equals("")) {
	layoutid = "0";
}
%>

<!DOCTYPE html>
<html>
<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<title>Preview for Layout 5</title>
<link rel="stylesheet" type="text/css" href="../local/css/html-preview.css" />
<script type="text/javascript" src="../assets/plugins/jquery-1.10.2.min.js"></script>
<script type="text/JavaScript" src="../local/scripts/preview/html5Preloader.js"></script>
<script type="text/JavaScript" src="../local/scripts/preview/html-preview.js"></script>
<link rel="shortcut icon" href="../local/img/favicon.ico" />
</head>

<body onload="dsInit(<%=layoutid%>)">
	<div id="player">
		<div id="info"></div>
		<div id="log"></div>
		<div id="screen">
			<div id="splash">
				<div id="loader"></div>
				<div id="loaderCaption">
					<p>正在载入...</p>
				</div>
			</div>
			<div id="end">
				<a href="javascript:history.go(0)" style="text-decoration: none; color: #ffffff">重新预览?</a>
			</div>
		</div>

	</div>
</body>
</html>
