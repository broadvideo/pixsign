package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Branch;

public interface BranchMapper {
	Branch selectByPrimaryKey(@Param(value = "branchid") String branchid);

	List<Branch> selectRoot(@Param(value = "orgid") String orgid);

	List<Branch> selectChild(@Param(value = "parentid") String parentid);

	List<Branch> selectByName(@Param(value = "name") String name, @Param(value = "orgid") String orgid);

	Branch selectByUuid(@Param("uuid") String uuid, @Param("orgid") String orgid);

	List<Branch> selectTaodianList();

	List<Branch> selectOrgBranchList(@Param("orgid") String orgid);

	List<Branch> selectList(@Param("rootid") String rootid);

	int deleteByPrimaryKey(@Param(value = "branchid") String branchid);

	// int insert(Branch record);

	int insertSelective(Branch record);

	int updateByPrimaryKeySelective(Branch record);

	// int updateByPrimaryKey(Branch record);

	int updateCurrentstorage();
}