package com.broadvideo.pixsignage.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

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
import com.broadvideo.pixsignage.common.CommonConstants;

public class SecurityFilter implements Filter {
	private Logger logger = LoggerFactory.getLogger(getClass());

	protected FilterConfig filterConfig = null;
	private String orgRedirectURL = null;
	private String vspRedirectURL = null;
	private List<String> excludeLoginURLs = new ArrayList<String>();

	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;

		HttpSession session = request.getSession();

		String servletPath = request.getServletPath();
		logger.debug("Servlet path: " + servletPath);
		for (int i = 0; i < excludeLoginURLs.size(); i++) {
			if (servletPath.matches(excludeLoginURLs.get(i))) {
				chain.doFilter(request, response);
				return;
			}
		}

		if (session.getAttribute(CommonConstants.SESSION_TOKEN) == null
				|| session.getAttribute(CommonConstants.SESSION_SUBSYSTEM) == null) {
			if (servletPath.startsWith("/vsp/")) {
				response.sendRedirect(request.getContextPath() + vspRedirectURL);
			} else {
				response.sendRedirect(request.getContextPath() + orgRedirectURL);
			}
			return;
		}

		if (session.getAttribute(CommonConstants.SESSION_SUBSYSTEM).equals(CommonConstants.SUBSYSTEM_ORG)
				&& servletPath.startsWith("/vsp/")) {
			response.sendRedirect(request.getContextPath() + vspRedirectURL);
			return;
		}
		if (session.getAttribute(CommonConstants.SESSION_SUBSYSTEM).equals(CommonConstants.SUBSYSTEM_VSP)
				&& servletPath.startsWith("/org/")) {
			response.sendRedirect(request.getContextPath() + orgRedirectURL);
			return;
		}

		chain.doFilter(request, response);
	}

	public void destroy() {
		excludeLoginURLs.clear();
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
		orgRedirectURL = filterConfig.getInitParameter("orgRedirectURL");
		vspRedirectURL = filterConfig.getInitParameter("vspRedirectURL");

		String s = filterConfig.getInitParameter("excludeLoginURLs");
		if (excludeLoginURLs != null) {
			StringTokenizer st = new StringTokenizer(s, ";");
			excludeLoginURLs.clear();
			while (st.hasMoreTokens()) {
				excludeLoginURLs.add(st.nextToken());
			}
		}
	}
}
