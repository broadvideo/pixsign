package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Pagezone {
	public final static String Type_Text = "0";
	public final static String Type_Image = "1";
	public final static String Type_Video = "2";

	private Integer pagezoneid;

	private Integer pageid;

	private String name;

	private String type;

	private String status;

	private Integer height;

	private Integer width;

	private Integer topoffset;

	private Integer leftoffset;

	private Integer zindex;

	private String transform;

	private String bdcolor;

	private String bdstyle;

	private Integer bdwidth;

	private Integer bdtl;

	private Integer bdtr;

	private Integer bdbl;

	private Integer bdbr;

	private String bgcolor;

	private Integer bgopacity;

	private Integer opacity;

	private Integer padding;

	private String shadow;

	private String color;

	private String fontfamily;

	private Integer fontsize;

	private String fontweight;

	private String fontstyle;

	private String decoration;

	private String align;

	private Integer lineheight;

	private Integer linkpageid;

	private String imageid;

	private String videoid;

	private Date createtime;

	private String content;

	public Integer getPagezoneid() {
		return pagezoneid;
	}

	public void setPagezoneid(Integer pagezoneid) {
		this.pagezoneid = pagezoneid;
	}

	public Integer getPageid() {
		return pageid;
	}

	public void setPageid(Integer pageid) {
		this.pageid = pageid;
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

	public String getTransform() {
		return transform;
	}

	public void setTransform(String transform) {
		this.transform = transform == null ? null : transform.trim();
	}

	public String getBdcolor() {
		return bdcolor;
	}

	public void setBdcolor(String bdcolor) {
		this.bdcolor = bdcolor == null ? null : bdcolor.trim();
	}

	public String getBdstyle() {
		return bdstyle;
	}

	public void setBdstyle(String bdstyle) {
		this.bdstyle = bdstyle == null ? null : bdstyle.trim();
	}

	public Integer getBdwidth() {
		return bdwidth;
	}

	public void setBdwidth(Integer bdwidth) {
		this.bdwidth = bdwidth;
	}

	public Integer getBdtl() {
		return bdtl;
	}

	public void setBdtl(Integer bdtl) {
		this.bdtl = bdtl;
	}

	public Integer getBdtr() {
		return bdtr;
	}

	public void setBdtr(Integer bdtr) {
		this.bdtr = bdtr;
	}

	public Integer getBdbl() {
		return bdbl;
	}

	public void setBdbl(Integer bdbl) {
		this.bdbl = bdbl;
	}

	public Integer getBdbr() {
		return bdbr;
	}

	public void setBdbr(Integer bdbr) {
		this.bdbr = bdbr;
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

	public Integer getOpacity() {
		return opacity;
	}

	public void setOpacity(Integer opacity) {
		this.opacity = opacity;
	}

	public Integer getPadding() {
		return padding;
	}

	public void setPadding(Integer padding) {
		this.padding = padding;
	}

	public String getShadow() {
		return shadow;
	}

	public void setShadow(String shadow) {
		this.shadow = shadow == null ? null : shadow.trim();
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color == null ? null : color.trim();
	}

	public String getFontfamily() {
		return fontfamily;
	}

	public void setFontfamily(String fontfamily) {
		this.fontfamily = fontfamily == null ? null : fontfamily.trim();
	}

	public Integer getFontsize() {
		return fontsize;
	}

	public void setFontsize(Integer fontsize) {
		this.fontsize = fontsize;
	}

	public String getFontweight() {
		return fontweight;
	}

	public void setFontweight(String fontweight) {
		this.fontweight = fontweight == null ? null : fontweight.trim();
	}

	public String getFontstyle() {
		return fontstyle;
	}

	public void setFontstyle(String fontstyle) {
		this.fontstyle = fontstyle == null ? null : fontstyle.trim();
	}

	public String getDecoration() {
		return decoration;
	}

	public void setDecoration(String decoration) {
		this.decoration = decoration == null ? null : decoration.trim();
	}

	public String getAlign() {
		return align;
	}

	public void setAlign(String align) {
		this.align = align == null ? null : align.trim();
	}

	public Integer getLineheight() {
		return lineheight;
	}

	public void setLineheight(Integer lineheight) {
		this.lineheight = lineheight;
	}

	public Integer getLinkpageid() {
		return linkpageid;
	}

	public void setLinkpageid(Integer linkpageid) {
		this.linkpageid = linkpageid;
	}

	public String getImageid() {
		return imageid;
	}

	public void setImageid(String imageid) {
		this.imageid = imageid == null ? null : imageid.trim();
	}

	public String getVideoid() {
		return videoid;
	}

	public void setVideoid(String videoid) {
		this.videoid = videoid == null ? null : videoid.trim();
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content == null ? null : content.trim();
	}
}