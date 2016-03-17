package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Weather;

public interface WeatherService {
	public List<Weather> selectList();

	public Weather selectByCity(String city);

	public void refreshWeather(Weather weather);
}
