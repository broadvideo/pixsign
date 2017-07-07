package com.broadvideo.pixsignage.common;

import java.io.Serializable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 与具体ORM实现无关的分页参数及查询结果封装.
 * 
 * 
 * Page中记录的类型.
 * 
 */
public class PageInfo implements Serializable {

	private static final long serialVersionUID = 2468093376898910699L;
	protected final Logger logger = LoggerFactory.getLogger(getClass());

	// 公共变量
	public static final String ASC = "asc";
	public static final String DESC = "desc";
	private Integer start;
	private Integer length;
	private String orderBy = null;
	private String order = null;

	public PageInfo(Integer start, Integer length) {
		this.start = start;
		this.length = length;

	}


	public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public Integer getLength() {
		return length;
	}

	public void setLength(Integer length) {
		this.length = length;
	}


	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

	public String getOrder() {
		return order;
	}

	public void setOrder(String order) {
		this.order = order;
	}

	public PageInfo() {
		super();
	}




}
