package com.broadvideo.signage.servlet;

import java.text.SimpleDateFormat;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.Logger;

import com.broadvideo.signage.common.CommonConfig;
import com.broadvideo.signage.util.IOUtil;

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
			IOUtil.mkdirs(CommonConfig.CONFIG_IMAGE_HOME);
			IOUtil.mkdirs(CommonConfig.CONFIG_VIDEO_HOME);
			IOUtil.mkdirs(CommonConfig.CONFIG_TEMP_HOME);
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
			CommonConfig.LICENSE_MaxDevicesPerSigOrg = Integer.parseInt((String) licensecontext
					.getAttribute("MaxDevicesPerSigOrg"));
			CommonConfig.LICENSE_MaxStoragePerSigOrg = Integer.parseInt((String) licensecontext
					.getAttribute("MaxStoragePerSigOrg"));
			CommonConfig.LICENSE_MaxDevicesPerMovieOrg = Integer.parseInt((String) licensecontext
					.getAttribute("MaxDevicesPerMovieOrg"));
			CommonConfig.LICENSE_MaxStoragePerMovieOrg = Integer.parseInt((String) licensecontext
					.getAttribute("MaxStoragePerMovieOrg"));
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
