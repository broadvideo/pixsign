package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Weather;

public interface WeatherService {
	public List<Weather> selectList(String type);

	public Weather selectByCity(String type, String city);

	public void refreshWeather(Weather weather);
}
