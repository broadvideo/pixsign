<%@page import="java.util.List"%> 
<%@page import="java.util.ArrayList"%> 
<%@page import="com.broadvideo.pixsignage.domain.Staff"%> 
<%@page import="com.broadvideo.pixsignage.domain.Privilege"%>
<%@page import="com.broadvideo.pixsignage.domain.Org"%> 
<%@page import="com.broadvideo.pixsignage.common.SessionConstants"%> 

<%
	String currentPrivilegeid = request.getParameter("CurrentP");
	if (currentPrivilegeid == null) {
		currentPrivilegeid = "";
	}
	String parentPrivilegeid = "" + request.getParameter("ParentP");
	if (parentPrivilegeid == null) {
		parentPrivilegeid = "";
	}

	List<Privilege> pList = (List<Privilege>)session.getAttribute(SessionConstants.SESSION_PRIVILEGES);
	
	Staff staff = (Staff)session.getAttribute(SessionConstants.SESSION_STAFF);
	List<Privilege> myPrivilegeList = staff.getPrivileges();
	boolean superFlag = false;
	List<Integer> myPrivilegeidList = new ArrayList<Integer>();
	for (int i=0; i<myPrivilegeList.size(); i++) {
		myPrivilegeidList.add(myPrivilegeList.get(i).getPrivilegeid());
		if (myPrivilegeList.get(i).getPrivilegeid() == 0) {
			superFlag = true; 
		}
	}
	
	Org session_org = (Org)session.getAttribute(SessionConstants.SESSION_ORG);
%>

<!-- BEGIN THEME STYLES -->
<link href="/pixsignage-static/global/css/components.css" id="style_components" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/css/plugins.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/admin/layout/css/layout.css" rel="stylesheet" type="text/css" />
<link id="style_color" href="/pixsignage-static/admin/layout/css/themes/darkblue.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/admin/layout/css/custom.css" rel="stylesheet" type="text/css" />
<!-- END THEME STYLES -->
	<link rel="shortcut icon" href="../favicon.ico" />

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
						<input type="hidden" name="staff.staffid" value="<%=staff.getStaffid()%>" />
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
				<a href="main.jsp">
				<img src="${base_ctx}/img/logo.png" alt="logo" class="logo-default"/>
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
					<!-- BEGIN USER LOGIN DROPDOWN -->
					<li class="dropdown dropdown-user">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
						<img alt="" class="img-circle" src="${base_ctx}/img/anonymous.jpg"/>
						<span class="username username-hide-on-mobile"><%=staff.getName()%></span>
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
						<a href="main.jsp">
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
							out.println("<a href=\"" + p.getMenuurl()+"?CurrentP="+p.getPrivilegeid() + "\">");
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
											out.println("<a href=\"" + child.getMenuurl()+"?CurrentP="+child.getPrivilegeid()+"&ParentP="+child.getParentid() + "\">" + child.getName() + "</a>");
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
