package com.broadvideo.pixsignage.domain;

import java.beans.Transient;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.broadvideo.pixsignage.util.DateUtil;

public class Meeting {

	public static String WAITING_FOR_AUDIT = "0";
	public static String SUCCESS_FOR_AUDIT = "1";
	public static String REFUSE_FOR_AUDIT = "2";
	public static String NONE_FOR_AUDIT = "9";
    private Integer meetingid;

    private String uuid;

    private Integer meetingroomid;
	private String meetingroomname;

    private String subject;

    private String description;
    private Date starttime;

    private Date endtime;

    private Integer duration;
	
    private BigDecimal fee;
	
	private String formatduration;

    private Integer amount;

    private Integer bookstaffid;
	private String bookstaffname;

    private Integer bookbranchid;
	private String bookbranchname;
	private String locationname;

    private String qrcode;

    private String auditstatus;
    private String auditresult;
    private Integer orgid;

    private Date createtime;

    private Integer createstaffid;

    private Date updatetime;
    private Integer updatestaffid;

    private String status;
	private Integer[] attendeeuserids;
	private List<Attendee> attendees = new ArrayList<Attendee>();
	private String search;
	private Integer locationid;
	private Integer signamount;
	private List<String> auditstatuslist;

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

	public void setStarttime(String starttime) {

		this.starttime = DateUtil.getDate(starttime, "yyyy-MM-dd HH:mm");

	}

    public Date getEndtime() {
        return endtime;
    }

    public void setEndtime(Date endtime) {
        this.endtime = endtime;
    }

	public void setEndtime(String endtime) {
		this.endtime = DateUtil.getDate(endtime, "yyyy-MM-dd HH:mm");
	}

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    public BigDecimal getFee() {
        return fee;
    }
    public void setFee(BigDecimal fee) {
        this.fee = fee;
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

    public String getAuditstatus() {
        return auditstatus;
    }
    public void setAuditstatus(String auditstatus) {
        this.auditstatus = auditstatus == null ? null : auditstatus.trim();
    }
    public String getAuditresult() {
        return auditresult;
    }
    public void setAuditresult(String auditresult) {
        this.auditresult = auditresult == null ? null : auditresult.trim();
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

	@Transient
	public String getFormatduration() {
		return formatduration;
	}

	public void setFormatduration(String formatduration) {
		this.formatduration = formatduration;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

	@Transient
	public String getMeetingroomname() {
		return meetingroomname;
	}

	public void setMeetingroomname(String meetingroomname) {
		this.meetingroomname = meetingroomname;
	}

	@Transient
	public String getBookstaffname() {
		return bookstaffname;
	}

	public void setBookstaffname(String bookstaffname) {
		this.bookstaffname = bookstaffname;
	}

	@Transient
	public String getBookbranchname() {
		return bookbranchname;
	}

	public void setBookbranchname(String bookbranchname) {
		this.bookbranchname = bookbranchname;
	}

	@Transient
	public String getLocationname() {
		return locationname;
	}

	public void setLocationname(String locationname) {
		this.locationname = locationname;
	}

	@Transient
	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}

	@Transient
	public List<Attendee> getAttendees() {
		return attendees;
	}

	public void setAttendees(List<Attendee> attendees) {
		this.attendees = attendees;
	}

	@Transient
	public Integer getLocationid() {
		return locationid;
	}

	public void setLocationid(Integer locationid) {
		this.locationid = locationid;
	}

	@Transient
	public Integer getSignamount() {
		return signamount;
	}

	public void setSignamount(Integer signamount) {
		this.signamount = signamount;
	}

	@Transient
	public List<String> getAuditstatuslist() {
		return auditstatuslist;
	}

	public void setAuditstatuslist(List<String> auditstatuslist) {
		this.auditstatuslist = auditstatuslist;
	}


}