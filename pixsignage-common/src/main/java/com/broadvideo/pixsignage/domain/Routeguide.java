package com.broadvideo.pixsignage.domain;

public class Routeguide {
    private Integer routeguideid;

    private String name;

    private String code;
    
    private String type;

    private String description;

    public Integer getRouteguideid() {
        return routeguideid;
    }

    public void setRouteguideid(Integer routeguideid) {
        this.routeguideid = routeguideid;
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
		this.type = type;
	}

	public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }
}