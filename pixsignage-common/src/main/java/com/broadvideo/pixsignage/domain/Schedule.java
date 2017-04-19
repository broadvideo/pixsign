package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Schedule {
	public final static String ScheduleType_Solo = "1";
	public final static String ScheduleType_Multi = "2";

	public final static String BindType_Device = "1";
	public final static String BindType_Devicegroup = "2";
	public final static String BindType_Devicegrid = "3";

	public final static String PlayMode_Once = "1";
	public final static String PlayMode_Daily = "2";

	private Integer scheduleid;

	private String bindtype;

	private Integer bindid;

	private String scheduletype;

	private String playmode;

	private Date starttime;

	private Date endtime;

	private Integer intervaltime;

	private Date createtime;

	private List<Scheduledtl> scheduledtls;

	public Integer getScheduleid() {
		return scheduleid;
	}

	public void setScheduleid(Integer scheduleid) {
		this.scheduleid = scheduleid;
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

	public String getScheduletype() {
		return scheduletype;
	}

	public void setScheduletype(String scheduletype) {
		this.scheduletype = scheduletype == null ? null : scheduletype.trim();
	}

	public String getPlaymode() {
		return playmode;
	}

	public void setPlaymode(String playmode) {
		this.playmode = playmode == null ? null : playmode.trim();
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

	public Integer getIntervaltime() {
		return intervaltime;
	}

	public void setIntervaltime(Integer intervaltime) {
		this.intervaltime = intervaltime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public List<Scheduledtl> getScheduledtls() {
		return scheduledtls;
	}

	public void setScheduledtls(List<Scheduledtl> scheduledtls) {
		this.scheduledtls = scheduledtls;
	}
}