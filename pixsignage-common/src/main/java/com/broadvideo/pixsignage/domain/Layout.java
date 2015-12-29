package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Layout {
	private Integer layoutid;

	private Integer orgid;

	private String name;

	private String type;

	private String status;

	private String ratio;

	private Integer height;

	private Integer width;

	private String bgcolor;

	private Integer bgimageid;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	private Image bgimage;

	private List<Layoutdtl> layoutdtls;

	public Integer getLayoutid() {
		return layoutid;
	}

	public void setLayoutid(Integer layoutid) {
		this.layoutid = layoutid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getRatio() {
		return ratio;
	}

	public void setRatio(String ratio) {
		this.ratio = ratio == null ? null : ratio.trim();
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

	public String getBgcolor() {
		return bgcolor;
	}

	public void setBgcolor(String bgcolor) {
		this.bgcolor = bgcolor == null ? null : bgcolor.trim();
	}

	public Integer getBgimageid() {
		return bgimageid;
	}

	public void setBgimageid(Integer bgimageid) {
		this.bgimageid = bgimageid;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Integer getCreatestaffid() {
		return createstaffid;
	}

	public void setCreatestaffid(Integer createstaffid) {
		this.createstaffid = createstaffid;
	}

	public Image getBgimage() {
		return bgimage;
	}

	public void setBgimage(Image bgimage) {
		this.bgimage = bgimage;
	}

	public List<Layoutdtl> getLayoutdtls() {
		return layoutdtls;
	}

	public void setLayoutdtls(List<Layoutdtl> layoutdtls) {
		this.layoutdtls = layoutdtls;
	}
}