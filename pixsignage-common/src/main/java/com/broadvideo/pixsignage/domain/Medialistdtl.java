package com.broadvideo.pixsignage.domain;

public class Medialistdtl {
	public final static String ObjType_Video = "1";
	public final static String ObjType_Image = "2";
	public final static String ObjType_Stream = "5";

	private Integer medialistdtlid;

	private Integer medialistid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Video video;

	private Image image;

	private Stream stream;

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

	public Stream getStream() {
		return stream;
	}

	public void setStream(Stream stream) {
		this.stream = stream;
	}
}