package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Onlinelog;

public interface OnlinelogMapper {
	Onlinelog selectByPrimaryKey(@Param(value = "onlinelogid") String onlinelogid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid);

	List<Onlinelog> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "onlinelogid") String onlinelogid);

	// int insert(Onlinelog record);

	int insertSelective(Onlinelog record);

	int updateByPrimaryKeySelective(Onlinelog record);

	// int updateByPrimaryKey(Onlinelog record);

	int updateAll();

	int updateOne(@Param(value = "deviceid") String deviceid);
}