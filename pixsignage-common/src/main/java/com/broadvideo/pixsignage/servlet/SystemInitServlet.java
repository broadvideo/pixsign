package com.broadvideo.pixsignage.servlet;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.commons.io.FileUtils;
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
			CommonConfig.CONFIG_VCSS_SERVER = "http://" + properties.getProperty("common.pixsignage.vcencoder")
					+ ":6060/";
			is.close();
		} catch (Exception ex) {
			logger.error("", ex);
		}
		try {
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/combine"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/preview"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/gif"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/thumb"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pagepkg"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/bundle"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/temp"));
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}
}
