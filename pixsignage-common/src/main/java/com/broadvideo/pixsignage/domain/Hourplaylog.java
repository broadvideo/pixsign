package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Hourplaylog {
	private Integer hourplaylogid;

	private Integer orgid;

	private Integer branchid;

	private Integer deviceid;

	private String mediatype;

	private Integer mediaid;

	private Date starttime;

	private Integer total;

	private Date createtime;

	private Video video;

	private Image image;

	public Integer getHourplaylogid() {
		return hourplaylogid;
	}

	public void setHourplaylogid(Integer hourplaylogid) {
		this.hourplaylogid = hourplaylogid;
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

	public Date getStarttime() {
		return starttime;
	}

	public void setStarttime(Date starttime) {
		this.starttime = starttime;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
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