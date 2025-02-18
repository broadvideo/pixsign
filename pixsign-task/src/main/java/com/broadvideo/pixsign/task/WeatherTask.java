package com.broadvideo.pixsign.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsign.domain.Weather;
import com.broadvideo.pixsign.service.WeatherService;

public class WeatherTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private WeatherService weatherService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;
			logger.info("Start WeatherTask Quartz Task");

			List<Weather> weatherList = weatherService.selectList(Weather.Type_Baidu);
			for (Weather weather : weatherList) {
				weatherService.refreshWeather(weather);
			}

			weatherList = weatherService.selectList(Weather.Type_Yahoo);
			for (Weather weather : weatherList) {
				weatherService.refreshWeather(weather);
			}
		} catch (Exception e) {
			logger.error("WeatherTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}
}
