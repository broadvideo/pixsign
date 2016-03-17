package com.broadvideo.pixsignage.domain;

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

	private String status;

	private String description;

	private String onlineflag;

	private String version;

	private String type;

	private Integer devicegroupid;

	private String lontitude;

	private String latitude;

	private String city;

	private String addr1;

	private String addr2;

	private Date createtime;

	private Date activetime;

	private Date refreshtime;

	private Devicegroup devicegroup;

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

	public String getOnlineflag() {
		return onlineflag;
	}

	public void setOnlineflag(String onlineflag) {
		this.onlineflag = onlineflag == null ? null : onlineflag.trim();
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version == null ? null : version.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public Integer getDevicegroupid() {
		return devicegroupid;
	}

	public void setDevicegroupid(Integer devicegroupid) {
		this.devicegroupid = devicegroupid;
	}

	public String getLontitude() {
		return lontitude;
	}

	public void setLontitude(String lontitude) {
		this.lontitude = lontitude == null ? null : lontitude.trim();
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude == null ? null : latitude.trim();
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city == null ? null : city.trim();
	}

	public String getAddr1() {
		return addr1;
	}

	public void setAddr1(String addr1) {
		this.addr1 = addr1 == null ? null : addr1.trim();
	}

	public String getAddr2() {
		return addr2;
	}

	public void setAddr2(String addr2) {
		this.addr2 = addr2 == null ? null : addr2.trim();
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
	public Date getActivetime() {
		return activetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setActivetime(Date activetime) {
		this.activetime = activetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getRefreshtime() {
		return refreshtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setRefreshtime(Date refreshtime) {
		this.refreshtime = refreshtime;
	}

	public Devicegroup getDevicegroup() {
		return devicegroup;
	}

	public void setDevicegroup(Devicegroup devicegroup) {
		this.devicegroup = devicegroup;
	}
}