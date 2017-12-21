package com.broadvideo.pixsignage.domain;

import java.util.List;

public class Catalog {
	private Integer catalogid;

	private Integer orgid;

	private String type;

	private String name;

	private String status;

	private List<Cataitem> cataitems;

	public Integer getCatalogid() {
		return catalogid;
	}

	public void setCatalogid(Integer catalogid) {
		this.catalogid = catalogid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public List<Cataitem> getCataitems() {
		return cataitems;
	}

	public void setCataitems(List<Cataitem> cataitems) {
		this.cataitems = cataitems;
	}
}