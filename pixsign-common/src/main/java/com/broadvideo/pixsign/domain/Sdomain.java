package com.broadvideo.pixsign.domain;

public class Sdomain {
	private Integer sdomainid;

	private String name;

	private String code;

	private String langflag;

	private String description;

	private String indexpage;

	private String theme;

	public Integer getSdomainid() {
		return sdomainid;
	}

	public void setSdomainid(Integer sdomainid) {
		this.sdomainid = sdomainid;
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

	public String getLangflag() {
		return langflag;
	}

	public void setLangflag(String langflag) {
		this.langflag = langflag == null ? null : langflag.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public String getIndexpage() {
		return indexpage;
	}

	public void setIndexpage(String indexpage) {
		this.indexpage = indexpage;
	}

	public String getTheme() {
		return theme;
	}

	public void setTheme(String theme) {
		this.theme = theme;
	}
}