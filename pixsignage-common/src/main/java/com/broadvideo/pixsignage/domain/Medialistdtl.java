package com.broadvideo.pixsignage.domain;

public class Medialistdtl {
	private Integer medialistdtlid;

	private Integer medialistid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Video video;

	private Image image;

	public Integer getMedialistdtlid() {
		return medialistdtlid;
	}

	public void setMedialistdtlid(Integer medialistdtlid) {
		this.medialistdtlid = medialistdtlid;
	}

	public Integer getMedialistid() {
		return medialistid;
	}

	public void setMedialistid(Integer medialistid) {
		this.medialistid = medialistid;
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
}