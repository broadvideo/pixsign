package com.broadvideo.pixsignage.domain;

import java.beans.Transient;
import java.util.Date;
import java.util.List;

public class Event {
    private Integer eventid;

    private String uuid;

    private Integer roomid;
	private String roomname;
	private Integer roomtype;

    private String name;

    private String type;
    private Date startdate;
    private Date enddate;
    private Date shortstarttime;
    private Date shortendtime;
    private Date starttime;

    private Date endtime;
    private String eventdaysflag;

    private Integer amount;

    private String sourcetype;

    private Integer orgid;

    private Date createtime;

    private Integer createstaffid;

    private Date updatetime;

    private Integer updatestaffid;

    private String status;
	private String search;
	private List<Eventdtl> eventdtls;
	private String timedtls;

    public Integer getEventid() {
        return eventid;
    }

    public void setEventid(Integer eventid) {
        this.eventid = eventid;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid == null ? null : uuid.trim();
    }

    public Integer getRoomid() {
        return roomid;
    }

    public void setRoomid(Integer roomid) {
        this.roomid = roomid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public Date getStartdate() {
        return startdate;
    }
    public void setStartdate(Date startdate) {
        this.startdate = startdate;
    }

    public Date getEnddate() {
        return enddate;
    }
    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }

    public Date getShortstarttime() {
        return shortstarttime;
    }
    public void setShortstarttime(Date shortstarttime) {
        this.shortstarttime = shortstarttime;
    }

    public Date getShortendtime() {
        return shortendtime;
    }
    public void setShortendtime(Date shortendtime) {
        this.shortendtime = shortendtime;
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

    public String getEventdaysflag() {
        return eventdaysflag;
    }
    public void setEventdaysflag(String eventdaysflag) {
        this.eventdaysflag = eventdaysflag == null ? null : eventdaysflag.trim();
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getSourcetype() {
        return sourcetype;
    }

    public void setSourcetype(String sourcetype) {
        this.sourcetype = sourcetype == null ? null : sourcetype.trim();
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
	public String getRoomname() {
		return roomname;
	}

	public void setRoomname(String roomname) {
		this.roomname = roomname;
	}

	@Transient
	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}

	@Transient
	public Integer getRoomtype() {
		return roomtype;
	}

	public void setRoomtype(Integer roomtype) {
		this.roomtype = roomtype;
	}

	@Transient
	public List<Eventdtl> getEventdtls() {
		return eventdtls;
	}

	public void setEventdtls(List<Eventdtl> eventdtls) {
		this.eventdtls = eventdtls;
	}

	@Transient
	public String getTimedtls() {
		return timedtls;
	}


	public void setTimedtls(String timedtls) {
		this.timedtls = timedtls;
	}
}