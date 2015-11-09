package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Vchannel;

public interface VchannelMapper {
	Vchannel selectByPrimaryKey(@Param(value = "vchannelid") String vchannelid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "search") String search);

	List<Vchannel> selectList(@Param(value = "orgid") String orgid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "vchannelid") String vchannelid);

	// int insert(Vchannel record);

	int insertSelective(Vchannel record);

	int updateByPrimaryKeySelective(Vchannel record);

	// int updateByPrimaryKey(Vchannel record);
}