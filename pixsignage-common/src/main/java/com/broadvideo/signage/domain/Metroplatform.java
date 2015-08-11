package com.broadvideo.signage.domain;

public class Metroplatform {
    private Integer metroplatformid;

    private Integer metrolineid;

    private Integer metrostationid;

    private String atsstationcode;

    private String name;

    private String code;

    private String direction;

    private String groupcode;

    public Integer getMetroplatformid() {
        return metroplatformid;
    }

    public void setMetroplatformid(Integer metroplatformid) {
        this.metroplatformid = metroplatformid;
    }

    public Integer getMetrolineid() {
        return metrolineid;
    }

    public void setMetrolineid(Integer metrolineid) {
        this.metrolineid = metrolineid;
    }

    public Integer getMetrostationid() {
        return metrostationid;
    }

    public void setMetrostationid(Integer metrostationid) {
        this.metrostationid = metrostationid;
    }

    public String getAtsstationcode() {
        return atsstationcode;
    }

    public void setAtsstationcode(String atsstationcode) {
        this.atsstationcode = atsstationcode == null ? null : atsstationcode.trim();
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

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction == null ? null : direction.trim();
    }

    public String getGroupcode() {
        return groupcode;
    }

    public void setGroupcode(String groupcode) {
        this.groupcode = groupcode == null ? null : groupcode.trim();
    }
}