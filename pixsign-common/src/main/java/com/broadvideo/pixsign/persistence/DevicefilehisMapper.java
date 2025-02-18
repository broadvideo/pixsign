package com.broadvideo.pixsign.persistence;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Devicefilehis;

public interface DevicefilehisMapper {
	Devicefilehis selectByPrimaryKey(@Param(value = "devicefilehisid") String devicefilehisid);

	int deleteByPrimaryKey(@Param(value = "devicefilehisid") String devicefilehisid);

	// int insert(Devicefilehis record);

	int insertSelective(Devicefilehis record);

	int updateByPrimaryKeySelective(Devicefilehis record);

	// int updateByPrimaryKey(Devicefilehis record);
}