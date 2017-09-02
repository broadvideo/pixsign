package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Attendanceevent {
    private Integer attendanceeventid;

    private String type;

    private String name;

    private Integer attendanceschemeid;

    private Integer classroomid;

    private Integer orgid;

    private Integer objectid;

    private String objecttype;

    private String ondate;

    private Date starttime;

    private Date endtime;

    private Date createtime;

    public Integer getAttendanceeventid() {
        return attendanceeventid;
    }

    public void setAttendanceeventid(Integer attendanceeventid) {
        this.attendanceeventid = attendanceeventid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Integer getAttendanceschemeid() {
        return attendanceschemeid;
    }

    public void setAttendanceschemeid(Integer attendanceschemeid) {
        this.attendanceschemeid = attendanceschemeid;
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

    public Integer getObjectid() {
        return objectid;
    }

    public void setObjectid(Integer objectid) {
        this.objectid = objectid;
    }

    public String getObjecttype() {
        return objecttype;
    }

    public void setObjecttype(String objecttype) {
        this.objecttype = objecttype == null ? null : objecttype.trim();
    }

    public String getOndate() {
        return ondate;
    }

    public void setOndate(String ondate) {
        this.ondate = ondate == null ? null : ondate.trim();
    }

    public Date getStarttime() {
        return starttime;
    }

    public void setStarttime(Date starttime) {
        this.starttime = starttime;
    }

    public Date getEndtime() {
        return endtime;
    }

    public void setEndtime(Date endtime) {
        this.endtime = endtime;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}