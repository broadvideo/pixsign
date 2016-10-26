package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Bundleschedule;

public interface BundlescheduleMapper {
	Bundleschedule selectByPrimaryKey(@Param(value = "bundlescheduleid") String bundlescheduleid);

	List<Bundleschedule> selectList(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "playmode") String playmode, @Param(value = "fromdate") String fromdate,
			@Param(value = "todate") String todate);

	List<HashMap<String, Object>> selectBindListByBundle(@Param(value = "bundleid") String bundleid);

	List<HashMap<String, Object>> selectBindListByLayout(@Param(value = "layoutid") String layoutid);

	int deleteByPrimaryKey(@Param(value = "bundlescheduleid") String bundlescheduleid);

	int deleteByDtl(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "playmode") String playmode, @Param(value = "playdate") String playdate,
			@Param(value = "starttime") String starttime);

	// int insert(Bundleschedule record);

	int insertSelective(Bundleschedule record);

	int updateByPrimaryKeySelective(Bundleschedule record);

	// int updateByPrimaryKey(Bundleschedule record);
}