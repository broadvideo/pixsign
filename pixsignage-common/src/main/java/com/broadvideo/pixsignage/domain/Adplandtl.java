package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Adplandtl {
	private Integer adplandtlid;

	private Integer orgid;

	private Integer adplanid;

	private String adplace;

	private Integer devicegroupid;

	private String adtype;

	private Integer adid;

	private Integer duration;

	private Integer times;

	private Integer months;

	private Date starttime;

	private Date endtime;

	private Integer unitprice;

	private Integer amount;

	private String status;

	private Devicegroup devicegroup;

	private Video video;

	private Image image;

	public Integer getAdplandtlid() {
		return adplandtlid;
	}

	public void setAdplandtlid(Integer adplandtlid) {
		this.adplandtlid = adplandtlid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getAdplanid() {
		return adplanid;
	}

	public void setAdplanid(Integer adplanid) {
		this.adplanid = adplanid;
	}

	public String getAdplace() {
		return adplace;
	}

	public void setAdplace(String adplace) {
		this.adplace = adplace == null ? null : adplace.trim();
	}

	public Integer getDevicegroupid() {
		return devicegroupid;
	}

	public void setDevicegroupid(Integer devicegroupid) {
		this.devicegroupid = devicegroupid;
	}

	public String getAdtype() {
		return adtype;
	}

	public void setAdtype(String adtype) {
		this.adtype = adtype == null ? null : adtype.trim();
	}

	public Integer getAdid() {
		return adid;
	}

	public void setAdid(Integer adid) {
		this.adid = adid;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public Integer getTimes() {
		return times;
	}

	public void setTimes(Integer times) {
		this.times = times;
	}

	public Integer getMonths() {
		return months;
	}

	public void setMonths(Integer months) {
		this.months = months;
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

	public Integer getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(Integer unitprice) {
		this.unitprice = unitprice;
	}

	public Integer getAmount() {
		return amount;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Devicegroup getDevicegroup() {
		return devicegroup;
	}

	public void setDevicegroup(Devicegroup devicegroup) {
		this.devicegroup = devicegroup;
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