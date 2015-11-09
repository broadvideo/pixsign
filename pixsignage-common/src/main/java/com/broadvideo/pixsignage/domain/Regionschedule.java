package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Regionschedule {
	private Integer regionscheduleid;

	private String bindtype;

	private Integer bindid;

	private Integer regionid;

	private String playmode;

	private Date playdate;

	private Date starttime;

	private Date endtime;

	private String objtype;

	private Integer objid;

	private Integer taskid;

	private Date createtime;

	private Date tempstarttime;

	private Medialist medialist;

	private Text text;

	private Stream stream;

	private Dvb dvb;

	private Widget widget;

	public Integer getRegionscheduleid() {
		return regionscheduleid;
	}

	public void setRegionscheduleid(Integer regionscheduleid) {
		this.regionscheduleid = regionscheduleid;
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

	public Integer getRegionid() {
		return regionid;
	}

	public void setRegionid(Integer regionid) {
		this.regionid = regionid;
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

	public String getObjtype() {
		return objtype;
	}

	public void setObjtype(String objtype) {
		this.objtype = objtype == null ? null : objtype.trim();
	}

	public Integer getObjid() {
		return objid;
	}

	public void setObjid(Integer objid) {
		this.objid = objid;
	}

	public Integer getTaskid() {
		return taskid;
	}

	public void setTaskid(Integer taskid) {
		this.taskid = taskid;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Date getTempstarttime() {
		return tempstarttime;
	}

	public void setTempstarttime(Date tempstarttime) {
		this.tempstarttime = tempstarttime;
	}

	public Medialist getMedialist() {
		return medialist;
	}

	public void setMedialist(Medialist medialist) {
		this.medialist = medialist;
	}

	public Text getText() {
		return text;
	}

	public void setText(Text text) {
		this.text = text;
	}

	public Stream getStream() {
		return stream;
	}

	public void setStream(Stream stream) {
		this.stream = stream;
	}

	public Dvb getDvb() {
		return dvb;
	}

	public void setDvb(Dvb dvb) {
		this.dvb = dvb;
	}

	public Widget getWidget() {
		return widget;
	}

	public void setWidget(Widget widget) {
		this.widget = widget;
	}
}