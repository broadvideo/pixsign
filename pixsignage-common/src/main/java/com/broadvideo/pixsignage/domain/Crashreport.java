package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Crashreport {
	private Integer crashreportid;

	private String hardkey;

	private String terminalid;

	private String clientip;

	private String clientname;

	private String os;

	private String appname;

	private String vname;

	private String vcode;

	private String resolution;

	private String other;

	private Date createtime;

	private String stack;

	public Integer getCrashreportid() {
		return crashreportid;
	}

	public void setCrashreportid(Integer crashreportid) {
		this.crashreportid = crashreportid;
	}

	public String getHardkey() {
		return hardkey;
	}

	public void setHardkey(String hardkey) {
		this.hardkey = hardkey == null ? null : hardkey.trim();
	}

	public String getTerminalid() {
		return terminalid;
	}

	public void setTerminalid(String terminalid) {
		this.terminalid = terminalid == null ? null : terminalid.trim();
	}

	public String getClientip() {
		return clientip;
	}

	public void setClientip(String clientip) {
		this.clientip = clientip == null ? null : clientip.trim();
	}

	public String getClientname() {
		return clientname;
	}

	public void setClientname(String clientname) {
		this.clientname = clientname == null ? null : clientname.trim();
	}

	public String getOs() {
		return os;
	}

	public void setOs(String os) {
		this.os = os == null ? null : os.trim();
	}

	public String getAppname() {
		return appname;
	}

	public void setAppname(String appname) {
		this.appname = appname == null ? null : appname.trim();
	}

	public String getVname() {
		return vname;
	}

	public void setVname(String vname) {
		this.vname = vname == null ? null : vname.trim();
	}

	public String getVcode() {
		return vcode;
	}

	public void setVcode(String vcode) {
		this.vcode = vcode == null ? null : vcode.trim();
	}

	public String getResolution() {
		return resolution;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution == null ? null : resolution.trim();
	}

	public String getOther() {
		return other;
	}

	public void setOther(String other) {
		this.other = other == null ? null : other.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public String getStack() {
		return stack;
	}

	public void setStack(String stack) {
		this.stack = stack == null ? null : stack.trim();
	}
}