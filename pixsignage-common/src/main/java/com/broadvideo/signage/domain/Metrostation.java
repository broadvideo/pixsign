package com.broadvideo.signage.domain;

public class Metrostation {
    private Integer metrostationid;

    private String name;

    private String code;

    private String groupcode;

    public Integer getMetrostationid() {
        return metrostationid;
    }

    public void setMetrostationid(Integer metrostationid) {
        this.metrostationid = metrostationid;
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

    public String getGroupcode() {
        return groupcode;
    }

    public void setGroupcode(String groupcode) {
        this.groupcode = groupcode == null ? null : groupcode.trim();
    }
}