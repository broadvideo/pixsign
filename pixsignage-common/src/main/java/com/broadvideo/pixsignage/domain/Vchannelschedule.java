package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Vchannelschedule {
	private Integer vchannelscheduleid;

	private Integer vchannelid;

	private String playmode;

	private Date playdate;

	private Date starttime;

	private Date endtime;

	private Integer playlistid;

	private Date createtime;

	private Date tempstarttime;

	private Playlist playlist;

	public Integer getVchannelscheduleid() {
		return vchannelscheduleid;
	}

	public void setVchannelscheduleid(Integer vchannelscheduleid) {
		this.vchannelscheduleid = vchannelscheduleid;
	}

	public Integer getVchannelid() {
		return vchannelid;
	}

	public void setVchannelid(Integer vchannelid) {
		this.vchannelid = vchannelid;
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

	public Integer getPlaylistid() {
		return playlistid;
	}

	public void setPlaylistid(Integer playlistid) {
		this.playlistid = playlistid;
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

	public Playlist getPlaylist() {
		return playlist;
	}

	public void setPlaylist(Playlist playlist) {
		this.playlist = playlist;
	}
}