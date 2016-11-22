package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Wxdevice {
	private Integer wxdeviceid;

	private Integer orgid;

	private Integer wxdeviceapplyid;

	private String uuid;

	private Integer major;

	private Integer minor;

	private String wxstatus;

	private Date activetime;

	private Integer poiid;

	private String comment;

	private Integer deviceid;

	private Date bindtime;

	private Date createtime;

	private Device device;

	public Integer getWxdeviceid() {
		return wxdeviceid;
	}

	public void setWxdeviceid(Integer wxdeviceid) {
		this.wxdeviceid = wxdeviceid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getWxdeviceapplyid() {
		return wxdeviceapplyid;
	}

	public void setWxdeviceapplyid(Integer wxdeviceapplyid) {
		this.wxdeviceapplyid = wxdeviceapplyid;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid == null ? null : uuid.trim();
	}

	public Integer getMajor() {
		return major;
	}

	public void setMajor(Integer major) {
		this.major = major;
	}

	public Integer getMinor() {
		return minor;
	}

	public void setMinor(Integer minor) {
		this.minor = minor;
	}

	public String getWxstatus() {
		return wxstatus;
	}

	public void setWxstatus(String wxstatus) {
		this.wxstatus = wxstatus == null ? null : wxstatus.trim();
	}

	public Date getActivetime() {
		return activetime;
	}

	public void setActivetime(Date activetime) {
		this.activetime = activetime;
	}

	public Integer getPoiid() {
		return poiid;
	}

	public void setPoiid(Integer poiid) {
		this.poiid = poiid;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment == null ? null : comment.trim();
	}

	public Integer getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(Integer deviceid) {
		this.deviceid = deviceid;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getBindtime() {
		return bindtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setBindtime(Date bindtime) {
		this.bindtime = bindtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}
}