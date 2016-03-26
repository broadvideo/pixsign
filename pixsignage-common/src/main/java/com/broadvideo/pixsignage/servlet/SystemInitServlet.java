package com.broadvideo.pixsignage.servlet;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.commons.io.FileUtils;

import com.broadvideo.pixsignage.common.CommonConfig;

@SuppressWarnings("serial")
public class SystemInitServlet extends HttpServlet {
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
			ex.printStackTrace();
		}
		try {
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/combine"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/preview"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/snapshot"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/preview"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/gif"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/temp"));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}
