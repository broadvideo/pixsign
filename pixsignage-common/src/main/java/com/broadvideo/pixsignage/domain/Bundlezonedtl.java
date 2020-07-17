package com.broadvideo.pixsignage.domain;

public class Bundlezonedtl {
	public final static String ObjType_Video = "1";
	public final static String ObjType_Image = "2";
	public final static String ObjType_Stream = "5";
	public final static String ObjType_Audio = "6";
	public final static String ObjType_Dvb = "7";
	public final static String ObjType_Page = "8";

	private Integer bundlezonedtlid;

	private Integer bundlezoneid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Image image;

	private Video video;

	private Stream stream;

	private Audio audio;

	private Dvb dvb;

	private Page page;

	public Integer getBundlezonedtlid() {
		return bundlezonedtlid;
	}

	public void setBundlezonedtlid(Integer bundlezonedtlid) {
		this.bundlezonedtlid = bundlezonedtlid;
	}

	public Integer getBundlezoneid() {
		return bundlezoneid;
	}

	public void setBundlezoneid(Integer bundlezoneid) {
		this.bundlezoneid = bundlezoneid;
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

	public Dvb getDvb() {
		return dvb;
	}

	public void setDvb(Dvb dvb) {
		this.dvb = dvb;
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}
}