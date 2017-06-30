package com.broadvideo.pixsignage.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CourseScheduleScheme {
    private Integer id;

    private String name;

    private String description;

    private String workdays;

    private Integer morningperiods;

    private Integer afternoonperiods;

    private Integer nightperiods;
	private boolean periodInitFlag;

	private List<PeriodTimeDtl> morningPeriodTimeDtls = new ArrayList<PeriodTimeDtl>();
	private List<PeriodTimeDtl> afternoonPeriodTimeDtls = new ArrayList<PeriodTimeDtl>();
	private List<PeriodTimeDtl> nightPeriodTimeDtls = new ArrayList<PeriodTimeDtl>();

    private Integer periodduration;

    private String enableflag;

    private Integer orgid;

    private Date createtime;

    private Integer createpsnid;

    private Date updatetime;

    private Integer updatepsnid;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

	public boolean isPeriodInitFlag() {
		return periodInitFlag;
	}

	public void setPeriodInitFlag(boolean periodInitFlag) {
		this.periodInitFlag = periodInitFlag;
	}

	public List<PeriodTimeDtl> getMorningPeriodTimeDtls() {
		return morningPeriodTimeDtls;
	}

	public void setMorningPeriodTimeDtls(List<PeriodTimeDtl> morningPeriodTimeDtls) {
		this.morningPeriodTimeDtls = morningPeriodTimeDtls;
	}

	public List<PeriodTimeDtl> getAfternoonPeriodTimeDtls() {
		return afternoonPeriodTimeDtls;
	}

	public void setAfternoonPeriodTimeDtls(List<PeriodTimeDtl> afternoonPeriodTimeDtls) {
		this.afternoonPeriodTimeDtls = afternoonPeriodTimeDtls;
	}

	public List<PeriodTimeDtl> getNightPeriodTimeDtls() {
		return nightPeriodTimeDtls;
	}

	public void setNightPeriodTimeDtls(List<PeriodTimeDtl> nightPeriodTimeDtls) {
		this.nightPeriodTimeDtls = nightPeriodTimeDtls;
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