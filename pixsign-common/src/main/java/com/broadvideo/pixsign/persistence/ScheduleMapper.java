package com.broadvideo.pixsign.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Schedule;

public interface ScheduleMapper {
	Schedule selectByPrimaryKey(@Param(value = "scheduleid") String scheduleid);

	List<Schedule> selectList(@Param(value = "scheduletype") String scheduletype,
			@Param(value = "attachflag") String attachflag, @Param(value = "bindtype") String bindtype,
			@Param(value = "bindid") String bindid, @Param(value = "playmode") String playmode);

	List<HashMap<String, Object>> selectBindListByObj(@Param(value = "objtype") String objtype,
			@Param(value = "objid") String objid);

	int deleteByPrimaryKey(@Param(value = "scheduleid") String scheduleid);

	int deleteByDtl(@Param(value = "scheduletype") String scheduletype, @Param(value = "attachflag") String attachflag,
			@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "playmode") String playmode, @Param(value = "starttime") String starttime);

	// int insert(Schedule record);

	int insertSelective(Schedule record);

	int updateByPrimaryKeySelective(Schedule record);

	// int updateByPrimaryKey(Schedule record);
}