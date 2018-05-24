package com.broadvideo.pixcourse.common;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "code", "message", "data" })
public class BasicResp<T> {

	private int code;
	private String message;
	private List<T> data = new ArrayList<T>();

	@JsonProperty("code")
	public int getRetcode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	@JsonProperty(value = "message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@JsonProperty("data")
	public List<T> getData() {
		return data;
	}

	public void setData(List<T> data) {
		this.data = data;
	}

	public static void main(String[] args) {

		BasicResp<String> resp = new BasicResp<String>();
		JsonMapper jsonMapper = new JsonMapper();
		String jsonStr = jsonMapper.toJson(resp);
		System.out.println(jsonStr);

	}
}
