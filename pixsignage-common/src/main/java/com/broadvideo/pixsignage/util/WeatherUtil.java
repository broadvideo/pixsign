package com.broadvideo.pixsignage.util;

import java.net.URLEncoder;

import javax.ws.rs.core.MediaType;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

public class WeatherUtil {
	private static Logger logger = LoggerFactory.getLogger(WeatherUtil.class);

	public static String getWeather(String city) {
		try {
			logger.info("get weather of {} from baidu", city);
			Client c = Client.create();
			String url = "http://api.map.baidu.com/telematics/v3/weather?location=" + URLEncoder.encode(city, "UTF-8")
					+ "&output=json&ak=851da3cf179f117ed8e34d4f2e64f5e8";
			WebResource r = c.resource(url);
			String s = r.accept(MediaType.APPLICATION_JSON_TYPE).get(String.class);
			logger.info("Get weather of {} response: {}", city, s);
			return new JSONObject(s).toString();
		} catch (Exception e) {
			logger.error("get weather of {} error", city, e);
			JSONObject json = new JSONObject();
			json.put("error", -3);
			json.put("status", "No result available");
			return json.toString();
		}
	}
}
