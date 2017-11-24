package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Devicefile {
	public final static String ObjType_Video = "1";
	public final static String ObjType_Image = "2";
	public final static String ObjType_Audio = "3";
	public final static String ObjType_CropVideo = "8";
	public final static String ObjType_CropImage = "9";

	private Integer devicefileid;

	private Integer deviceid;

	private String objtype;

	private Integer objid;

	private Long size;

	private Integer progress;

	private String status;

	private String description;

	private Date createtime;

	private Date updatetime;

	private Video video;

	private Image image;

	private Mmediadtl mmediadtl;

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

	public String getObjtype() {
		return objtype;
	}

	public void setObjtype(String objtype) {
		this.objtype = objtype == null ? null : objtype.trim();
	}

	public Integer getObjid() {
		return objid;
	}

	public void setObjid(Integer objid) {
		this.objid = objid;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	public Integer getProgress() {
		return progress;
	}

	public void setProgress(Integer progress) {
		this.progress = progress;
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
	public Date getUpdatetime() {
		return updatetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setUpdatetime(Date updatetime) {
		this.updatetime = updatetime;
	}

	public Video getVideo() {
		return video;
	}

	public void setVideo(Video video) {
		this.video = video;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public Mmediadtl getMmediadtl() {
		return mmediadtl;
	}

	public void setMmediadtl(Mmediadtl mmediadtl) {
		this.mmediadtl = mmediadtl;
	}
}