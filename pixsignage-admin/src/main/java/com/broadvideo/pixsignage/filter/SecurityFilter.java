package com.broadvideo.pixsignage.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Sdomain;
import com.broadvideo.pixsignage.service.SdomainService;

public class SecurityFilter implements Filter {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private List<String> excludeLoginURLs = new ArrayList<String>();
	private WebApplicationContext springContext;

	public void init(FilterConfig config) throws ServletException {
		springContext = WebApplicationContextUtils.getWebApplicationContext(config.getServletContext());

		excludeLoginURLs.add("/admin.jsp");
		excludeLoginURLs.add("/error.jsp");
		excludeLoginURLs.add("/preview/preview.jsp");
		excludeLoginURLs.add("/login.action");
		excludeLoginURLs.add("/org/educloudinit.action");
		excludeLoginURLs.add("/org/educloudcallback.action");
	}

	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;

		HttpSession session = request.getSession();

		String servletPath = request.getServletPath();
		for (int i = 0; i < excludeLoginURLs.size(); i++) {
			if (servletPath.matches(excludeLoginURLs.get(i)) || servletPath.startsWith("/index")) {
				chain.doFilter(request, response);
				return;
			}
		}

		SdomainService sdomainService = (SdomainService) springContext.getBean("sdomainService");
		Sdomain sdomain = sdomainService.selectByServername(request.getServerName());
		String redirectURL = "/index.jsp";
		if (sdomain != null) {
			redirectURL = "/" + sdomain.getIndexpage();
		} else {
			sdomain = sdomainService.selectByServername("default");
			redirectURL = "/" + sdomain.getIndexpage();
		}

		if (session.getAttribute(CommonConstants.SESSION_TOKEN) == null
				|| session.getAttribute(CommonConstants.SESSION_SUBSYSTEM) == null) {
			if (request.getHeader("x-requested-with") != null
					&& request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")) {
				response.setHeader("sessionstatus", "timeout");
			} else {
				response.sendRedirect(request.getContextPath() + redirectURL);
			}
			return;
		}

		if (session.getAttribute(CommonConstants.SESSION_SUBSYSTEM).equals(CommonConstants.SUBSYSTEM_SYS)
				&& !servletPath.startsWith("/sys/")) {
			response.sendRedirect(request.getContextPath() + redirectURL);
			return;
		}
		if (session.getAttribute(CommonConstants.SESSION_SUBSYSTEM).equals(CommonConstants.SUBSYSTEM_VSP)
				&& !servletPath.startsWith("/vsp/")) {
			response.sendRedirect(request.getContextPath() + redirectURL);
			return;
		}
		if (session.getAttribute(CommonConstants.SESSION_SUBSYSTEM).equals(CommonConstants.SUBSYSTEM_ORG)
				&& !servletPath.startsWith("/org/")) {
			response.sendRedirect(request.getContextPath() + redirectURL);
			return;
		}

		chain.doFilter(request, response);

	}

	public void destroy() {
		excludeLoginURLs.clear();
	}

}
