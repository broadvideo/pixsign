package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Vsp {
	private Integer vspid;

	private String name;

	private String code;

	private String bundleflag;

	private String pageflag;

	private String reviewflag;

	private String touchflag;

	private String liftflag;

	private String calendarflag;

	private String mscreenflag;

	private String flowrateflag;

	private String tagflag;

	private String diyflag;

	private String streamflag;

	private String dvbflag;

	private String videoinflag;

	private Integer maxdevices;

	private Long maxstorage;

	private Integer currentdevices;

	private Long currentstorage;

	private String apps;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	List<App> applist;

	public Integer getVspid() {
		return vspid;
	}

	public void setVspid(Integer vspid) {
		this.vspid = vspid;
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

	public String getBundleflag() {
		return bundleflag;
	}

	public void setBundleflag(String bundleflag) {
		this.bundleflag = bundleflag;
	}

	public String getPageflag() {
		return pageflag;
	}

	public void setPageflag(String pageflag) {
		this.pageflag = pageflag;
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

	public String getTagflag() {
		return tagflag;
	}

	public void setTagflag(String tagflag) {
		this.tagflag = tagflag;
	}

	public String getDiyflag() {
		return diyflag;
	}

	public void setDiyflag(String diyflag) {
		this.diyflag = diyflag;
	}

	public String getStreamflag() {
		return streamflag;
	}

	public void setStreamflag(String streamflag) {
		this.streamflag = streamflag;
	}

	public String getDvbflag() {
		return dvbflag;
	}

	public void setDvbflag(String dvbflag) {
		this.dvbflag = dvbflag;
	}

	public String getVideoinflag() {
		return videoinflag;
	}

	public void setVideoinflag(String videoinflag) {
		this.videoinflag = videoinflag;
	}

	public Integer getMaxdevices() {
		return maxdevices;
	}

	public void setMaxdevices(Integer maxdevices) {
		this.maxdevices = maxdevices;
	}

	public Long getMaxstorage() {
		return maxstorage;
	}

	public void setMaxstorage(Long maxstorage) {
		this.maxstorage = maxstorage;
	}

	public Integer getCurrentdevices() {
		return currentdevices;
	}

	public void setCurrentdevices(Integer currentdevices) {
		this.currentdevices = currentdevices;
	}

	public Long getCurrentstorage() {
		return currentstorage;
	}

	public void setCurrentstorage(Long currentstorage) {
		this.currentstorage = currentstorage;
	}

	public String getApps() {
		return apps;
	}

	public void setApps(String apps) {
		this.apps = apps;
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

	public Integer getCreatestaffid() {
		return createstaffid;
	}

	public void setCreatestaffid(Integer createstaffid) {
		this.createstaffid = createstaffid;
	}

	public List<App> getApplist() {
		return applist;
	}

	public void setApplist(List<App> applist) {
		this.applist = applist;
	}
}