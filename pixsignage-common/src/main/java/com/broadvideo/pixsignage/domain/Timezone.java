package com.broadvideo.pixsignage.domain;

public class Timezone {
	private Integer timezoneid;

	private String name;

	public Integer getTimezoneid() {
		return timezoneid;
	}

	public void setTimezoneid(Integer timezoneid) {
		this.timezoneid = timezoneid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}
}