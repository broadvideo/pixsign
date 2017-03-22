package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Playlog;

public interface PlaylogMapper {
	Playlog selectByPrimaryKey(@Param(value = "playlogid") String playlogid);

	int selectDeviceStatCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<HashMap<String, Object>> selectDeviceStatList(@Param(value = "orgid") String orgid,
			@Param(value = "branchid") String branchid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	List<Playlog> selectList(@Param(value = "orgid") String orgid, @Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "playlogid") String playlogid);

	// int insert(Playlog record);

	int insertSelective(Playlog record);

	int updateByPrimaryKeySelective(Playlog record);

	// int updateByPrimaryKey(Playlog record);
}