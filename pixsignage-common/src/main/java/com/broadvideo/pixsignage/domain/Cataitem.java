package com.broadvideo.pixsignage.domain;

public class Cataitem {
    private Integer cataitemid;

    private Integer catalogid;

    private String name;

    public Integer getCataitemid() {
        return cataitemid;
    }

    public void setCataitemid(Integer cataitemid) {
        this.cataitemid = cataitemid;
    }

    public Integer getCatalogid() {
        return catalogid;
    }

    public void setCatalogid(Integer catalogid) {
        this.catalogid = catalogid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }
}