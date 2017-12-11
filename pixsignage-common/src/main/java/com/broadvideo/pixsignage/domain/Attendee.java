package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Attendee {
    private Integer attendeeid;

    private Integer meetingid;

    private Integer staffid;
	private String staffname;

    private Date signtime;

    private Date createtime;

    public Integer getAttendeeid() {
        return attendeeid;
    }

    public void setAttendeeid(Integer attendeeid) {
        this.attendeeid = attendeeid;
    }

    public Integer getMeetingid() {
        return meetingid;
    }

    public void setMeetingid(Integer meetingid) {
        this.meetingid = meetingid;
    }

    public Integer getStaffid() {
        return staffid;
    }

    public void setStaffid(Integer staffid) {
        this.staffid = staffid;
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

	public String getStaffname() {
		return staffname;
	}

	public void setStaffname(String staffname) {
		this.staffname = staffname;
	}
}