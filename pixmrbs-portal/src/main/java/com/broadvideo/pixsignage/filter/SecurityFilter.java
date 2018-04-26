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

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.broadvideo.pixsignage.service.CmsSSOServiceBuilder;

public class SecurityFilter implements Filter {
	private Logger logger = LoggerFactory.getLogger(getClass());

	protected FilterConfig filterConfig = null;
	private List<String> excludeLoginURLs = new ArrayList<String>();

	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		final String servletPath = request.getServletPath();
		for (int i = 0; i < excludeLoginURLs.size(); i++) {
			if (servletPath.matches(excludeLoginURLs.get(i))) {
				logger.info("exclude path({})", excludeLoginURLs.get(i));
				chain.doFilter(request, response);
				return;
			}
		}
		String userAccount = (String) request.getSession().getAttribute("UserAccount");
		if (StringUtils.isBlank(userAccount)) {
			logger.error("No login request({}),redirect login page....", request.getRequestURI());
			response.getWriter().write(CmsSSOServiceBuilder.buildSSOLoginHtml());
			response.getWriter().flush();
			return;
		} else {
			if (servletPath.indexOf("/login.jsp") != -1) {
				response.sendRedirect("index.jsp");
			}

		}
		chain.doFilter(request, response);
	}

	public void destroy() {
		excludeLoginURLs.clear();
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
		excludeLoginURLs.add("/loginCallback");

	}


}
