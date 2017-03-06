package com.broadvideo.pixsignage.util;

import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EduCloudUtil {
	private static Logger logger = LoggerFactory.getLogger(EduCloudUtil.class);

	private static String ClientID = "openapi_test";
	private static String ClientSecret = "openapi_test";

	public static String buildSSOAuthUrl(String callbackurl) {
		try {
			StringBuilder sb = new StringBuilder();
			sb.append("http://www.jzjyy.cn/zhxy/platform_change?client_id=");
			sb.append(ClientID);
			sb.append("&spring-security-redirect=");
			sb.append(URLEncoder.encode(callbackurl, "utf-8"));
			logger.info("EduCloud SSOAuth URL:" + sb.toString());
			return sb.toString();
		} catch (Exception e) {
			return "";
		}
	}

	private static String buildHashCode(String timestamp) {
		StringBuilder sb = new StringBuilder(timestamp);
		sb.append(ClientID);
		sb.append(ClientSecret);
		return DigestUtils.md5Hex(sb.toString());
	}

	public static String getUserInfo(String accessToken) {
		try {
			DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
			String timestamp = dateFormat.format(new Date());
			String hashCode = buildHashCode(timestamp);
			StringBuilder url = new StringBuilder("http://www.jzjyy.cn/zhxy/valid_token?access_token=")
					.append(accessToken);
			url.append("&caller=").append(ClientID);
			url.append("&timestamp=").append(timestamp);
			url.append("&hashcode=").append(hashCode);
			logger.info("EduCloud getUserInfo URL:" + url.toString());

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(30000).setConnectTimeout(30000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url.toString());
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				logger.info("EduCloud getUserInfo response: {}", s);
				httpclient.close();
				return s;
			} else {
				httpclient.close();
				return "";
			}
		} catch (Exception e) {
			logger.error("EduCloud getUserInfo exception: {}", e.getMessage());
			return "";
		}
	}

	public static String getClassList(String schcode) {
		try {
			DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
			String timestamp = dateFormat.format(new Date());
			String hashCode = buildHashCode(timestamp);
			StringBuilder url = new StringBuilder("http://www.jzjyy.cn/zhxy-openapi/orgs/class/classListBySchCode");
			url.append("?schCode=").append(schcode);
			url.append("&client_id=").append(ClientID);
			url.append("&timestamp=").append(timestamp);
			url.append("&hashcode=").append(hashCode);
			logger.info("EduCloud getClassList URL:" + url.toString());

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(30000).setConnectTimeout(30000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url.toString());
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				logger.info("EduCloud getClassList response: {}", s);
				httpclient.close();
				return s;
			} else {
				httpclient.close();
				return "";
			}
		} catch (Exception e) {
			logger.error("EduCloud getClassList exception: {}", e.getMessage());
			return "";
		}
	}

	public static String getScheduleList(String classcode, String starttime, String endtime) {
		try {
			DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
			String timestamp = dateFormat.format(new Date());
			String hashCode = buildHashCode(timestamp);
			StringBuilder url = new StringBuilder(
					"http://www.jzjyy.cn/zhxy-openapi/relations/courseScheduleListByClassCodeAndTime");
			url.append("?classCode=").append(classcode);
			url.append("&startTime=").append(starttime);
			url.append("&endTime=").append(endtime);
			url.append("&client_id=").append(ClientID);
			url.append("&timestamp=").append(timestamp);
			url.append("&hashcode=").append(hashCode);
			logger.info("EduCloud getScheduleList URL:" + url.toString());

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(30000).setConnectTimeout(30000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url.toString());
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				logger.info("EduCloud getScheduleList response: {}", s);
				httpclient.close();
				return s;
			} else {
				httpclient.close();
				return "";
			}
		} catch (Exception e) {
			logger.error("EduCloud getScheduleList exception: {}", e.getMessage());
			return "";
		}
	}
}
