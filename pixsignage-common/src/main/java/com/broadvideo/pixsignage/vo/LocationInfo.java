package com.broadvideo.pixsignage.vo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LocationInfo {
	@JsonProperty("category_id")
	private Integer categoryId;
	private String name;
	private List<LocationInfo> children = new ArrayList<LocationInfo>();
	@JsonIgnore
	private Integer parentId;

	public Integer getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Integer id) {
		this.categoryId = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<LocationInfo> getChildren() {
		return children;
	}

	public void setChildren(List<LocationInfo> children) {
		this.children = children;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

}
