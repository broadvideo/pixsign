package com.broadvideo.pixsign.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Devicefilehis {
	public final static String ObjType_Video = "1";
	public final static String ObjType_Image = "2";
	public final static String ObjType_Audio = "3";
	public final static String ObjType_CropVideo = "8";
	public final static String ObjType_CropImage = "9";

	private Integer devicefilehisid;

	private Integer deviceid;

	private String objtype;

	private Integer objid;

	private Long size;

	private Date createtime;

	public Integer getDevicefilehisid() {
		return devicefilehisid;
	}

	public void setDevicefilehisid(Integer devicefilehisid) {
		this.devicefilehisid = devicefilehisid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
}