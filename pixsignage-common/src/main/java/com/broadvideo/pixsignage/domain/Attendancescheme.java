package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Attendancescheme {
    private Integer attendanceschemeid;

    private String type;

    private String name;

    private Integer amount;

    private String timeconfig;

    private String enableflag;

    private Date createtime;

    private Integer orgid;

    private Integer createstaffid;

    public Integer getAttendanceschemeid() {
        return attendanceschemeid;
    }

    public void setAttendanceschemeid(Integer attendanceschemeid) {
        this.attendanceschemeid = attendanceschemeid;
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

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getTimeconfig() {
        return timeconfig;
    }

    public void setTimeconfig(String timeconfig) {
        this.timeconfig = timeconfig == null ? null : timeconfig.trim();
    }

    public String getEnableflag() {
        return enableflag;
    }

    public void setEnableflag(String enableflag) {
        this.enableflag = enableflag == null ? null : enableflag.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public Integer getCreatestaffid() {
        return createstaffid;
    }

    public void setCreatestaffid(Integer createstaffid) {
        this.createstaffid = createstaffid;
    }
}