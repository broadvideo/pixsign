package com.broadvideo.signage.filter;

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

public class SecurityFilter implements Filter {

	protected FilterConfig filterConfig = null;
	private String redirectURL = null;
	private List<String> excludeLoginUrls = new ArrayList<String>();
	private String sessionKey = null;

	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;

		HttpSession session = request.getSession();

		if (sessionKey == null) {
			chain.doFilter(request, response);
			return;
		}

		String resource = request.getServletPath();

		for (int i = 0; i < excludeLoginUrls.size(); i++) {
			if (resource.matches(excludeLoginUrls.get(i))) {
				chain.doFilter(request, response);
				return;
			}
		}

		if (session.getAttribute(sessionKey) == null) {
			response.sendRedirect(request.getContextPath() + redirectURL);
			return;
		}

		chain.doFilter(request, response);
	}

	public void destroy() {
		excludeLoginUrls.clear();
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
		redirectURL = filterConfig.getInitParameter("redirectUrl");
		sessionKey = filterConfig.getInitParameter("checkSessionKey");
		String s = filterConfig.getInitParameter("excludeLoginUrls");

		if (excludeLoginUrls != null) {
			StringTokenizer st = new StringTokenizer(s, ";");
			excludeLoginUrls.clear();
			while (st.hasMoreTokens()) {
				excludeLoginUrls.add(st.nextToken());
			}
		}
	}
}
