package com.broadvideo.pixsign.servlet;

import java.io.InputStream;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map.Entry;
import java.util.Properties;
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

			Properties properties = new Properties();
			InputStream is = this.getClass().getResourceAsStream("/signature.properties");
			properties.load(is);
			CommonConfig.CONFIG_SIGNATURE = new Hashtable<String, String>();
			Iterator<Entry<Object, Object>> it = properties.entrySet().iterator();
			while (it.hasNext()) {
				Entry<Object, Object> entry = it.next();
				CommonConfig.CONFIG_SIGNATURE.put(entry.getValue().toString(), entry.getKey().toString());
			}
			is.close();

			Locale.setDefault(Locale.CHINA);
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

}
