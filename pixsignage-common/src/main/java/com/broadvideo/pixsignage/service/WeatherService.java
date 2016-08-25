package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Weather;

public interface WeatherService {
	public List<Weather> selectList(String type);

	public Weather selectByCity(String type, String city);

	public void refreshWeather(Weather weather);
}
