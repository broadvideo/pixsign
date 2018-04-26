package com.broadvideo.pixcourse.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ScheduleQueryReq {
	private String username;
	private String password;
	protected String objectid;
	@JsonProperty("year_id")
	private String yearid;
	@JsonProperty("semester_id")
	private String semesterid;
	@JsonProperty("week_num")
	private String weeknum;
	@JsonProperty("day_of_week")
	private String dayofweek;
	@JsonProperty("day_of_period")
	private String peroidofday;
	@JsonProperty("page_size")
	private Integer pagesize;
	@JsonProperty("current_index")
	private Integer pageno;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getObjectid() {
		return objectid;
	}

	public void setObjectid(String objectid) {
		this.objectid = objectid;
	}

	public String getYearid() {
		return yearid;
	}

	public void setYearid(String yearid) {
		this.yearid = yearid;
	}

	public String getSemesterid() {
		return semesterid;
	}

	public void setSemesterid(String semesterid) {
		this.semesterid = semesterid;
	}

	public String getWeeknum() {
		return weeknum;
	}

	public void setWeeknum(String weeknum) {
		this.weeknum = weeknum;
	}

	public String getDayofweek() {
		return dayofweek;
	}

	public void setDayofweek(String dayofweek) {
		this.dayofweek = dayofweek;
	}

	public String getPeroidofday() {
		return peroidofday;
	}

	public void setPeroidofday(String peroidofday) {
		this.peroidofday = peroidofday;
	}

	public Integer getPagesize() {
		return pagesize;
	}

	public void setPagesize(Integer pagesize) {
		this.pagesize = pagesize;
	}

	public Integer getPageno() {
		return pageno;
	}

	public void setPageno(Integer pageno) {
		this.pageno = pageno;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("ScheduleQueryReq [username=");
		builder.append(username);
		builder.append(", password=");
		builder.append(password);
		builder.append(", objectid=");
		builder.append(objectid);
		builder.append(", yearid=");
		builder.append(yearid);
		builder.append(", semesterid=");
		builder.append(semesterid);
		builder.append(", weeknum=");
		builder.append(weeknum);
		builder.append(", dayofweek=");
		builder.append(dayofweek);
		builder.append(", dayofperiod=");
		builder.append(peroidofday);
		builder.append(", pagesize=");
		builder.append(pagesize);
		builder.append(", pageno=");
		builder.append(pageno);
		builder.append("]");
		return builder.toString();
	}

}
