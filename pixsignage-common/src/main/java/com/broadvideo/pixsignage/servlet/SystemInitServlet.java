package com.broadvideo.pixsignage.servlet;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import com.broadvideo.pixsignage.common.CommonConfig;

public class SystemInitServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8591238992835900440L;

	private static final Logger log = Logger.getLogger(SystemInitServlet.class);

	@Override
	public void init() throws ServletException {
		super.init();

		try {
			Properties properties = new Properties();
			InputStream is = new BufferedInputStream(new FileInputStream("/opt/pix/conf/common.properties"));
			properties.load(is);
			CommonConfig.CONFIG_SERVER_IP = properties.getProperty("common.server.ip");
			CommonConfig.CONFIG_SERVER_PORT = properties.getProperty("common.server.port");
			CommonConfig.CONFIG_APP_VERSION_NAME = properties.getProperty("common.pixsignage.app.version.name");
			CommonConfig.CONFIG_APP_VERSION_CODE = properties.getProperty("common.pixsignage.app.version.code");
			CommonConfig.CONFIG_APP_VERSION_FILE = properties.getProperty("common.pixsignage.app.version.file");
			is.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		try {
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/combine"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/snapshot"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/gif"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/temp"));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void updateLicense(ServletContext context) {
		if (CommonConfig.LICENSE) {
			return;
		}

		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (System.getProperties().getProperty("os.name").startsWith("Windows")) {
			CommonConfig.LICENSE_HOSTID_VERIFY = true;
			try {
				CommonConfig.LICENSE_Expire = sf.parse("2037-01-01 00:00:00");
			} catch (Exception e) {
			}
			CommonConfig.LICENSE_MaxOrgs = 10;
			CommonConfig.LICENSE_MaxDevicesPerSigOrg = 20;
			CommonConfig.LICENSE_MaxStoragePerSigOrg = 3000;
			CommonConfig.LICENSE_MaxDevicesPerMovieOrg = 20;
			CommonConfig.LICENSE_MaxStoragePerMovieOrg = 3000;
		}

		ServletContext licensecontext = context.getContext("/pixlicense");
		if (licensecontext == null) {
			log.error("Init error: context of license is null");
			return;
		}
		if (licensecontext.getAttribute("HostIDVerify") == null) {
			log.error("Init error: HostIDVerify is null");
			return;
		}
		try {
			CommonConfig.LICENSE_HOSTID_VERIFY = (Boolean) licensecontext.getAttribute("HostIDVerify");
			CommonConfig.LICENSE_Expire = sf.parse((String) licensecontext.getAttribute("Expire"));
			CommonConfig.LICENSE_MaxOrgs = Integer.parseInt((String) licensecontext.getAttribute("MaxOrgs"));
			CommonConfig.LICENSE_MaxDevicesPerSigOrg = Integer
					.parseInt((String) licensecontext.getAttribute("MaxDevicesPerSigOrg"));
			CommonConfig.LICENSE_MaxStoragePerSigOrg = Integer
					.parseInt((String) licensecontext.getAttribute("MaxStoragePerSigOrg"));
			CommonConfig.LICENSE_MaxDevicesPerMovieOrg = Integer
					.parseInt((String) licensecontext.getAttribute("MaxDevicesPerMovieOrg"));
			CommonConfig.LICENSE_MaxStoragePerMovieOrg = Integer
					.parseInt((String) licensecontext.getAttribute("MaxStoragePerMovieOrg"));
			log.info("License HostID verify: " + CommonConfig.LICENSE_HOSTID_VERIFY);
			log.info("License Expire: " + sf.format(CommonConfig.LICENSE_Expire));
			log.info("License MaxOrgs: " + CommonConfig.LICENSE_MaxOrgs);
			log.info("License MaxDevicesPerSigOrg: " + CommonConfig.LICENSE_MaxDevicesPerSigOrg);
			log.info("License MaxStoragePerSigOrg: " + CommonConfig.LICENSE_MaxStoragePerSigOrg);
			log.info("License MaxDevicesPerMovieOrg: " + CommonConfig.LICENSE_MaxDevicesPerMovieOrg);
			log.info("License MaxStoragePerMovieOrg: " + CommonConfig.LICENSE_MaxStoragePerMovieOrg);
			CommonConfig.LICENSE = true;
		} catch (Exception e) {
			e.printStackTrace();
			log.error("Init error: " + e.getMessage());
		}
	}
}
