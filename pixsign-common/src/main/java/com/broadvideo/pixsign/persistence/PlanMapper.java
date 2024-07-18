package com.broadvideo.pixsign.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Plan;

public interface PlanMapper {
	Plan selectByPrimaryKey(@Param(value = "planid") String planid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "subbranchflag") String subbranchflag, @Param(value = "plantype") String plantype,
			@Param(value = "search") String search);

	List<Plan> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "subbranchflag") String subbranchflag, @Param(value = "plantype") String plantype,
			@Param(value = "start") String start, @Param(value = "length") String length,
			@Param(value = "search") String search);

	List<Plan> selectListByBind(@Param(value = "plantype") String plantype, @Param(value = "bindtype") String bindtype,
			@Param(value = "bindid") String bindid);

	List<HashMap<String, Object>> selectBindListByObj(@Param(value = "objtype") String objtype,
			@Param(value = "objid") String objid);

	int deleteByPrimaryKey(@Param(value = "planid") String planid);

	// int insert(Plan record);

	int insertSelective(Plan record);

	int updateByPrimaryKeySelective(Plan record);

	// int updateByPrimaryKey(Plan record);
}