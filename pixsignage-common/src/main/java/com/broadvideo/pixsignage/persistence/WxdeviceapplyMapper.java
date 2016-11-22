package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Wxdeviceapply;

public interface WxdeviceapplyMapper {
	Wxdeviceapply selectByPrimaryKey(@Param(value = "wxdeviceapplyid") String wxdeviceapplyid);

	int selectCount(@Param(value = "orgid") String orgid);

	List<Wxdeviceapply> selectList(@Param(value = "orgid") String orgid, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "wxdeviceapplyid") String wxdeviceapplyid);

	// int insert(Wxdeviceapply record);

	int insertSelective(Wxdeviceapply record);

	int updateByPrimaryKeySelective(Wxdeviceapply record);

	// int updateByPrimaryKey(Wxdeviceapply record);
}