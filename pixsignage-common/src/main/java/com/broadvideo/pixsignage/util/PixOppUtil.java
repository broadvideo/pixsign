package com.broadvideo.pixsignage.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PixOppUtil {
	private static Logger logger = LoggerFactory.getLogger(PixOppUtil.class);

	public static String getHostID() {
		String hostid = "";
		try {
			String cmd = "/usr/local/bin/gethostid";
			Process process = Runtime.getRuntime().exec(cmd);
			InputStream fis = process.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(fis));
			String line;
			while ((line = br.readLine()) != null) {
				if (line.length() > 0) {
					hostid = line.trim();
				}
			}
			br.close();
			fis.close();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return hostid;
	}

	public static String getDockerID() {
		String dockerid = "";
		try {
			String cmd = "/usr/local/bin/getdockerid";
			Process process = Runtime.getRuntime().exec(cmd);
			InputStream fis = process.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(fis));
			String line;
			while ((line = br.readLine()) != null) {
				if (line.length() > 0) {
					dockerid = line.trim();
				}
			}
			br.close();
			fis.close();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return dockerid;
	}

	public static String init(String type, String key, String checkcode, String svrversion, String dbversion) {
		try {
			logger.info("send init message type={}, key={}, checkcode={}, svrversion={}, dbversion={}", type, key,
					checkcode, svrversion, dbversion);
			String url = "http://180.96.19.239/pixopp/rest/pixsign/init?type=" + type + "&key=" + key + "&checkcode="
					+ checkcode + "&svrversion=" + svrversion + "&dbversion=" + dbversion;

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("Get init response: {}", s);
				return new JSONObject(s).toString();
			} else {
				httpclient.close();
				logger.error("Get init response code: {}", status);
				return "";
			}
		} catch (Exception e) {
			logger.error("Get init response error", e);
			return "";
		}
	}
}
