package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Bundledtl {
	public final static String Type_Private = "0";
	public final static String Type_Public = "1";

	public final static String ObjType_NONE = "0";
	public final static String ObjType_Medialist = "1";
	public final static String ObjType_Text = "2";
	public final static String ObjType_Stream = "3";
	public final static String ObjType_Widget = "5";
	public final static String ObjType_Dvb = "6";
	public final static String ObjType_Rss = "7";

	private Integer bundledtlid;

	private Integer bundleid;

	private Integer homebundleid;

	private Integer layoutdtlid;

	private String type;

	private String objtype;

	private Integer objid;

	private String touchlabel;

	private String touchtype;

	private Integer touchbundleid;

	private String touchapk;

	private Date createtime;

	private Layoutdtl layoutdtl;

	private Medialist medialist;

	private Text text;

	private Stream stream;

	private Widget widget;

	private Dvb dvb;

	private Rss rss;

	public Integer getBundledtlid() {
		return bundledtlid;
	}

	public void setBundledtlid(Integer bundledtlid) {
		this.bundledtlid = bundledtlid;
	}

	public Integer getBundleid() {
		return bundleid;
	}

	public void setBundleid(Integer bundleid) {
		this.bundleid = bundleid;
	}

	public Integer getHomebundleid() {
		return homebundleid;
	}

	public void setHomebundleid(Integer homebundleid) {
		this.homebundleid = homebundleid;
	}

	public Integer getLayoutdtlid() {
		return layoutdtlid;
	}

	public void setLayoutdtlid(Integer layoutdtlid) {
		this.layoutdtlid = layoutdtlid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
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

	public String getTouchlabel() {
		return touchlabel;
	}

	public void setTouchlabel(String touchlabel) {
		this.touchlabel = touchlabel;
	}

	public String getTouchtype() {
		return touchtype;
	}

	public void setTouchtype(String touchtype) {
		this.touchtype = touchtype;
	}

	public Integer getTouchbundleid() {
		return touchbundleid;
	}

	public void setTouchbundleid(Integer touchbundleid) {
		this.touchbundleid = touchbundleid;
	}

	public String getTouchapk() {
		return touchapk;
	}

	public void setTouchapk(String touchapk) {
		this.touchapk = touchapk;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Layoutdtl getLayoutdtl() {
		return layoutdtl;
	}

	public void setLayoutdtl(Layoutdtl layoutdtl) {
		this.layoutdtl = layoutdtl;
	}

	public Medialist getMedialist() {
		return medialist;
	}

	public void setMedialist(Medialist medialist) {
		this.medialist = medialist;
	}

	public Text getText() {
		return text;
	}

	public void setText(Text text) {
		this.text = text;
	}

	public Stream getStream() {
		return stream;
	}

	public void setStream(Stream stream) {
		this.stream = stream;
	}

	public Widget getWidget() {
		return widget;
	}

	public void setWidget(Widget widget) {
		this.widget = widget;
	}

	public Dvb getDvb() {
		return dvb;
	}

	public void setDvb(Dvb dvb) {
		this.dvb = dvb;
	}

	public Rss getRss() {
		return rss;
	}

	public void setRss(Rss rss) {
		this.rss = rss;
	}
}