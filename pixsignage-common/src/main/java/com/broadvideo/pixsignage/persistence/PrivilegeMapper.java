package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Privilege;

public interface PrivilegeMapper {
	Privilege selectByPrimaryKey(@Param(value = "privilegeid") String privilegeid);

	List<Privilege> selectSysTreeList();

	List<Privilege> selectVspTreeList();

	List<Privilege> selectOrgTreeList(@Param(value = "orgtype") String orgtype);
}