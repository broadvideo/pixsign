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

	private Integer persons;

	private Integer male;

	private Integer female;

	private Integer age1;

	private Integer age2;

	private Integer age3;

	private Integer age4;

	private Integer age5;

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

	public Integer getPersons() {
		return persons;
	}

	public void setPersons(Integer persons) {
		this.persons = persons;
	}

	public Integer getMale() {
		return male;
	}

	public void setMale(Integer male) {
		this.male = male;
	}

	public Integer getFemale() {
		return female;
	}

	public void setFemale(Integer female) {
		this.female = female;
	}

	public Integer getAge1() {
		return age1;
	}

	public void setAge1(Integer age1) {
		this.age1 = age1;
	}

	public Integer getAge2() {
		return age2;
	}

	public void setAge2(Integer age2) {
		this.age2 = age2;
	}

	public Integer getAge3() {
		return age3;
	}

	public void setAge3(Integer age3) {
		this.age3 = age3;
	}

	public Integer getAge4() {
		return age4;
	}

	public void setAge4(Integer age4) {
		this.age4 = age4;
	}

	public Integer getAge5() {
		return age5;
	}

	public void setAge5(Integer age5) {
		this.age5 = age5;
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