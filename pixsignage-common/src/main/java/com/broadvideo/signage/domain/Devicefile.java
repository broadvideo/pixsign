package com.broadvideo.signage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Devicefile {
	private Integer devicefileid;

	private Integer deviceid;

	private String uploadtype;

	private String filetype;

	private Integer fileid;

	private String filename;

	private String fileuri;

	private Long filesize;

	private String md5;

	private Integer complete;

	private String status;

	private String name;

	private String syncstatus;

	private String description;

	private Date createtime;

	private Date updatetime;

	private Device device;

	private Media media;

	public Integer getDevicefileid() {
		return devicefileid;
	}

	public void setDevicefileid(Integer devicefileid) {
		this.devicefileid = devicefileid;
	}

	public Integer getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(Integer deviceid) {
		this.deviceid = deviceid;
	}

	public String getUploadtype() {
		return uploadtype;
	}

	public void setUploadtype(String uploadtype) {
		this.uploadtype = uploadtype;
	}

	public String getFiletype() {
		return filetype;
	}

	public void setFiletype(String filetype) {
		this.filetype = filetype == null ? null : filetype.trim();
	}

	public Integer getFileid() {
		return fileid;
	}

	public void setFileid(Integer fileid) {
		this.fileid = fileid;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename == null ? null : filename.trim();
	}

	public String getFileuri() {
		return fileuri;
	}

	public void setFileuri(String fileuri) {
		this.fileuri = fileuri == null ? null : fileuri.trim();
	}

	public Long getFilesize() {
		return filesize;
	}

	public void setFilesize(Long filesize) {
		this.filesize = filesize;
	}

	public String getMd5() {
		return md5;
	}

	public void setMd5(String md5) {
		this.md5 = md5 == null ? null : md5.trim();
	}

	public Integer getComplete() {
		return complete;
	}

	public void setComplete(Integer complete) {
		this.complete = complete;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSyncstatus() {
		return syncstatus;
	}

	public void setSyncstatus(String syncstatus) {
		this.syncstatus = syncstatus;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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
	public Date getUpdatetime() {
		return updatetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setUpdatetime(Date updatetime) {
		this.updatetime = updatetime;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public Media getMedia() {
		return media;
	}

	public void setMedia(Media media) {
		this.media = media;
	}

}