package com.broadvideo.pixsignage.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Mediagrid {
	public final static String Status_Waiting = "0";
	public final static String Status_Active = "1";
	public final static String Status_Error = "2";
	public final static String Status_Delete = "9";

	private Integer mediagridid;

	private Integer orgid;

	private Integer branchid;

	private String gridlayoutcode;

	private String name;

	private Integer xcount;

	private Integer ycount;

	private String ratio;

	private Integer width;

	private Integer height;

	private Integer intervaltime;

	private String snapshot;

	private String status;

	private Date createtime;

	private String snapshotdtl;

	private List<Mediagriddtl> mediagriddtls;

	public Integer getMediagridid() {
		return mediagridid;
	}

	public void setMediagridid(Integer mediagridid) {
		this.mediagridid = mediagridid;
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

	public String getGridlayoutcode() {
		return gridlayoutcode;
	}

	public void setGridlayoutcode(String gridlayoutcode) {
		this.gridlayoutcode = gridlayoutcode == null ? null : gridlayoutcode.trim();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public Integer getXcount() {
		return xcount;
	}

	public void setXcount(Integer xcount) {
		this.xcount = xcount;
	}

	public Integer getYcount() {
		return ycount;
	}

	public void setYcount(Integer ycount) {
		this.ycount = ycount;
	}

	public String getRatio() {
		return ratio;
	}

	public void setRatio(String ratio) {
		this.ratio = ratio == null ? null : ratio.trim();
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getIntervaltime() {
		return intervaltime;
	}

	public void setIntervaltime(Integer intervaltime) {
		this.intervaltime = intervaltime;
	}

	public String getSnapshot() {
		return snapshot;
	}

	public void setSnapshot(String snapshot) {
		this.snapshot = snapshot == null ? null : snapshot.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public String getSnapshotdtl() {
		return snapshotdtl;
	}

	public void setSnapshotdtl(String snapshotdtl) {
		this.snapshotdtl = snapshotdtl;
	}

	public List<Mediagriddtl> getMediagriddtls() {
		return mediagriddtls;
	}

	public void setMediagriddtls(List<Mediagriddtl> mediagriddtls) {
		this.mediagriddtls = mediagriddtls == null ? new ArrayList<Mediagriddtl>() : mediagriddtls;
	}
}