package com.broadvideo.pixsignage.service;

import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.domain.Weather;
import com.broadvideo.pixsignage.persistence.WeatherMapper;
import com.broadvideo.pixsignage.util.WeatherUtil;

@Service("weatherService")
public class WeatherServiceImpl implements WeatherService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private WeatherMapper weatherMapper;

	public List<Weather> selectList() {
		return weatherMapper.selectList();
	}

	public Weather selectByCity(String city) {
		Weather weather = weatherMapper.selectByCity(city);
		if (weather == null) {
			return getNewWeather(city);
		}
		return weather;
	}

	private synchronized Weather getNewWeather(String city) {
		Weather weather = weatherMapper.selectByCity(city);
		if (weather == null) {
			weather = new Weather();
			String s = WeatherUtil.getWeather(city);
			weather.setCity(city);
			weather.setWeather(s);
			weather.setStatus("1");
			weather.setRefreshtime(Calendar.getInstance().getTime());
			weatherMapper.insertSelective(weather);
		}
		return weather;
	}

	public void refreshWeather(Weather weather) {
		String s = WeatherUtil.getWeather(weather.getCity());
		if (!weather.getWeather().equals(s)) {
			logger.info("Weather of {} changed", weather.getCity());
			weather.setWeather(s);
			weather.setRefreshtime(Calendar.getInstance().getTime());
			weatherMapper.updateByPrimaryKeySelective(weather);
		}
	}

}
