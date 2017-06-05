package com.broadvideo.pixsignage.servlet;

import java.io.InputStream;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map.Entry;
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
