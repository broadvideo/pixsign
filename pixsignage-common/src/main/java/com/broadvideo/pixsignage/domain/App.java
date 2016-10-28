package com.broadvideo.pixsignage.domain;

public class App {
	private Integer appid;

	private String name;

	private String mainboard;

	private String subdir;

	private String description;

	public Integer getAppid() {
		return appid;
	}

	public void setAppid(Integer appid) {
		this.appid = appid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getMainboard() {
		return mainboard;
	}

	public void setMainboard(String mainboard) {
		this.mainboard = mainboard == null ? null : mainboard.trim();
	}

	public String getSubdir() {
		return subdir;
	}

	public void setSubdir(String subdir) {
		this.subdir = subdir;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}
}