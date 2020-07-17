package com.broadvideo.pixsignage.domain;

public class Intent {
	private Integer intentid;

	private Integer orgid;

	private String intentkey;

	private String relatetype;

	private Integer relateid;

	private String relateurl;

	private Video relatevideo;

	private Image relateimage;

	private Page relatepage;

	public Integer getIntentid() {
		return intentid;
	}

	public void setIntentid(Integer intentid) {
		this.intentid = intentid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public String getIntentkey() {
		return intentkey;
	}

	public void setIntentkey(String intentkey) {
		this.intentkey = intentkey == null ? null : intentkey.trim();
	}

	public String getRelatetype() {
		return relatetype;
	}

	public void setRelatetype(String relatetype) {
		this.relatetype = relatetype == null ? null : relatetype.trim();
	}

	public Integer getRelateid() {
		return relateid;
	}

	public void setRelateid(Integer relateid) {
		this.relateid = relateid;
	}

	public String getRelateurl() {
		return relateurl;
	}

	public void setRelateurl(String relateurl) {
		this.relateurl = relateurl == null ? null : relateurl.trim();
	}

	public Video getRelatevideo() {
		return relatevideo;
	}

	public void setRelatevideo(Video relatevideo) {
		this.relatevideo = relatevideo;
	}

	public Image getRelateimage() {
		return relateimage;
	}

	public void setRelateimage(Image relateimage) {
		this.relateimage = relateimage;
	}

	public Page getRelatepage() {
		return relatepage;
	}

	public void setRelatepage(Page relatepage) {
		this.relatepage = relatepage;
	}
}