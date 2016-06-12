package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Bundle {
	private Integer bundleid;

	private Integer orgid;

	private Integer branchid;

	private Integer layoutid;

	private String name;

	private String snapshot;

	private Integer height;

	private Integer width;

	private String status;

	private Date createtime;

	private Integer createstaffid;

	private String snapshotdtl;

	private Layout layout;

	private List<Bundledtl> bundledtls;

	public Bundledtl getBundledtl(String regionid) {
		if (bundledtls != null) {
			for (Bundledtl bundledtl : bundledtls) {
				if (regionid.equals("" + bundledtl.getRegionid())) {
					return bundledtl;
				}
			}
		}
		return null;
	}

	public Integer getBundleid() {
		return bundleid;
	}

	public void setBundleid(Integer bundleid) {
		this.bundleid = bundleid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getBranchid() {
		return branchid;
	}

	public void setBranchid(Integer branchid) {
		this.branchid = branchid;
	}

	public Integer getLayoutid() {
		return layoutid;
	}

	public void setLayoutid(Integer layoutid) {
		this.layoutid = layoutid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getSnapshot() {
		return snapshot;
	}

	public void setSnapshot(String snapshot) {
		this.snapshot = snapshot;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Integer getCreatestaffid() {
		return createstaffid;
	}

	public void setCreatestaffid(Integer createstaffid) {
		this.createstaffid = createstaffid;
	}

	public String getSnapshotdtl() {
		return snapshotdtl;
	}

	public void setSnapshotdtl(String snapshotdtl) {
		this.snapshotdtl = snapshotdtl;
	}

	public Layout getLayout() {
		return layout;
	}

	public void setLayout(Layout layout) {
		this.layout = layout;
	}

	public List<Bundledtl> getBundledtls() {
		return bundledtls;
	}

	public void setBundledtls(List<Bundledtl> bundledtls) {
		this.bundledtls = bundledtls;
	}
}