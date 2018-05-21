package com.broadvideo.pixsignage.servlet;

import java.io.IOException;
import java.util.Calendar;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import EIAC.EAC.SSO.AppSSOBLL;
import EIAC.EAC.SSO.ReadConfig;

import com.broadvideo.pixsignage.common.EncryptionUtils;
import com.broadvideo.pixsignage.common.ServiceConstants;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.service.CmsSSOServiceBuilder;

/**
 * 登录回掉地址
 */
public class LoginCallBackServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7460045635456314022L;
	private final Logger logger = LoggerFactory.getLogger(getClass());

	public LoginCallBackServlet() {
		super();

	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String userAccount = request.getParameter("UserAccount");
		String result = request.getParameter("Result");
		String errorDescription = request.getParameter("ErrorDescription");
		String authenticator = request.getParameter("Authenticator");
		String timestamp = request.getParameter("TimeStamp");
		logger.info(
				"#####LoginCallBackServlet with UserAccount:{},Result:{},ErrorDescription:{},Authenticator:{},TimeStamp:{}",
				userAccount, result, errorDescription, authenticator, timestamp);
		AppSSOBLL app = new AppSSOBLL();
		if (StringUtils.isNotBlank(userAccount)) {
			String iasId = CmsSSOServiceBuilder.getConfig().getIasId();
			String IASkey = ReadConfig.getString("IASKey");
			logger.info("#####LoginCallBackServlet:iASKey:{}", IASkey);
			if (!"0".equals(result)) {
				logger.error("Result({})验证不成功！", result);
				logger.info(iasId + ":" + timestamp + ":" + userAccount + ":" + result + ":" + errorDescription + ":"
						+ authenticator);
				request.setAttribute("message", this.buildErrorMsg(errorDescription));
				request.getRequestDispatcher("error.jsp").forward(request, response);
				return;
			}
			try {
				if (app.ValidateFromEAC(iasId, timestamp, userAccount, result, errorDescription, authenticator)) {
					// set cookies
					Cookie tokenCookie = new Cookie("Token", genUserToken(userAccount));
					tokenCookie.setMaxAge(-1);
					response.addCookie(tokenCookie);
					Cookie userAccountCookie = new Cookie("UserAcount", userAccount);
					userAccountCookie.setMaxAge(-1);
					response.addCookie(userAccountCookie);
					logger.info("userAccount:{}认证成功!", userAccount);
					request.getSession().setAttribute("UserAccount", userAccount);
					response.sendRedirect("index.jsp");
				} else {
					logger.error("userAccount:{}验证错误", userAccount);
					logger.info(iasId + ":" + timestamp + ":" + userAccount + ":" + result + ":" + errorDescription
							+ ":" + authenticator);
					request.setAttribute("message", this.buildErrorMsg(errorDescription));
					request.getRequestDispatcher("error.jsp").forward(request, response);

				}
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("loginCallback exception.", e);
				request.setAttribute("message", e.getMessage());
				request.getRequestDispatcher("error.jsp").forward(request, response);
			}

		}

	}

	private String genUserToken(String loginName) throws ServiceException {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_WEEK, 7);
		long expiresIn = calendar.getTimeInMillis();
		String plainText = loginName + "|" + expiresIn;
		final String token = EncryptionUtils.encrypt(ServiceConstants.ENCRYPT_KEY, plainText);
		return token;
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {

		doGet(request, response);
	}

	private String buildErrorMsg(String errorDescription) {
		StringBuilder errorMsg = new StringBuilder();
		errorMsg.append("验证失败:").append(errorDescription);
		return errorMsg.toString();

	}

}
