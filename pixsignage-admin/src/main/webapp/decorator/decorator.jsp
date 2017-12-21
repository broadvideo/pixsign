<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 
<%@include file="/common/session.jsp"%>

<%
response.setHeader("Cache-Control","no-store");
response.setHeader("Pragrma","no-cache");
response.setDateHeader("Expires",0);
%>

<%@page import="java.util.List"%> 
<%@page import="java.util.ArrayList"%> 
<%@page import="com.broadvideo.pixsignage.domain.Privilege"%>
<%@page import="com.broadvideo.pixsignage.common.CommonConfig"%> 

<%@page import="org.springframework.web.context.WebApplicationContext"%> 
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%> 
<%@page import="com.broadvideo.pixsignage.domain.Sdomain"%> 
<%@page import="com.broadvideo.pixsignage.service.SdomainService"%> 


<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>Digital Signage</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta content="" name="description" />
<meta content="" name="author" />
<meta name="MobileOptimized" content="320">
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->
<script type="text/javascript">
   var res="${static_ctx}";
   var ctx="${base_ctx}";
</script>
<!-- BEGIN PAGE LEVEL STYLES -->
<sitemesh:write property='head'/>
<!-- END PAGE LEVEL STYLES -->

<%
	ServletContext servletContext = this.getServletContext();
	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
	SdomainService sdomainService = (SdomainService) ctx.getBean("sdomainService");
	Sdomain sdomain = sdomainService.selectByServername(request.getServerName());
	if (sdomain == null) {
		sdomain = sdomainService.selectByServername("default");
	}
	String theme = sdomain.getTheme();
	String mode = "default";
	if (sdomain.getIndexpage().equals("index_viewsonic.jsp")) {
		mode = "viewsonic";
	}
	
	String currentPrivilegeid = request.getParameter("CurrentP");
	if (currentPrivilegeid == null) {
		currentPrivilegeid = "";
	}
	String parentPrivilegeid = "" + request.getParameter("ParentP");
	if (parentPrivilegeid == null) {
		parentPrivilegeid = "";
	}

	List<Privilege> pList = (List<Privilege>)session.getAttribute(CommonConstants.SESSION_PRIVILEGES);
	
	List<Privilege> myPrivilegeList = session_staff.getPrivileges();
	boolean superFlag = false;
	List<Integer> myPrivilegeidList = new ArrayList<Integer>();
	for (int i=0; i<myPrivilegeList.size(); i++) {
		myPrivilegeidList.add(myPrivilegeList.get(i).getPrivilegeid());
		if (myPrivilegeList.get(i).getPrivilegeid() == 0) {
			superFlag = true; 
		}
	}
%>

<!-- BEGIN THEME STYLES -->
<link href="${static_ctx}/global/css/components.css" id="style_components" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/css/plugins.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/admin/layout/css/layout.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/admin/layout/css/themes/<%=theme%>.css" rel="stylesheet" type="text/css" id="style_color" />
<!-- END THEME STYLES -->
<link rel="shortcut icon" href="../favicon.ico" />

<style type="text/css">
.hide-orgtype-1 { 
} 
.hide-orgtype-2 {
  display: none !important; 
}
<% if (!mode.equals("default")) { %>
.page-content-wrapper .page-content {
  margin-left: 0 !important;
}
<% } %>
</style>

<script>
function hasPrivilege(privilegeid) {
	var myPrivilegeidList = [];
	<%for (int i=0; i<myPrivilegeList.size(); i++) {%>
		myPrivilegeidList.push(<%=myPrivilegeList.get(i).getPrivilegeid()%>);
	<%}%>
	
	if (myPrivilegeidList.indexOf(0) >= 0 || myPrivilegeidList.indexOf(privilegeid) >= 0) {
		return true;
	}
	return false;
}
</script>

