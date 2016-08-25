package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Weather;

public interface WeatherMapper {
	Weather selectByPrimaryKey(@Param(value = "weatherid") String weatherid);

	List<Weather> selectList(@Param(value = "type") String type);

	Weather selectByCity(@Param(value = "type") String type, @Param(value = "city") String city);

	int deleteByPrimaryKey(@Param(value = "weatherid") String weatherid);

	// int insert(Weather record);

	int insertSelective(Weather record);

	int updateByPrimaryKeySelective(Weather record);

	int updateByPrimaryKeyWithBLOBs(Weather record);

	// int updateByPrimaryKey(Weather record);
}