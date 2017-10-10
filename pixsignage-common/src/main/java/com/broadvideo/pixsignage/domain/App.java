package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class App {
	private Integer appid;

	private String name;

	private String mtype;

	private String sname;

	private String description;

	private Date createtime;

	private Appfile appfile;

	public Integer getAppid() {
		return appid;
	}

	public void setAppid(Integer appid) {
		this.appid = appid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getMtype() {
		return mtype;
	}

	public void setMtype(String mtype) {
		this.mtype = mtype == null ? null : mtype.trim();
	}

	public String getSname() {
		return sname;
	}

	public void setSname(String sname) {
		this.sname = sname == null ? null : sname.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Appfile getAppfile() {
		return appfile;
	}

	public void setAppfile(Appfile appfile) {
		this.appfile = appfile;
	}
}