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

	private String testflag;

	private String appname;

	private String sign;

	private String vname;

	private Integer vcode;

	private String mtype;

	private String boardtype;

	private String type;

	private String ostype;

	private Integer devicegroupid;

	private String longitude;

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

	private Integer interval1;

	private Integer interval2;

	private String boardinfo;

	private Long storageused;

	private Long storageavail;

	private String upgradeflag;

	private Integer appfileid;

	private String tagflag;

	private String temperature;

	private Integer downloadspeed;

	private Long downloadbytes;

	private String networkmode;

	private Integer networksignal;

	private Integer brightness;

	private String tags;

	private Integer cataitemid1;

	private Integer cataitemid2;

	private Integer defaultbundleid;

	private Integer defaultpageid;

	private String hotspotflag;

	private String hotspotssid;

	private String hotspotpassword;

	private String hotspotfrequency;

	private String temperatureflag;

	private Integer relateid;

	private String screenstatus;

	private Integer batchid;

	private Integer modelid;

	private String qrcode;

	private Long nextpoweron;

	private Long nextpoweroff;

	private Integer playbundleid;

	private Integer playpageid;

	private Branch branch;

	private Devicegroup devicegroup;

	private Appfile appfile;

	private List<Schedule> schedules;

	private Bundle defaultbundle;

	private Page defaultpage;

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
		this.position = position;
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

	public String getTestflag() {
		return testflag;
	}

	public void setTestflag(String testflag) {
		this.testflag = testflag;
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

	public String getBoardtype() {
		return boardtype;
	}

	public void setBoardtype(String boardtype) {
		this.boardtype = boardtype;
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

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude == null ? null : longitude.trim();
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

	@JSON(format = "HH:mm:ss")
	public Date getPoweron() {
		return poweron;
	}

	@JSON(format = "HH:mm:ss")
	public void setPoweron(Date poweron) {
		this.poweron = poweron;
	}

	@JSON(format = "HH:mm:ss")
	public Date getPoweroff() {
		return poweroff;
	}

	@JSON(format = "HH:mm:ss")
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

	public Integer getInterval1() {
		return interval1;
	}

	public void setInterval1(Integer interval1) {
		this.interval1 = interval1;
	}

	public Integer getInterval2() {
		return interval2;
	}

	public void setInterval2(Integer interval2) {
		this.interval2 = interval2;
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

	public String getTagflag() {
		return tagflag;
	}

	public void setTagflag(String tagflag) {
		this.tagflag = tagflag;
	}

	public String getTemperature() {
		return temperature;
	}

	public void setTemperature(String temperature) {
		this.temperature = temperature;
	}

	public Integer getDownloadspeed() {
		return downloadspeed;
	}

	public void setDownloadspeed(Integer downloadspeed) {
		this.downloadspeed = downloadspeed;
	}

	public Long getDownloadbytes() {
		return downloadbytes;
	}

	public void setDownloadbytes(Long downloadbytes) {
		this.downloadbytes = downloadbytes;
	}

	public String getNetworkmode() {
		return networkmode;
	}

	public void setNetworkmode(String networkmode) {
		this.networkmode = networkmode;
	}

	public Integer getNetworksignal() {
		return networksignal;
	}

	public void setNetworksignal(Integer networksignal) {
		this.networksignal = networksignal;
	}

	public Integer getBrightness() {
		return brightness;
	}

	public void setBrightness(Integer brightness) {
		this.brightness = brightness;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public Integer getCataitemid1() {
		return cataitemid1;
	}

	public void setCataitemid1(Integer cataitemid1) {
		this.cataitemid1 = cataitemid1;
	}

	public Integer getCataitemid2() {
		return cataitemid2;
	}

	public void setCataitemid2(Integer cataitemid2) {
		this.cataitemid2 = cataitemid2;
	}

	public Integer getDefaultbundleid() {
		return defaultbundleid;
	}

	public void setDefaultbundleid(Integer defaultbundleid) {
		this.defaultbundleid = defaultbundleid;
	}

	public Integer getDefaultpageid() {
		return defaultpageid;
	}

	public void setDefaultpageid(Integer defaultpageid) {
		this.defaultpageid = defaultpageid;
	}

	public String getHotspotflag() {
		return hotspotflag;
	}

	public void setHotspotflag(String hotspotflag) {
		this.hotspotflag = hotspotflag;
	}

	public String getHotspotssid() {
		return hotspotssid;
	}

	public void setHotspotssid(String hotspotssid) {
		this.hotspotssid = hotspotssid;
	}

	public String getHotspotpassword() {
		return hotspotpassword;
	}

	public void setHotspotpassword(String hotspotpassword) {
		this.hotspotpassword = hotspotpassword;
	}

	public String getHotspotfrequency() {
		return hotspotfrequency;
	}

	public void setHotspotfrequency(String hotspotfrequency) {
		this.hotspotfrequency = hotspotfrequency;
	}

	public String getTemperatureflag() {
		return temperatureflag;
	}

	public void setTemperatureflag(String temperatureflag) {
		this.temperatureflag = temperatureflag;
	}

	public Integer getRelateid() {
		return relateid;
	}

	public void setRelateid(Integer relateid) {
		this.relateid = relateid;
	}

	public String getScreenstatus() {
		return screenstatus;
	}

	public void setScreenstatus(String screenstatus) {
		this.screenstatus = screenstatus;
	}

	public Integer getBatchid() {
		return batchid;
	}

	public void setBatchid(Integer batchid) {
		this.batchid = batchid;
	}

	public Integer getModelid() {
		return modelid;
	}

	public void setModelid(Integer modelid) {
		this.modelid = modelid;
	}

	public String getQrcode() {
		return qrcode;
	}

	public void setQrcode(String qrcode) {
		this.qrcode = qrcode;
	}

	public Long getNextpoweron() {
		return nextpoweron;
	}

	public void setNextpoweron(Long nextpoweron) {
		this.nextpoweron = nextpoweron;
	}

	public Long getNextpoweroff() {
		return nextpoweroff;
	}

	public void setNextpoweroff(Long nextpoweroff) {
		this.nextpoweroff = nextpoweroff;
	}

	public Integer getPlaybundleid() {
		return playbundleid;
	}

	public void setPlaybundleid(Integer playbundleid) {
		this.playbundleid = playbundleid;
	}

	public Integer getPlaypageid() {
		return playpageid;
	}

	public void setPlaypageid(Integer playpageid) {
		this.playpageid = playpageid;
	}

	public Branch getBranch() {
		return branch;
	}

	public void setBranch(Branch branch) {
		this.branch = branch;
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

	public Bundle getDefaultbundle() {
		return defaultbundle;
	}

	public void setDefaultbundle(Bundle defaultbundle) {
		this.defaultbundle = defaultbundle;
	}

	public Page getDefaultpage() {
		return defaultpage;
	}

	public void setDefaultpage(Page defaultpage) {
		this.defaultpage = defaultpage;
	}
}