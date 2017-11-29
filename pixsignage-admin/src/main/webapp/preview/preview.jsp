<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no">
	
	<link rel="stylesheet" href="plugin/font-awesome/css/font-awesome.min.css"/>
	<link rel="stylesheet" href="plugin/animate.css/animate.min.css"/>
	<link rel="stylesheet" href="plugin/bxslider/jquery.bxslider.min.css"/>

	<link rel="stylesheet" href="module/daily-course/daily-course.css"/>
	<link rel="stylesheet" href="module/weekly-course/weekly-course.css"/>
	<link rel="stylesheet" href="module/attendance/attendance.css"/>
	<link rel="stylesheet" href="module/home-school/home-school.css"/>
	<link rel="stylesheet" href="module/exam-notice/exam-notice.css"/>
	<link rel="stylesheet" href="module/an-capacity/animate-ext.css"/>
	<link rel="stylesheet" href="module/meeting/meeting.css"/>
	
	<link rel="stylesheet" href="pixpage/pixpage.css"/>
</head>

<body>
	<div id="PageDiv" style="position:absolute; top:0; left:0; width:100%; height:100%; "></div>
	
	<script src="plugin/jquery/jquery.min.js" type="text/javascript"></script>
	<script src="plugin/dot/doT.min.js"></script>
	<script src="plugin/moment/moment.min.js"></script>
	<script src="plugin/base64/base64.min.js"></script>
	<script src="plugin/bxslider/jquery.bxslider.min.js"></script>
	<script src="plugin/hammer/hammer.js"></script>
	
	<script src="pixpage/pixpage.js" type="text/javascript"></script>
	<script src="pixpage/module-image.js" type="text/javascript"></script>
	<script src="pixpage/module-video.js" type="text/javascript"></script>
	<script src="pixpage/module-text.js" type="text/javascript"></script>
	<script src="pixpage/module-scroll.js" type="text/javascript"></script>
	<script src="pixpage/module-date.js" type="text/javascript"></script>
	<script src="pixpage/module-web.js" type="text/javascript"></script>
	<script src="pixpage/module-button.js" type="text/javascript"></script>
	<script src="pixpage/module-other.js" type="text/javascript"></script>

	<script src="module/common/index.js"></script>
	<script src="module/daily-course/index.js"></script>
	<script src="module/weekly-course/index.js"></script>
	<script src="module/attendance/index.js"></script>
	<script src="module/home-school/index.js"></script>
	<script src="module/exam-notice/index.js"></script>
	<script src="module/an-capacity/an-capacity.js"></script>
	<script src="module/meeting/index.js"></script>

<%
	String content = new String(request.getParameter("content").getBytes("ISO-8859-1"), "UTF-8");
	String diycode = request.getParameter("diycode");
	if (diycode != null && diycode.length() > 0) {
%>
	<script src='module/route-guide/route-guide.js'></script>
	<script src='/pixsigdata/diy/<%=diycode%>/diy.data.js'></script>
<%
	}
%>

	<script type="text/javascript">
		var Page = <%=content%>;
		PixPage.init('preview');

		$(window).resize(function(e) {
			PixPage.resize();
		});
	</script>

</body>
</html>
