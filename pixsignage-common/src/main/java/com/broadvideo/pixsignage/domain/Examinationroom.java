package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Examinationroom {
    private Integer examinationroomid;

    private String name;

    private String description;

    private Date starttime;
	private String strstarttime;

    private Date endtime;
	private String strendtime;

    private String coursename;

    private Integer courseid;

    private Integer classroomid;

    private Integer orgid;

    private Date createtime;

    private Integer createstaffid;

    public Integer getExaminationroomid() {
        return examinationroomid;
    }

    public void setExaminationroomid(Integer examinationroomid) {
        this.examinationroomid = examinationroomid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Date getStarttime() {
        return starttime;
    }

    public void setStarttime(Date starttime) {
        this.starttime = starttime;
    }

	public String getStrstarttime() {
		return strstarttime;
	}

	public void setStrstarttime(String strstarttime) {
		this.strstarttime = strstarttime;
	}

	public Date getEndtime() {
        return endtime;
    }

    public void setEndtime(Date endtime) {
        this.endtime = endtime;
    }

	public String getStrendtime() {
		return strendtime;
	}

	public void setStrendtime(String strendtime) {
		this.strendtime = strendtime;
	}

    public String getCoursename() {
        return coursename;
    }

    public void setCoursename(String coursename) {
        this.coursename = coursename == null ? null : coursename.trim();
    }

    public Integer getCourseid() {
        return courseid;
    }

    public void setCourseid(Integer courseid) {
        this.courseid = courseid;
    }

    public Integer getClassroomid() {
        return classroomid;
    }

    public void setClassroomid(Integer classroomid) {
        this.classroomid = classroomid;
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public Date getCreatetime() {
        return createtime;
    }

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