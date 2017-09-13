package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Dailyplaylog {
	private Integer dailyplaylogid;

	private Integer orgid;

	private Integer branchid;

	private Integer deviceid;

	private String mediatype;

	private Integer mediaid;

	private String playdate;

	private Integer total;

	private Date createtime;

	public Integer getDailyplaylogid() {
		return dailyplaylogid;
	}

	public void setDailyplaylogid(Integer dailyplaylogid) {
		this.dailyplaylogid = dailyplaylogid;
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

	public String getPlaydate() {
		return playdate;
	}

	public void setPlaydate(String playdate) {
		this.playdate = playdate;
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