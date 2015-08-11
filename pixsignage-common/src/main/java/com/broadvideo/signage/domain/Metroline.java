package com.broadvideo.signage.domain;

import java.util.List;

public class Metroline {
	private Integer metrolineid;

	private String name;

	private String code;

	private List<Metrostation> metrostations;

	public Integer getMetrolineid() {
		return metrolineid;
	}

	public void setMetrolineid(Integer metrolineid) {
		this.metrolineid = metrolineid;
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

	public List<Metrostation> getMetrostations() {
		return metrostations;
	}

	public void setMetrostations(List<Metrostation> metrostations) {
		this.metrostations = metrostations;
	}
}