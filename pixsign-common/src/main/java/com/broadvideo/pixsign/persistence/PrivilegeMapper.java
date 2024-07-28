package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Privilege;

public interface PrivilegeMapper {
	Privilege selectByPrimaryKey(@Param(value = "privilegeid") String privilegeid);

	List<Privilege> selectSysTreeList();

	List<Privilege> selectOrgTreeList();
}