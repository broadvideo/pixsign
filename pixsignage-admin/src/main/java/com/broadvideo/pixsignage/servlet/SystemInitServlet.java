package com.broadvideo.pixsignage.servlet;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.commons.io.FileUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Vsp;
import com.broadvideo.pixsignage.service.OrgService;
import com.broadvideo.pixsignage.service.VspService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.PixOppUtil;

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
			CommonConfig.CONFIG_ACTIVEMQ_SERVER = properties.getProperty("common.activemq.server");
			is.close();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		try {
			ServletContext servletContext = this.getServletContext();
			WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
			VspService vspService = (VspService) ctx.getBean("vspService");
			Vsp vsp = vspService.selectByCode("default");
			OrgService orgService = (OrgService) ctx.getBean("orgService");
			Org org = orgService.selectByCode("default");

			String hostid = PixOppUtil.getHostID();
			String dockerid = PixOppUtil.getDockerID();
			String type = "0";
			String key = "";
			if (hostid.length() > 0) {
				logger.info("system hostid: {}", hostid);
				type = "1";
				key = hostid;
				CommonConfig.SYSTEM_ID = hostid;
			} else if (dockerid.length() > 0) {
				logger.info("system dockerid: {}", dockerid);
				type = "2";
				key = dockerid;
				CommonConfig.SYSTEM_ID = dockerid;
			}
			if (key.length() > 0) {
				String checkcode = CommonUtil.getMd5(type + key, "pixsign");
				String s = PixOppUtil.init(type, key, checkcode);
				if (!s.equals("")) {
					JSONObject dataJson = new JSONObject(s).getJSONObject("data");
					if (dataJson != null) {
						String name = dataJson.getString("name");
						String vspflag = dataJson.getString("vspflag");
						int maxvspdevices = dataJson.getInt("maxvspdevices");
						long maxvspstorage = dataJson.getLong("maxvspstorage");
						int maxorgdevices = dataJson.getInt("maxorgdevices");
						long maxorgstorage = dataJson.getLong("maxorgstorage");
						vsp.setMaxdevices(maxvspdevices);
						vsp.setMaxstorage(maxvspstorage);
						org.setMaxdevices(maxorgdevices);
						org.setMaxstorage(maxorgstorage);
						vspService.updateVsp(vsp);
						orgService.updateOrg(org);
					}
				}
			}
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
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/screen"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow/temp"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog/temp"));

		} catch (Exception ex) {
			logger.error("", ex);
		}
	}
}
