package com.broadvideo.signage.domain;

public class Config {
	private Integer configid;

	private String code;

	private String name;

	private String value;

	private String type;

	private String refer;

	public Integer getConfigid() {
		return configid;
	}

	public void setConfigid(Integer configid) {
		this.configid = configid;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code == null ? null : code.trim();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value == null ? null : value.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getRefer() {
		return refer;
	}

	public void setRefer(String refer) {
		this.refer = refer == null ? null : refer.trim();
	}
}