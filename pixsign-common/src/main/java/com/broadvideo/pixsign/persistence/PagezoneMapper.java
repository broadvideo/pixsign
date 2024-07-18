package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Pagezone;

public interface PagezoneMapper {
	Pagezone selectByPrimaryKey(@Param(value = "pagezoneid") String pagezoneid);

	List<Pagezone> selectList(@Param(value = "pageid") String pageid);

	int deleteByPrimaryKey(@Param(value = "pagezoneid") String pagezoneid);

	// int insert(Pagezone record);

	int insertSelective(Pagezone record);

	int updateByPrimaryKeySelective(Pagezone record);

	int updateByPrimaryKeyWithBLOBs(Pagezone record);

	// int updateByPrimaryKey(Pagezone record);
}