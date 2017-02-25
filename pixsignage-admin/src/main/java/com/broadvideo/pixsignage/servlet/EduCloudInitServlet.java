package com.broadvideo.pixsignage.servlet;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.util.EduCloudUtil;

@SuppressWarnings("serial")
public class EduCloudInitServlet extends HttpServlet {
	private Logger logger = LoggerFactory.getLogger(getClass());

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		ServletContext servletContext = this.getServletContext();
		WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
		ConfigMapper configMapper = (ConfigMapper) ctx.getBean("configMapper");

		String uid = request.getParameter("uid");
		HttpSession session = request.getSession();
		if (session.getAttribute(CommonConstants.SESSION_EDUCLOUD_UID) == null
				|| !session.getAttribute(CommonConstants.SESSION_EDUCLOUD_UID).equals(uid)) {
			String callback = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
					+ configMapper.selectValueByCode("ServerPort") + "/pixsignage/educloudcallback";
			String authUrl = EduCloudUtil.buildSSOAuthUrl(callback);
			response.sendRedirect(authUrl);
		} else {
			response.sendRedirect("/org/main.jsp");
		}
	}

}
