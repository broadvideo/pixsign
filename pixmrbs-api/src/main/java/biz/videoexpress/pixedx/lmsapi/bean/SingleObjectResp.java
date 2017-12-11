package biz.videoexpress.pixedx.lmsapi.bean;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message", "data" })
public class SingleObjectResp<T> {

	private int retcode;
	private String message;
	private T data;

	@JsonProperty("retcode")
	public int getRetcode() {
		return retcode;
	}

	public void setRetcode(int retcode) {
		this.retcode = retcode;
	}

	@JsonProperty("message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@JsonProperty("data")
	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

}
