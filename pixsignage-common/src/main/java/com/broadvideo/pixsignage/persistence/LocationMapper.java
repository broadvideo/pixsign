package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Location;

public interface LocationMapper {
    int deleteByPrimaryKey(Integer locationid);

    int insert(Location record);

    int insertSelective(Location record);

    Location selectByPrimaryKey(Integer locationid);

	Location selectLocation(@Param("locationid") Integer locationid, @Param("orgid") Integer orgid);

	int existName(@Param("location") Location location, @Param("orgid") Integer orgid);
	List<Location> selectChildren(@Param(value = "parentid") Integer parentid, @Param("orgid") Integer orgid);

	List<Location> selectAllLocations(Integer orgid);

    int updateByPrimaryKeySelective(Location record);

    int updateByPrimaryKey(Location record);

	int updateLocation(Location location);

}