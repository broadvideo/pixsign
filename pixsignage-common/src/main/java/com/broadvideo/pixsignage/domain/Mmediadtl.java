package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Mmediadtl {
    private Integer mmediadtlid;

    private Integer mmediaid;

    private Integer xpos;

    private Integer ypos;

    private String fileidx;

    private String filepath;

    private String filename;

    private Long size;

    private Date createtime;

    public Integer getMmediadtlid() {
        return mmediadtlid;
    }

    public void setMmediadtlid(Integer mmediadtlid) {
        this.mmediadtlid = mmediadtlid;
    }

    public Integer getMmediaid() {
        return mmediaid;
    }

    public void setMmediaid(Integer mmediaid) {
        this.mmediaid = mmediaid;
    }

    public Integer getXpos() {
        return xpos;
    }

    public void setXpos(Integer xpos) {
        this.xpos = xpos;
    }

    public Integer getYpos() {
        return ypos;
    }

    public void setYpos(Integer ypos) {
        this.ypos = ypos;
    }

    public String getFileidx() {
        return fileidx;
    }

    public void setFileidx(String fileidx) {
        this.fileidx = fileidx == null ? null : fileidx.trim();
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath == null ? null : filepath.trim();
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename == null ? null : filename.trim();
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}