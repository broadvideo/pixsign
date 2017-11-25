package com.broadvideo.pixsignage.util;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * httpclient工具类
 * 
 * @author charles
 *
 */
public class HttpClientUtils {

	private static Logger logger = LoggerFactory.getLogger(HttpClientUtils.class);

	private static final String ENCODE_CHARSET_UTF8 = "UTF-8";
	/**
	 * 连接超时
	 */
	private static final int CONNECTION_TIMEOUT = 3 * 1000;

	private static final int SOCKET_TIMEOUT = 3 * 1000;

	public static SimpleHttpResponse doHttpRequest(HttpRequestBase httpRequest, Header[] headers) throws Exception {

		CloseableHttpClient httpclient = HttpClients.custom().disableAutomaticRetries()
				.setRetryHandler(new DefaultHttpRequestRetryHandler(0, false)).build();
		long t1 = System.currentTimeMillis();
		try {
			logger.info("Create simple httpclient with no retry...");
			RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(SOCKET_TIMEOUT)
					.setConnectTimeout(CONNECTION_TIMEOUT)
					.build();
			httpRequest.setConfig(requestConfig);
			if (headers != null) {
				httpRequest.setHeaders(headers);
			}
			HttpResponse response = httpclient.execute(httpRequest);
			int statusCode = response.getStatusLine().getStatusCode();
			String responseBody = null;
			if (response.getEntity() != null) {
				responseBody = EntityUtils.toString(response.getEntity(), ENCODE_CHARSET_UTF8);
			}
			return new SimpleHttpResponse(statusCode, responseBody);

		} catch (IOException e) {

			e.printStackTrace();
			throw new IOException("httpclient io异常！" + e.getMessage(), e);
		} finally {

			if (httpclient != null) {
				httpclient.close();
			}
			long t2 = System.currentTimeMillis();
			logger.info("######doRequest({}) cost:{}ms", httpRequest.getURI(), t2 - t1);

		}

	}



	public static SimpleHttpResponse doFormPost(String url, String params) throws Exception {
		logger.info("do Post：url={},params={}", url, params);

		HttpPost httpPost = new HttpPost(url);
		if (StringUtils.isNotBlank(params)) {

			StringEntity entity = new StringEntity(params, ContentType.APPLICATION_FORM_URLENCODED);
			httpPost.setEntity(entity);
		}

		return doHttpRequest(httpPost, null);

	}

	public static SimpleHttpResponse doPost(String url, String bodyJson) throws Exception {
		HttpPost httpPost = new HttpPost(url);
		if (StringUtils.isNotBlank(bodyJson)) {
			StringEntity reqEntity = new StringEntity(bodyJson, ContentType.APPLICATION_JSON);
			httpPost.setEntity(reqEntity);
		}
		return doHttpRequest(httpPost, null);

	}


	public static SimpleHttpResponse doGet(String url, Map<String, String> paramsMap, Header[] headers)
			throws Exception {
		logger.info("do Get：url={}.........", url);

		HttpGet httpGet = new HttpGet();
		String queryStr = "";
		if (paramsMap != null) {

			Iterator<Map.Entry<String, String>> it = paramsMap.entrySet().iterator();
			List<NameValuePair> params = new ArrayList<NameValuePair>();
			while (it.hasNext()) {
				Map.Entry<String, String> entry = it.next();
				params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));

			}

			queryStr = EntityUtils.toString(new UrlEncodedFormEntity(params));


		}
		String wrapperUrl = url;
		if (!StringUtils.isBlank(queryStr)) {
			if (!url.contains("?")) {

				wrapperUrl += "?" + queryStr;
			} else {

				wrapperUrl += "&" + queryStr;
			}
		}

		httpGet.setURI(new URI(wrapperUrl));
		return doHttpRequest(httpGet, headers);

	}





	public static class SimpleHttpResponse {

		public SimpleHttpResponse(int _statusCode, String _body) {
			this.statusCode = _statusCode;
			this.body = _body;
		}

		private int statusCode;

		private String body;

		public int getStatusCode() {
			return statusCode;
		}

		public void setStatusCode(int statusCode) {
			this.statusCode = statusCode;
		}

		public String getBody() {
			if (body != null) {
				return body.replaceAll("\\r\\n", "");

			}
			return body;
		}

		public void setBody(String body) {
			if (body != null) {
			this.body = body.replaceAll("\\r\\n", "");
			} else {
				this.body = body;
			}
		}

		@Override
		public String toString() {
			StringBuilder builder = new StringBuilder();
			builder.append("SimpleHttpResponse [statusCode=");
			builder.append(statusCode);
			builder.append(", body=");
			builder.append(body);
			builder.append("]");
			return builder.toString();
		}

	}




}