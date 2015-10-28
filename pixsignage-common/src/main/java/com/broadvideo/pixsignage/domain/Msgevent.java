package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Msgevent {
	private Integer msgeventid;

	private Integer deviceid;

	private String uuid;

	private String type;

	private Integer relateid;

	private String status;

	private String description;

	private Date createtime;

	private Date sendtime;

	private Date recvtime;

	public Integer getMsgeventid() {
		return msgeventid;
	}

	public void setMsgeventid(Integer msgeventid) {
		this.msgeventid = msgeventid;
	}

	public Integer getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(Integer deviceid) {
		this.deviceid = deviceid;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid == null ? null : uuid.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public Integer getRelateid() {
		return relateid;
	}

	public void setRelateid(Integer relateid) {
		this.relateid = relateid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getSendtime() {
		return sendtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setSendtime(Date sendtime) {
		this.sendtime = sendtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getRecvtime() {
		return recvtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setRecvtime(Date recvtime) {
		this.recvtime = recvtime;
	}
}