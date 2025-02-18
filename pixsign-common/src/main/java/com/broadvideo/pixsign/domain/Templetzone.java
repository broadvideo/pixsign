package com.broadvideo.pixsign.domain;

import java.util.List;

public class Templetzone {
	public final static byte Type_PLAY = 1;
	public final static byte Type_WIDGET = 2;
	public final static byte Type_TEXT = 3;
	public final static byte Type_SCROLL = 4;
	public final static byte Type_DATE = 5;
	public final static byte Type_WEATHER = 6;
	public final static byte Type_TOUCH = 7;
	public final static byte Type_NAVIGATE = 8;
	public final static byte Type_QRCODE = 9;
	public final static byte Type_CALENDAR_LIST = 10;
	public final static byte Type_CALENDAR_TABLE = 11;
	public final static byte Type_RSS = 12;
	public final static byte Type_AUDIO = 13;
	public final static byte Type_STREAM = 14;
	public final static byte Type_VIDEOIN = 15;
	public final static byte Type_DVB = 16;
	public final static byte Type_PAGE = 17;

	private Integer templetzoneid;

	private Integer templetid;

	private Integer hometempletid;

	private Byte type;

	private String mainflag;

	private Integer height;

	private Integer width;

	private Integer topoffset;

	private Integer leftoffset;

	private Integer zindex;

	private String bgcolor;

	private Integer bgopacity;

	private Integer bgimageid;

	private Integer sleeptime;

	private Integer intervaltime;

	private String animation;

	private String speed;

	private String color;

	private Integer size;

	private String dateformat;

	private String fitflag;

	private Integer volume;

	private String touchlabel;

	private String touchtype;

	private Integer touchobjid;

	private String content;

	private Image bgimage;

	private Templet touchtemplet;

	private Video touchvideo;

	private Image touchimage;

	private List<Templetzonedtl> templetzonedtls;

	public Integer getTempletzoneid() {
		return templetzoneid;
	}

	public void setTempletzoneid(Integer templetzoneid) {
		this.templetzoneid = templetzoneid;
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

	public Byte getType() {
		return type;
	}

	public void setType(Byte type) {
		this.type = type;
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

	public Integer getBgopacity() {
		return bgopacity;
	}

	public void setBgopacity(Integer bgopacity) {
		this.bgopacity = bgopacity;
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

	public Integer getTouchobjid() {
		return touchobjid;
	}

	public void setTouchobjid(Integer touchobjid) {
		this.touchobjid = touchobjid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content == null ? null : content.trim();
	}

	public Image getBgimage() {
		return bgimage;
	}

	public void setBgimage(Image bgimage) {
		this.bgimage = bgimage;
	}

	public Templet getTouchtemplet() {
		return touchtemplet;
	}

	public void setTouchtemplet(Templet touchtemplet) {
		this.touchtemplet = touchtemplet;
	}

	public Video getTouchvideo() {
		return touchvideo;
	}

	public void setTouchvideo(Video touchvideo) {
		this.touchvideo = touchvideo;
	}

	public Image getTouchimage() {
		return touchimage;
	}

	public void setTouchimage(Image touchimage) {
		this.touchimage = touchimage;
	}

	public List<Templetzonedtl> getTempletzonedtls() {
		return templetzonedtls;
	}

	public void setTempletzonedtls(List<Templetzonedtl> templetzonedtls) {
		this.templetzonedtls = templetzonedtls;
	}
}