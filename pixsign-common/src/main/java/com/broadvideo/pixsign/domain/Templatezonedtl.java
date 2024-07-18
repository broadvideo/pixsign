package com.broadvideo.pixsign.domain;

public class Templatezonedtl {
	private Integer templatezonedtlid;

	private Integer templatezoneid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Image image;

	private Video video;

	public Integer getTemplatezonedtlid() {
		return templatezonedtlid;
	}

	public void setTemplatezonedtlid(Integer templatezonedtlid) {
		this.templatezonedtlid = templatezonedtlid;
	}

	public Integer getTemplatezoneid() {
		return templatezoneid;
	}

	public void setTemplatezoneid(Integer templatezoneid) {
		this.templatezoneid = templatezoneid;
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