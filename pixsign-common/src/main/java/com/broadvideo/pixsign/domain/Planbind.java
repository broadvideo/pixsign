package com.broadvideo.pixsign.domain;

public class Planbind {
	public final static String BindType_Device = "1";
	public final static String BindType_Devicegroup = "2";
	public final static String BindType_Devicegrid = "3";

	private Integer planbindid;

	private Integer planid;

	private String bindtype;

	private Integer bindid;

	private Device device;

	private Devicegroup devicegroup;

	public Integer getPlanbindid() {
		return planbindid;
	}

	public void setPlanbindid(Integer planbindid) {
		this.planbindid = planbindid;
	}

	public Integer getPlanid() {
		return planid;
	}

	public void setPlanid(Integer planid) {
		this.planid = planid;
	}

	public String getBindtype() {
		return bindtype;
	}

	public void setBindtype(String bindtype) {
		this.bindtype = bindtype == null ? null : bindtype.trim();
	}

	public Integer getBindid() {
		return bindid;
	}

	public void setBindid(Integer bindid) {
		this.bindid = bindid;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public Devicegroup getDevicegroup() {
		return devicegroup;
	}

	public void setDevicegroup(Devicegroup devicegroup) {
		this.devicegroup = devicegroup;
	}
}