package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Diy;

public interface DiyMapper {
	Diy selectByPrimaryKey(@Param(value = "diyid") String diyid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Diy> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	Diy selectByCode(@Param(value = "code") String code);

	int deleteByPrimaryKey(@Param(value = "diyid") String diyid);

	// int insert(Diy record);

	int insertSelective(Diy record);

	int updateByPrimaryKeySelective(Diy record);

	// int updateByPrimaryKey(Diy record);
}