package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Templetdtl {
	public final static String Type_PLAY = "0";
	public final static String Type_TEXT = "1";
	public final static String Type_DATE = "2";
	public final static String Type_WEATHER = "3";
	public final static String Type_VIDEOIN = "4";
	public final static String Type_DVB = "5";
	public final static String Type_STREAM = "6";
	public final static String Type_TOUCH = "7";
	public final static String Type_NAVIGATE = "8";
	public final static String Type_QRCODE = "9";
	public final static String Type_CALENDAR_LIST = "10";
	public final static String Type_CALENDAR_TABLE = "11";
	public final static String Type_RSS = "12";
	public final static String Type_AUDIO = "13";
	public final static String Type_A1 = "A1";
	public final static String Type_A2 = "A2";

	public final static String ObjType_NONE = "0";
	public final static String ObjType_Medialist = "1";
	public final static String ObjType_Text = "2";
	public final static String ObjType_Stream = "3";
	public final static String ObjType_Widget = "5";
	public final static String ObjType_Dvb = "6";
	public final static String ObjType_Rss = "7";

	private Integer templetdtlid;

	private Integer templetid;

	private Integer hometempletid;

	private String type;

	private String mainflag;

	private Integer height;

	private Integer width;

	private Integer topoffset;

	private Integer leftoffset;

	private Integer zindex;

	private String bgcolor;

	private Integer opacity;

	private Integer bgimageid;

	private Integer sleeptime;

	private Integer intervaltime;

	private String animation;

	private String direction;

	private String speed;

	private String color;

	private Integer size;

	private String dateformat;

	private String fitflag;

	private Integer volume;

	private String objtype;

	private Integer objid;

	private String touchlabel;

	private String touchtype;

	private Integer touchtempletid;

	private String touchapk;

	private Date createtime;

	private Image bgimage;

	private Medialist medialist;

	private Text text;

	private Stream stream;

	private Widget widget;

	private Dvb dvb;

	private Rss rss;

	public Integer getTempletdtlid() {
		return templetdtlid;
	}

	public void setTempletdtlid(Integer templetdtlid) {
		this.templetdtlid = templetdtlid;
	}

	public Integer getTempletid() {
		return templetid;
	}

	public void setTempletid(Integer templetid) {
		this.templetid = templetid;
	}

	public Integer getHometempletid() {
		return hometempletid;
	}

	public void setHometempletid(Integer hometempletid) {
		this.hometempletid = hometempletid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public String getMainflag() {
		return mainflag;
	}

	public void setMainflag(String mainflag) {
		this.mainflag = mainflag == null ? null : mainflag.trim();
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getTopoffset() {
		return topoffset;
	}

	public void setTopoffset(Integer topoffset) {
		this.topoffset = topoffset;
	}

	public Integer getLeftoffset() {
		return leftoffset;
	}

	public void setLeftoffset(Integer leftoffset) {
		this.leftoffset = leftoffset;
	}

	public Integer getZindex() {
		return zindex;
	}

	public void setZindex(Integer zindex) {
		this.zindex = zindex;
	}

	public String getBgcolor() {
		return bgcolor;
	}

	public void setBgcolor(String bgcolor) {
		this.bgcolor = bgcolor == null ? null : bgcolor.trim();
	}

	public Integer getOpacity() {
		return opacity;
	}

	public void setOpacity(Integer opacity) {
		this.opacity = opacity;
	}

	public Integer getBgimageid() {
		return bgimageid;
	}

	public void setBgimageid(Integer bgimageid) {
		this.bgimageid = bgimageid;
	}

	public Integer getSleeptime() {
		return sleeptime;
	}

	public void setSleeptime(Integer sleeptime) {
		this.sleeptime = sleeptime;
	}

	public Integer getIntervaltime() {
		return intervaltime;
	}

	public void setIntervaltime(Integer intervaltime) {
		this.intervaltime = intervaltime;
	}

	public String getAnimation() {
		return animation;
	}

	public void setAnimation(String animation) {
		this.animation = animation == null ? null : animation.trim();
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction == null ? null : direction.trim();
	}

	public String getSpeed() {
		return speed;
	}

	public void setSpeed(String speed) {
		this.speed = speed == null ? null : speed.trim();
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color == null ? null : color.trim();
	}

	public Integer getSize() {
		return size;
	}

	public void setSize(Integer size) {
		this.size = size;
	}

	public String getDateformat() {
		return dateformat;
	}

	public void setDateformat(String dateformat) {
		this.dateformat = dateformat == null ? null : dateformat.trim();
	}

	public String getFitflag() {
		return fitflag;
	}

	public void setFitflag(String fitflag) {
		this.fitflag = fitflag == null ? null : fitflag.trim();
	}

	public Integer getVolume() {
		return volume;
	}

	public void setVolume(Integer volume) {
		this.volume = volume;
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
		this.touchlabel = touchlabel == null ? null : touchlabel.trim();
	}

	public String getTouchtype() {
		return touchtype;
	}

	public void setTouchtype(String touchtype) {
		this.touchtype = touchtype == null ? null : touchtype.trim();
	}

	public Integer getTouchtempletid() {
		return touchtempletid;
	}

	public void setTouchtempletid(Integer touchtempletid) {
		this.touchtempletid = touchtempletid;
	}

	public String getTouchapk() {
		return touchapk;
	}

	public void setTouchapk(String touchapk) {
		this.touchapk = touchapk == null ? null : touchapk.trim();
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Image getBgimage() {
		return bgimage;
	}

	public void setBgimage(Image bgimage) {
		this.bgimage = bgimage;
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