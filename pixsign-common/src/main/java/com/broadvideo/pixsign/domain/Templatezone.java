package com.broadvideo.pixsign.domain;

import java.util.List;

public class Templatezone {
	public final static byte Type_Video = 1;
	public final static byte Type_Image = 2;
	public final static byte Type_Text = 3;
	public final static byte Type_Scroll = 4;
	public final static byte Type_Date = 5;
	public final static byte Type_Weather = 6;
	public final static byte Type_Button = 7;
	public final static byte Type_Camera = 10;

	private Integer templatezoneid;

	private Integer templateid;

	private Integer hometemplateid;

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

	private Integer rowss;

	private Integer colss;

	private String rules;

	private String rulecolor;

	private Integer rulewidth;

	private String dateformat;

	private Integer diyid;

	private String touchtype;

	private Integer touchid;

	private String fixflag;

	private Integer diyactionid;

	private String animationinit;

	private Integer animationinitdelay;

	private String animationclick;

	private Integer volume;

	private Integer speed;

	private Integer intervaltime;

	private String effect;

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

	public Integer getHometemplateid() {
		return hometemplateid;
	}

	public void setHometemplateid(Integer hometemplateid) {
		this.hometemplateid = hometemplateid;
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

	public Integer getRowss() {
		return rowss;
	}

	public void setRowss(Integer rowss) {
		this.rowss = rowss;
	}

	public Integer getColss() {
		return colss;
	}

	public void setColss(Integer colss) {
		this.colss = colss;
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

	public Integer getTouchid() {
		return touchid;
	}

	public void setTouchid(Integer touchid) {
		this.touchid = touchid;
	}

	public String getFixflag() {
		return fixflag;
	}

	public void setFixflag(String fixflag) {
		this.fixflag = fixflag;
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

	public Integer getVolume() {
		return volume;
	}

	public void setVolume(Integer volume) {
		this.volume = volume;
	}

	public Integer getSpeed() {
		return speed;
	}

	public void setSpeed(Integer speed) {
		this.speed = speed;
	}

	public Integer getIntervaltime() {
		return intervaltime;
	}

	public void setIntervaltime(Integer intervaltime) {
		this.intervaltime = intervaltime;
	}

	public String getEffect() {
		return effect;
	}

	public void setEffect(String effect) {
		this.effect = effect;
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