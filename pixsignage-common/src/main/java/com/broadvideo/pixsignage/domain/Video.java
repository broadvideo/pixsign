package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Video {
	public final static String TYPE_INTERNAL = "1";
	public final static String TYPE_EXTERNAL = "2";

	private Integer videoid;

	private Integer orgid;

	private Integer branchid;

	private Integer folderid;

	private String name;

	private String oname;

	private String uuid;

	private String type;

	private Integer width;

	private Integer height;

	private String format;

	private String filepath;

	private String filename;

	private Long size;

	private String md5;

	private String previewflag;

	private String status;

	private Integer progress;

	private String description;

	private String thumbnail;

	private Integer relateid;

	private String relateurl;

	private String tags;

	private Date createtime;

	private Integer createstaffid;

	private Image relateimage;

	public Integer getVideoid() {
		return videoid;
	}

	public void setVideoid(Integer videoid) {
		this.videoid = videoid;
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

	public Integer getFolderid() {
		return folderid;
	}

	public void setFolderid(Integer folderid) {
		this.folderid = folderid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getOname() {
		return oname;
	}

	public void setOname(String oname) {
		this.oname = oname;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
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

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename == null ? null : filename.trim();
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
		this.md5 = md5 == null ? null : md5.trim();
	}

	public String getPreviewflag() {
		return previewflag;
	}

	public void setPreviewflag(String previewflag) {
		this.previewflag = previewflag;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public Integer getProgress() {
		return progress;
	}

	public void setProgress(Integer progress) {
		this.progress = progress;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail == null ? null : thumbnail.trim();
	}

	public Integer getRelateid() {
		return relateid;
	}

	public void setRelateid(Integer relateid) {
		this.relateid = relateid;
	}

	public String getRelateurl() {
		return relateurl;
	}

	public void setRelateurl(String relateurl) {
		this.relateurl = relateurl;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
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

	public Image getRelateimage() {
		return relateimage;
	}

	public void setRelateimage(Image relateimage) {
		this.relateimage = relateimage;
	}
}