package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Regionschedule;

public interface RegionscheduleMapper {
	Regionschedule selectByPrimaryKey(@Param(value = "regionscheduleid") String regionscheduleid);

	List<Regionschedule> selectList(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "regionid") String regionid, @Param(value = "playmode") String playmode,
			@Param(value = "fromdate") String fromdate, @Param(value = "todate") String todate);

	int deleteByPrimaryKey(@Param(value = "regionscheduleid") String regionscheduleid);

	int deleteByBind(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid);

	// int insert(Regionschedule record);

	int insertSelective(Regionschedule record);

	int updateByPrimaryKeySelective(Regionschedule record);

	// int updateByPrimaryKey(Regionschedule record);
}