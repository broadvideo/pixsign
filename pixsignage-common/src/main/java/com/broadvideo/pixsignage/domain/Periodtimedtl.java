package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Periodtimedtl {
    private Integer periodtimedtlid;

    private String type;

    private Integer periodnum;

    private String periodname;

    private String shortstarttime;

    private String shortendtime;

    private Integer duration;

    private Integer coursescheduleschemeid;

    private Integer orgid;

    private Date createtime;

    private Integer createpsnid;

    private Date updatetime;

    private Integer updatepsnid;

    public Integer getPeriodtimedtlid() {
        return periodtimedtlid;
    }

    public void setPeriodtimedtlid(Integer periodtimedtlid) {
        this.periodtimedtlid = periodtimedtlid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public Integer getPeriodnum() {
        return periodnum;
    }

    public void setPeriodnum(Integer periodnum) {
        this.periodnum = periodnum;
    }

    public String getPeriodname() {
        return periodname;
    }

    public void setPeriodname(String periodname) {
        this.periodname = periodname == null ? null : periodname.trim();
    }

    public String getShortstarttime() {
        return shortstarttime;
    }

    public void setShortstarttime(String shortstarttime) {
        this.shortstarttime = shortstarttime == null ? null : shortstarttime.trim();
    }

    public String getShortendtime() {
        return shortendtime;
    }

    public void setShortendtime(String shortendtime) {
        this.shortendtime = shortendtime == null ? null : shortendtime.trim();
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getCoursescheduleschemeid() {
        return coursescheduleschemeid;
    }

    public void setCoursescheduleschemeid(Integer coursescheduleschemeid) {
        this.coursescheduleschemeid = coursescheduleschemeid;
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getCreatepsnid() {
        return createpsnid;
    }

    public void setCreatepsnid(Integer createpsnid) {
        this.createpsnid = createpsnid;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public Integer getUpdatepsnid() {
        return updatepsnid;
    }

    public void setUpdatepsnid(Integer updatepsnid) {
        this.updatepsnid = updatepsnid;
    }

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Periodtimedtl [periodtimedtlid=");
		builder.append(periodtimedtlid);
		builder.append(", type=");
		builder.append(type);
		builder.append(", periodnum=");
		builder.append(periodnum);
		builder.append(", periodname=");
		builder.append(periodname);
		builder.append(", shortstarttime=");
		builder.append(shortstarttime);
		builder.append(", shortendtime=");
		builder.append(shortendtime);
		builder.append(", duration=");
		builder.append(duration);
		builder.append(", coursescheduleschemeid=");
		builder.append(coursescheduleschemeid);
		builder.append(", orgid=");
		builder.append(orgid);
		builder.append(", createtime=");
		builder.append(createtime);
		builder.append(", createpsnid=");
		builder.append(createpsnid);
		builder.append(", updatetime=");
		builder.append(updatetime);
		builder.append(", updatepsnid=");
		builder.append(updatepsnid);
		builder.append("]");
		return builder.toString();
	}

}