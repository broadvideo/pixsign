package com.broadvideo.pixsign.domain;

import java.util.Date;

public class Weather {
	public final static String Type_Baidu = "1";
	public final static String Type_Yahoo = "2";

	private Integer weatherid;

	private String city;

	private String type;

	private String status;

	private Date refreshtime;

	private String weather;

	public Integer getWeatherid() {
		return weatherid;
	}

	public void setWeatherid(Integer weatherid) {
		this.weatherid = weatherid;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city == null ? null : city.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public Date getRefreshtime() {
		return refreshtime;
	}

	public void setRefreshtime(Date refreshtime) {
		this.refreshtime = refreshtime;
	}

	public String getWeather() {
		return weather;
	}

	public void setWeather(String weather) {
		this.weather = weather == null ? null : weather.trim();
	}
}