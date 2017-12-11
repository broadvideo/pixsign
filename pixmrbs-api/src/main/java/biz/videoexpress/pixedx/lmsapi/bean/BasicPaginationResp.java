package biz.videoexpress.pixedx.lmsapi.bean;

import biz.videoexpress.pixedx.lmsapi.common.BasicResp;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message", "pagination", "data" })
public class BasicPaginationResp<T> extends BasicResp<T> {

	private Pagination pagination;

	@JsonProperty("pagination")
	public Pagination getPagination() {
		return pagination;
	}

	public void setPagination(Pagination pagination) {
		this.pagination = pagination;
	}

}
