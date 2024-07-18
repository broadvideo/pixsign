package com.broadvideo.pixsign.domain;

public class Pagezonedtl {
	public final static String ObjType_Video = "1";
	public final static String ObjType_Image = "2";

	private Integer pagezonedtlid;

	private Integer pagezoneid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Image image;

	private Video video;

	public Integer getPagezonedtlid() {
		return pagezonedtlid;
	}

	public void setPagezonedtlid(Integer pagezonedtlid) {
		this.pagezonedtlid = pagezonedtlid;
	}

	public Integer getPagezoneid() {
		return pagezoneid;
	}

	public void setPagezoneid(Integer pagezoneid) {
		this.pagezoneid = pagezoneid;
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

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public Video getVideo() {
		return video;
	}

	public void setVideo(Video video) {
		this.video = video;
	}
}