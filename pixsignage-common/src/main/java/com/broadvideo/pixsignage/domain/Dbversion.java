package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Dbversion {
    private Integer dbversionid;

    private Integer version;

    private String dbscript;

    private String type;

    private String status;

    private String description;

    private Date createtime;

    public Integer getDbversionid() {
        return dbversionid;
    }

    public void setDbversionid(Integer dbversionid) {
        this.dbversionid = dbversionid;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getDbscript() {
        return dbscript;
    }

    public void setDbscript(String dbscript) {
        this.dbscript = dbscript == null ? null : dbscript.trim();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}