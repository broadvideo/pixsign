package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Playlog {
	private Integer playlogid;

	private Integer orgid;

	private Integer branchid;

	private Integer deviceid;

	private Date starttime;

	private Date endtime;

	private Integer duration;

	private Integer bundleid;

	private Integer layoutdtlid;

	private String mediatype;

	private Integer mediaid;

	private Device device;

	private Video video;

	private Image image;

	public Integer getPlaylogid() {
		return playlogid;
	}

	public void setPlaylogid(Integer playlogid) {
		this.playlogid = playlogid;
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

	public Integer getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(Integer deviceid) {
		this.deviceid = deviceid;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getStarttime() {
		return starttime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setStarttime(Date starttime) {
		this.starttime = starttime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getEndtime() {
		return endtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setEndtime(Date endtime) {
		this.endtime = endtime;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public Integer getBundleid() {
		return bundleid;
	}

	public void setBundleid(Integer bundleid) {
		this.bundleid = bundleid;
	}

	public Integer getLayoutdtlid() {
		return layoutdtlid;
	}

	public void setLayoutdtlid(Integer layoutdtlid) {
		this.layoutdtlid = layoutdtlid;
	}

	public String getMediatype() {
		return mediatype;
	}

	public void setMediatype(String mediatype) {
		this.mediatype = mediatype == null ? null : mediatype.trim();
	}

	public Integer getMediaid() {
		return mediaid;
	}

	public void setMediaid(Integer mediaid) {
		this.mediaid = mediaid;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public Video getVideo() {
		return video;
	}

	public void setVideo(Video video) {
		this.video = video;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}
}