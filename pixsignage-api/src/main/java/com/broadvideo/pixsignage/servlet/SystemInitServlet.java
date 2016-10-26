package com.broadvideo.pixsignage.servlet;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.broadvideo.pixsignage.common.CommonConfig;

@SuppressWarnings("serial")
public class SystemInitServlet extends HttpServlet {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void init() throws ServletException {
		super.init();

		try {
			Properties properties = new Properties();
			InputStream is = new BufferedInputStream(new FileInputStream("/opt/pix/conf/common.properties"));
			properties.load(is);
			CommonConfig.CONFIG_SERVER_IP = properties.getProperty("common.server.ip");
			CommonConfig.CONFIG_SERVER_PORT = properties.getProperty("common.server.port");
			CommonConfig.CONFIG_ACTIVEMQ_SERVER = properties.getProperty("common.activemq.server");
			is.close();
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}
}
