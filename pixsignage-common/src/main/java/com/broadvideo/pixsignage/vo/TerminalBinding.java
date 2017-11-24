package com.broadvideo.pixsignage.vo;

import com.broadvideo.pixsignage.domain.Doorlog;

public  class TerminalBinding extends Doorlog {
	// 对应微信事件
	private String event;
	// 记录事件时间
	private Long eventtime;
	// 授权状态
	private String authorizestate;
	private long createts;

	public TerminalBinding(String terminalid, String wxuserid, String wxmpid) {
		this.setTerminalid(terminalid);
		this.setWxuserid(wxuserid);
		this.setWxmpid(wxmpid);
	}

	public TerminalBinding(String terminalid, String wxuserid, String wxmpid, String event, Long eventtime,
			Integer orgid) {
		this(terminalid, wxuserid, wxmpid);
		this.setOrgid(orgid);
		this.event = event;
		this.eventtime = eventtime;
		this.createts = System.currentTimeMillis();
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public Long getEventtime() {
		return eventtime;
	}

	public void setEventtime(Long eventtime) {
		this.eventtime = eventtime;
	}

	public String getAuthorizestate() {
		return authorizestate;
	}

	public void setAuthorizestate(String authorizestate) {
		this.authorizestate = authorizestate;
	}

	public long getCreatets() {
		return createts;
	}

	public void setCreatets(long createts) {
		this.createts = createts;
	}



}