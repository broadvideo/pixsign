<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no">
	
	<link rel="stylesheet" href="/pixsignage-page/plugin/font-awesome/css/font-awesome.min.css"/>
	<link rel="stylesheet" href="/pixsignage-page/plugin/animate.css/animate.min.css"/>
	<link rel="stylesheet" href="/pixsignage-page/plugin/bxslider/jquery.bxslider.min.css"/>

	<link rel="stylesheet" href="/pixsignage-page/module/daily-course/daily-course.css"/>
	<link rel="stylesheet" href="/pixsignage-page/module/weekly-course/weekly-course.css"/>
	<link rel="stylesheet" href="/pixsignage-page/module/attendance/attendance.css"/>
	<link rel="stylesheet" href="/pixsignage-page/module/home-school/home-school.css"/>
	<link rel="stylesheet" href="/pixsignage-page/module/exam-notice/exam-notice.css"/>
	<link rel="stylesheet" href="/pixsignage-page/module/personal-info/personal-info.css"/>
	<link rel="stylesheet" href="/pixsignage-page/module/an-capacity/animate-ext.css"/>
	<link rel="stylesheet" href="/pixsignage-page/module/meeting/meeting.css"/>
	
	<link rel="stylesheet" href="pixpage/pixpage.css"/>
</head>

<body>
	<div id="PageDiv" style="position:absolute; top:0; left:0; width:100%; height:100%; "></div>
	
	<script src="/pixsignage-page/plugin/jquery/jquery.min.js" type="text/javascript"></script>
	<script src="/pixsignage-page/plugin/dot/doT.min.js"></script>
	<script src="/pixsignage-page/plugin/moment/moment.min.js"></script>
	<script src="/pixsignage-page/plugin/moment/zh-cn.js"></script>
	<script src="/pixsignage-page/plugin/base64/base64.min.js"></script>
	<script src="/pixsignage-page/plugin/bxslider/jquery.bxslider.min.js"></script>
	<script src="/pixsignage-page/plugin/hammer/hammer.js"></script>
	<script src="/pixsignage-page/plugin/vconsole/vconsole.min.js"></script>
	
	<script src="/pixsignage-page/pixpage/pixpage.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-image.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-video.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-text.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-scroll.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-date.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-web.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-button.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-weather.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-stream.js" type="text/javascript"></script>
	<script src="/pixsignage-page/pixpage/module-other.js" type="text/javascript"></script>

	<script src="/pixsignage-page/module/common/index.js"></script>
	<script src="/pixsignage-page/module/daily-course/index.js"></script>
	<script src="/pixsignage-page/module/weekly-course/index.js"></script>
	<script src="/pixsignage-page/module/attendance/index.js"></script>
	<script src="/pixsignage-page/module/home-school/index.js"></script>
	<script src="/pixsignage-page/module/exam-notice/index.js"></script>
	<script src="/pixsignage-page/module/personal-info/index.js"></script>
	
	<script src="/pixsignage-page/module/an-capacity/an-capacity.js"></script>
	<script src="/pixsignage-page/module/meeting/index.js"></script>
	<script src="/pixsignage-page/module/camera/index.js"></script>
	<script src="/pixsignage-page/module/estate/index.js"></script>

<%
	String content = new String(request.getParameter("content").getBytes("ISO-8859-1"), "UTF-8");
	String diycode = request.getParameter("diycode");
	if (diycode != null && diycode.length() > 0) {
%>
	<script src='/pixsignage-page/module/route-guide/route-guide.js'></script>
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
