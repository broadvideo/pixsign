package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Gridschedule {
	public final static String PlayMode_Once = "1";
	public final static String PlayMode_Daily = "2";

	private Integer gridscheduleid;

	private Integer devicegridid;

	private String playmode;

	private Date playdate;

	private Date starttime;

	private Date endtime;

	private Date createtime;

	private List<Gridscheduledtl> gridscheduledtls;

	public Integer getGridscheduleid() {
		return gridscheduleid;
	}

	public void setGridscheduleid(Integer gridscheduleid) {
		this.gridscheduleid = gridscheduleid;
	}

	public Integer getDevicegridid() {
		return devicegridid;
	}

	public void setDevicegridid(Integer devicegridid) {
		this.devicegridid = devicegridid;
	}

	public String getPlaymode() {
		return playmode;
	}

	public void setPlaymode(String playmode) {
		this.playmode = playmode == null ? null : playmode.trim();
	}

	@JSON(format = "yyyy-MM-dd")
	public Date getPlaydate() {
		return playdate;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setPlaydate(Date playdate) {
		this.playdate = playdate;
	}

	@JSON(format = "HH:mm:ss")
	public Date getStarttime() {
		return starttime;
	}

	@JSON(format = "HH:mm:ss")
	public void setStarttime(Date starttime) {
		this.starttime = starttime;
	}

	@JSON(format = "HH:mm:ss")
	public Date getEndtime() {
		return endtime;
	}

	@JSON(format = "HH:mm:ss")
	public void setEndtime(Date endtime) {
		this.endtime = endtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public List<Gridscheduledtl> getGridscheduledtls() {
		return gridscheduledtls;
	}

	public void setGridscheduledtls(List<Gridscheduledtl> gridscheduledtls) {
		this.gridscheduledtls = gridscheduledtls;
	}
}