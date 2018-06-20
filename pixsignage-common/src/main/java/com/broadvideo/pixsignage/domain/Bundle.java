package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Bundle {
	public final static String REVIEW_WAIT = "0";
	public final static String REVIEW_PASSED = "1";
	public final static String REVIEW_REJECTED = "2";

	private Integer bundleid;

	private String uuid;

	private Integer orgid;

	private Integer branchid;

	private Integer templetid;

	private String name;

	private String snapshot;

	private String ratio;

	private Integer height;

	private Integer width;

	private String bgcolor;

	private Integer bgimageid;

	private String touchflag;

	private String homeflag;

	private Integer homebundleid;

	private Integer homeidletime;

	private String description;

	private String status;

	private String reviewflag;

	private String comment;

	private String exportflag;

	private Long exportsize;

	private Date createtime;

	private Date updatetime;

	private Integer createstaffid;

	private String json;

	private String snapshotdtl;

	private Image bgimage;

	private List<Bundlezone> bundlezones;

	private List<Bundle> subbundles;

	public Integer getBundleid() {
		return bundleid;
	}

	public void setBundleid(Integer bundleid) {
		this.bundleid = bundleid;
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

	public Integer getTempletid() {
		return templetid;
	}

	public void setTempletid(Integer templetid) {
		this.templetid = templetid;
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

	public String getBgcolor() {
		return bgcolor;
	}

	public void setBgcolor(String bgcolor) {
		this.bgcolor = bgcolor == null ? null : bgcolor.trim();
	}

	public Integer getBgimageid() {
		return bgimageid;
	}

	public void setBgimageid(Integer bgimageid) {
		this.bgimageid = bgimageid;
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

	public Integer getHomebundleid() {
		return homebundleid;
	}

	public void setHomebundleid(Integer homebundleid) {
		this.homebundleid = homebundleid;
	}

	public Integer getHomeidletime() {
		return homeidletime;
	}

	public void setHomeidletime(Integer homeidletime) {
		this.homeidletime = homeidletime;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getReviewflag() {
		return reviewflag;
	}

	public void setReviewflag(String reviewflag) {
		this.reviewflag = reviewflag == null ? null : reviewflag.trim();
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment == null ? null : comment.trim();
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
		this.json = json == null ? null : json.trim();
	}

	public String getSnapshotdtl() {
		return snapshotdtl;
	}

	public void setSnapshotdtl(String snapshotdtl) {
		this.snapshotdtl = snapshotdtl;
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

	public Image getBgimage() {
		return bgimage;
	}

	public void setBgimage(Image bgimage) {
		this.bgimage = bgimage;
	}

	public List<Bundlezone> getBundlezones() {
		return bundlezones;
	}

	public void setBundlezones(List<Bundlezone> bundlezones) {
		this.bundlezones = bundlezones;
	}

	public List<Bundle> getSubbundles() {
		return subbundles;
	}

	public void setSubbundles(List<Bundle> subbundles) {
		this.subbundles = subbundles;
	}
}