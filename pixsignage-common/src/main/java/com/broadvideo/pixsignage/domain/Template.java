package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Template {
	private Integer templateid;

	private String uuid;

	private Integer orgid;

	private String name;

	private String snapshot;

	private String ratio;

	private Integer height;

	private Integer width;

	private String limitflag;

	private String touchflag;

	private String homeflag;

	private Integer hometemplateid;

	private Integer homeidletime;

	private String publicflag;

	private String status;

	private String description;

	private Date createtime;

	private Integer createstaffid;

	private String snapshotdtl;

	private List<Templatezone> templatezones;

	private List<Template> subtemplates;

	public Integer getTemplateid() {
		return templateid;
	}

	public void setTemplateid(Integer templateid) {
		this.templateid = templateid;
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

	public String getLimitflag() {
		return limitflag;
	}

	public void setLimitflag(String limitflag) {
		this.limitflag = limitflag;
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

	public Integer getHometemplateid() {
		return hometemplateid;
	}

	public void setHometemplateid(Integer hometemplateid) {
		this.hometemplateid = hometemplateid;
	}

	public Integer getHomeidletime() {
		return homeidletime;
	}

	public void setHomeidletime(Integer homeidletime) {
		this.homeidletime = homeidletime;
	}

	public String getPublicflag() {
		return publicflag;
	}

	public void setPublicflag(String publicflag) {
		this.publicflag = publicflag == null ? null : publicflag.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
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

	public List<Templatezone> getTemplatezones() {
		return templatezones;
	}

	public void setTemplatezones(List<Templatezone> templatezones) {
		this.templatezones = templatezones;
	}

	public List<Template> getSubtemplates() {
		return subtemplates;
	}

	public void setSubtemplates(List<Template> subtemplates) {
		this.subtemplates = subtemplates;
	}
}