<%@page import="com.broadvideo.pixsign.common.CommonConstants"%> 
<%@page import="com.broadvideo.pixsign.domain.Org"%> 
<%@page import="com.broadvideo.pixsign.domain.Staff"%> 

<%
Org session_org = (Org)session.getAttribute(CommonConstants.SESSION_ORG);
Staff session_staff = (Staff)session.getAttribute(CommonConstants.SESSION_STAFF);
String subsystem = "";
String mainpage = "";
if (session_staff.getSubsystem().equals("0")) {
	subsystem = "sys";
	mainpage = "sys/main.jsp";
} else if (session_staff.getSubsystem().equals("2")) {
	subsystem = "org";
	mainpage = "org/" + session_org.getMainpage();
}
%>
