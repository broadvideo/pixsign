package com.broadvideo.pixsignage.util;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PixedxUtil {
	private static Logger logger = LoggerFactory.getLogger(PixedxUtil.class);

	public static String classrooms(String server) {
		try {
			String url = server + "/pixedxapi/lms/classrooms";
			logger.info("get classrooms from pixedx: {}", url);
			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("get classrooms from pixedx response: {}", s);
				return new JSONObject(s).toString();
			} else {
				httpclient.close();
				logger.error("get classrooms from pixedx response code: {}", status);
				return "";
			}
		} catch (Exception e) {
			logger.error("get classrooms from pixedx error: {}", e.getMessage());
			return "";
		}
	}

	public static String schedules(String server, String classroom, String starttime, String endtime) {
		try {
			String url = server + "/pixedxapi/lms/classrooms/" + classroom + "/schedules?start_time=" + starttime
					+ "&end_time=" + endtime;
			logger.info("get schedules from pixedx: {}", url);
			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("get schedules from pixedx response: {}", s);
				return new JSONObject(s).toString();
			} else {
				httpclient.close();
				logger.error("get schedules from pixedx response code: {}", status);
				return "";
			}
		} catch (Exception e) {
			logger.error("get schedules from pixedx error: {}", e.getMessage());
			return "";
		}
	}
}
