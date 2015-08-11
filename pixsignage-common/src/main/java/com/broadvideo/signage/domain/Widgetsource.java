package com.broadvideo.signage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Widgetsource {
    private Integer widgetsourceid;

    private Integer orgid;

    private String name;

    private String uri;

    private String description;

    private Date createtime;

    private Integer createstaffid;

    public Integer getWidgetsourceid() {
        return widgetsourceid;
    }

    public void setWidgetsourceid(Integer widgetsourceid) {
        this.widgetsourceid = widgetsourceid;
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri == null ? null : uri.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public Date getCreatetime() {
        return createtime;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getCreatestaffid() {
        return createstaffid;
    }

    public void setCreatestaffid(Integer createstaffid) {
        this.createstaffid = createstaffid;
    }
}