package com.broadvideo.pixsignage.action;

import java.util.List;

public class BaseDatatableAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3168820965178598735L;
	
	private String sEcho = null;
	private Integer iTotalRecords = null;
	private Integer iTotalDisplayRecords = null;
	private List<Object> aaData = null;
	
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
