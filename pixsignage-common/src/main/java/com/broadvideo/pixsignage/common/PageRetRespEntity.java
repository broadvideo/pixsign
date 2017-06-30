package com.broadvideo.pixsignage.common;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message", "recordsTotal", "recordsFiltered", "data" })
public class PageRetRespEntity extends BasicRetRespEntity {

	private Integer recordsTotal;
	private Integer recordsFiltered;
	private List<Object> data = new ArrayList<Object>();
	

	public PageRetRespEntity(Integer code, String message, Integer recordsTotal, Integer recordsFiltered,
 List data) {

		super(code, message);
		this.recordsTotal = recordsTotal;
		this.recordsFiltered = recordsFiltered;
		this.data = data;
	}


	@JsonProperty("recordsTotal")
	public Integer getRecordsTotal() {
		return recordsTotal;
	}

	public void setRecordsTotal(Integer recordsTotal) {
		this.recordsTotal = recordsTotal;
	}

	@JsonProperty("recordsFiltered")
	public Integer getRecordsFiltered() {
		return recordsFiltered;
	}

	public void setRecordsFiltered(Integer recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}

	@JsonProperty("data")
	public List<Object> getData() {
		return data;
	}

	public void setData(List<Object> data) {
		this.data = data;
	}

}
