package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Doorlog {
    private Integer doorlogid;

    private String wxuserid;

    private String terminalid;

    private String wxmpid;

    private Integer orgid;

    private String doortype;

    private String openstate;

    private Date opentime;

    private String closestate;

    private Date closetime;

    private Date createtime;


    public Integer getDoorlogid() {
        return doorlogid;
    }

    public void setDoorlogid(Integer doorlogid) {
        this.doorlogid = doorlogid;
    }

    public String getWxuserid() {
        return wxuserid;
    }

    public void setWxuserid(String wxuserid) {
        this.wxuserid = wxuserid == null ? null : wxuserid.trim();
    }

    public String getTerminalid() {
        return terminalid;
    }

    public void setTerminalid(String terminalid) {
        this.terminalid = terminalid == null ? null : terminalid.trim();
    }

    public String getWxmpid() {
        return wxmpid;
    }

    public void setWxmpid(String wxmpid) {
        this.wxmpid = wxmpid == null ? null : wxmpid.trim();
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public String getDoortype() {
        return doortype;
    }

    public void setDoortype(String doortype) {
        this.doortype = doortype == null ? null : doortype.trim();
    }

    public String getOpenstate() {
        return openstate;
    }

    public void setOpenstate(String openstate) {
        this.openstate = openstate == null ? null : openstate.trim();
    }

    public Date getOpentime() {
        return opentime;
    }

    public void setOpentime(Date opentime) {
        this.opentime = opentime;
    }

    public String getClosestate() {
        return closestate;
    }

    public void setClosestate(String closestate) {
        this.closestate = closestate == null ? null : closestate.trim();
    }

    public Date getClosetime() {
        return closetime;
    }

    public void setClosetime(Date closetime) {
        this.closetime = closetime;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}