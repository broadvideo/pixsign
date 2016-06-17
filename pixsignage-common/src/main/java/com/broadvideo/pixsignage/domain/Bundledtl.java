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

	private Integer bundledtlid;

	private Integer bundleid;

	private Integer regionid;

	private String type;

	private String objtype;

	private Integer objid;

	private Date createtime;

	private Layoutdtl layoutdtl;

	private Medialist medialist;

	private Text text;

	private Stream stream;

	private Widget widget;

	private Dvb dvb;

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

	public Integer getRegionid() {
		return regionid;
	}

	public void setRegionid(Integer regionid) {
		this.regionid = regionid;
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
}