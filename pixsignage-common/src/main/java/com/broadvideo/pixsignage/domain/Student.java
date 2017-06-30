package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Student {
	private Integer studentid;

	private Integer orgid;

	private Integer schoolclassid;
	private String schoolclassname;

	private String studentno;

	private String name;

	private String hardid;

	private String avatar;

	private Date createtime;

	private Integer createstaffid;

	public Integer getStudentid() {
		return studentid;
	}

	public void setStudentid(Integer studentid) {
		this.studentid = studentid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getSchoolclassid() {
		return schoolclassid;
	}

	public void setSchoolclassid(Integer schoolclassid) {
		this.schoolclassid = schoolclassid;
	}

	public String getSchoolclassname() {
		return schoolclassname;
	}

	public void setSchoolclassname(String schoolclassname) {
		this.schoolclassname = schoolclassname;
	}

	public String getStudentno() {
		return studentno;
	}

	public void setStudentno(String studentno) {
		this.studentno = studentno == null ? null : studentno.trim();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getHardid() {
		return hardid;
	}

	public void setHardid(String hardid) {
		this.hardid = hardid == null ? null : hardid.trim();
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar == null ? null : avatar.trim();
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
}