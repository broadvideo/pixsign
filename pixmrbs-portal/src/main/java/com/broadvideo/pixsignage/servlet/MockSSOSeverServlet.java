package com.broadvideo.pixsignage.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import EIAC.EAC.SSO.AppSSOBLL;
import EIAC.EAC.SSO.PSOCryptography;

import com.broadvideo.pixsignage.service.CmsSSOServiceBuilder.Config;

/**
 * Mock sso server授权端
 */
public class MockSSOSeverServlet extends HttpServlet {
       
    /**
	 * 
	 */
	private static final long serialVersionUID = 5745968472019472785L;

    public MockSSOSeverServlet() {
        super();
    }


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		StringBuilder paramBuilder = new StringBuilder();
		String timestamp = request.getParameter("TimeStamp");
		String iasId = request.getParameter("IASID");
		String userAccount = "admin";
		String result = "0";
		String errorDescription = "";
		String authenticator = request.getParameter("Authenticator");
		paramBuilder.append("Result=").append(result).append("&");
		paramBuilder.append("UserAccount=").append(userAccount).append("&");
		paramBuilder.append("ErrorDescription=").append(errorDescription).append("&");
		paramBuilder.append("TimeStamp=").append(timestamp).append("&");

		try {
			String OriginalAuthenticator = iasId.trim() + timestamp + userAccount + result + errorDescription;
			String AuthenticatorDigest = PSOCryptography.GenerateDigest(OriginalAuthenticator);
			String strTobeDeCrypted = AuthenticatorDigest + OriginalAuthenticator;
			String encryCurrentAuthenticator = "";
			String IASkey = Config.newConfig().getIasKey();
			encryCurrentAuthenticator = PSOCryptography.Encrypt(strTobeDeCrypted, IASkey, PSOCryptography.defaultIV);
			AppSSOBLL app = new AppSSOBLL();
			boolean isTrue = app.ValidateFromEAC(iasId, timestamp, userAccount, result, errorDescription,
					encryCurrentAuthenticator);
			paramBuilder.append("Authenticator=")
					.append(java.net.URLEncoder.encode(encryCurrentAuthenticator, "UTF-8"));
			response.sendRedirect("loginCallback?" + paramBuilder.toString());
		} catch (Exception ex) {
			ex.printStackTrace();
		}




	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		doGet(request, response);
	}

}
