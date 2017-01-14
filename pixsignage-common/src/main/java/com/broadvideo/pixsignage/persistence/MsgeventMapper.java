package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Msgevent;

public interface MsgeventMapper {
	Msgevent selectByPrimaryKey(@Param(value = "msgeventid") String msgeventid);

	List<Msgevent> selectList(@Param(value = "msgtype") String msgtype, @Param(value = "objtype1") String objtype1,
			@Param(value = "objid1") String objid1, @Param(value = "objtype2") String objtype2,
			@Param(value = "status") String status);

	Msgevent selectVchannelVCSSEvent();

	Msgevent selectVchannelscheduleVCSSEvent(@Param(value = "vchannelid") String vchannelid);

	Msgevent selectVchannelPixboxEvent();

	int deleteByPrimaryKey(@Param(value = "msgeventid") String msgeventid);

	int deleteByDtl(@Param(value = "msgtype") String msgtype, @Param(value = "objtype1") String objtype1,
			@Param(value = "objid1") String objid1, @Param(value = "objtype2") String objtype2,
			@Param(value = "objid2") String objid2, @Param(value = "status") String status);

	// int insert(Msgevent record);

	int insertSelective(Msgevent record);

	int updateByPrimaryKeySelective(Msgevent record);

	// int updateByPrimaryKey(Msgevent record);
}