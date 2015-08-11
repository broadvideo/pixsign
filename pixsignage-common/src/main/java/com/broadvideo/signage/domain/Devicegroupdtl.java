package com.broadvideo.signage.domain;

public class Devicegroupdtl {
    private Integer devicegroupdtlid;

    private Integer devicegroupid;

    private Integer deviceid;
    
    private Devicegroup devicegroup;
    
    private Device device;

    public Integer getDevicegroupdtlid() {
        return devicegroupdtlid;
    }

    public void setDevicegroupdtlid(Integer devicegroupdtlid) {
        this.devicegroupdtlid = devicegroupdtlid;
    }

    public Integer getDevicegroupid() {
        return devicegroupid;
    }

    public void setDevicegroupid(Integer devicegroupid) {
        this.devicegroupid = devicegroupid;
    }

    public Integer getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(Integer deviceid) {
        this.deviceid = deviceid;
    }

	public Devicegroup getDevicegroup() {
		return devicegroup;
	}

	public void setDevicegroup(Devicegroup devicegroup) {
		this.devicegroup = devicegroup;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevie(Device device) {
		this.device = device;
	}
}