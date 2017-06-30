package com.broadvideo.pixsignage.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * 返回单个数值类型
 * 
 * @author charles
 *
 */
@JsonPropertyOrder({ "retcode", "message", "retval" })
public class ValRetRespEntity extends BasicRetRespEntity {
	@JsonProperty("retval")
	private int retval;

	public ValRetRespEntity() {

	}

	public ValRetRespEntity(Integer code, String message, int retval) {
		super(code, message);
		this.retval = retval;

	}

	public int getRetval() {
		return retval;
	}

	public void setRetval(int retval) {
		this.retval = retval;
	}


}
