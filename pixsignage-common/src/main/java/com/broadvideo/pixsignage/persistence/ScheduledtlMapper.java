package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Scheduledtl;

public interface ScheduledtlMapper {
	Scheduledtl selectByPrimaryKey(@Param(value = "scheduledtlid") String scheduledtlid);

	List<Scheduledtl> selectList(@Param(value = "scheduleid") String scheduleid);

	int deleteByPrimaryKey(@Param(value = "scheduledtlid") String scheduledtlid);

	int deleteByDtl(@Param(value = "scheduletype") String scheduletype, @Param(value = "attachflag") String attachflag,
			@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "playmode") String playmode, @Param(value = "starttime") String starttime);

	int deleteBySchedule(@Param(value = "scheduleid") String scheduleid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Scheduledtl record);

	int insertSelective(Scheduledtl record);

	int updateByPrimaryKeySelective(Scheduledtl record);

	// int updateByPrimaryKey(Scheduledtl record);
}