package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Vchannel {
	private Integer vchannelid;

	private Integer orgid;

	private String name;

	private String uuid;

	private Integer backupvideoid;

	private String status;

	private String description;

	private Date createtime;

	private Video backupvideo;

	public Integer getVchannelid() {
		return vchannelid;
	}

	public void setVchannelid(Integer vchannelid) {
		this.vchannelid = vchannelid;
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

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid == null ? null : uuid.trim();
	}

	public Integer getBackupvideoid() {
		return backupvideoid;
	}

	public void setBackupvideoid(Integer backupvideoid) {
		this.backupvideoid = backupvideoid;
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

	public Video getBackupvideo() {
		return backupvideo;
	}

	public void setBackupvideo(Video backupvideo) {
		this.backupvideo = backupvideo;
	}
}