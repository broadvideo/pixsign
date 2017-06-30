package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class CourseSchedule {
    private Integer id;

    private Integer courseid;

    private String coursename;

    private Integer classroomid;

    private String classroomname;

    private Integer teacherid;

    private String teachername;

    private Integer coursescheduleschemeid;

    private Integer workday;

    private Integer periodtimedtlid;
	private PeriodTimeDtl periodTimeDtl;
    private Integer orgid;

    private Date createtime;

    private Integer createpsnid;

    private Date updatetime;

    private Integer updatepsnid;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCourseid() {
        return courseid;
    }

    public void setCourseid(Integer courseid) {
        this.courseid = courseid;
    }

    public String getCoursename() {
        return coursename;
    }

    public void setCoursename(String coursename) {
        this.coursename = coursename == null ? null : coursename.trim();
    }

    public Integer getClassroomid() {
        return classroomid;
    }

    public void setClassroomid(Integer classroomid) {
        this.classroomid = classroomid;
    }

    public String getClassroomname() {
        return classroomname;
    }

    public void setClassroomname(String classroomname) {
        this.classroomname = classroomname == null ? null : classroomname.trim();
    }

    public Integer getTeacherid() {
        return teacherid;
    }

    public void setTeacherid(Integer teacherid) {
        this.teacherid = teacherid;
    }

    public String getTeachername() {
        return teachername;
    }

    public void setTeachername(String teachername) {
        this.teachername = teachername == null ? null : teachername.trim();
    }

    public Integer getCoursescheduleschemeid() {
        return coursescheduleschemeid;
    }

    public void setCoursescheduleschemeid(Integer coursescheduleschemeid) {
        this.coursescheduleschemeid = coursescheduleschemeid;
    }

    public Integer getWorkday() {
        return workday;
    }

    public void setWorkday(Integer workday) {
        this.workday = workday;
    }

    public Integer getPeriodtimedtlid() {
        return periodtimedtlid;
    }

    public void setPeriodtimedtlid(Integer periodtimedtlid) {
        this.periodtimedtlid = periodtimedtlid;
    }

	public PeriodTimeDtl getPeriodTimeDtl() {
		return periodTimeDtl;
	}

	public void setPeriodTimeDtl(PeriodTimeDtl periodTimeDtl) {
		this.periodTimeDtl = periodTimeDtl;
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

    public Integer getCreatepsnid() {
        return createpsnid;
    }

    public void setCreatepsnid(Integer createpsnid) {
        this.createpsnid = createpsnid;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public Integer getUpdatepsnid() {
        return updatepsnid;
    }

    public void setUpdatepsnid(Integer updatepsnid) {
        this.updatepsnid = updatepsnid;
    }
}