package com.broadvideo.signage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Branch {
    private Integer branchid;

    private Integer orgid;

    private Integer parentid;

    private String name;
    
    private String code;

    private String status;

    private String description;

    private Date createtime;

    private Integer createstaffid;

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

    public Integer getParentid() {
        return parentid;
    }

    public void setParentid(Integer parentid) {
        this.parentid = parentid;
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
		this.code = code == null ? null : code.trim();
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