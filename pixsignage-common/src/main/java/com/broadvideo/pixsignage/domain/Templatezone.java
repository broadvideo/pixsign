package com.broadvideo.pixsignage.domain;

import java.util.List;

public class Templatezone {
	public final static byte Type_VIDEO = 1;
	public final static byte Type_IMAGE = 2;
	public final static byte Type_TEXT = 3;
	public final static byte Type_CALENDAR_LIST = 10;
	public final static byte Type_CALENDAR_TABLE = 11;
	public final static byte Type_CALENDAR_SIGNIN = 12;

	private Integer templatezoneid;

	private Integer templateid;

	private Byte type;

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

	private Integer shadowh;

	private Integer shadowv;

	private Integer shadowblur;

	private String shadowcolor;

	private String color;

	private String fontfamily;

	private Integer fontsize;

	private String fontweight;

	private String fontstyle;

	private String decoration;

	private String align;

	private Integer lineheight;

	private String content;

	private List<Templatezonedtl> templatezonedtls;

	public Integer getTemplatezoneid() {
		return templatezoneid;
	}

	public void setTemplatezoneid(Integer templatezoneid) {
		this.templatezoneid = templatezoneid;
	}

	public Integer getTemplateid() {
		return templateid;
	}

	public void setTemplateid(Integer templateid) {
		this.templateid = templateid;
	}

	public Byte getType() {
		return type;
	}

	public void setType(Byte type) {
		this.type = type;
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

	public Integer getShadowh() {
		return shadowh;
	}

	public void setShadowh(Integer shadowh) {
		this.shadowh = shadowh;
	}

	public Integer getShadowv() {
		return shadowv;
	}

	public void setShadowv(Integer shadowv) {
		this.shadowv = shadowv;
	}

	public Integer getShadowblur() {
		return shadowblur;
	}

	public void setShadowblur(Integer shadowblur) {
		this.shadowblur = shadowblur;
	}

	public String getShadowcolor() {
		return shadowcolor;
	}

	public void setShadowcolor(String shadowcolor) {
		this.shadowcolor = shadowcolor == null ? null : shadowcolor.trim();
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content == null ? null : content.trim();
	}

	public List<Templatezonedtl> getTemplatezonedtls() {
		return templatezonedtls;
	}

	public void setTemplatezonedtls(List<Templatezonedtl> templatezonedtls) {
		this.templatezonedtls = templatezonedtls;
	}
}