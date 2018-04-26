package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Templet {
	private Integer templetid;

	private String uuid;

	private Integer orgid;

	private String name;

	private String snapshot;

	private String ratio;

	private Integer height;

	private Integer width;

	private String bgcolor;

	private Integer bgimageid;

	private String touchflag;

	private String homeflag;

	private Integer hometempletid;

	private Integer homeidletime;

	private String description;

	private String status;

	private String publicflag;

	private Date createtime;

	private Integer createstaffid;

	private String snapshotdtl;

	private Image bgimage;

	private List<Templetzone> templetzones;

	private List<Templet> subtemplets;

	public Integer getTempletid() {
		return templetid;
	}

	public void setTempletid(Integer templetid) {
		this.templetid = templetid;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid == null ? null : uuid.trim();
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
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

	public Integer getHometempletid() {
		return hometempletid;
	}

	public void setHometempletid(Integer hometempletid) {
		this.hometempletid = hometempletid;
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

	public String getPublicflag() {
		return publicflag;
	}

	public void setPublicflag(String publicflag) {
		this.publicflag = publicflag;
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

	public Image getBgimage() {
		return bgimage;
	}

	public void setBgimage(Image bgimage) {
		this.bgimage = bgimage;
	}

	public List<Templetzone> getTempletzones() {
		return templetzones;
	}

	public void setTempletzones(List<Templetzone> templetzones) {
		this.templetzones = templetzones;
	}

	public List<Templet> getSubtemplets() {
		return subtemplets;
	}

	public void setSubtemplets(List<Templet> subtemplets) {
		this.subtemplets = subtemplets;
	}
}