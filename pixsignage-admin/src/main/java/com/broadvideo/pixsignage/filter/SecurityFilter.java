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

import com.broadvideo.pixsignage.common.CommonConstants;

public class SecurityFilter implements Filter {
	private Logger logger = LoggerFactory.getLogger(getClass());

	protected FilterConfig filterConfig = null;
	private List<String> excludeLoginURLs = new ArrayList<String>();

	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;

		HttpSession session = request.getSession();

		String servletPath = request.getServletPath();
		for (int i = 0; i < excludeLoginURLs.size(); i++) {
			if (servletPath.matches(excludeLoginURLs.get(i))) {
				chain.doFilter(request, response);
				return;
			}
		}

		String redirectURL = "/index.jsp";

		if (session.getAttribute(CommonConstants.SESSION_TOKEN) == null
				|| session.getAttribute(CommonConstants.SESSION_SUBSYSTEM) == null) {
			response.sendRedirect(request.getContextPath() + redirectURL);
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

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;

		excludeLoginURLs.add("/index.jsp");
		excludeLoginURLs.add("/admin.jsp");
		excludeLoginURLs.add("/error.jsp");
		excludeLoginURLs.add("/login.action");

		excludeLoginURLs.add("/org/educloudinit.action");
		excludeLoginURLs.add("/org/educloudcallback.action");
	}
}
