package com.broadvideo.pixsign.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Page {
	public final static String REVIEW_WAIT = "0";
	public final static String REVIEW_PASSED = "1";
	public final static String REVIEW_REJECTED = "2";

	private Integer pageid;

	private String uuid;

	private Integer orgid;

	private Integer branchid;

	private Integer templateid;

	private String name;

	private String snapshot;

	private String ratio;

	private Integer height;

	private Integer width;

	private String limitflag;

	private String privilegeflag;

	private String touchflag;

	private String homeflag;

	private Integer homepageid;

	private Integer homeidletime;

	private String status;

	private Long size;

	private String md5;

	private String description;

	private String reviewflag;

	private String comment;

	private String exportflag;

	private Long exportsize;

	private Date createtime;

	private Date updatetime;

	private Integer createstaffid;

	private String json;

	private String snapshotdtl;

	private String editflag = "1";

	private List<Pagezone> pagezones;

	private List<Page> subpages;

	public Integer getPageid() {
		return pageid;
	}

	public void setPageid(Integer pageid) {
		this.pageid = pageid;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
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

	public Integer getTemplateid() {
		return templateid;
	}

	public void setTemplateid(Integer templateid) {
		this.templateid = templateid;
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
		this.snapshot = snapshot == null ? null : snapshot.trim();
	}

	public String getRatio() {
		return ratio;
	}

	public void setRatio(String ratio) {
		this.ratio = ratio == null ? null : ratio.trim();
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

	public String getLimitflag() {
		return limitflag;
	}

	public void setLimitflag(String limitflag) {
		this.limitflag = limitflag;
	}

	public String getPrivilegeflag() {
		return privilegeflag;
	}

	public void setPrivilegeflag(String privilegeflag) {
		this.privilegeflag = privilegeflag;
	}

	public String getTouchflag() {
		return touchflag;
	}

	public void setTouchflag(String touchflag) {
		this.touchflag = touchflag == null ? null : touchflag.trim();
	}

	public String getHomeflag() {
		return homeflag;
	}

	public void setHomeflag(String homeflag) {
		this.homeflag = homeflag == null ? null : homeflag.trim();
	}

	public Integer getHomepageid() {
		return homepageid;
	}

	public void setHomepageid(Integer homepageid) {
		this.homepageid = homepageid;
	}

	public Integer getHomeidletime() {
		return homeidletime;
	}

	public void setHomeidletime(Integer homeidletime) {
		this.homeidletime = homeidletime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	public String getMd5() {
		return md5;
	}

	public void setMd5(String md5) {
		this.md5 = md5;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public String getReviewflag() {
		return reviewflag;
	}

	public void setReviewflag(String reviewflag) {
		this.reviewflag = reviewflag;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getExportflag() {
		return exportflag;
	}

	public void setExportflag(String exportflag) {
		this.exportflag = exportflag;
	}

	public Long getExportsize() {
		return exportsize;
	}

	public void setExportsize(Long exportsize) {
		this.exportsize = exportsize;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getUpdatetime() {
		return updatetime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setUpdatetime(Date updatetime) {
		this.updatetime = updatetime;
	}

	public Integer getCreatestaffid() {
		return createstaffid;
	}

	public void setCreatestaffid(Integer createstaffid) {
		this.createstaffid = createstaffid;
	}

	public String getJson() {
		return json;
	}

	public void setJson(String json) {
		this.json = json;
	}

	public String getSnapshotdtl() {
		return snapshotdtl;
	}

	public void setSnapshotdtl(String snapshotdtl) {
		this.snapshotdtl = snapshotdtl;
	}

	public String getEditflag() {
		return editflag;
	}

	public void setEditflag(String editflag) {
		this.editflag = editflag;
	}

	public Long getTimestamp() {
		if (updatetime != null) {
			return updatetime.getTime();
		} else {
			return 0L;
		}
	}

	public void setTimestamp(Long timestamp) {
	}

	public List<Pagezone> getPagezones() {
		return pagezones;
	}

	public void setPagezones(List<Pagezone> pagezones) {
		this.pagezones = pagezones;
	}

	public List<Page> getSubpages() {
		return subpages;
	}

	public void setSubpages(List<Page> subpages) {
		this.subpages = subpages;
	}
}