package com.broadvideo.pixsignage.persistence;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Eventperson;

public interface EventpersonMapper {
	int deleteByPrimaryKey(Integer eventpersonid);

	int deleteByEventid(@Param("eventid") Integer eventid);

	int insert(Eventperson record);

	int insertSelective(Eventperson record);

	Eventperson selectByPrimaryKey(Integer eventpersonid);

	int updateByPrimaryKeySelective(Eventperson record);

	int updateByPrimaryKey(Eventperson record);
}