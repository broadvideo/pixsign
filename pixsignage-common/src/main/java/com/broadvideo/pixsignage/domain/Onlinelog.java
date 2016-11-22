package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Onlinelog {
	private Integer onlinelogid;

	private Integer orgid;

	private Integer branchid;

	private Integer deviceid;

	private Date onlinetime;

	private Date offlinetime;

	private Integer duration;

	public Integer getOnlinelogid() {
		return onlinelogid;
	}

	public void setOnlinelogid(Integer onlinelogid) {
		this.onlinelogid = onlinelogid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getOnlinetime() {
		return onlinetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setOnlinetime(Date onlinetime) {
		this.onlinetime = onlinetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getOfflinetime() {
		return offlinetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setOfflinetime(Date offlinetime) {
		this.offlinetime = offlinetime;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}
}