package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Layoutschedule;

public interface LayoutscheduleMapper {
	Layoutschedule selectByPrimaryKey(@Param(value = "layoutscheduleid") String layoutscheduleid);

	List<Layoutschedule> selectList(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid);

	int deleteByPrimaryKey(@Param(value = "layoutscheduleid") String layoutscheduleid);

	int deleteByBind(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid);

	// int insert(Layoutschedule record);

	int insertSelective(Layoutschedule record);

	int updateByPrimaryKeySelective(Layoutschedule record);

	// int updateByPrimaryKey(Layoutschedule record);
}