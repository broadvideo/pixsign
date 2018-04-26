package com.broadvideo.pixcourse.resource;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.broadvideo.pixcourse.common.AppException;

/**
 * Version Check and Authentication Check. Add extra headers in response.
 * 
 * @author foxty
 *
 */
@Provider
public class AppReqRespFilter implements ContainerRequestFilter, ContainerResponseFilter {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	public static final String X_API_VERSION = "X-API-Version";
	public static final String BASIC_AUTH = "Authorization";
	@Context
	private HttpServletRequest servletRequest;
	@Context
	private HttpServletResponse servletResponse;

	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
			throws IOException {
		responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");
		responseContext.getHeaders().add("Access-Control-Allow-Methods", "*");
		responseContext.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
	}

	public void filter(ContainerRequestContext requestContext) throws IOException {
		// Version Check
		String clientReqApiVersion = requestContext.getHeaderString(X_API_VERSION);
		String[] supportedVersions = null;// conf.getRestServSuportVersions();
		boolean supported = true; // ArrayUtils.contains(supportedVersions,
									// clientReqApiVersion);
		String supportedList = StringUtils.join(supportedVersions, ",");
		if (!supported) {
			throw new AppException("Unsupported Version " + clientReqApiVersion
					+ " is not supported, supported versions : " + supportedList);
		}
		//
		logger.info("req({})", servletRequest.getRequestURI());

	}
}
