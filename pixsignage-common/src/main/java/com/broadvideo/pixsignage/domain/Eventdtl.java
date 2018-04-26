package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Eventdtl {
    private Integer eventdtlid;

    private Integer eventid;

    private Integer dayofweek;

    private Date shortstarttime;

    private Date shortendtime;

    private Date createtime;

    public Integer getEventdtlid() {
        return eventdtlid;
    }

    public void setEventdtlid(Integer eventdtlid) {
        this.eventdtlid = eventdtlid;
    }

    public Integer getEventid() {
        return eventid;
    }

    public void setEventid(Integer eventid) {
        this.eventid = eventid;
    }

    public Integer getDayofweek() {
        return dayofweek;
    }

    public void setDayofweek(Integer dayofweek) {
        this.dayofweek = dayofweek;
    }

	@JSON(format = "HH:mm")
    public Date getShortstarttime() {
        return shortstarttime;
    }

    public void setShortstarttime(Date shortstarttime) {
        this.shortstarttime = shortstarttime;
    }

	@JSON(format = "HH:mm")
    public Date getShortendtime() {
        return shortendtime;
    }

    public void setShortendtime(Date shortendtime) {
        this.shortendtime = shortendtime;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}