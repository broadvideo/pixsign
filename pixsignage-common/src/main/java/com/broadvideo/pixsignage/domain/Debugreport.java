package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Debugreport {
	private Integer debugreportid;

	private Integer deviceid;

	private String hardkey;

	private String filepath;

	private Date createtime;

	private Device device;

	public Integer getDebugreportid() {
		return debugreportid;
	}

	public void setDebugreportid(Integer debugreportid) {
		this.debugreportid = debugreportid;
	}

	public Integer getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(Integer deviceid) {
		this.deviceid = deviceid;
	}

	public String getHardkey() {
		return hardkey;
	}

	public void setHardkey(String hardkey) {
		this.hardkey = hardkey == null ? null : hardkey.trim();
	}

	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath == null ? null : filepath.trim();
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