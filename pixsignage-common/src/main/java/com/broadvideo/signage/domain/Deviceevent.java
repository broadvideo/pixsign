package com.broadvideo.signage.domain;

import java.util.Date;

public class Deviceevent {
    private Integer deviceeventid;

    private Integer deviceid;

    private String type;

    private String message;

    private Integer previd;

    private Integer prevduration;

    private Integer nextid;

    private Date createtime;

    public Integer getDeviceeventid() {
        return deviceeventid;
    }

    public void setDeviceeventid(Integer deviceeventid) {
        this.deviceeventid = deviceeventid;
    }

    public Integer getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(Integer deviceid) {
        this.deviceid = deviceid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message == null ? null : message.trim();
    }

    public Integer getPrevid() {
        return previd;
    }

    public void setPrevid(Integer previd) {
        this.previd = previd;
    }

    public Integer getPrevduration() {
        return prevduration;
    }

    public void setPrevduration(Integer prevduration) {
        this.prevduration = prevduration;
    }

    public Integer getNextid() {
        return nextid;
    }

    public void setNextid(Integer nextid) {
        this.nextid = nextid;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}