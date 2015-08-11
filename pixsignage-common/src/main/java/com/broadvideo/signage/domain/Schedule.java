package com.broadvideo.signage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Schedule {
    private Integer scheduleid;

    private Integer taskid;

    private Integer deviceid;

    private Integer layoutid;

    private String type;
    
    private String utype;

    private Date fromdate;

    private Date todate;

    private Integer priority;

    private String syncstatus;

    private String status;

    private Integer complete;
    
    private Long filesize;
    
    private Long filesizecomplete;
    
    private Date syncstarttime;
    
    private Date syncendtime;

    private Date createtime;

    private Integer createstaffid;
    
    private Integer devicegroupid;
    
    private long intfromdate;
    
    private long inttodate;
    
    private Device device;

    private Layout layout;

    public Integer getScheduleid() {
        return scheduleid;
    }

    public void setScheduleid(Integer scheduleid) {
        this.scheduleid = scheduleid;
    }

    public Integer getTaskid() {
        return taskid;
    }

    public void setTaskid(Integer taskid) {
        this.taskid = taskid;
    }

    public Integer getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(Integer deviceid) {
        this.deviceid = deviceid;
    }

    public Integer getLayoutid() {
        return layoutid;
    }

    public void setLayoutid(Integer layoutid) {
        this.layoutid = layoutid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getUtype() {
		return utype;
	}

	public void setUtype(String utype) {
		this.utype = utype;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
    public Date getFromdate() {
        return fromdate;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public void setFromdate(Date fromdate) {
        this.fromdate = fromdate;
        this.setIntfromdate(fromdate.getTime());
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public Date getTodate() {
        return todate;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public void setTodate(Date todate) {
        this.todate = todate;
        this.setInttodate(todate.getTime());
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getSyncstatus() {
        return syncstatus;
    }

    public void setSyncstatus(String syncstatus) {
        this.syncstatus = syncstatus == null ? null : syncstatus.trim();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

    public Integer getComplete() {
        return complete;
    }

    public void setComplete(Integer complete) {
        this.complete = complete;
    }

    public Long getFilesize() {
		return filesize;
	}

	public void setFilesize(Long filesize) {
		this.filesize = filesize;
	}

	public Long getFilesizecomplete() {
		return filesizecomplete;
	}

	public void setFilesizecomplete(Long filesizecomplete) {
		this.filesizecomplete = filesizecomplete;
	}

    @JSON(format="yyyy-MM-dd HH:mm:ss")
	public Date getSyncstarttime() {
		return syncstarttime;
	}

    @JSON(format="yyyy-MM-dd HH:mm:ss")
	public void setSyncstarttime(Date syncstarttime) {
		this.syncstarttime = syncstarttime;
	}

    @JSON(format="yyyy-MM-dd HH:mm:ss")
	public Date getSyncendtime() {
		return syncendtime;
	}

    @JSON(format="yyyy-MM-dd HH:mm:ss")
	public void setSyncendtime(Date syncendtime) {
		this.syncendtime = syncendtime;
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

	public Integer getDevicegroupid() {
		return devicegroupid;
	}

	public void setDevicegroupid(Integer devicegroupid) {
		this.devicegroupid = devicegroupid;
	}

	public long getIntfromdate() {
		return intfromdate;
	}

	public void setIntfromdate(long intfromdate) {
		this.intfromdate = intfromdate;
	}

	public long getInttodate() {
		return inttodate;
	}

	public void setInttodate(long inttodate) {
		this.inttodate = inttodate;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public Layout getLayout() {
		return layout;
	}

	public void setLayout(Layout layout) {
		this.layout = layout;
	}
}