package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Oplog;

public interface OplogMapper {
	Oplog selectByPrimaryKey(@Param(value = "oplogid") String oplogid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type);

	List<Oplog> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "oplogid") String oplogid);

	// int insert(Oplog record);

	int insertSelective(Oplog record);

	int updateByPrimaryKeySelective(Oplog record);

	// int updateByPrimaryKey(Oplog record);
}