<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Main Page</title>
</head>
<body>
<p style="display:block;height:20px;">
<a style="float:right;padding-left:50px;" href="/sampleapp/logoutServlet">退出</a>
</p>
<hr/>
  <p style="text-align:center;">Main page for logined user.  </p>
  <p/>
  <p>
  accessToken:${sessionScope.accessToken}
  
  </p>
  <p>
   userInfo: ${sessionScope.userInfo}
  </p>
  
</body>
</html>