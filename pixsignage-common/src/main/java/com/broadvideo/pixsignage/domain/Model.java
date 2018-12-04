package com.broadvideo.pixsignage.domain;

public class Model {
	private Integer modelid;

	private String name;

	private String model;

	private String prefix;

	private String programflag;

	private String touchflag;

	private String planflag;

	private Integer currentdeviceidx;

	public Integer getModelid() {
		return modelid;
	}

	public void setModelid(Integer modelid) {
		this.modelid = modelid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model == null ? null : model.trim();
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix == null ? null : prefix.trim();
	}

	public String getProgramflag() {
		return programflag;
	}

	public void setProgramflag(String programflag) {
		this.programflag = programflag == null ? null : programflag.trim();
	}

	public String getTouchflag() {
		return touchflag;
	}

	public void setTouchflag(String touchflag) {
		this.touchflag = touchflag == null ? null : touchflag.trim();
	}

	public String getPlanflag() {
		return planflag;
	}

	public void setPlanflag(String planflag) {
		this.planflag = planflag == null ? null : planflag.trim();
	}

	public Integer getCurrentdeviceidx() {
		return currentdeviceidx;
	}

	public void setCurrentdeviceidx(Integer currentdeviceidx) {
		this.currentdeviceidx = currentdeviceidx;
	}
}