package com.broadvideo.pixsignage.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message", "data" })
public class ObjectRetRespEntity extends BasicRetRespEntity {
	public ObjectRetRespEntity(Integer code, String message, Object data) {
		super(code, message);
		this.data = data;

	}

	@JsonProperty(value = "data")
	private Object data;


	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

}
