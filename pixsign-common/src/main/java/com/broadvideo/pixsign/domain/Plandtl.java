package com.broadvideo.pixsign.domain;

public class Plandtl {
	public final static String ObjType_Bundle = "1";
	public final static String ObjType_Page = "2";
	public final static String ObjType_Video = "3";
	public final static String ObjType_Image = "4";
	public final static String ObjType_Mediagrid = "9";

	private Integer plandtlid;

	private Integer planid;

	private String objtype;

	private Integer objid;

	private Integer sequence;

	private Integer duration;

	private Integer maxtimes;

	private Bundle bundle;

	private Page page;

	private Video video;

	private Image image;

	public Integer getPlandtlid() {
		return plandtlid;
	}

	public void setPlandtlid(Integer plandtlid) {
		this.plandtlid = plandtlid;
	}

	public Integer getPlanid() {
		return planid;
	}

	public void setPlanid(Integer planid) {
		this.planid = planid;
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

	public Integer getMaxtimes() {
		return maxtimes;
	}

	public void setMaxtimes(Integer maxtimes) {
		this.maxtimes = maxtimes;
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
}