package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Devicegroup {
	public final static String Type_Device = "1";
	public final static String Type_Devicegrid = "2";

	private Integer devicegroupid;

	private Integer orgid;

	private Integer branchid;

	private String name;

	private String type;

	private String gridlayoutcode;

	private Integer xcount;

	private Integer ycount;

	private String ratio;

	private Integer width;

	private Integer height;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	private Integer defaultbundleid;

	private Integer defaultpageid;

	private List<Device> devices;

	private List<Devicegrid> devicegrids;

	private List<Schedule> schedules;

	private Bundle defaultbundle;

	private Page defaultpage;

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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getGridlayoutcode() {
		return gridlayoutcode;
	}

	public void setGridlayoutcode(String gridlayoutcode) {
		this.gridlayoutcode = gridlayoutcode;
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
		this.ratio = ratio;
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

	public Integer getDefaultbundleid() {
		return defaultbundleid;
	}

	public void setDefaultbundleid(Integer defaultbundleid) {
		this.defaultbundleid = defaultbundleid;
	}

	public Integer getDefaultpageid() {
		return defaultpageid;
	}

	public void setDefaultpageid(Integer defaultpageid) {
		this.defaultpageid = defaultpageid;
	}

	public List<Device> getDevices() {
		return devices;
	}

	public void setDevices(List<Device> devices) {
		this.devices = devices;
	}

	public List<Devicegrid> getDevicegrids() {
		return devicegrids;
	}

	public void setDevicegrids(List<Devicegrid> devicegrids) {
		this.devicegrids = devicegrids;
	}

	public List<Schedule> getSchedules() {
		return schedules;
	}

	public void setSchedules(List<Schedule> schedules) {
		this.schedules = schedules;
	}

	public Bundle getDefaultbundle() {
		return defaultbundle;
	}

	public void setDefaultbundle(Bundle defaultbundle) {
		this.defaultbundle = defaultbundle;
	}

	public Page getDefaultpage() {
		return defaultpage;
	}

	public void setDefaultpage(Page defaultpage) {
		this.defaultpage = defaultpage;
	}
}