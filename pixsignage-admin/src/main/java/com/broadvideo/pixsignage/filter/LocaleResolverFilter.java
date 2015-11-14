package com.broadvideo.pixsignage.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.context.i18n.LocaleContextHolder;

/**
 * 本地化拦截器.
 */
public class LocaleResolverFilter extends AbstractLocaleResolverFilter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		super.handerFilter((HttpServletRequest) request, response);
		chain.doFilter(request, response);
		// Reset thread-bound LocaleContext.
		LocaleContextHolder.resetLocaleContext();
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		super.init(filterConfig);
	}

	@Override
	public void destroy() {
	}

}
