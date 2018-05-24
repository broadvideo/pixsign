package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Roomperson {
    private Integer roompersonid;

    private Integer roomid;

    private Integer personid;

    private Date createtime;

    public Integer getRoompersonid() {
        return roompersonid;
    }

    public void setRoompersonid(Integer roompersonid) {
        this.roompersonid = roompersonid;
    }

    public Integer getRoomid() {
        return roomid;
    }

    public void setRoomid(Integer roomid) {
        this.roomid = roomid;
    }

    public Integer getPersonid() {
        return personid;
    }

    public void setPersonid(Integer personid) {
        this.personid = personid;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}