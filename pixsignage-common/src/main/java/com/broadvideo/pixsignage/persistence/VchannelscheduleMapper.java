package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Vchannelschedule;

public interface VchannelscheduleMapper {
	Vchannelschedule selectByPrimaryKey(@Param(value = "vchannelscheduleid") String vchannelscheduleid);

	List<Vchannelschedule> selectList(@Param(value = "vchannelid") String vchannelid);

	int deleteByPrimaryKey(@Param(value = "vchannelscheduleid") String vchannelscheduleid);

	int deleteByDtl(@Param(value = "vchannelid") String vchannelid, @Param(value = "playmode") String playmode,
			@Param(value = "playdate") String playdate, @Param(value = "starttime") String starttime);

	int deleteByPlaylist(@Param(value = "playlistid") String playlistid);

	// int insert(Vchannelschedule record);

	int insertSelective(Vchannelschedule record);

	int updateByPrimaryKeySelective(Vchannelschedule record);

	// int updateByPrimaryKey(Vchannelschedule record);
}