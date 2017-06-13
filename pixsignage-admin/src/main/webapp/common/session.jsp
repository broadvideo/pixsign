<%@page import="com.broadvideo.pixsignage.common.CommonConstants"%> 
<%@page import="com.broadvideo.pixsignage.domain.Vsp"%> 
<%@page import="com.broadvideo.pixsignage.domain.Org"%> 
<%@page import="com.broadvideo.pixsignage.domain.Staff"%> 

<%
Vsp session_vsp = (Vsp)session.getAttribute(CommonConstants.SESSION_VSP);
Org session_org = (Org)session.getAttribute(CommonConstants.SESSION_ORG);
Staff session_staff = (Staff)session.getAttribute(CommonConstants.SESSION_STAFF);
%>
