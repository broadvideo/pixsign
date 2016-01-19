package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Layoutschedule;

public interface LayoutscheduleMapper {
	Layoutschedule selectByPrimaryKey(@Param(value = "layoutscheduleid") String layoutscheduleid);

	List<Layoutschedule> selectList(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "playmode") String playmode, @Param(value = "fromdate") String fromdate,
			@Param(value = "todate") String todate);

	List<HashMap<String, Object>> selectBindListByLayout(@Param(value = "layoutid") String layoutid);

	int deleteByPrimaryKey(@Param(value = "layoutscheduleid") String layoutscheduleid);

	int deleteByDtl(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "playmode") String playmode, @Param(value = "playdate") String playdate,
			@Param(value = "starttime") String starttime);

	// int insert(Layoutschedule record);

	int insertSelective(Layoutschedule record);

	int updateByPrimaryKeySelective(Layoutschedule record);

	// int updateByPrimaryKey(Layoutschedule record);
}