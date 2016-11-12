package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Oplog {
	private Integer oplogid;

	private Integer orgid;

	private Integer branchid;

	private Integer staffid;

	private String type;

	private String objtype1;

	private Integer objid1;

	private String objname1;

	private String objtype2;

	private Integer objid2;

	private String objname2;

	private String status;

	private String description;

	private Date createtime;

	private Staff staff;

	public Integer getOplogid() {
		return oplogid;
	}

	public void setOplogid(Integer oplogid) {
		this.oplogid = oplogid;
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

	public Integer getStaffid() {
		return staffid;
	}

	public void setStaffid(Integer staffid) {
		this.staffid = staffid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public String getObjtype1() {
		return objtype1;
	}

	public void setObjtype1(String objtype1) {
		this.objtype1 = objtype1 == null ? null : objtype1.trim();
	}

	public Integer getObjid1() {
		return objid1;
	}

	public void setObjid1(Integer objid1) {
		this.objid1 = objid1;
	}

	public String getObjname1() {
		return objname1;
	}

	public void setObjname1(String objname1) {
		this.objname1 = objname1 == null ? null : objname1.trim();
	}

	public String getObjtype2() {
		return objtype2;
	}

	public void setObjtype2(String objtype2) {
		this.objtype2 = objtype2 == null ? null : objtype2.trim();
	}

	public Integer getObjid2() {
		return objid2;
	}

	public void setObjid2(Integer objid2) {
		this.objid2 = objid2;
	}

	public String getObjname2() {
		return objname2;
	}

	public void setObjname2(String objname2) {
		this.objname2 = objname2 == null ? null : objname2.trim();
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

	public Staff getStaff() {
		return staff;
	}

	public void setStaff(Staff staff) {
		this.staff = staff;
	}
}