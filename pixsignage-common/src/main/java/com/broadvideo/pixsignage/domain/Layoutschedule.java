package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Layoutschedule {
	private Integer layoutscheduleid;

	private String bindtype;

	private Integer bindid;

	private Integer layoutid;

	private Date starttime;

	private Date endtime;

	private Date createtime;

	public Integer getLayoutscheduleid() {
		return layoutscheduleid;
	}

	public void setLayoutscheduleid(Integer layoutscheduleid) {
		this.layoutscheduleid = layoutscheduleid;
	}

	public String getBindtype() {
		return bindtype;
	}

	public void setBindtype(String bindtype) {
		this.bindtype = bindtype == null ? null : bindtype.trim();
	}

	public Integer getBindid() {
		return bindid;
	}

	public void setBindid(Integer bindid) {
		this.bindid = bindid;
	}

	public Integer getLayoutid() {
		return layoutid;
	}

	public void setLayoutid(Integer layoutid) {
		this.layoutid = layoutid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
}