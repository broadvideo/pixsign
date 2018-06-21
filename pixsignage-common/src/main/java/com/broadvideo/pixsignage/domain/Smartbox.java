package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Smartbox {
    private Integer smartboxid;

    private Integer orgid;

    private String terminalid;

    private String name;

    private String description;

    private String doorversion;

    private Integer stocknum;

    private String extra;

    private Date createtime;

    private String status;

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

    public String getTerminalid() {
        return terminalid;
    }

    public void setTerminalid(String terminalid) {
        this.terminalid = terminalid == null ? null : terminalid.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getDoorversion() {
        return doorversion;
    }

    public void setDoorversion(String doorversion) {
        this.doorversion = doorversion == null ? null : doorversion.trim();
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

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }
}