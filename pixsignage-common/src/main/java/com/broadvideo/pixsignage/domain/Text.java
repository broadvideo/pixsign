package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Text {
	private Integer textid;

	private Integer orgid;

	private String name;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	private String text;

	public Integer getTextid() {
		return textid;
	}

	public void setTextid(Integer textid) {
		this.textid = textid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Integer getCreatestaffid() {
		return createstaffid;
	}

	public void setCreatestaffid(Integer createstaffid) {
		this.createstaffid = createstaffid;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text == null ? null : text.trim();
	}
}