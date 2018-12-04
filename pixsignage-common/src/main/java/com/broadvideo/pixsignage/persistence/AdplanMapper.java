package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Adplan;

public interface AdplanMapper {
	Adplan selectByPrimaryKey(@Param(value = "adplanid") String adplanid);

	int selectCount(@Param(value = "orgid") String orgid);

	List<Adplan> selectList(@Param(value = "orgid") String orgid, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Adplan> selectByDevicegroup(@Param(value = "devicegroupid") String devicegroupid);

	int deleteByPrimaryKey(@Param(value = "adplanid") String adplanid);

	// int insert(Adplan record);

	int insertSelective(Adplan record);

	int updateByPrimaryKeySelective(Adplan record);

	// int updateByPrimaryKey(Adplan record);
}