package com.broadvideo.pixsignage.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.util.EduCloudUtil;

/**
 * 认证通过后的回调处理 Servlet implementation class AuthCallBackServlet
 */
public class EduCloudCallBackServlet extends HttpServlet {
	private Logger logger = LoggerFactory.getLogger(getClass());

	public EduCloudCallBackServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		String accessToken = request.getParameter("access_token");
		try {
			String userInfo = EduCloudUtil.getUserInfo(accessToken);
			if (userInfo.length() > 0) {
				JSONObject userJson = JSONObject.fromObject(userInfo);
				session.setAttribute(CommonConstants.SESSION_EDUCLOUD_UID, userJson.getString("identityId"));
				session.setAttribute("accessToken", accessToken);
				session.setAttribute("userInfo", userInfo);
			}
			// 插入数据库，生成记录
			// 初始化session
			response.sendRedirect("main.jsp");
		} catch (Exception e) {
			logger.error("EduCloudCallBackServlet exception, ", e);
		}

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
