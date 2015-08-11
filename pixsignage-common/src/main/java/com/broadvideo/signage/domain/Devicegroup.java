package com.broadvideo.signage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Devicegroup {
    private Integer devicegroupid;

    private Integer orgid;

    private Integer branchid;

    private String name;
    
    private String code;

    private String description;

    private String status;

    private Date createtime;

    private Integer createstaffid;
    
    private Staff createstaff;

    public Integer getDevicegroupid() {
        return devicegroupid;
    }

    public void setDevicegroupid(Integer devicegroupid) {
        this.devicegroupid = devicegroupid;
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

    public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
    public Date getCreatetime() {
        return createtime;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getCreatestaffid() {
        return createstaffid;
    }

    public void setCreatestaffid(Integer createstaffid) {
        this.createstaffid = createstaffid;
    }

	public Staff getCreatestaff() {
		return createstaff;
	}

	public void setCreatestaff(Staff createstaff) {
		this.createstaff = createstaff;
	}
}