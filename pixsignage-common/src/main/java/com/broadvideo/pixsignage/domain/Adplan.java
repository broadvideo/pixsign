package com.broadvideo.pixsignage.domain;

public class Adplan {
	private Integer adplanid;

	private Integer orgid;

	private String adplace;

	private Integer devicegroupid;

	private Integer unitprice;

	private Devicegroup devicegroup;

	public Integer getAdplanid() {
		return adplanid;
	}

	public void setAdplanid(Integer adplanid) {
		this.adplanid = adplanid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public String getAdplace() {
		return adplace;
	}

	public void setAdplace(String adplace) {
		this.adplace = adplace == null ? null : adplace.trim();
	}

	public Integer getDevicegroupid() {
		return devicegroupid;
	}

	public void setDevicegroupid(Integer devicegroupid) {
		this.devicegroupid = devicegroupid;
	}

	public Integer getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(Integer unitprice) {
		this.unitprice = unitprice;
	}

	public Devicegroup getDevicegroup() {
		return devicegroup;
	}

	public void setDevicegroup(Devicegroup devicegroup) {
		this.devicegroup = devicegroup;
	}
}