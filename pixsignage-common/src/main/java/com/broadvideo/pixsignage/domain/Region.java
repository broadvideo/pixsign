package com.broadvideo.pixsignage.domain;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;

public class Region {
	public final static String Type_NONTEXT = "0";
	public final static String Type_TEXT = "1";
	public final static String Type_DATE = "2";

	private Integer regionid;

	private String name;

	private String code;

	private String type;

	private boolean translated = false;

	public Integer getRegionid() {
		return regionid;
	}

	public void setRegionid(Integer regionid) {
		this.regionid = regionid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code == null ? null : code.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public void translate(ResourceBundleMessageSource messageSource) {
		if (!translated) {
			name = messageSource.getMessage(name, null, LocaleContextHolder.getLocale());
			translated = true;
		}
	}
}