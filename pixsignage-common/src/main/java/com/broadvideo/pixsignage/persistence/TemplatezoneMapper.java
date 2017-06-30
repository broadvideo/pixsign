package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Templatezone;

public interface TemplatezoneMapper {
	Templatezone selectByPrimaryKey(@Param(value = "templatezoneid") String templatezoneid);

	List<Templatezone> selectList(@Param(value = "templateid") String templateid);

	int deleteByPrimaryKey(@Param(value = "templatezoneid") String templatezoneid);

	// int insert(Templatezone record);

	int insertSelective(Templatezone record);

	int updateByPrimaryKeySelective(Templatezone record);

	int updateByPrimaryKeyWithBLOBs(Templatezone record);

	// int updateByPrimaryKey(Templatezone record);
}