package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Eventperson {
    private Integer eventpersonid;

    private Integer eventid;

    private Integer personid;

    private String signtype;

    private Date signtime;

    private Date createtime;

    public Integer getEventpersonid() {
        return eventpersonid;
    }

    public void setEventpersonid(Integer eventpersonid) {
        this.eventpersonid = eventpersonid;
    }

    public Integer getEventid() {
        return eventid;
    }

    public void setEventid(Integer eventid) {
        this.eventid = eventid;
    }

    public Integer getPersonid() {
        return personid;
    }

    public void setPersonid(Integer personid) {
        this.personid = personid;
    }

    public String getSigntype() {
        return signtype;
    }

    public void setSigntype(String signtype) {
        this.signtype = signtype == null ? null : signtype.trim();
    }

    public Date getSigntime() {
        return signtime;
    }

    public void setSigntime(Date signtime) {
        this.signtime = signtime;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}