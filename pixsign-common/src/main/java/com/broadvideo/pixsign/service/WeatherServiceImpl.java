package com.broadvideo.pixsign.service;

import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsign.domain.Weather;
import com.broadvideo.pixsign.persistence.WeatherMapper;
import com.broadvideo.pixsign.util.WeatherUtil;

@Service("weatherService")
public class WeatherServiceImpl implements WeatherService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private WeatherMapper weatherMapper;

	public List<Weather> selectList(String type) {
		return weatherMapper.selectList(type);
	}

	public Weather selectByCity(String type, String city) {
		Weather weather = weatherMapper.selectByCity(type, city);
		if (weather == null) {
			return getNewWeather(type, city);
		}
		return weather;
	}

	private synchronized Weather getNewWeather(String type, String city) {
		Weather weather = weatherMapper.selectByCity(type, city);
		if (weather == null) {
			weather = new Weather();
			weather.setType(type);
			weather.setCity(city);
			if (type.equals(Weather.Type_Baidu)) {
				weather.setWeather(WeatherUtil.getBaiduWeather(weather.getCity()));
			} else {
				weather.setWeather(WeatherUtil.getYahooWeather(weather.getCity()));
			}
			weather.setStatus("1");
			weather.setRefreshtime(Calendar.getInstance().getTime());
			weatherMapper.insertSelective(weather);
		}
		return weather;
	}

	public void refreshWeather(Weather weather) {
		String s = "";
		if (weather.getType().equals(Weather.Type_Baidu)) {
			s = WeatherUtil.getBaiduWeather(weather.getCity());
		} else {
			s = WeatherUtil.getYahooWeather(weather.getCity());
		}
		if (!weather.getWeather().equals(s) && s.length() > 0) {
			logger.info("Weather of {} changed", weather.getCity());
			weather.setWeather(s);
			weather.setRefreshtime(Calendar.getInstance().getTime());
			weatherMapper.updateByPrimaryKeySelective(weather);
		}
	}

}
