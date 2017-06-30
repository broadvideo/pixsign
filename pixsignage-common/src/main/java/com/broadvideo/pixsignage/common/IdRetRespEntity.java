package com.broadvideo.pixsignage.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * 用于新增数据，返回id值
 * 
 * @author charles
 *
 */
@JsonPropertyOrder({ "retcode", "message", "id" })
public class IdRetRespEntity extends BasicRetRespEntity {

	private Object retId;

	public IdRetRespEntity(Integer code, String message, Object retId) {
		super(code, message);
		this.retId = retId;

	}

	@JsonProperty("id")
	public Object getRetId() {
		return retId;
	}

	public void setRetId(Object retId) {
		this.retId = retId;
	}

}
