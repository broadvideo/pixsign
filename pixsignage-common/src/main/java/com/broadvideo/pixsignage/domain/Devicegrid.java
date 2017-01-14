package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

public class Devicegrid {
	private Integer devicegridid;

	private Integer orgid;

	private Integer branchid;

	private String name;

	private String gridlayoutcode;

	private Integer xcount;

	private Integer ycount;

	private String ratio;

	private Integer width;

	private Integer height;

	private String status;

	private String description;

	private Date createtime;

	private List<Device> devices;

	private List<Gridschedule> gridschedules;

	public Integer getDevicegridid() {
		return devicegridid;
	}

	public void setDevicegridid(Integer devicegridid) {
		this.devicegridid = devicegridid;
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

	public String getGridlayoutcode() {
		return gridlayoutcode;
	}

	public void setGridlayoutcode(String gridlayoutcode) {
		this.gridlayoutcode = gridlayoutcode == null ? null : gridlayoutcode.trim();
	}

	public Integer getXcount() {
		return xcount;
	}

	public void setXcount(Integer xcount) {
		this.xcount = xcount;
	}

	public Integer getYcount() {
		return ycount;
	}

	public void setYcount(Integer ycount) {
		this.ycount = ycount;
	}

	public String getRatio() {
		return ratio;
	}

	public void setRatio(String ratio) {
		this.ratio = ratio == null ? null : ratio.trim();
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
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

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public List<Device> getDevices() {
		return devices;
	}

	public void setDevices(List<Device> devices) {
		this.devices = devices;
	}

	public List<Gridschedule> getGridschedules() {
		return gridschedules;
	}

	public void setGridschedules(List<Gridschedule> gridschedules) {
		this.gridschedules = gridschedules;
	}
}