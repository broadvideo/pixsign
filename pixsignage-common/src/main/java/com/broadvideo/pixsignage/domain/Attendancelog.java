package com.broadvideo.pixsignage.domain;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Attendancelog {
	private Integer attendancelogid;

	private Integer eventid;

	private String eventname;

	private Integer personid;

	private String personname;

	private Integer roomid;

	private String roomname;

	private Integer roomterminalid;

	private String terminalid;

	private String terminalname;

	private String signtype;

	private Date signtime;

	private Integer orgid;
	private Date createtime;

	private String syncstatus;

	private String status;

	private Date starttime;
	private Date endtime;
	private Person person;
	private String search;
	private List<Date> signtimes = new ArrayList<Date>();

	public Integer getAttendancelogid() {
		return attendancelogid;
	}

	public void setAttendancelogid(Integer attendancelogid) {
		this.attendancelogid = attendancelogid;
	}

	public Integer getEventid() {
		return eventid;
	}

	public void setEventid(Integer eventid) {
		this.eventid = eventid;
	}

	public String getEventname() {
		return eventname;
	}

	public void setEventname(String eventname) {
		this.eventname = eventname == null ? null : eventname.trim();
	}

	public Integer getPersonid() {
		return personid;
	}

	public void setPersonid(Integer personid) {
		this.personid = personid;
	}

	public String getPersonname() {
		return personname;
	}

	public void setPersonname(String personname) {
		this.personname = personname == null ? null : personname.trim();
	}

	public Integer getRoomid() {
		return roomid;
	}

	public void setRoomid(Integer roomid) {
		this.roomid = roomid;
	}

	public String getRoomname() {
		return roomname;
	}

	public void setRoomname(String roomname) {
		this.roomname = roomname == null ? null : roomname.trim();
	}

	public Integer getRoomterminalid() {
		return roomterminalid;
	}

	public void setRoomterminalid(Integer roomterminalid) {
		this.roomterminalid = roomterminalid;
	}

	public String getTerminalid() {
		return terminalid;
	}

	public void setTerminalid(String terminalid) {
		this.terminalid = terminalid == null ? null : terminalid.trim();
	}

	public String getTerminalname() {
		return terminalname;
	}

	public void setTerminalname(String terminalname) {
		this.terminalname = terminalname == null ? null : terminalname.trim();
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

	public String getSyncstatus() {
		return syncstatus;
	}

	public void setSyncstatus(String syncstatus) {
		this.syncstatus = syncstatus;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	@Transient
	public Date getStarttime() {
		return starttime;
	}

	public void setStarttime(Date starttime) {
		this.starttime = starttime;
	}

	@Transient
	public Date getEndtime() {
		return endtime;
	}

	public void setEndtime(Date endtime) {
		this.endtime = endtime;
	}

	@Transient
	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	@Transient
	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}

	@Transient
	public List<Date> getSigntimes() {
		return signtimes;
	}

	public void setSigntimes(List<Date> signtimes) {
		this.signtimes = signtimes;
	}

}