</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="page-header-fixed page-quick-sidebar-over-content">

	<div id="ChangePwdModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<form id="ChangePwdForm" class="form-horizontal form-bordered form-row-stripped">
						<input type="hidden" name="staff.staffid" value="<%=session_staff.getStaffid()%>" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.oldpassword"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="password" class="form-control" name="staff.oldpassword" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.newpassword"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="password" id="password" class="form-control" name="staff.password" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="global.newpassword"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="password" class="form-control" name="staff.password2" />
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
					<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<!-- BEGIN HEADER -->
	<div class="page-header navbar navbar-fixed-top">
		<!-- BEGIN HEADER INNER -->
		<div class="page-header-inner">
			<!-- BEGIN LOGO -->  
			<div class="page-logo">
				<a href="/pixsignage/">
				<%
					if (session_org != null && session_org.getLogo().length() > 0) {
				%>
				<img src="/pixsigdata<%=session_org.getLogo()%>" height="40" alt="logo" />
				<%
					} else if (sdomain != null) {
				%>
				<img src="/pixsigdata/sdomain/<%=sdomain.getCode()%>/logo.png?t=1" height="40" alt="logo" />
				<%
					} else {
				%>
				<img src="${base_ctx}/img/logo-default.png?t=1" height="40" alt="logo" />
				<%
					}
				%>
				</a>
				<div class="menu-toggler sidebar-toggler hide">
				</div>
			</div>
			<!-- END LOGO -->
			<!-- BEGIN RESPONSIVE MENU TOGGLER -->
			<a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
			</a>
			<!-- END RESPONSIVE MENU TOGGLER -->
			<!-- BEGIN TOP NAVIGATION MENU -->
			<div class="top-menu">
				<ul class="nav navbar-nav pull-right">
					<li class="dropdown dropdown-user">
						<div class="dropdown-toggle" style="color:#ffffff;">
						<% 
						if (session_staff.getSubsystem().equals("0")) {
						%>
						<%
						} else if (session_staff.getSubsystem().equals("1")) {
						%>
						<%=session_staff.getVsp().getName()%>
						<%
						} else if (session_staff.getSubsystem().equals("2")) {
						%>
						<%=session_staff.getOrg().getName()%> - <%=session_staff.getBranch().getName()%>
						<%
						}
						%>
						</div>
					</li>
					<!-- BEGIN USER LOGIN DROPDOWN -->
					<li class="dropdown dropdown-user">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
						<img alt="" class="img-circle" src="${base_ctx}/img/anonymous.jpg"/>
						<span class="username username-hide-on-mobile"><%=session_staff.getName()%></span>
						<i class="fa fa-angle-down"></i>
						</a>
						<ul class="dropdown-menu dropdown-menu-default">
							<li><a href="javascript:;" id="change_password"><i class="fa fa-lock"></i> <spring:message code="global.chanegepassword"/></a></li>
							<li class="divider"></li>
							<li><a href="javascript:;" id="trigger_fullscreen"><i class="fa fa-arrows"></i> <spring:message code="global.fullscreen"/></a></li>
							<li><a href="logout.action"><i class="fa fa-key"></i> <spring:message code="global.logout"/></a></li>
						</ul>
					</li>
					<!-- END USER LOGIN DROPDOWN -->
				</ul>
			</div>
			<!-- END TOP NAVIGATION MENU -->
		</div>
		<!-- END HEADER INNER -->
	</div>
	<!-- END HEADER -->
	
	<div class="clearfix"></div>
	
	<!-- BEGIN CONTAINER -->
	<div class="page-container">
		<% if (mode.equals("default")) { %>
		<!-- BEGIN SIDEBAR -->
		<div class="page-sidebar-wrapper">
			<div class="page-sidebar navbar-collapse collapse">
				<!-- BEGIN SIDEBAR MENU -->        
				<ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
					<li class="sidebar-toggler-wrapper">
						<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
						<div class="sidebar-toggler"></div>
						<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
					</li>
					<li class="start <%= currentPrivilegeid.equals("")? "active" : "" %> ">
						<a href="/pixsignage/<%=subsystem%>/main.jsp">
						<i class="fa fa-home"></i> 
						<span class="title"><spring:message code="global.dashboard"/></span>
						<span class="selected"></span>
						</a>
					</li>
				<%

				for (Privilege p : pList) {
					if (!superFlag && myPrivilegeidList.indexOf(p.getPrivilegeid()) < 0) {
						continue;
					}
					if (p.getParent() == null && p.getType().equals("1")) {
						String liClass = "";
						if (parentPrivilegeid.equals(p.getPrivilegeid().toString()) || currentPrivilegeid.equals(p.getPrivilegeid().toString())) {
							liClass = "active";
						}
						
						if (p.getMenuurl() != null && p.getMenuurl().length() > 0) {
							out.println("<li class=\"" + liClass + "\">");
							out.println("<a href=\"/pixsignage/" + subsystem + "/" + p.getMenuurl()+"?CurrentP="+p.getPrivilegeid() + "\">");
							out.println("<i class=\"fa " + p.getIcon() + "\"></i>");
							out.println("<span class=\"title\">" + p.getName() + "</span>");
							if (liClass.equals("active")) {
								out.println("<span class=\"selected\"></span>");
							}
							out.println("</a>");
							out.println("</li>");						
						} else {							
							out.println("<li class=\"" + liClass + "\">");
							out.println("<a href=\"javascript:;\">");
							out.println("<i class=\"fa " + p.getIcon() + "\"></i>");
							out.println("<span class=\"title\">" + p.getName() + "</span>");
							out.println("<span class=\"arrow \"></span>");
							out.println("</a>");
							out.println("<ul class=\"sub-menu\">");
							for (Privilege child : p.getChildren()) {
								if (superFlag || myPrivilegeidList.indexOf(child.getPrivilegeid()) >= 0) {
									if (child.getType().equals("1")) {
										liClass = "";
										if (currentPrivilegeid.equals(child.getPrivilegeid().toString())) {
											liClass = "active";
										}
										if (superFlag || myPrivilegeidList.indexOf(child.getPrivilegeid()) >= 0) {
											out.println("<li class=\"" + liClass + "\">");
											out.println("<a href=\"/pixsignage/" + subsystem + "/" + child.getMenuurl()+"?CurrentP="+child.getPrivilegeid()+"&ParentP="+child.getParentid() + "\">" + child.getName() + "</a>");
										} else {
											out.println("<li class=\"disabled-link tooltips\" data-original-title=\"<spring:message code=\"global_noprivilege\"/>\">");
											out.println("<a href=\"#\" class=\"disabled-link\"><span class=\"disable-target\">" + child.getName() + "</span></a>");
										}
										out.println("</li>");
									}
								}
							}
							out.println("</ul>");
							out.println("</li>");
						}
					}
				}
				
				%>

				</ul>
				<!-- END SIDEBAR MENU -->
			</div>
		</div>
		<!-- END SIDEBAR -->
		<% } %>

		<sitemesh:write property='body'/>
	</div>
	
	<div class="page-footer">
		<div class="page-footer-inner">
			<%if (session_org == null || session_org.getCopyright() == null || session_org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;<%=CommonConfig.SYSTEM_COPYRIGHT%>
			<%} else { %>
			©<%=session_org.getCopyright()%>
			<%} %>
		</div>
		<div class="scroll-to-top">
			<i class="icon-arrow-up"></i>
		</div>
	</div>
	
<!-- BEGIN CORE PLUGINS -->   
<!--[if lt IE 9]>
<script src="${static_ctx}/global/plugins/respond.min.js"></script>
<script src="${static_ctx}/global/plugins/excanvas.min.js"></script> 
<![endif]-->   
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->

<sitemesh:write property='div.SiteMethJavaScript'/>

</body>
</html>
