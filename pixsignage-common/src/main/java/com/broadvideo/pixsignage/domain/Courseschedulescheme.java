package com.broadvideo.pixsignage.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Courseschedulescheme {
    private Integer coursescheduleschemeid;

    private String name;

    private String description;

    private String workdays;

    private Integer morningperiods;

    private Integer afternoonperiods;

    private Integer nightperiods;
	private boolean periodinitflag;

	private List<Periodtimedtl> morningperiodtimedtls = new ArrayList<Periodtimedtl>();
	private List<Periodtimedtl> afternoonperiodtimedtls = new ArrayList<Periodtimedtl>();
	private List<Periodtimedtl> nightperiodtimedtls = new ArrayList<Periodtimedtl>();

    private Integer periodduration;

    private String enableflag;

    private Integer orgid;

    private Date createtime;

    private Integer createpsnid;

    private Date updatetime;

    private Integer updatepsnid;

    public Integer getCoursescheduleschemeid() {
        return coursescheduleschemeid;
    }

    public void setCoursescheduleschemeid(Integer coursescheduleschemeid) {
        this.coursescheduleschemeid = coursescheduleschemeid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getWorkdays() {
        return workdays;
    }

    public void setWorkdays(String workdays) {
        this.workdays = workdays == null ? null : workdays.trim();
    }

    public Integer getMorningperiods() {
        return morningperiods;
    }

    public void setMorningperiods(Integer morningperiods) {
        this.morningperiods = morningperiods;
    }

    public Integer getAfternoonperiods() {
        return afternoonperiods;
    }

    public void setAfternoonperiods(Integer afternoonperiods) {
        this.afternoonperiods = afternoonperiods;
    }

    public Integer getNightperiods() {
        return nightperiods;
    }

    public void setNightperiods(Integer nightperiods) {
        this.nightperiods = nightperiods;
    }

	public boolean isPeriodinitflag() {
		return periodinitflag;
	}

	public void setPeriodinitflag(boolean periodinitflag) {
		this.periodinitflag = periodinitflag;
	}

	public List<Periodtimedtl> getMorningperiodtimedtls() {
		return morningperiodtimedtls;
	}

	public void setMorningperiodtimedtls(List<Periodtimedtl> morningperiodtimedtls) {
		this.morningperiodtimedtls = morningperiodtimedtls;
	}

	public List<Periodtimedtl> getAfternoonperiodtimedtls() {
		return afternoonperiodtimedtls;
	}

	public void setAfternoonperiodtimedtls(List<Periodtimedtl> afternoonperiodtimedtls) {
		this.afternoonperiodtimedtls = afternoonperiodtimedtls;
	}

	public List<Periodtimedtl> getNightperiodtimedtls() {
		return nightperiodtimedtls;
	}

	public void setNightperiodtimedtls(List<Periodtimedtl> nightperiodtimedtls) {
		this.nightperiodtimedtls = nightperiodtimedtls;
	}

	public Integer getPeriodduration() {
        return periodduration;
    }

    public void setPeriodduration(Integer periodduration) {
        this.periodduration = periodduration;
    }

    public String getEnableflag() {
        return enableflag;
    }

    public void setEnableflag(String enableflag) {
        this.enableflag = enableflag == null ? null : enableflag.trim();
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getCreatepsnid() {
        return createpsnid;
    }

    public void setCreatepsnid(Integer createpsnid) {
        this.createpsnid = createpsnid;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public Integer getUpdatepsnid() {
        return updatepsnid;
    }

    public void setUpdatepsnid(Integer updatepsnid) {
        this.updatepsnid = updatepsnid;
    }
}