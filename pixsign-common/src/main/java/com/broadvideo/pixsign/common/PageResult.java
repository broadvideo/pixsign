package com.broadvideo.pixsign.common;

import java.util.Collections;
import java.util.List;

public class PageResult<T> {

	private PageInfo pageInfo;
	// 返回结果
	private List<T> result = Collections.emptyList();
	// 记录总数
	private Integer totalCount = -1;


	public PageResult(int totalCount, List<T> result, PageInfo pageInfo) {
		this.totalCount = totalCount;
		this.result = result;
		this.pageInfo = pageInfo;
	}

	public PageInfo getPageInfo() {
		return pageInfo;
	}

	public void setPageInfo(PageInfo pageInfo) {
		this.pageInfo = pageInfo;
	}

	public List<T> getResult() {
		return result;
	}

	public void setResult(List<T> result) {
		this.result = result;
	}

	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}



}
