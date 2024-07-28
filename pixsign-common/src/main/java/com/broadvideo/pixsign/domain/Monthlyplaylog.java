package com.broadvideo.pixsign.domain;

import java.util.Date;

public class Monthlyplaylog {
	private Integer monthlyplaylogid;

	private Integer orgid;

	private Integer branchid;

	private Integer deviceid;

	private String mediatype;

	private Integer mediaid;

	private String playmonth;

	private Integer total;

	private Date createtime;

	public Integer getMonthlyplaylogid() {
		return monthlyplaylogid;
	}

	public void setMonthlyplaylogid(Integer monthlyplaylogid) {
		this.monthlyplaylogid = monthlyplaylogid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getBranchid() {
		return branchid;
	}

	public void setBranchid(Integer branchid) {
		this.branchid = branchid;
	}

	public Integer getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(Integer deviceid) {
		this.deviceid = deviceid;
	}

	public String getMediatype() {
		return mediatype;
	}

	public void setMediatype(String mediatype) {
		this.mediatype = mediatype == null ? null : mediatype.trim();
	}

	public Integer getMediaid() {
		return mediaid;
	}

	public void setMediaid(Integer mediaid) {
		this.mediaid = mediaid;
	}

	public String getPlaymonth() {
		return playmonth;
	}

	public void setPlaymonth(String playmonth) {
		this.playmonth = playmonth == null ? null : playmonth.trim();
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
}