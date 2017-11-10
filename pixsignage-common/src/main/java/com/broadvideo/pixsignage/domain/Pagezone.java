package com.broadvideo.pixsignage.domain;

import java.util.List;

public class Pagezone {
	public final static byte Type_Video = 1;
	public final static byte Type_Image = 2;
	public final static byte Type_Text = 3;
	public final static byte Type_Scroll = 4;
	public final static byte Type_Date = 5;
	public final static byte Type_Weather = 6;
	public final static byte Type_Button = 7;
	public final static byte Type_Calendar_List = 11;
	public final static byte Type_Calendar_Table = 12;
	public final static byte Type_Attendance = 13;
	public final static byte Type_Home_School = 14;

	private Integer pagezoneid;

	private Integer pageid;

	private Integer homepageid;

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

	private Integer bdradius;

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

	private Integer rows;

	private Integer cols;

	private String rules;

	private String rulecolor;

	private Integer rulewidth;

	private String dateformat;

	private Integer diyid;

	private String touchtype;

	private Integer touchpageid;

	private Integer diyactionid;

	private String animationinit;

	private Integer animationinitdelay;

	private String animationclick;

	private String sourcetype;

	private String content;

	private Diy diy;

	private Diyaction diyaction;

	private List<Pagezonedtl> pagezonedtls;

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

	public Integer getHomepageid() {
		return homepageid;
	}

	public void setHomepageid(Integer homepageid) {
		this.homepageid = homepageid;
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

	public Integer getBdradius() {
		return bdradius;
	}

	public void setBdradius(Integer bdradius) {
		this.bdradius = bdradius;
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

	public Integer getRows() {
		return rows;
	}

	public void setRows(Integer rows) {
		this.rows = rows;
	}

	public Integer getCols() {
		return cols;
	}

	public void setCols(Integer cols) {
		this.cols = cols;
	}

	public String getRules() {
		return rules;
	}

	public void setRules(String rules) {
		this.rules = rules;
	}

	public String getRulecolor() {
		return rulecolor;
	}

	public void setRulecolor(String rulecolor) {
		this.rulecolor = rulecolor;
	}

	public Integer getRulewidth() {
		return rulewidth;
	}

	public void setRulewidth(Integer rulewidth) {
		this.rulewidth = rulewidth;
	}

	public String getDateformat() {
		return dateformat;
	}

	public void setDateformat(String dateformat) {
		this.dateformat = dateformat == null ? null : dateformat.trim();
	}

	public Integer getDiyid() {
		return diyid;
	}

	public void setDiyid(Integer diyid) {
		this.diyid = diyid;
	}

	public String getTouchtype() {
		return touchtype;
	}

	public void setTouchtype(String touchtype) {
		this.touchtype = touchtype == null ? null : touchtype.trim();
	}

	public Integer getTouchpageid() {
		return touchpageid;
	}

	public void setTouchpageid(Integer touchpageid) {
		this.touchpageid = touchpageid;
	}

	public Integer getDiyactionid() {
		return diyactionid;
	}

	public void setDiyactionid(Integer diyactionid) {
		this.diyactionid = diyactionid;
	}

	public String getAnimationinit() {
		return animationinit;
	}

	public void setAnimationinit(String animationinit) {
		this.animationinit = animationinit;
	}

	public Integer getAnimationinitdelay() {
		return animationinitdelay;
	}

	public void setAnimationinitdelay(Integer animationinitdelay) {
		this.animationinitdelay = animationinitdelay;
	}

	public String getAnimationclick() {
		return animationclick;
	}

	public void setAnimationclick(String animationclick) {
		this.animationclick = animationclick;
	}

	public String getSourcetype() {
		return sourcetype;
	}

	public void setSourcetype(String sourcetype) {
		this.sourcetype = sourcetype;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content == null ? null : content.trim();
	}

	public Diy getDiy() {
		return diy;
	}

	public void setDiy(Diy diy) {
		this.diy = diy;
	}

	public Diyaction getDiyaction() {
		return diyaction;
	}

	public void setDiyaction(Diyaction diyaction) {
		this.diyaction = diyaction;
	}

	public List<Pagezonedtl> getPagezonedtls() {
		return pagezonedtls;
	}

	public void setPagezonedtls(List<Pagezonedtl> pagezonedtls) {
		this.pagezonedtls = pagezonedtls;
	}
}