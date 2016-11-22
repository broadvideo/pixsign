package com.broadvideo.pixsignage.util;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WeixinUtil {
	private Logger logger = LoggerFactory.getLogger(getClass());

	public final static int SUCCESS = 1;
	public final static int ERROR = -1;

	private JSONObject responseJson;
	private int responseCode;
	private String responseError;

	public WeixinUtil() {
	}

	public JSONObject getResponseJson() {
		return responseJson;
	}

	public void setResponseJson(JSONObject responseJson) {
		this.responseJson = responseJson;
	}

	public int getResponseCode() {
		return responseCode;
	}

	public void setResponseCode(int responseCode) {
		this.responseCode = responseCode;
	}

	public String getResponseError() {
		return responseError;
	}

	public void setResponseError(String responseError) {
		this.responseError = responseError;
	}

	public String getResponseValue(String key) {
		if (responseJson != null) {
			return responseJson.getString(key);
		}
		return null;
	}

	public void getToken(String appid, String secret) {
		try {
			logger.info("get weixin access token {}, {}", appid, secret);
			String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid
					+ "&secret=" + secret;

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("get weixin access token response: {}", s);
				responseJson = new JSONObject(s);
				if (responseJson.getString("access_token").length() > 0) {
					responseCode = SUCCESS;
				} else {
					responseCode = ERROR;
					responseError = responseJson.getString("errmsg");
				}
			} else {
				httpclient.close();
				logger.error("get weixin access token response code: {}", status);
				responseCode = ERROR;
				responseError = "weixin response: " + status;
			}
		} catch (Exception e) {
			logger.error("get weixin access token error", e);
			responseCode = ERROR;
			responseError = e.getMessage();
		}
	}

	public void applyDevice(String token, int quantity, String reason) {
		try {
			logger.info("apply weixin devices quantity={}, reason={}", quantity, reason);
			String url = "https://api.weixin.qq.com/shakearound/device/applyid?access_token=" + token;

			JSONObject requestJson = new JSONObject();
			requestJson.put("quantity", quantity);
			requestJson.put("apply_reason", reason);

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpPost httppost = new HttpPost(url);
			StringEntity entity = new StringEntity(requestJson.toString(), "UTF-8");
			entity.setContentEncoding("UTF-8");
			entity.setContentType("application/json");
			httppost.setEntity(entity);
			CloseableHttpResponse response = httpclient.execute(httppost);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("apply weixin devices response: {}", s);
				responseJson = new JSONObject(s);
				if (responseJson.getInt("errcode") == 0) {
					responseCode = SUCCESS;
					responseError = responseJson.getString("errmsg");
				} else {
					responseCode = ERROR;
					responseError = responseJson.getString("errmsg");
				}
			} else {
				httpclient.close();
				logger.error("apply weixin devices response code: {}", status);
				responseCode = ERROR;
				responseError = "weixin response: " + status;
			}
		} catch (Exception e) {
			logger.error("apply weixin devices error", e);
			responseCode = ERROR;
			responseError = e.getMessage();
		}
	}

	public void applyStatus(String token, int applyid) {
		try {
			logger.info("get weixin devices apply status, applyid={}", applyid);
			String url = "https://api.weixin.qq.com/shakearound/device/applystatus?access_token=" + token;

			JSONObject requestJson = new JSONObject();
			requestJson.put("apply_id", applyid);

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpPost httppost = new HttpPost(url);
			StringEntity entity = new StringEntity(requestJson.toString(), "UTF-8");
			entity.setContentEncoding("UTF-8");
			entity.setContentType("application/json");
			httppost.setEntity(entity);
			CloseableHttpResponse response = httpclient.execute(httppost);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("get weixin devices apply status response: {}", s);
				responseJson = new JSONObject(s);
				if (responseJson.getInt("errcode") == 0) {
					responseCode = SUCCESS;
					responseError = responseJson.getString("errmsg");
				} else {
					responseCode = ERROR;
					responseError = responseJson.getString("errmsg");
				}
			} else {
				httpclient.close();
				logger.error("get weixin devices apply status response code: {}", status);
				responseCode = ERROR;
				responseError = "weixin response: " + status;
			}
		} catch (Exception e) {
			logger.error("get weixin devices apply status error", e);
			responseCode = ERROR;
			responseError = e.getMessage();
		}
	}

	public void queryApplyDevices(String token, int applyid) {
		try {
			logger.info("query weixin apply devices, applyid={}", applyid);
			String url = "https://api.weixin.qq.com/shakearound/device/search?access_token=" + token;

			JSONObject requestJson = new JSONObject();
			requestJson.put("type", 3);
			requestJson.put("apply_id", applyid);
			requestJson.put("last_seen", 0);
			requestJson.put("count", 50);

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpPost httppost = new HttpPost(url);
			StringEntity entity = new StringEntity(requestJson.toString(), "UTF-8");
			entity.setContentEncoding("UTF-8");
			entity.setContentType("application/json");
			httppost.setEntity(entity);
			CloseableHttpResponse response = httpclient.execute(httppost);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("query weixin apply devices response: {}", s);
				responseJson = new JSONObject(s);
				if (responseJson.getInt("errcode") == 0) {
					responseCode = SUCCESS;
					responseError = responseJson.getString("errmsg");
				} else {
					responseCode = ERROR;
					responseError = responseJson.getString("errmsg");
				}
			} else {
				httpclient.close();
				logger.error("query weixin apply devices response code: {}", status);
				responseCode = ERROR;
				responseError = "weixin response: " + status;
			}
		} catch (Exception e) {
			logger.error("query weixin apply devices error", e);
			responseCode = ERROR;
			responseError = e.getMessage();
		}
	}

}
