package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Branch;

public interface BranchMapper {
	Branch selectByPrimaryKey(@Param(value = "branchid") String branchid);

	int selectCount(@Param(value = "orgid") int orgid);

	List<Branch> selectList(@Param(value = "orgid") int orgid);

	List<Branch> selectRoot(@Param(value = "orgid") int orgid);

	List<Branch> selectByName(@Param(value = "name") String name, @Param(value = "orgid") String orgid);

	List<Branch> selectByCode(@Param(value = "code") String code, @Param(value = "orgid") String orgid);

	int deleteByPrimaryKey(@Param(value = "branchid") String branchid);

	// int insert(Branch record);

	int insertSelective(Branch record);

	int updateByPrimaryKeySelective(Branch record);

	// int updateByPrimaryKey(Branch record);
}