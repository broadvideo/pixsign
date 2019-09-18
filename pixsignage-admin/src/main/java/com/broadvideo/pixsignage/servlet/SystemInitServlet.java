package com.broadvideo.pixsignage.servlet;

import java.io.File;
import java.io.InputStream;
import java.util.Properties;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DbversionMapper;
import com.broadvideo.pixsignage.service.PlanService;

@SuppressWarnings("serial")
public class SystemInitServlet extends HttpServlet {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void init() throws ServletException {
		super.init();

		try {
			Properties properties = new Properties();
			InputStream is = this.getClass().getResourceAsStream("/version.properties");
			properties.load(is);
			CommonConfig.CURRENT_APPVERSION = properties.getProperty("app.version");
			is.close();

			ServletContext servletContext = this.getServletContext();
			WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
			ConfigMapper configMapper = (ConfigMapper) ctx.getBean("configMapper");
			Config config = configMapper.selectByCode("APPVersion");
			config.setValue(CommonConfig.CURRENT_APPVERSION);
			configMapper.updateByPrimaryKeySelective(config);

			config = configMapper.selectByCode("SystemID");
			String systemid = config.getValue();
			if (config.getValue().equals("")) {
				systemid = UUID.randomUUID().toString().replace("-", "");
				config.setValue(systemid);
				configMapper.updateByPrimaryKeySelective(config);
			}
			CommonConfig.SYSTEM_ID = systemid;

			CommonConfig.SYSTEM_COPYRIGHT = configMapper.selectValueByCode("Copyright");
			if (CommonConfig.SYSTEM_COPYRIGHT == null) {
				CommonConfig.SYSTEM_COPYRIGHT = "";
			}
			CommonConfig.SYSTEM_ICP = configMapper.selectValueByCode("ICP");
			if (CommonConfig.SYSTEM_ICP == null) {
				CommonConfig.SYSTEM_ICP = "";
			}

			DbversionMapper dbversionMapper = (DbversionMapper) ctx.getBean("dbversionMapper");
			CommonConfig.CURRENT_DBVERSION = "" + dbversionMapper.selectCurrentVersion().getVersion();

			PlanService planService = (PlanService) ctx.getBean("planService");
			logger.info("begin to upgrade2multiplan");
			planService.upgrade2multiplan();

			logger.info("System ID: {}", CommonConfig.SYSTEM_ID);
			logger.info("APP Version: {}", CommonConfig.CURRENT_APPVERSION);
			logger.info("DB Version: {}", CommonConfig.CURRENT_DBVERSION);
		} catch (Exception ex) {
			CommonConfig.CURRENT_DBVERSION = "0";
			logger.error("", ex);
		}

		try {
			if (System.getProperties().getProperty("os.name").startsWith("Windows")) {
				CommonConfig.CONFIG_PIXDATA_HOME = "d:" + CommonConfig.CONFIG_PIXDATA_HOME;
				CommonConfig.CONFIG_FFMPEG_CMD = "/opt/pix/ffmpeg/ffmpeg.exe";
			}

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/rk44"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/rk51"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/uwin"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/bv"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/changhong"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/mtk"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/tunqire"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/debug"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/win32"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/win64"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/import"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/combine"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/preview"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/gif"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/thumb"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/audio"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/audio/upload"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/diy/snapshot"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pagepkg"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/bundle"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/templet"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/temp"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/screen"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow/temp"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog/temp"));
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/org"));

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/mediagrid"));
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}
}
