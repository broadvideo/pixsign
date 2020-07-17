<%@page language="java" contentType="text/html; charset=UTF-8" 
 import="org.springframework.web.context.WebApplicationContext,
 org.springframework.web.context.support.WebApplicationContextUtils,
 com.broadvideo.pixsignage.service.SchoolclassService,com.supercat.supertrain.common.PageInfo,com.supercat.supertrain.common.PageResult,java.util.*"
pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>

</head>

<body>

<%

WebApplicationContext ctx= WebApplicationContextUtils.getWebApplicationContext( request.getSession().getServletContext());

 SchoolclassService _service=ctx.getBean(SchoolclassService.class);
 PageInfo pageInfo=new PageInfo();
 pageInfo.setLength(10);
 pageInfo.setStart(0);
 PageResult pageResult=_service.getSchoolclassList(null, pageInfo, 1);
 List<Map<String, Object>> results=pageResult.getResult();
 for(Map<String,Object> result : results){
	 
	 byte[] databytes=(byte[])result.get("classroomid");
	 String dataStr=new String(databytes);
	 out.println("######schoolclassid:"+result.get("schoolclassid")+",classroomid:"+result.get("classroomid").getClass().getCanonicalName()+",dataStr:"+dataStr);
	 
 }
 
 






%>
	
</body>

</html>
