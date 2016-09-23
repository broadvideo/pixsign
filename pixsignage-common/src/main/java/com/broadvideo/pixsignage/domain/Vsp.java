package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Vsp {
	private Integer vspid;

	private String name;

	private String code;

	private Integer maxdevices;

	private Long maxstorage;

	private Integer currentdevices;

	private Long currentstorage;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	public Integer getVspid() {
		return vspid;
	}

	public void setVspid(Integer vspid) {
		this.vspid = vspid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code == null ? null : code.trim();
	}

	public Integer getMaxdevices() {
		return maxdevices;
	}

	public void setMaxdevices(Integer maxdevices) {
		this.maxdevices = maxdevices;
	}

	public Long getMaxstorage() {
		return maxstorage;
	}

	public void setMaxstorage(Long maxstorage) {
		this.maxstorage = maxstorage;
	}

	public Integer getCurrentdevices() {
		return currentdevices;
	}

	public void setCurrentdevices(Integer currentdevices) {
		this.currentdevices = currentdevices;
	}

	public Long getCurrentstorage() {
		return currentstorage;
	}

	public void setCurrentstorage(Long currentstorage) {
		this.currentstorage = currentstorage;
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