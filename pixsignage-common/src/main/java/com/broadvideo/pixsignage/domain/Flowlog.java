package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Flowlog {
    private Integer flowlogid;

    private Integer orgid;

    private Integer branchid;

    private Integer deviceid;

    private String uuid;

    private Date starttime;

    private Date endtime;

    private Integer total;

    private Integer male;

    private Integer female;

    private Integer age1;

    private Integer age2;

    private Integer age3;

    private Integer age4;

    private Integer age5;

    private Date createtime;

    public Integer getFlowlogid() {
        return flowlogid;
    }

    public void setFlowlogid(Integer flowlogid) {
        this.flowlogid = flowlogid;
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

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid == null ? null : uuid.trim();
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

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getMale() {
        return male;
    }

    public void setMale(Integer male) {
        this.male = male;
    }

    public Integer getFemale() {
        return female;
    }

    public void setFemale(Integer female) {
        this.female = female;
    }

    public Integer getAge1() {
        return age1;
    }

    public void setAge1(Integer age1) {
        this.age1 = age1;
    }

    public Integer getAge2() {
        return age2;
    }

    public void setAge2(Integer age2) {
        this.age2 = age2;
    }

    public Integer getAge3() {
        return age3;
    }

    public void setAge3(Integer age3) {
        this.age3 = age3;
    }

    public Integer getAge4() {
        return age4;
    }

    public void setAge4(Integer age4) {
        this.age4 = age4;
    }

    public Integer getAge5() {
        return age5;
    }

    public void setAge5(Integer age5) {
        this.age5 = age5;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}