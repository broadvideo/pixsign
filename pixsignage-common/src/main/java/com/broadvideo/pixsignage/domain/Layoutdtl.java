package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Layoutdtl {
	private Integer layoutdtlid;

	private Integer layoutid;

	private Integer regionid;

	private Integer height;

	private Integer width;

	private Integer topoffset;

	private Integer leftoffset;

	private Integer zindex;

	private String bgcolor;

	private Integer opacity;

	private Integer intervaltime;

	private String direction;

	private String speed;

	private String color;

	private Integer size;

	private Date createtime;

	private Region region;

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

	public Integer getRegionid() {
		return regionid;
	}

	public void setRegionid(Integer regionid) {
		this.regionid = regionid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

	public List<HashMap<String, String>> getRegiondtls() {
		return regiondtls;
	}

	public void setRegiondtls(List<HashMap<String, String>> regiondtls) {
		this.regiondtls = regiondtls;
	}

}