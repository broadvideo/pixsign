package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Wxinfo {
	private Integer wxinfoid;

	private Integer orgid;

	private String wxappid;

	private String wxsecret;

	private String validflag;

	private String comment;

	private String accesstocken;

	private Date applytime;

	private Date expiretime;

	public Integer getWxinfoid() {
		return wxinfoid;
	}

	public void setWxinfoid(Integer wxinfoid) {
		this.wxinfoid = wxinfoid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public String getWxappid() {
		return wxappid;
	}

	public void setWxappid(String wxappid) {
		this.wxappid = wxappid == null ? null : wxappid.trim();
	}

	public String getWxsecret() {
		return wxsecret;
	}

	public void setWxsecret(String wxsecret) {
		this.wxsecret = wxsecret == null ? null : wxsecret.trim();
	}

	public String getValidflag() {
		return validflag;
	}

	public void setValidflag(String validflag) {
		this.validflag = validflag;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getAccesstocken() {
		return accesstocken;
	}

	public void setAccesstocken(String accesstocken) {
		this.accesstocken = accesstocken == null ? null : accesstocken.trim();
	}

	public Date getApplytime() {
		return applytime;
	}

	public void setApplytime(Date applytime) {
		this.applytime = applytime;
	}

	public Date getExpiretime() {
		return expiretime;
	}

	public void setExpiretime(Date expiretime) {
		this.expiretime = expiretime;
	}
}