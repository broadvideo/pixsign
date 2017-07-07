package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Attendance {
    private Integer attendanceid;

    private Integer studentid;

    private Integer orgid;

    private Integer schoolclassid;
    private Integer classroomid;

    private Integer coursescheduleid;

    private Date eventtime;

    private Date createtime;

    public Integer getAttendanceid() {
        return attendanceid;
    }

    public void setAttendanceid(Integer attendanceid) {
        this.attendanceid = attendanceid;
    }

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

    public Integer getClassroomid() {
        return classroomid;
    }

    public void setClassroomid(Integer classroomid) {
        this.classroomid = classroomid;
    }

    public Integer getCoursescheduleid() {
        return coursescheduleid;
    }

    public void setCoursescheduleid(Integer coursescheduleid) {
        this.coursescheduleid = coursescheduleid;
    }

    public Date getEventtime() {
        return eventtime;
    }

    public void setEventtime(Date eventtime) {
        this.eventtime = eventtime;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}