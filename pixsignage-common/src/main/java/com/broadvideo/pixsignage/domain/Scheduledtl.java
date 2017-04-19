package com.broadvideo.pixsignage.domain;

public class Scheduledtl {
	public final static String ObjType_Bundle = "1";
	public final static String ObjType_Page = "2";
	public final static String ObjType_Video = "3";
	public final static String ObjType_Image = "4";
	public final static String ObjType_Mediagrid = "9";

	private Integer scheduledtlid;

	private Integer scheduleid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Integer duration;

	private Bundle bundle;

	private Page page;

	private Video video;

	private Image image;

	private Mediagrid mediagrid;

	public Integer getScheduledtlid() {
		return scheduledtlid;
	}

	public void setScheduledtlid(Integer scheduledtlid) {
		this.scheduledtlid = scheduledtlid;
	}

	public Integer getScheduleid() {
		return scheduleid;
	}

	public void setScheduleid(Integer scheduleid) {
		this.scheduleid = scheduleid;
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

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public Bundle getBundle() {
		return bundle;
	}

	public void setBundle(Bundle bundle) {
		this.bundle = bundle;
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
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

	public Mediagrid getMediagrid() {
		return mediagrid;
	}

	public void setMediagrid(Mediagrid mediagrid) {
		this.mediagrid = mediagrid;
	}
}