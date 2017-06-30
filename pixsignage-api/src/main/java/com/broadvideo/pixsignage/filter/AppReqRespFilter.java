package com.broadvideo.pixsignage.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

/**
 * Version Check and Authentictation Check. Add extra headers in resposne.
 * 
 *
 */

public class AppReqRespFilter implements Filter {

	public static final String X_API_VERSION = "X-API-Version";
	public static final String BASIC_AUTH = "Authorization";
	public static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
	public static final String ACCESS_CONTROL_ALLOW_HEADERS = "Access-Control-Allow-Headers";
	public static final String ACCESS_CONTROL_EXPOSE_HEADERS = "Access-Control-Expose-Headers";
	public static final String ACCESS_CONTROL_ALLOW_METHODS = "Access-Control-Allow-Methods";

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException {

		HttpServletResponse httpResp = (HttpServletResponse) response;
		httpResp.addHeader(ACCESS_CONTROL_ALLOW_ORIGIN, "*");
		httpResp.addHeader(ACCESS_CONTROL_ALLOW_HEADERS, "content-type, Authorization");
		httpResp.addHeader(ACCESS_CONTROL_ALLOW_METHODS, "GET,HEAD,POST,PUT,DELETE");
		httpResp.addHeader(ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization");
		chain.doFilter(request, response);

	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}



}
