package com.broadvideo.pixsign.domain;

public class Templetzonedtl {
	private Integer templetzonedtlid;

	private Integer templetzoneid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Image image;

	private Video video;

	private Stream stream;

	private Audio audio;

	private Page page;

	public Integer getTempletzonedtlid() {
		return templetzonedtlid;
	}

	public void setTempletzonedtlid(Integer templetzonedtlid) {
		this.templetzonedtlid = templetzonedtlid;
	}

	public Integer getTempletzoneid() {
		return templetzoneid;
	}

	public void setTempletzoneid(Integer templetzoneid) {
		this.templetzoneid = templetzoneid;
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

	public Stream getStream() {
		return stream;
	}

	public void setStream(Stream stream) {
		this.stream = stream;
	}

	public Audio getAudio() {
		return audio;
	}

	public void setAudio(Audio audio) {
		this.audio = audio;
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}
}