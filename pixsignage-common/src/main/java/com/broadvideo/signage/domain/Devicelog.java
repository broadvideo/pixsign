package com.broadvideo.signage.domain;

import java.util.Date;

public class Devicelog {
    private Integer devicelogid;

    private Integer deviceid;

    private String level;

    private String message;

    private Date createtime;

    public Integer getDevicelogid() {
        return devicelogid;
    }

    public void setDevicelogid(Integer devicelogid) {
        this.devicelogid = devicelogid;
    }

    public Integer getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(Integer deviceid) {
        this.deviceid = deviceid;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level == null ? null : level.trim();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message == null ? null : message.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}