package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Device {
	public final static String Online = "1";
	public final static String Offline = "0";

	private Integer deviceid;

	private Integer orgid;

	private Integer branchid;

	private String terminalid;

	private String hardkey;

	private String name;

	private String position;

	private String ip;

	private String iip;

	private String mac;

	private String schedulestatus;

	private String filestatus;

	private String status;

	private String description;

	private String onlineflag;

	private String appname;

	private String sign;

	private String vname;

	private Integer vcode;

	private String mtype;

	private String type;

	private String ostype;

	private Integer devicegroupid;

	private String lontitude;

	private String latitude;

	private String city;

	private String addr1;

	private String addr2;

	private String externalid;

	private String externalname;

	private String other;

	private Date createtime;

	private Date activetime;

	private Date refreshtime;

	private Integer devicegridid;

	private Integer xpos;

	private Integer ypos;

	private String powerflag;

	private Date poweron;

	private Date poweroff;

	private String volumeflag;

	private Integer volume;

	private String boardinfo;

	private Long storageused;

	private Long storageavail;

	private String upgradeflag;

	private Integer appfileid;

	private Devicegroup devicegroup;

	private Appfile appfile;

	private List<Schedule> schedules;

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
		return position == null ? "" : position.trim();
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

	public String getIip() {
		return iip;
	}

	public void setIip(String iip) {
		this.iip = iip;
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

	public String getAppname() {
		return appname;
	}

	public void setAppname(String appname) {
		this.appname = appname;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public String getVname() {
		return vname;
	}

	public void setVname(String vname) {
		this.vname = vname;
	}

	public Integer getVcode() {
		return vcode;
	}

	public void setVcode(Integer vcode) {
		this.vcode = vcode;
	}

	public String getMtype() {
		return mtype;
	}

	public void setMtype(String mtype) {
		this.mtype = mtype;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public String getOstype() {
		return ostype;
	}

	public void setOstype(String ostype) {
		this.ostype = ostype;
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
		return addr1 == null ? "" : addr1.trim();
	}

	public void setAddr1(String addr1) {
		this.addr1 = addr1 == null ? null : addr1.trim();
	}

	public String getAddr2() {
		return addr2 == null ? "" : addr2.trim();
	}

	public void setAddr2(String addr2) {
		this.addr2 = addr2 == null ? null : addr2.trim();
	}

	public String getExternalid() {
		return externalid;
	}

	public void setExternalid(String externalid) {
		this.externalid = externalid;
	}

	public String getExternalname() {
		return externalname;
	}

	public void setExternalname(String externalname) {
		this.externalname = externalname;
	}

	public String getOther() {
		return other;
	}

	public void setOther(String other) {
		this.other = other;
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

	public Integer getDevicegridid() {
		return devicegridid;
	}

	public void setDevicegridid(Integer devicegridid) {
		this.devicegridid = devicegridid;
	}

	public Integer getXpos() {
		return xpos;
	}

	public void setXpos(Integer xpos) {
		this.xpos = xpos;
	}

	public Integer getYpos() {
		return ypos;
	}

	public void setYpos(Integer ypos) {
		this.ypos = ypos;
	}

	public String getPowerflag() {
		return powerflag;
	}

	public void setPowerflag(String powerflag) {
		this.powerflag = powerflag == null ? null : powerflag.trim();
	}

	public Date getPoweron() {
		return poweron;
	}

	public void setPoweron(Date poweron) {
		this.poweron = poweron;
	}

	public Date getPoweroff() {
		return poweroff;
	}

	public void setPoweroff(Date poweroff) {
		this.poweroff = poweroff;
	}

	public String getVolumeflag() {
		return volumeflag;
	}

	public void setVolumeflag(String volumeflag) {
		this.volumeflag = volumeflag == null ? null : volumeflag.trim();
	}

	public Integer getVolume() {
		return volume;
	}

	public void setVolume(Integer volume) {
		this.volume = volume;
	}

	public String getBoardinfo() {
		return boardinfo;
	}

	public void setBoardinfo(String boardinfo) {
		this.boardinfo = boardinfo == null ? null : boardinfo.trim();
	}

	public Long getStorageused() {
		return storageused;
	}

	public void setStorageused(Long storageused) {
		this.storageused = storageused;
	}

	public Long getStorageavail() {
		return storageavail;
	}

	public void setStorageavail(Long storageavail) {
		this.storageavail = storageavail;
	}

	public String getUpgradeflag() {
		return upgradeflag;
	}

	public void setUpgradeflag(String upgradeflag) {
		this.upgradeflag = upgradeflag == null ? null : upgradeflag.trim();
	}

	public Integer getAppfileid() {
		return appfileid;
	}

	public void setAppfileid(Integer appfileid) {
		this.appfileid = appfileid;
	}

	public Devicegroup getDevicegroup() {
		return devicegroup;
	}

	public void setDevicegroup(Devicegroup devicegroup) {
		this.devicegroup = devicegroup;
	}

	public Appfile getAppfile() {
		return appfile;
	}

	public void setAppfile(Appfile appfile) {
		this.appfile = appfile;
	}

	public List<Schedule> getSchedules() {
		return schedules;
	}

	public void setSchedules(List<Schedule> schedules) {
		this.schedules = schedules;
	}
}