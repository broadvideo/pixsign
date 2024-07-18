package com.broadvideo.pixsign.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Org {
	public final static String FUNCTION_DISABLED = "0";
	public final static String FUNCTION_ENABLED = "1";

	private Integer orgid;

	private Integer vspid;

	private Integer topbranchid;

	private String name;

	private String code;

	private String status;

	private String feature;

	private String expireflag;

	private Date expiretime;

	private Integer maxdevices;

	private Integer currentdevices;

	private Integer currentdeviceidx;

	private String maxdetail;

	private Long maxstorage;

	private Long currentstorage;

	private String copyright;

	private String description;

	private Integer backupvideoid;

	private String powerflag;

	private Date poweron;

	private Date poweroff;

	private String qrcodeflag;

	private String devicepassflag;

	private String devicepass;

	private String upgradeflag;

	private String volumeflag;

	private Integer volume;

	private String timezone;

	private String apps;

	private String logo;

	private String tags;

	private Integer defaultbundleid;

	private Integer defaultpageid;

	private String mainpage;

	private String city;

	private String boardtype;

	private Integer hightemperature;

	private Integer lowtemperature;

	private Date createtime;

	private Integer createstaffid;

	private Video backupvideo;

	private Page defaultpage;

	List<App> applist;

	public int getMaxDevices(String type) {
		String[] maxs = maxdetail.split(",");
		int t = Integer.parseInt(type);
		return maxs.length > t - 1 ? Integer.parseInt(maxs[t - 1]) : 0;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getVspid() {
		return vspid;
	}

	public void setVspid(Integer vspid) {
		this.vspid = vspid;
	}

	public Integer getTopbranchid() {
		return topbranchid;
	}

	public void setTopbranchid(Integer topbranchid) {
		this.topbranchid = topbranchid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code == null ? null : code.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getFeature() {
		return feature;
	}

	public void setFeature(String feature) {
		this.feature = feature;
	}

	public String getExpireflag() {
		return expireflag;
	}

	public void setExpireflag(String expireflag) {
		this.expireflag = expireflag == null ? null : expireflag.trim();
	}

	@JSON(format = "yyyy-MM-dd")
	public Date getExpiretime() {
		return expiretime;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setExpiretime(Date expiretime) {
		this.expiretime = expiretime;
	}

	public Integer getMaxdevices() {
		return maxdevices;
	}

	public void setMaxdevices(Integer maxdevices) {
		this.maxdevices = maxdevices;
	}

	public Integer getCurrentdevices() {
		return currentdevices;
	}

	public void setCurrentdevices(Integer currentdevices) {
		this.currentdevices = currentdevices;
	}

	public Integer getCurrentdeviceidx() {
		return currentdeviceidx;
	}

	public void setCurrentdeviceidx(Integer currentdeviceidx) {
		this.currentdeviceidx = currentdeviceidx;
	}

	public String getMaxdetail() {
		return maxdetail;
	}

	public void setMaxdetail(String maxdetail) {
		this.maxdetail = maxdetail;
	}

	public Long getMaxstorage() {
		return maxstorage;
	}

	public void setMaxstorage(Long maxstorage) {
		this.maxstorage = maxstorage;
	}

	public Long getCurrentstorage() {
		return currentstorage;
	}

	public void setCurrentstorage(Long currentstorage) {
		this.currentstorage = currentstorage;
	}

	public String getCopyright() {
		return copyright;
	}

	public void setCopyright(String copyright) {
		this.copyright = copyright == null ? null : copyright.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public Integer getBackupvideoid() {
		return backupvideoid;
	}

	public void setBackupvideoid(Integer backupvideoid) {
		this.backupvideoid = backupvideoid;
	}

	public String getPowerflag() {
		return powerflag;
	}

	public void setPowerflag(String powerflag) {
		this.powerflag = powerflag;
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

	public String getQrcodeflag() {
		return qrcodeflag;
	}

	public void setQrcodeflag(String qrcodeflag) {
		this.qrcodeflag = qrcodeflag;
	}

	public String getDevicepassflag() {
		return devicepassflag;
	}

	public void setDevicepassflag(String devicepassflag) {
		this.devicepassflag = devicepassflag;
	}

	public String getDevicepass() {
		return devicepass;
	}

	public void setDevicepass(String devicepass) {
		this.devicepass = devicepass;
	}

	public String getUpgradeflag() {
		return upgradeflag;
	}

	public void setUpgradeflag(String upgradeflag) {
		this.upgradeflag = upgradeflag;
	}

	public String getVolumeflag() {
		return volumeflag;
	}

	public void setVolumeflag(String volumeflag) {
		this.volumeflag = volumeflag;
	}

	public Integer getVolume() {
		return volume;
	}

	public void setVolume(Integer volume) {
		this.volume = volume;
	}

	public String getTimezone() {
		return timezone;
	}

	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}

	public String getApps() {
		return apps;
	}

	public void setApps(String apps) {
		this.apps = apps;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
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

	public String getMainpage() {
		return mainpage;
	}

	public void setMainpage(String mainpage) {
		this.mainpage = mainpage;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getBoardtype() {
		return boardtype;
	}

	public void setBoardtype(String boardtype) {
		this.boardtype = boardtype;
	}

	public Integer getHightemperature() {
		return hightemperature;
	}

	public void setHightemperature(Integer hightemperature) {
		this.hightemperature = hightemperature;
	}

	public Integer getLowtemperature() {
		return lowtemperature;
	}

	public void setLowtemperature(Integer lowtemperature) {
		this.lowtemperature = lowtemperature;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Integer getCreatestaffid() {
		return createstaffid;
	}

	public void setCreatestaffid(Integer createstaffid) {
		this.createstaffid = createstaffid;
	}

	public String getBundleflag() {
		int i = 1;
		return feature.substring(i - 1, i);
	}

	public void setBundleflag(String flag) {
		int i = 1;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getPageflag() {
		int i = 2;
		return feature.substring(i - 1, i);
	}

	public void setPageflag(String flag) {
		int i = 2;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getSscreenflag() {
		int i = 3;
		return feature.substring(i - 1, i);
	}

	public void setSscreenflag(String flag) {
		int i = 3;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getMscreenflag() {
		int i = 4;
		return feature.substring(i - 1, i);
	}

	public void setMscreenflag(String flag) {
		int i = 4;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getReviewflag() {
		int i = 5;
		return feature.substring(i - 1, i);
	}

	public void setReviewflag(String flag) {
		int i = 5;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getTouchflag() {
		int i = 6;
		return feature.substring(i - 1, i);
	}

	public void setTouchflag(String flag) {
		int i = 6;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getStreamflag() {
		int i = 7;
		return feature.substring(i - 1, i);
	}

	public void setStreamflag(String flag) {
		int i = 7;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getDvbflag() {
		int i = 8;
		return feature.substring(i - 1, i);
	}

	public void setDvbflag(String flag) {
		int i = 8;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getVideoinflag() {
		int i = 9;
		return feature.substring(i - 1, i);
	}

	public void setVideoinflag(String flag) {
		int i = 9;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getWidgetflag() {
		int i = 10;
		return feature.substring(i - 1, i);
	}

	public void setWidgetflag(String flag) {
		int i = 10;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getRssflag() {
		int i = 11;
		return feature.substring(i - 1, i);
	}

	public void setRssflag(String flag) {
		int i = 11;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getDiyflag() {
		int i = 12;
		return feature.substring(i - 1, i);
	}

	public void setDiyflag(String flag) {
		int i = 12;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getFlowrateflag() {
		int i = 13;
		return feature.substring(i - 1, i);
	}

	public void setFlowrateflag(String flag) {
		int i = 13;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getTagflag() {
		int i = 14;
		return feature.substring(i - 1, i);
	}

	public void setTagflag(String flag) {
		int i = 14;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getSchoolflag() {
		int i = 15;
		return feature.substring(i - 1, i);
	}

	public void setSchoolflag(String flag) {
		int i = 15;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getAdvertflag() {
		int i = 16;
		return feature.substring(i - 1, i);
	}

	public void setAdvertflag(String flag) {
		int i = 16;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getVipflag() {
		int i = 17;
		return feature.substring(i - 1, i);
	}

	public void setVipflag(String flag) {
		int i = 17;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getEstateflag() {
		int i = 18;
		return feature.substring(i - 1, i);
	}

	public void setEstateflag(String flag) {
		int i = 18;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getLiftflag() {
		int i = 19;
		return feature.substring(i - 1, i);
	}

	public void setLiftflag(String flag) {
		int i = 19;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getBundleplanflag() {
		int i = 20;
		return feature.substring(i - 1, i);
	}

	public void setBundleplanflag(String flag) {
		int i = 20;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getPageplanflag() {
		int i = 21;
		return feature.substring(i - 1, i);
	}

	public void setPageplanflag(String flag) {
		int i = 21;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getMassageflag() {
		int i = 22;
		return feature.substring(i - 1, i);
	}

	public void setMassageflag(String flag) {
		int i = 22;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getDscreenflag() {
		int i = 23;
		return feature.substring(i - 1, i);
	}

	public void setDscreenflag(String flag) {
		int i = 23;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public String getCloudiaflag() {
		int i = 24;
		return feature.substring(i - 1, i);
	}

	public void setCloudiaflag(String flag) {
		int i = 24;
		feature = feature.substring(0, i - 1) + flag + feature.substring(i);
	}

	public Video getBackupvideo() {
		return backupvideo;
	}

	public void setBackupvideo(Video backupvideo) {
		this.backupvideo = backupvideo;
	}

	public Page getDefaultpage() {
		return defaultpage;
	}

	public void setDefaultpage(Page defaultpage) {
		this.defaultpage = defaultpage;
	}

	public List<App> getApplist() {
		return applist;
	}

	public void setApplist(List<App> applist) {
		this.applist = applist;
	}
}