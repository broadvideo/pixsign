package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Medialist;

public interface MedialistMapper {
	Medialist selectByPrimaryKey(@Param(value = "medialistid") String medialistid);

	int selectCount(@Param(value = "orgid") int orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Medialist> selectList(@Param(value = "orgid") int orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "medialistid") String medialistid);

	// int insert(Medialist record);

	int insertSelective(Medialist record);

	int updateByPrimaryKeySelective(Medialist record);

	// int updateByPrimaryKey(Medialist record);
}