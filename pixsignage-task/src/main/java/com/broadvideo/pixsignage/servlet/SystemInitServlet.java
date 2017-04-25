package com.broadvideo.pixsignage.servlet;

import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DbversionMapper;
import com.broadvideo.pixsignage.task.SystemTask;

@SuppressWarnings("serial")
public class SystemInitServlet extends HttpServlet {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void init() throws ServletException {
		super.init();

		try {
			ServletContext servletContext = this.getServletContext();
			WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
			ConfigMapper configMapper = (ConfigMapper) ctx.getBean("configMapper");
			Config config = configMapper.selectByCode("SystemID");
			String systemid = config.getValue();
			if (config.getValue().equals("")) {
				systemid = UUID.randomUUID().toString().replace("-", "");
				config.setValue(systemid);
				configMapper.updateByPrimaryKeySelective(config);
			}
			CommonConfig.SYSTEM_ID = systemid;

			DbversionMapper dbversionMapper = (DbversionMapper) ctx.getBean("dbversionMapper");
			CommonConfig.CURRENT_DBVERSION = "" + dbversionMapper.selectCurrentVersion().getVersion();

			logger.info("System ID: {}", CommonConfig.SYSTEM_ID);
			logger.info("DB Version: {}", CommonConfig.CURRENT_DBVERSION);

			SystemTask systemTask = (SystemTask) ctx.getBean("systemTask");
			systemTask.start();
		} catch (Exception ex) {
			logger.error("System init exception. ", ex);
		}
	}
}
