package com.broadvideo.pixsignage.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class ResBase {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	protected static Map<Integer, Integer> roomPersonMap = new HashMap<Integer, Integer>();
	static {
		roomPersonMap.put(0, 0); // 信发类
		roomPersonMap.put(1, 3);// vip签到
		roomPersonMap.put(2, 2);// 员工考勤
		roomPersonMap.put(4, 1);// 班牌考勤

	}
	protected String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		logger.info("{}  response: {}", this.getClass().getName(), responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, List data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("{} response: {}", this.getClass().getName(), responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, Map<String, Object> data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info(" {} response: {}", this.getClass().getName(), responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, JSONObject data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("{} response: {}", this.getClass().getName(), responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, JSONArray data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("{} response: {}", this.getClass().getName(), responseJson.toString());
		return responseJson.toString();
	}

	protected String getImageUrl(String serverIP, String imgpath) {
		return "http://" + serverIP + "/pixsigdata" + imgpath;
	}


}
