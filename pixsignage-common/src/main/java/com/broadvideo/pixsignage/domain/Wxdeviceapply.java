package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Wxdeviceapply {
	private Integer wxdeviceapplyid;

	private Integer orgid;

	private String name;

	private Integer count;

	private String reason;

	private Date applytime;

	private Integer applyid;

	private String status;

	private String comment;

	private Date audittime;

	public Integer getWxdeviceapplyid() {
		return wxdeviceapplyid;
	}

	public void setWxdeviceapplyid(Integer wxdeviceapplyid) {
		this.wxdeviceapplyid = wxdeviceapplyid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason == null ? null : reason.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getApplytime() {
		return applytime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setApplytime(Date applytime) {
		this.applytime = applytime;
	}

	public Integer getApplyid() {
		return applyid;
	}

	public void setApplyid(Integer applyid) {
		this.applyid = applyid;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getAudittime() {
		return audittime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setAudittime(Date audittime) {
		this.audittime = audittime;
	}
}