package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Vsp {
	private Integer vspid;

	private String name;

	private String code;

	private String feature;

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

	public String getFeature() {
		return feature;
	}

	public void setFeature(String feature) {
		this.feature = feature;
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

	public String getMeetingflag() {
		int i = 16;
		return feature.substring(i - 1, i);
	}

	public void setMeetingflag(String flag) {
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

	public List<App> getApplist() {
		return applist;
	}

	public void setApplist(List<App> applist) {
		this.applist = applist;
	}
}