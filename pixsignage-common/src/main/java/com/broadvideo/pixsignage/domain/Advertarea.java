package com.broadvideo.pixsignage.domain;

public class Advertarea {
    private Integer advertareaid;

    private String adtype;

    private Integer adid;

    private Integer areaid;

    public Integer getAdvertareaid() {
        return advertareaid;
    }

    public void setAdvertareaid(Integer advertareaid) {
        this.advertareaid = advertareaid;
    }

    public String getAdtype() {
        return adtype;
    }

    public void setAdtype(String adtype) {
        this.adtype = adtype == null ? null : adtype.trim();
    }

    public Integer getAdid() {
        return adid;
    }

    public void setAdid(Integer adid) {
        this.adid = adid;
    }

    public Integer getAreaid() {
        return areaid;
    }

    public void setAreaid(Integer areaid) {
        this.areaid = areaid;
    }
}