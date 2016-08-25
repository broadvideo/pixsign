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

	public static String getBaiduWeather(String city) {
		try {
			logger.info("get weather of {} from baidu", city);
			Client c = Client.create();
			c.setConnectTimeout(5000);
			c.setReadTimeout(5000);
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

	public static String getYahooWeather(String city) {
		try {
			String yql = "select location,item from weather.forecast where woeid in (select woeid from geo.places(1) where text=\""
					+ city + "\")";
			String url = "http://query.yahooapis.com/v1/public/yql?q=" + URLEncoder.encode(yql, "UTF-8")
					+ "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
			logger.info("get weather of {} from yahoo: {}", city, url);
			// http://query.yahooapis.com/v1/public/yql?q=select%20location%2Citem%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22shenzhen%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
			Client c = Client.create();
			c.setConnectTimeout(5000);
			c.setReadTimeout(5000);
			WebResource r = c.resource(url);
			String s = r.header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
					.header("Accept-Encoding", "gzip, deflate, sdch").header("Accept-Language", "zh-CN,zh;q=0.8")
					.header("Cache-Control", "max-age=0").header("Connection", "keep-alive")
					.header("Cookie", "BX=0dmjfadbcq8mk&b=4&d=ojEMzEJpYEKsFxYcdQWW7w--&s=ni&i=lzQj_u3eJixWTEoqnl5k")
					.header("Host", "query.yahooapis.com").header("Upgrade-Insecure-Requests", "1")
					.header("User-Agent",
							"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36")
					.get(String.class);
			logger.info("Get weather of {} response: {}", city, s);

			JSONObject rspJson = new JSONObject(s);
			int count = rspJson.getJSONObject("query").getInt("count");
			if (count == 1) {
				return rspJson.getJSONObject("query").getJSONObject("results").getJSONObject("channel").toString();
			}
			return "";
		} catch (Exception e) {
			logger.error("get weather of {} error", city, e);
			return "";
		}
	}
}
