package com.broadvideo.pixsignage.domain;

public class Diyaction {
    private Integer diyactionid;

    private Integer diyid;

    private String name;

    private String code;

    public Integer getDiyactionid() {
        return diyactionid;
    }

    public void setDiyactionid(Integer diyactionid) {
        this.diyactionid = diyactionid;
    }

    public Integer getDiyid() {
        return diyid;
    }

    public void setDiyid(Integer diyid) {
        this.diyid = diyid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }
}