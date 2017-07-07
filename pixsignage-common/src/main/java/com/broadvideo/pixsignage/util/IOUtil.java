package com.broadvideo.pixsignage.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.util.Arrays;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class IOUtil {

	public static void deleteFile(File oldPath) {
		if (oldPath.isDirectory()) {
			File[] files = oldPath.listFiles();
			for (File file : files) {
				deleteFile(file);
			}
			oldPath.delete();
		} else {
			oldPath.delete();
		}
	}

	public static void mkdirs(String path) {
		if (path != null) {
			new File(path).mkdirs();
		}
	}

	public static int download2File(String url, String filepath) throws Exception {
		File file = new File(filepath);
		if (file.exists()) {
			file.delete();
		}

		RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
				.setConnectionRequestTimeout(30000).build();
		CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
		try {
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				FileOutputStream fileOutputStream = new FileOutputStream(file);
				fileOutputStream.write(EntityUtils.toByteArray(response.getEntity()));
				fileOutputStream.close();
			}
			return status;
		} finally {
			httpclient.close();
		}
	}

	public static byte[] download2Bytes(String url) throws Exception {
		RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
				.setConnectionRequestTimeout(30000).build();
		CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
		try {
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			return EntityUtils.toByteArray(response.getEntity());
		} finally {
			httpclient.close();
		}
	}

	public static String download2String(String url) throws Exception {
		RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
				.setConnectionRequestTimeout(30000).build();
		CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
		try {
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			return EntityUtils.toString(response.getEntity());
		} finally {
			httpclient.close();
		}
	}

	public static String findFile(File dir, final String prefix) {
		File[] files = dir.listFiles(new FilenameFilter() {
			@Override
			public boolean accept(File dir, String name) {
				return name.startsWith(prefix);
			}
		});
		if (files != null && files.length > 0) {
			Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);
			return files[0].getName();
		}
		return "";
	}

}
