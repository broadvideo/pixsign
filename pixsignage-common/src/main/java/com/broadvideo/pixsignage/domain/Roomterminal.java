package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Roomterminal {
    private Integer roomterminalid;

    private String name;

    private Integer roomid;

    private String terminalid;

    private Date createtime;

    public Integer getRoomterminalid() {
        return roomterminalid;
    }

    public void setRoomterminalid(Integer roomterminalid) {
        this.roomterminalid = roomterminalid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Integer getRoomid() {
        return roomid;
    }

    public void setRoomid(Integer roomid) {
        this.roomid = roomid;
    }

    public String getTerminalid() {
        return terminalid;
    }

    public void setTerminalid(String terminalid) {
        this.terminalid = terminalid == null ? null : terminalid.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}