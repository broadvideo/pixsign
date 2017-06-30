package com.broadvideo.pixsignage.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message" })
public class BasicRetRespEntity {

	protected int retcode;
	protected String message;

	public BasicRetRespEntity() {

	}
	public BasicRetRespEntity(Integer retcode) {

		this.retcode = retcode;
	}
	public BasicRetRespEntity(Integer retcode, String message) {

		this.retcode = retcode;
		if (message == null) {
			this.message = " ";
		} else {
		this.message = message;
		}
	}

	@JsonProperty("retcode")
	public int getRetcode() {
		return retcode;
	}

	public void setRetcode(int retcode) {
		this.retcode = retcode;
	}

	@JsonProperty(value = "message")
	public String getMessage() {

		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
