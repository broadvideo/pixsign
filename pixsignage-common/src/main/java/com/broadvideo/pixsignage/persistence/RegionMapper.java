package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Region;

public interface RegionMapper {
	Region selectByPrimaryKey(@Param(value = "regionid") String regionid);

	List<Region> selectList();

	int deleteByPrimaryKey(@Param(value = "regionid") String regionid);

	int insert(Region record);

	int insertSelective(Region record);

	int updateByPrimaryKeySelective(Region record);

	int updateByPrimaryKey(Region record);
}