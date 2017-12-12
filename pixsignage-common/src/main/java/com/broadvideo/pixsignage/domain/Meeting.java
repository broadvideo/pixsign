package com.broadvideo.pixsignage.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Meeting {

    private Integer meetingid;

    private String uuid;

    private Integer meetingroomid;
	private String meetingroomname;

    private String subject;

    private String description;
    private Date starttime;

    private Date endtime;

    private Integer duration;

    private Integer amount;

    private Integer bookstaffid;
	private String bookstaffname;

    private Integer bookbranchid;
	private String bookbranchname;
	private String locationname;

    private String qrcode;

    private Integer orgid;

    private Date createtime;

    private Integer createstaffid;

    private Date updatetime;

    private Integer updatestaffid;

    private String auditstatus;
    private String status;
	private Integer[] attendeeuserids;

	private List<Attendee> attendees = new ArrayList<Attendee>();
	private String search;

    public Integer getMeetingid() {
        return meetingid;
    }

    public void setMeetingid(Integer meetingid) {
        this.meetingid = meetingid;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid == null ? null : uuid.trim();
    }

    public Integer getMeetingroomid() {
        return meetingroomid;
    }

    public void setMeetingroomid(Integer meetingroomid) {
        this.meetingroomid = meetingroomid;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject == null ? null : subject.trim();
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Date getStarttime() {
        return starttime;
    }

    public void setStarttime(Date starttime) {
        this.starttime = starttime;
    }

    public Date getEndtime() {
        return endtime;
    }

    public void setEndtime(Date endtime) {
        this.endtime = endtime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Integer getBookstaffid() {
        return bookstaffid;
    }

	public void setBookstaffid(Integer bookstaffid) {
        this.bookstaffid = bookstaffid;
    }

    public Integer getBookbranchid() {
        return bookbranchid;
    }

    public void setBookbranchid(Integer bookbranchid) {
        this.bookbranchid = bookbranchid;
    }

    public String getQrcode() {
        return qrcode;
    }

    public void setQrcode(String qrcode) {
        this.qrcode = qrcode == null ? null : qrcode.trim();
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

    public Integer getCreatestaffid() {
        return createstaffid;
    }

    public void setCreatestaffid(Integer createstaffid) {
        this.createstaffid = createstaffid;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

	public Integer[] getAttendeeuserids() {
		return attendeeuserids;
	}

	public void setAttendeeuserids(Integer[] attendeeuserids) {
		this.attendeeuserids = attendeeuserids;
	}

	public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public Integer getUpdatestaffid() {
        return updatestaffid;
    }

    public void setUpdatestaffid(Integer updatestaffid) {
        this.updatestaffid = updatestaffid;
    }

    public String getAuditstatus() {
        return auditstatus;
    }
    public void setAuditstatus(String auditstatus) {
        this.auditstatus = auditstatus == null ? null : auditstatus.trim();
    }
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

	public String getMeetingroomname() {
		return meetingroomname;
	}

	public void setMeetingroomname(String meetingroomname) {
		this.meetingroomname = meetingroomname;
	}

	public String getBookstaffname() {
		return bookstaffname;
	}

	public void setBookstaffname(String bookstaffname) {
		this.bookstaffname = bookstaffname;
	}

	public String getBookbranchname() {
		return bookbranchname;
	}

	public void setBookbranchname(String bookbranchname) {
		this.bookbranchname = bookbranchname;
	}

	public String getLocationname() {
		return locationname;
	}

	public void setLocationname(String locationname) {
		this.locationname = locationname;
	}

	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}

	public List<Attendee> getAttendees() {
		return attendees;
	}

	public void setAttendees(List<Attendee> attendees) {
		this.attendees = attendees;
	}
}