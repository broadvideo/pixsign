package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Pflowlog {
    private Integer pflowlogid;

    private Integer orgid;

    private Integer branchid;

    private Integer deviceid;

    private Date starttime;

    private Date endtime;

    private Integer duration;

    private Date createtime;

    public Integer getPflowlogid() {
        return pflowlogid;
    }

    public void setPflowlogid(Integer pflowlogid) {
        this.pflowlogid = pflowlogid;
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

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}