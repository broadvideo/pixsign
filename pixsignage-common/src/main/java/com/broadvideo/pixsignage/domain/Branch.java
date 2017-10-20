package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Branch {
	private Integer branchid;

	private Integer orgid;

	private Integer topfolderid;

	private Integer parentid;

	private Integer parentid2;

	private Integer parentid3;

	private String name;

	private String code;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	private Integer childcount;

	private Branch parent;

	private List<Branch> children;

	private Org org;

	public Integer getBranchid() {
		return branchid;
	}

	public void setBranchid(Integer branchid) {
		this.branchid = branchid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getTopfolderid() {
		return topfolderid;
	}

	public void setTopfolderid(Integer topfolderid) {
		this.topfolderid = topfolderid;
	}

	public Integer getParentid() {
		return parentid;
	}

	public void setParentid(Integer parentid) {
		this.parentid = parentid;
	}

	public Integer getParentid2() {
		return parentid2;
	}

	public void setParentid2(Integer parentid2) {
		this.parentid2 = parentid2;
	}

	public Integer getParentid3() {
		return parentid3;
	}

	public void setParentid3(Integer parentid3) {
		this.parentid3 = parentid3;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
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

	public Integer getChildcount() {
		return childcount;
	}

	public void setChildcount(Integer childcount) {
		this.childcount = childcount;
	}

	public Branch getParent() {
		return parent;
	}

	public void setParent(Branch parent) {
		this.parent = parent;
	}

	public List<Branch> getChildren() {
		return children;
	}

	public void setChildren(List<Branch> children) {
		this.children = children;
	}

	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}
}