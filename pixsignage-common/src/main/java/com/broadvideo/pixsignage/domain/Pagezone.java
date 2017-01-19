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

	private String height;

	private String width;

	private String topoffset;

	private String leftoffset;

	private Integer zindex;

	private String transform;

	private String bdcolor;

	private String bdstyle;

	private String bdwidth;

	private String bdtl;

	private String bdtr;

	private String bdbl;

	private String bdbr;

	private String bgcolor;

	private Integer opacity;

	private String padding;

	private String shadow;

	private String color;

	private String fontfamily;

	private String fontsize;

	private String fontweight;

	private String fontstyle;

	private String decoration;

	private String align;

	private String lineheight;

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

	public String getHeight() {
		return height;
	}

	public void setHeight(String height) {
		this.height = height == null ? null : height.trim();
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width == null ? null : width.trim();
	}

	public String getTopoffset() {
		return topoffset;
	}

	public void setTopoffset(String topoffset) {
		this.topoffset = topoffset == null ? null : topoffset.trim();
	}

	public String getLeftoffset() {
		return leftoffset;
	}

	public void setLeftoffset(String leftoffset) {
		this.leftoffset = leftoffset == null ? null : leftoffset.trim();
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

	public String getBdwidth() {
		return bdwidth;
	}

	public void setBdwidth(String bdwidth) {
		this.bdwidth = bdwidth == null ? null : bdwidth.trim();
	}

	public String getBdtl() {
		return bdtl;
	}

	public void setBdtl(String bdtl) {
		this.bdtl = bdtl == null ? null : bdtl.trim();
	}

	public String getBdtr() {
		return bdtr;
	}

	public void setBdtr(String bdtr) {
		this.bdtr = bdtr == null ? null : bdtr.trim();
	}

	public String getBdbl() {
		return bdbl;
	}

	public void setBdbl(String bdbl) {
		this.bdbl = bdbl == null ? null : bdbl.trim();
	}

	public String getBdbr() {
		return bdbr;
	}

	public void setBdbr(String bdbr) {
		this.bdbr = bdbr == null ? null : bdbr.trim();
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

	public String getPadding() {
		return padding;
	}

	public void setPadding(String padding) {
		this.padding = padding == null ? null : padding.trim();
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

	public String getFontsize() {
		return fontsize;
	}

	public void setFontsize(String fontsize) {
		this.fontsize = fontsize == null ? null : fontsize.trim();
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

	public String getLineheight() {
		return lineheight;
	}

	public void setLineheight(String lineheight) {
		this.lineheight = lineheight == null ? null : lineheight.trim();
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