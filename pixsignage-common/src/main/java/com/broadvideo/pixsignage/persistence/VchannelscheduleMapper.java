package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Vchannelschedule;

public interface VchannelscheduleMapper {
	Vchannelschedule selectByPrimaryKey(@Param(value = "vchannelscheduleid") String vchannelscheduleid);

	List<Vchannelschedule> selectList(@Param(value = "vchannelid") String vchannelid);

	int deleteByPrimaryKey(@Param(value = "vchannelscheduleid") String vchannelscheduleid);

	// int insert(Vchannelschedule record);

	int insertSelective(Vchannelschedule record);

	int updateByPrimaryKeySelective(Vchannelschedule record);

	// int updateByPrimaryKey(Vchannelschedule record);
}