package com.broadvideo.signage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Task {
    private Integer taskid;

    private Integer orgid;

    private Integer branchid;

    private String name;

    private String type;

    private Date fromdate;

    private Date todate;
    
    private Long filesize;

    private Date createtime;

    private Integer createstaffid;
    
    private List<Schedule> schedules;
    
    private Staff createstaff;

    public Integer getTaskid() {
        return taskid;
    }

    public void setTaskid(Integer taskid) {
        this.taskid = taskid;
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

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public Date getFromdate() {
        return fromdate;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public void setFromdate(Date fromdate) {
        this.fromdate = fromdate;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public Date getTodate() {
        return todate;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public void setTodate(Date todate) {
        this.todate = todate;
    }

    public Long getFilesize() {
		return filesize;
	}

	public void setFilesize(Long filesize) {
		this.filesize = filesize;
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

	public List<Schedule> getSchedules() {
		return schedules;
	}

	public void setSchedules(List<Schedule> schedules) {
		this.schedules = schedules;
	}

	public Staff getCreatestaff() {
		return createstaff;
	}

	public void setCreatestaff(Staff createstaff) {
		this.createstaff = createstaff;
	}
}