package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Templetzone;

public interface TempletzoneMapper {
	Templetzone selectByPrimaryKey(@Param(value = "templetzoneid") String templetzoneid);

	List<Templetzone> selectList(@Param(value = "templetid") String templetid);

	int deleteByPrimaryKey(@Param(value = "templetzoneid") String templetzoneid);

	// int insert(Templetzone record);

	int insertSelective(Templetzone record);

	int updateByPrimaryKeySelective(Templetzone record);

	int updateByPrimaryKeyWithBLOBs(Templetzone record);

	// int updateByPrimaryKey(Templetzone record);
}