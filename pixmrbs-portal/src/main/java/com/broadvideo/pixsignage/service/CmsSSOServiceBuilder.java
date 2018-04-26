package com.broadvideo.pixsignage.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import EIAC.EAC.SSO.AppSSOBLL;

public class CmsSSOServiceBuilder {

	private final static Logger logger = LoggerFactory.getLogger(CmsSSOServiceBuilder.class);
	public static String buildSSOLoginHtml() {
		logger.info("cms:build sso login html:");
		Config config = Config.newConfig();
		AppSSOBLL app = new AppSSOBLL();
		String postBodyHtml = app.PostString(config.getIasId(), config.getTimestamp(), config.getReturlUrl(), null);
		logger.info("cms:build sso login html:{} ", postBodyHtml);
		return postBodyHtml;
	}

	public static Config getConfig() {

		return Config.newConfig();

	}

	public static class Config {
		private String iasId;
		private String iasKey;
		private String ssoUrl;
		private String returlUrl;
		private String timestamp;

		private Config() {

		}

		public static Config newConfig() {
			Config config = new Config();
			EIAC.EAC.SSO.ReadConfig rd = new EIAC.EAC.SSO.ReadConfig();
			config.iasId = rd.getString("IASID").trim();
			config.iasKey = rd.getString("IASKey").trim();
			config.ssoUrl = rd.getString("PostUrl").trim();
			config.returlUrl = rd.getString("ReturnUrl").trim();
			DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			config.timestamp = formatter.format(new Date());

			return config;

		}

		public String getIasId() {
			return iasId;
		}

		public String getIasKey() {
			return iasKey;
		}

		public String getSsoUrl() {
			return ssoUrl;
		}

		public String getReturlUrl() {
			return returlUrl;
		}

		public String getTimestamp() {
			return timestamp;
		}

	}

}
