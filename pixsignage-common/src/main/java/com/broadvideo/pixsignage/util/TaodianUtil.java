package com.broadvideo.pixsignage.util;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.json.JSONObject;

public class TaodianUtil {
	private Logger logger = LoggerFactory.getLogger(getClass());

	public final static int SUCCESS = 1;
	public final static int ERROR = -1;

	private String server;

	private JSONObject responseJson;
	private int responseCode;
	private String responseError;

	public TaodianUtil(String server) {
		this.server = server;
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

	public void getbrands(String clientid) {
		try {
			String url = server + "?client_id=" + clientid;
			logger.info("Taodian getbrands URL: {}", url);
			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(30000).setConnectTimeout(30000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				logger.info("Taodian getbrands response: {}", s);
				responseJson = JSONObject.fromObject(s);
				if (responseJson.getInt("code") != 0) {
					responseCode = TaodianUtil.ERROR;
					responseError = responseJson.getString("message");
				} else {
					responseCode = TaodianUtil.SUCCESS;
					responseError = "";
				}
			} else {
				logger.error("Taodian getbrands error response status: {}", status);
				responseCode = TaodianUtil.ERROR;
				responseError = "Internal Error";
			}
			httpclient.close();
		} catch (Exception e) {
			logger.error("Taodian getbrands exception ", e);
			responseCode = TaodianUtil.ERROR;
			responseError = e.getMessage();
		}
	}

}
