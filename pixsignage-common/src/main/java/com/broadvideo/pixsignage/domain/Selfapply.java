package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Selfapply {
	private Integer selfapplyid;

	private String email;

	private String mobile;

	private String name;

	private String orgname;

	private String orgcode;

	private String description;

	private String status;

	private String auditmemo;

	private Date createtime;

	public Integer getSelfapplyid() {
		return selfapplyid;
	}

	public void setSelfapplyid(Integer selfapplyid) {
		this.selfapplyid = selfapplyid;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email == null ? null : email.trim();
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile == null ? null : mobile.trim();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getOrgname() {
		return orgname;
	}

	public void setOrgname(String orgname) {
		this.orgname = orgname == null ? null : orgname.trim();
	}

	public String getOrgcode() {
		return orgcode;
	}

	public void setOrgcode(String orgcode) {
		this.orgcode = orgcode == null ? null : orgcode.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getAuditmemo() {
		return auditmemo;
	}

	public void setAuditmemo(String auditmemo) {
		this.auditmemo = auditmemo == null ? null : auditmemo.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
}