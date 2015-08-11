package com.broadvideo.signage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Org {
	private Integer orgid;

	private Integer vspid;

	private String name;

	private String code;

	private String status;

	private String orgtype;

	private String videoflag = "0";

	private String imageflag = "0";

	private String textflag = "0";

	private String liveflag = "0";

	private String widgetflag = "0";

	private String description;

	private Date createtime;

	private Integer createstaffid;

	private String expireflag;

	private Date expiretime;

	private Integer maxdevices;

	private Long maxstorage;

	private String uploadflag;

	private Integer currentdevices;

	private Long currentstorage;

	private Integer currentdeviceidx;

	private String copyright;

	private Integer backupmediaid;

	private Vsp vsp;

	private Media backupmedia;

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getVspid() {
		return vspid;
	}

	public void setVspid(Integer vspid) {
		this.vspid = vspid;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getOrgtype() {
		return orgtype;
	}

	public void setOrgtype(String orgtype) {
		this.orgtype = orgtype;
	}

	public String getVideoflag() {
		return videoflag;
	}

	public void setVideoflag(String videoflag) {
		this.videoflag = videoflag;
	}

	public String getImageflag() {
		return imageflag;
	}

	public void setImageflag(String imageflag) {
		this.imageflag = imageflag;
	}

	public String getTextflag() {
		return textflag;
	}

	public void setTextflag(String textflag) {
		this.textflag = textflag;
	}

	public String getLiveflag() {
		return liveflag;
	}

	public void setLiveflag(String liveflag) {
		this.liveflag = liveflag;
	}

	public String getWidgetflag() {
		return widgetflag;
	}

	public void setWidgetflag(String widgetflag) {
		this.widgetflag = widgetflag;
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

	public String getExpireflag() {
		return expireflag;
	}

	public void setExpireflag(String expireflag) {
		this.expireflag = expireflag == null ? null : expireflag.trim();
	}

	@JSON(format = "yyyy-MM-dd")
	public Date getExpiretime() {
		return expiretime;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setExpiretime(Date expiretime) {
		this.expiretime = expiretime;
	}

	public Integer getMaxdevices() {
		return maxdevices;
	}

	public void setMaxdevices(Integer maxdevices) {
		this.maxdevices = maxdevices;
	}

	public Long getMaxstorage() {
		return maxstorage;
	}

	public void setMaxstorage(Long maxstorage) {
		this.maxstorage = maxstorage;
	}

	public String getUploadflag() {
		return uploadflag;
	}

	public void setUploadflag(String uploadflag) {
		this.uploadflag = uploadflag == null ? null : uploadflag.trim();
	}

	public Integer getCurrentdevices() {
		return currentdevices;
	}

	public void setCurrentdevices(Integer currentdevices) {
		this.currentdevices = currentdevices;
	}

	public Long getCurrentstorage() {
		return currentstorage;
	}

	public void setCurrentstorage(Long currentstorage) {
		this.currentstorage = currentstorage;
	}

	public Integer getCurrentdeviceidx() {
		return currentdeviceidx;
	}

	public void setCurrentdeviceidx(Integer currentdeviceidx) {
		this.currentdeviceidx = currentdeviceidx;
	}

	public String getCopyright() {
		return copyright;
	}

	public void setCopyright(String copyright) {
		this.copyright = copyright;
	}

	public Integer getBackupmediaid() {
		return backupmediaid;
	}

	public void setBackupmediaid(Integer backupmediaid) {
		this.backupmediaid = backupmediaid;
	}

	public Vsp getVsp() {
		return vsp;
	}

	public void setVsp(Vsp vsp) {
		this.vsp = vsp;
	}

	public Media getBackupmedia() {
		return backupmedia;
	}

	public void setBackupmedia(Media backupmedia) {
		this.backupmedia = backupmedia;
	}

}