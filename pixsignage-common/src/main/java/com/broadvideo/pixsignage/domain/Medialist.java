package com.broadvideo.pixsignage.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Medialist {
	public final static String Type_Private = "0";
	public final static String Type_Public = "1";

	private Integer medialistid;

	private Integer orgid;

	private Integer branchid;

	private String name;

	private String type;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	private List<Medialistdtl> medialistdtls;

	public Integer getMedialistid() {
		return medialistid;
	}

	public void setMedialistid(Integer medialistid) {
		this.medialistid = medialistid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getBranchid() {
		return branchid;
	}

	public void setBranchid(Integer branchid) {
		this.branchid = branchid;
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

	public List<Medialistdtl> getMedialistdtls() {
		return medialistdtls;
	}

	public void setMedialistdtls(List<Medialistdtl> medialistdtls) {
		this.medialistdtls = medialistdtls == null ? new ArrayList<Medialistdtl>() : medialistdtls;
	}
}