package com.broadvideo.signage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Device {
	private Integer deviceid;

	private Integer orgid;

	private Integer branchid;

	private String terminalid;

	private String hardkey;

	private String name;

	private String position;

	private String ip;

	private String mac;

	private String schedulestatus;

	private String filestatus;

	private String configstatus;

	private String status;

	private String description;

	private Date createtime;

	private String onlineflag;

	private Integer onlinelayoutid;

	private Integer onlinemediaid;

	private Integer rate;

	private String version;

	private String upgradeversion;

	private String upgradestatus;

	private Date lastservertime;

	private Date lastlocaltime;

	private String type;

	private String groupcode;

	private String metrotype;

	private Integer metrolineid;

	private Integer metrostationid;

	private Integer metroplatformid;

	private String metrodirection;

	private Metroline metroline;

	private Metrostation metrostation;

	public Integer getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(Integer deviceid) {
		this.deviceid = deviceid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getBranchid() {
		return branchid;
	}

	public void setBranchid(Integer branchid) {
		this.branchid = branchid;
	}

	public String getTerminalid() {
		return terminalid;
	}

	public void setTerminalid(String terminalid) {
		this.terminalid = terminalid == null ? null : terminalid.trim();
	}

	public String getHardkey() {
		return hardkey;
	}

	public void setHardkey(String hardkey) {
		this.hardkey = hardkey == null ? null : hardkey.trim();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position == null ? null : position.trim();
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip == null ? null : ip.trim();
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac == null ? null : mac.trim();
	}

	public String getSchedulestatus() {
		return schedulestatus;
	}

	public void setSchedulestatus(String schedulestatus) {
		this.schedulestatus = schedulestatus == null ? null : schedulestatus.trim();
	}

	public String getFilestatus() {
		return filestatus;
	}

	public void setFilestatus(String filestatus) {
		this.filestatus = filestatus == null ? null : filestatus.trim();
	}

	public String getConfigstatus() {
		return configstatus;
	}

	public void setConfigstatus(String configstatus) {
		this.configstatus = configstatus == null ? null : configstatus.trim();
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

	public String getOnlineflag() {
		return onlineflag;
	}

	public void setOnlineflag(String onlineflag) {
		this.onlineflag = onlineflag == null ? null : onlineflag.trim();
	}

	public Integer getOnlinelayoutid() {
		return onlinelayoutid;
	}

	public void setOnlinelayoutid(Integer onlinelayoutid) {
		this.onlinelayoutid = onlinelayoutid;
	}

	public Integer getOnlinemediaid() {
		return onlinemediaid;
	}

	public void setOnlinemediaid(Integer onlinemediaid) {
		this.onlinemediaid = onlinemediaid;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version == null ? null : version.trim();
	}

	public String getUpgradeversion() {
		return upgradeversion;
	}

	public void setUpgradeversion(String upgradeversion) {
		this.upgradeversion = upgradeversion == null ? null : upgradeversion.trim();
	}

	public String getUpgradestatus() {
		return upgradestatus;
	}

	public void setUpgradestatus(String upgradestatus) {
		this.upgradestatus = upgradestatus == null ? null : upgradestatus.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getLastservertime() {
		return lastservertime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setLastservertime(Date lastservertime) {
		this.lastservertime = lastservertime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getLastlocaltime() {
		return lastlocaltime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setLastlocaltime(Date lastlocaltime) {
		this.lastlocaltime = lastlocaltime;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public String getGroupcode() {
		return groupcode;
	}

	public void setGroupcode(String groupcode) {
		this.groupcode = groupcode == null ? null : groupcode.trim();
	}

	public String getMetrotype() {
		return metrotype;
	}

	public void setMetrotype(String metrotype) {
		this.metrotype = metrotype;
	}

	public Integer getMetrolineid() {
		return metrolineid;
	}

	public void setMetrolineid(Integer metrolineid) {
		this.metrolineid = metrolineid;
	}

	public Integer getMetrostationid() {
		return metrostationid;
	}

	public void setMetrostationid(Integer metrostationid) {
		this.metrostationid = metrostationid;
	}

	public Integer getMetroplatformid() {
		return metroplatformid;
	}

	public void setMetroplatformid(Integer metroplatformid) {
		this.metroplatformid = metroplatformid;
	}

	public String getMetrodirection() {
		return metrodirection;
	}

	public void setMetrodirection(String metrodirection) {
		this.metrodirection = metrodirection;
	}

	public Metroline getMetroline() {
		return metroline;
	}

	public void setMetroline(Metroline metroline) {
		this.metroline = metroline;
	}

	public Metrostation getMetrostation() {
		return metrostation;
	}

	public void setMetrostation(Metrostation metrostation) {
		this.metrostation = metrostation;
	}

}