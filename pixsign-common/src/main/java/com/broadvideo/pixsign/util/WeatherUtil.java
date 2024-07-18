package com.broadvideo.pixsign.util;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WeatherUtil {
	private static Logger logger = LoggerFactory.getLogger(WeatherUtil.class);

	public static String getBaiduWeather(String city) {
		try {
			logger.info("get weather of {} from baidu", city);
			String url = "http://api.map.baidu.com/telematics/v3/weather?location=" + URLEncoder.encode(city, "UTF-8")
					+ "&output=json&ak=851da3cf179f117ed8e34d4f2e64f5e8";

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("Get weather of {} response: {}", city, s);
				return new JSONObject(s).toString();
			} else {
				httpclient.close();
				logger.error("Get weather of {} response code: {}", city, status);
				JSONObject json = new JSONObject();
				json.put("error", -3);
				json.put("status", "No result available");
				return json.toString();
			}
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
			final String appId = "P9LnSG3e";
			final String consumerKey = "dj0yJmk9MGYxemRmVlc1TERRJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTQw";
			final String consumerSecret = "deb003c6e74850137454cccf0e193c586030554a";
			final String url = "https://weather-ydn-yql.media.yahoo.com/forecastrss";

			long timestamp = new Date().getTime() / 1000;
			byte[] nonce = new byte[32];
			Random rand = new Random();
			rand.nextBytes(nonce);
			String oauthNonce = new String(nonce).replaceAll("\\W", "");

			List<String> parameters = new ArrayList<>();
			parameters.add("oauth_consumer_key=" + consumerKey);
			parameters.add("oauth_nonce=" + oauthNonce);
			parameters.add("oauth_signature_method=HMAC-SHA1");
			parameters.add("oauth_timestamp=" + timestamp);
			parameters.add("oauth_version=1.0");
			// Make sure value is encoded
			parameters.add("location=" + URLEncoder.encode(city, "UTF-8"));
			parameters.add("format=json");
			parameters.add("u=c");
			Collections.sort(parameters);

			StringBuffer parametersList = new StringBuffer();
			for (int i = 0; i < parameters.size(); i++) {
				parametersList.append(((i > 0) ? "&" : "") + parameters.get(i));
			}

			String signatureString = "GET&" + URLEncoder.encode(url, "UTF-8") + "&"
					+ URLEncoder.encode(parametersList.toString(), "UTF-8");

			String signature = null;
			try {
				SecretKeySpec signingKey = new SecretKeySpec((consumerSecret + "&").getBytes(), "HmacSHA1");
				Mac mac = Mac.getInstance("HmacSHA1");
				mac.init(signingKey);
				byte[] rawHMAC = mac.doFinal(signatureString.getBytes());
				Encoder encoder = Base64.getEncoder();
				signature = encoder.encodeToString(rawHMAC);
			} catch (Exception e) {
				System.err.println("Unable to append signature");
				System.exit(0);
			}

			String authorizationLine = "OAuth " + "oauth_consumer_key=\"" + consumerKey + "\", " + "oauth_nonce=\""
					+ oauthNonce + "\", " + "oauth_timestamp=\"" + timestamp + "\", "
					+ "oauth_signature_method=\"HMAC-SHA1\", " + "oauth_signature=\"" + signature + "\", "
					+ "oauth_version=\"1.0\"";

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url + "?location=" + URLEncoder.encode(city, "UTF-8") + "&format=json&u=c");
			httpget.setHeader("Authorization", authorizationLine);
			httpget.setHeader("X-Yahoo-App-Id", appId);
			httpget.setHeader("Content-Type", "application/json");

			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				logger.info("Get weather of {} response: {}", city, s);
				return s;
			} else {
				logger.error("Get weather of {} response code: {}", city, status);
			}
			httpclient.close();

			return "";
		} catch (Exception e) {
			logger.error("get weather of {} error", city, e);
			return "";
		}
	}

	public static String getYahooWeather_old(String city) {
		try {
			String yql = "select location,item from weather.forecast where woeid in (select woeid from geo.places(1) where text=\""
					+ city + "\")";
			String url = "http://query.yahooapis.com/v1/public/yql?q=" + URLEncoder.encode(yql, "UTF-8")
					+ "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
			logger.info("get weather of {} from yahoo: {}", city, url);

			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			httpget.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
			httpget.setHeader("Accept-Encoding", "gzip, deflate, sdch");
			httpget.setHeader("Accept-Language", "zh-CN,zh;q=0.8");
			httpget.setHeader("Cache-Control", "max-age=0");
			httpget.setHeader("Connection", "keep-alive");
			httpget.setHeader("Cookie", "BX=0dmjfadbcq8mk&b=4&d=ojEMzEJpYEKsFxYcdQWW7w--&s=ni&i=lzQj_u3eJixWTEoqnl5k");
			httpget.setHeader("Host", "query.yahooapis.com");
			httpget.setHeader("Upgrade-Insecure-Requests", "1");
			httpget.setHeader("User-Agent",
					"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36");
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				logger.info("Get weather of {} response: {}", city, s);
				JSONObject rspJson = new JSONObject(s);
				int count = rspJson.getJSONObject("query").getInt("count");
				if (count == 1) {
					return rspJson.getJSONObject("query").getJSONObject("results").getJSONObject("channel").toString();
				}
			} else {
				logger.error("Get weather of {} response code: {}", city, status);
			}
			httpclient.close();

			return "";
		} catch (Exception e) {
			logger.error("get weather of {} error", city, e);
			return "";
		}
	}
}
