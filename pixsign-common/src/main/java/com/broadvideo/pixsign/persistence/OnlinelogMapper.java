package com.broadvideo.pixsign.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Onlinelog;

public interface OnlinelogMapper {
	Onlinelog selectByPrimaryKey(@Param(value = "onlinelogid") String onlinelogid);

	int selectDeviceStatCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "cataitemid1") String cataitemid1, @Param(value = "cataitemid2") String cataitemid2,
			@Param(value = "search") String search);

	List<HashMap<String, Object>> selectDeviceStatList(@Param(value = "orgid") String orgid,
			@Param(value = "branchid") String branchid, @Param(value = "cataitemid1") String cataitemid1,
			@Param(value = "cataitemid2") String cataitemid2, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	List<Onlinelog> selectList(@Param(value = "orgid") String orgid, @Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "onlinelogid") String onlinelogid);

	// int insert(Onlinelog record);

	int insertSelective(Onlinelog record);

	int updateByPrimaryKeySelective(Onlinelog record);

	// int updateByPrimaryKey(Onlinelog record);

	int updateAll();

	int updateLast2Offline(@Param(value = "deviceid") String deviceid);

	int updateLast2Online(@Param(value = "deviceid") String deviceid);
}