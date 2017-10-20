package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Courseschedule {
    private Integer coursescheduleid;

    private Integer courseid;

    private String coursename;

    private Integer classroomid;

    private String classroomname;

    private Integer teacherid;

    private String teachername;

    private Integer coursescheduleschemeid;
	private String coursescheduleschemename;

    private Integer workday;

    private Integer periodtimedtlid;
	private Periodtimedtl periodtimedtl;
    private Integer orgid;

    private Date createtime;

    private Integer createpsnid;

    private Date updatetime;

    private Integer updatepsnid;

    public Integer getCoursescheduleid() {
        return coursescheduleid;
    }

    public void setCoursescheduleid(Integer coursescheduleid) {
        this.coursescheduleid = coursescheduleid;
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

	public String getCoursescheduleschemename() {
		return coursescheduleschemename;
	}

	public void setCoursescheduleschemename(String coursescheduleschemename) {
		this.coursescheduleschemename = coursescheduleschemename;
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

	public Periodtimedtl getPeriodtimedtl() {
		return periodtimedtl;
	}

	public void setPeriodtimedtl(Periodtimedtl periodtimedtl) {
		this.periodtimedtl = periodtimedtl;
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

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Courseschedule [coursescheduleid=");
		builder.append(coursescheduleid);
		builder.append(", courseid=");
		builder.append(courseid);
		builder.append(", coursename=");
		builder.append(coursename);
		builder.append(", classroomid=");
		builder.append(classroomid);
		builder.append(", classroomname=");
		builder.append(classroomname);
		builder.append(", teacherid=");
		builder.append(teacherid);
		builder.append(", teachername=");
		builder.append(teachername);
		builder.append(", coursescheduleschemeid=");
		builder.append(coursescheduleschemeid);
		builder.append(", coursescheduleschemename=");
		builder.append(coursescheduleschemename);
		builder.append(", workday=");
		builder.append(workday);
		builder.append(", periodtimedtlid=");
		builder.append(periodtimedtlid);
		builder.append(", periodtimedtl=");
		builder.append(periodtimedtl);
		builder.append(", orgid=");
		builder.append(orgid);
		builder.append(", createtime=");
		builder.append(createtime);
		builder.append(", createpsnid=");
		builder.append(createpsnid);
		builder.append(", updatetime=");
		builder.append(updatetime);
		builder.append(", updatepsnid=");
		builder.append(updatepsnid);
		builder.append("]");
		return builder.toString();
	}

}