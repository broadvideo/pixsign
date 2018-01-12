package biz.videoexpress.pixedx.lmsapi.resource;

import java.io.IOException;

import javax.servlet.ServletContext;
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
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import biz.videoexpress.pixedx.lmsapi.common.AppException;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.service.OrgService;


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

	@Override
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
		String orgcode = servletRequest.getParameter("org_code");
		logger.info("req({}) with orgcode:{}", servletRequest.getRequestURI(), orgcode);
		if (StringUtils.isNotBlank(orgcode)) {
			try{
				ServletContext sc = servletRequest.getSession().getServletContext();
				ApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(servletRequest
						.getSession().getServletContext());
				OrgService orgService = (OrgService) ctx.getBean("orgService");
				Org org = orgService.selectByCode(orgcode);
				sc.setAttribute("orgid", org.getOrgid());
			}catch(Exception ex){
				logger.error("init org error", ex);
			}

		}



	}

	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
			throws IOException {
		responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");
		responseContext.getHeaders().add("Access-Control-Allow-Methods", "*");
		responseContext.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

	}
}
