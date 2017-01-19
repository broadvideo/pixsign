package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Mediagriddtl {
	public final static String ObjType_Video = "1";
	public final static String ObjType_Image = "2";
	public final static String ObjType_Page = "3";

	private Integer mediagriddtlid;

	private Integer mediagridid;

	private Integer xpos;

	private Integer ypos;

	private Integer xcount;

	private Integer ycount;

	private String objtype;

	private Integer objid;

	private Integer mmediaid;

	private Date createtime;

	private Video video;

	private Image image;

	private Page page;

	public Integer getMediagriddtlid() {
		return mediagriddtlid;
	}

	public void setMediagriddtlid(Integer mediagriddtlid) {
		this.mediagriddtlid = mediagriddtlid;
	}

	public Integer getMediagridid() {
		return mediagridid;
	}

	public void setMediagridid(Integer mediagridid) {
		this.mediagridid = mediagridid;
	}

	public Integer getXpos() {
		return xpos;
	}

	public void setXpos(Integer xpos) {
		this.xpos = xpos;
	}

	public Integer getYpos() {
		return ypos;
	}

	public void setYpos(Integer ypos) {
		this.ypos = ypos;
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

	public Integer getMmediaid() {
		return mmediaid;
	}

	public void setMmediaid(Integer mmediaid) {
		this.mmediaid = mmediaid;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Video getVideo() {
		return video;
	}

	public void setVideo(Video video) {
		this.video = video;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}
}