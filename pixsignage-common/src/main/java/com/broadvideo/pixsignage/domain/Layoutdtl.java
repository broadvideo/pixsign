package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Layoutdtl {
	public final static String Type_PLAY = "0";
	public final static String Type_TEXT = "1";
	public final static String Type_DATE = "2";
	public final static String Type_WEATHER = "3";
	public final static String Type_VIDEOIN = "4";
	public final static String Type_DVB = "5";
	public final static String Type_STREAM = "6";
	public final static String Type_TOUCH = "7";
	public final static String Type_NAVIGATE = "8";
	public final static String Type_A1 = "A1";
	public final static String Type_A2 = "A2";

	private Integer layoutdtlid;

	private Integer layoutid;

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

	private String direction;

	private String speed;

	private String color;

	private Integer size;

	private String dateformat;

	private String fitflag;

	private Integer volume;

	private Date createtime;

	private Image bgimage;

	private List<HashMap<String, String>> regiondtls;

	public Integer getLayoutdtlid() {
		return layoutdtlid;
	}

	public void setLayoutdtlid(Integer layoutdtlid) {
		this.layoutdtlid = layoutdtlid;
	}

	public Integer getLayoutid() {
		return layoutid;
	}

	public void setLayoutid(Integer layoutid) {
		this.layoutid = layoutid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMainflag() {
		return mainflag;
	}

	public void setMainflag(String mainflag) {
		this.mainflag = mainflag;
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
		this.bgcolor = bgcolor;
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
		this.dateformat = dateformat;
	}

	public String getFitflag() {
		return fitflag;
	}

	public void setFitflag(String fitflag) {
		this.fitflag = fitflag;
	}

	public Integer getVolume() {
		return volume;
	}

	public void setVolume(Integer volume) {
		this.volume = volume;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Image getBgimage() {
		return bgimage;
	}

	public void setBgimage(Image bgimage) {
		this.bgimage = bgimage;
	}

	public List<HashMap<String, String>> getRegiondtls() {
		return regiondtls;
	}

	public void setRegiondtls(List<HashMap<String, String>> regiondtls) {
		this.regiondtls = regiondtls;
	}

}