package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Wxdevice;

public interface WxdeviceMapper {
	Wxdevice selectByPrimaryKey(@Param(value = "wxdeviceid") String wxdeviceid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "wxdeviceapplyid") String wxdeviceapplyid);

	List<Wxdevice> selectList(@Param(value = "orgid") String orgid,
			@Param(value = "wxdeviceapplyid") String wxdeviceapplyid, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "wxdeviceid") String wxdeviceid);

	// int insert(Wxdevice record);

	int insertSelective(Wxdevice record);

	int updateByPrimaryKeySelective(Wxdevice record);

	// int updateByPrimaryKey(Wxdevice record);
}