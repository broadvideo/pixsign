package com.broadvideo.pixsignage.domain;

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

	private String reviewflag;

	private String touchflag;

	private String liftflag;

	private String calendarflag;

	private String sscreenflag;

	private String mscreenflag;

	private String flowrateflag;

	private String videoflag;

	private String imageflag;

	private String textflag;

	private String streamflag;

	private String dvbflag;

	private String videoinflag;

	private String widgetflag;

	private String expireflag;

	private Date expiretime;

	private Integer maxdevices;

	private Integer currentdevices;

	private Integer currentdeviceidx;

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

	private String apps;

	private Date createtime;

	private Integer createstaffid;

	private Video backupvideo;

	List<App> applist;

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

	public String getReviewflag() {
		return reviewflag;
	}

	public void setReviewflag(String reviewflag) {
		this.reviewflag = reviewflag;
	}

	public String getTouchflag() {
		return touchflag;
	}

	public void setTouchflag(String touchflag) {
		this.touchflag = touchflag;
	}

	public String getLiftflag() {
		return liftflag;
	}

	public void setLiftflag(String liftflag) {
		this.liftflag = liftflag;
	}

	public String getCalendarflag() {
		return calendarflag;
	}

	public void setCalendarflag(String calendarflag) {
		this.calendarflag = calendarflag;
	}

	public String getSscreenflag() {
		return sscreenflag;
	}

	public void setSscreenflag(String sscreenflag) {
		this.sscreenflag = sscreenflag;
	}

	public String getMscreenflag() {
		return mscreenflag;
	}

	public void setMscreenflag(String mscreenflag) {
		this.mscreenflag = mscreenflag;
	}

	public String getFlowrateflag() {
		return flowrateflag;
	}

	public void setFlowrateflag(String flowrateflag) {
		this.flowrateflag = flowrateflag;
	}

	public String getVideoflag() {
		return videoflag;
	}

	public void setVideoflag(String videoflag) {
		this.videoflag = videoflag == null ? null : videoflag.trim();
	}

	public String getImageflag() {
		return imageflag;
	}

	public void setImageflag(String imageflag) {
		this.imageflag = imageflag == null ? null : imageflag.trim();
	}

	public String getTextflag() {
		return textflag;
	}

	public void setTextflag(String textflag) {
		this.textflag = textflag == null ? null : textflag.trim();
	}

	public String getStreamflag() {
		return streamflag;
	}

	public void setStreamflag(String streamflag) {
		this.streamflag = streamflag == null ? null : streamflag.trim();
	}

	public String getDvbflag() {
		return dvbflag;
	}

	public void setDvbflag(String dvbflag) {
		this.dvbflag = dvbflag == null ? null : dvbflag.trim();
	}

	public String getVideoinflag() {
		return videoinflag;
	}

	public void setVideoinflag(String videoinflag) {
		this.videoinflag = videoinflag;
	}

	public String getWidgetflag() {
		return widgetflag;
	}

	public void setWidgetflag(String widgetflag) {
		this.widgetflag = widgetflag == null ? null : widgetflag.trim();
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

	public String getApps() {
		return apps;
	}

	public void setApps(String apps) {
		this.apps = apps;
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

	public Video getBackupvideo() {
		return backupvideo;
	}

	public void setBackupvideo(Video backupvideo) {
		this.backupvideo = backupvideo;
	}

	public List<App> getApplist() {
		return applist;
	}

	public void setApplist(List<App> applist) {
		this.applist = applist;
	}
}