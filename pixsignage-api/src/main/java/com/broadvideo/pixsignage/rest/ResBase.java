package com.broadvideo.pixsignage.rest;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class ResBase {
	protected Logger logger = LoggerFactory.getLogger(getClass());

	protected String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		logger.info("QRCodes Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, List<Map<String, Object>> data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("QRCodes Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, Map<String, Object> data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("QRCodes Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, JSONObject data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("QRCodes Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	protected String handleResult(int code, String message, JSONArray data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("QRCodes Service response: {}", responseJson.toString());
		return responseJson.toString();
	}



}
