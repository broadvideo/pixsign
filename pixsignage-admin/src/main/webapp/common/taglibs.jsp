<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="base_ctx" value="/pixsignage" />
<c:set var="static_ctx" value="/pixsignage-static" />
<c:set var="locale"><%=org.springframework.context.i18n.LocaleContextHolder.getLocale().toString() %></c:set>

<spring:message code="global_username" var="global_username"/>
<spring:message code="global_password" var="global_password"/>
<spring:message code="global_submit" var="global_submit"/>
<spring:message code="global_close" var="global_close"/>
<spring:message code="global_cancel" var="global_cancel"/>
<spring:message code="global_more" var="global_more"/>
<spring:message code="global_oldpassword" var="global_oldpassword"/>
<spring:message code="global_newpassword" var="global_newpassword"/>
<spring:message code="global_chanegepassword" var="global_chanegepassword"/>
<spring:message code="global_fullscreen" var="global_fullscreen"/>
<spring:message code="global_logout" var="global_logout"/>
<spring:message code="global_dashboard" var="global_dashboard"/>
<spring:message code="global_noprivilege" var="global_noprivilege"/>
<spring:message code="global_copyright" var="global_copyright"/>
