package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Bundleschedule {
	public final static String BindType_Device = "1";
	public final static String BindType_DeviceGroup = "2";

	public final static String PlayMode_Once = "1";
	public final static String PlayMode_Daily = "2";

	private Integer bundlescheduleid;

	private String bindtype;

	private Integer bindid;

	private Integer bundleid;

	private String playmode;

	private Date playdate;

	private Date starttime;

	private Date endtime;

	private Date createtime;

	private Date tempstarttime;

	private Bundle bundle;

	public Integer getBundlescheduleid() {
		return bundlescheduleid;
	}

	public void setBundlescheduleid(Integer bundlescheduleid) {
		this.bundlescheduleid = bundlescheduleid;
	}

	public String getBindtype() {
		return bindtype;
	}

	public void setBindtype(String bindtype) {
		this.bindtype = bindtype == null ? null : bindtype.trim();
	}

	public Integer getBindid() {
		return bindid;
	}

	public void setBindid(Integer bindid) {
		this.bindid = bindid;
	}

	public Integer getBundleid() {
		return bundleid;
	}

	public void setBundleid(Integer bundleid) {
		this.bundleid = bundleid;
	}

	public String getPlaymode() {
		return playmode;
	}

	public void setPlaymode(String playmode) {
		this.playmode = playmode == null ? null : playmode.trim();
	}

	@JSON(format = "yyyy-MM-dd")
	public Date getPlaydate() {
		return playdate;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setPlaydate(Date playdate) {
		this.playdate = playdate;
	}

	@JSON(format = "HH:mm:ss")
	public Date getStarttime() {
		return starttime;
	}

	@JSON(format = "HH:mm:ss")
	public void setStarttime(Date starttime) {
		this.starttime = starttime;
	}

	@JSON(format = "HH:mm:ss")
	public Date getEndtime() {
		return endtime;
	}

	@JSON(format = "HH:mm:ss")
	public void setEndtime(Date endtime) {
		this.endtime = endtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Date getTempstarttime() {
		return tempstarttime;
	}

	public void setTempstarttime(Date tempstarttime) {
		this.tempstarttime = tempstarttime;
	}

	public Bundle getBundle() {
		return bundle;
	}

	public void setBundle(Bundle bundle) {
		this.bundle = bundle;
	}
}