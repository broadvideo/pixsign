package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Dbversion;

public interface DbversionMapper {
	Dbversion selectCurrentVersion();

	Dbversion selectByPrimaryKey(Integer dbversionid);

	int deleteByPrimaryKey(Integer dbversionid);

	// int insert(Dbversion record);

	int insertSelective(Dbversion record);

	int updateByPrimaryKeySelective(Dbversion record);

	// int updateByPrimaryKey(Dbversion record);
}