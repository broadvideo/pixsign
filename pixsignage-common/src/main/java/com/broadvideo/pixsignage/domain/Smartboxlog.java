package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Smartboxlog {
    private Integer smartboxlogid;

    private Integer smartboxid;

    private Integer orgid;

    private String wxuserid;

    private String terminalid;

    private String wxmpid;

    private String doorversion;

    private String doortype;

    private Integer stocknum;

    private String extra;

    private Date authorizeopentime;

    private String openstate;

    private Date opentime;

    private String closestate;

    private Date closetime;

    private Date createtime;

    public Integer getSmartboxlogid() {
        return smartboxlogid;
    }

    public void setSmartboxlogid(Integer smartboxlogid) {
        this.smartboxlogid = smartboxlogid;
    }

    public Integer getSmartboxid() {
        return smartboxid;
    }

    public void setSmartboxid(Integer smartboxid) {
        this.smartboxid = smartboxid;
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
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

    public String getDoorversion() {
        return doorversion;
    }

    public void setDoorversion(String doorversion) {
        this.doorversion = doorversion == null ? null : doorversion.trim();
    }

    public String getDoortype() {
        return doortype;
    }

    public void setDoortype(String doortype) {
        this.doortype = doortype == null ? null : doortype.trim();
    }

    public Integer getStocknum() {
        return stocknum;
    }

    public void setStocknum(Integer stocknum) {
        this.stocknum = stocknum;
    }

    public String getExtra() {
        return extra;
    }

    public void setExtra(String extra) {
        this.extra = extra == null ? null : extra.trim();
    }

    public Date getAuthorizeopentime() {
        return authorizeopentime;
    }

    public void setAuthorizeopentime(Date authorizeopentime) {
        this.authorizeopentime = authorizeopentime;
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