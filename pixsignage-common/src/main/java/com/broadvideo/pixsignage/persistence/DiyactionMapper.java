package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Diyaction;

public interface DiyactionMapper {
	Diyaction selectByPrimaryKey(@Param(value = "diyactionid") String diyactionid);

	List<Diyaction> selectList(@Param(value = "diyid") String diyid);

	int deleteByPrimaryKey(@Param(value = "diyactionid") String diyactionid);

	// int insert(Diyaction record);

	int insertSelective(Diyaction record);

	int updateByPrimaryKeySelective(Diyaction record);

	int updateByPrimaryKeyWithBLOBs(Diyaction record);

	// int updateByPrimaryKey(Diyaction record);
}