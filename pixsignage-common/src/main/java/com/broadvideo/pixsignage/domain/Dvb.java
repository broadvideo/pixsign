package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Dvb {
	private Integer dvbid;

	private Integer orgid;

	private String name;

	private String frequency;

	private String number;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	public Integer getDvbid() {
		return dvbid;
	}

	public void setDvbid(Integer dvbid) {
		this.dvbid = dvbid;
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

	public String getFrequency() {
		return frequency;
	}

	public void setFrequency(String frequency) {
		this.frequency = frequency == null ? null : frequency.trim();
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number == null ? null : number.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Integer getCreatestaffid() {
		return createstaffid;
	}

	public void setCreatestaffid(Integer createstaffid) {
		this.createstaffid = createstaffid;
	}
}