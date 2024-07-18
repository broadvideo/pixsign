package com.broadvideo.pixsign.servlet;

import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.domain.Config;
import com.broadvideo.pixsign.persistence.ConfigMapper;
import com.broadvideo.pixsign.persistence.DbversionMapper;
import com.broadvideo.pixsign.task.ExportTask;

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

			ExportTask exportTask = (ExportTask) ctx.getBean("exportTask");
			exportTask.start();

		} catch (Exception ex) {
			logger.error("System init exception. ", ex);
		}
	}
}
