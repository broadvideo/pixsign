package com.broadvideo.pixsign.action;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import com.broadvideo.pixsign.common.PageInfo;

public class BaseDatatableAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3168820965178598735L;

	private String sEcho = null;
	private Integer iTotalRecords = null;
	private Integer iTotalDisplayRecords = null;
	private List<Object> aaData = null;

	protected PageInfo initPageInfo() {
		this.setsEcho(getParameter("sEcho"));
		String start = getParameter("iDisplayStart");
		String length = getParameter("iDisplayLength");
		PageInfo pageInfo = new PageInfo();
		if (StringUtils.isBlank(start)) {
			pageInfo.setStart(0);
		} else {
			pageInfo.setStart(NumberUtils.toInt(start));
		}
		if (StringUtils.isBlank(length)) {
			pageInfo.setLength(10);
		} else {
			pageInfo.setLength(NumberUtils.toInt(length));
		}
		return pageInfo;
	}

	public String getsEcho() {
		return sEcho;
	}

	public void setsEcho(String sEcho) {
		this.sEcho = sEcho;
	}

	public Integer getiTotalRecords() {
		return iTotalRecords;
	}

	public void setiTotalRecords(Integer iTotalRecords) {
		this.iTotalRecords = iTotalRecords;
	}

	public Integer getiTotalDisplayRecords() {
		return iTotalDisplayRecords;
	}

	public void setiTotalDisplayRecords(Integer iTotalDisplayRecords) {
		this.iTotalDisplayRecords = iTotalDisplayRecords;
	}

	public List<Object> getAaData() {
		return aaData;
	}

	public void setAaData(List<Object> aaData) {
		this.aaData = aaData;
	}

}
