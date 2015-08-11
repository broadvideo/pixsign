package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Branch;

public interface BranchMapper {

	int deleteByKeys(String ids);

    int insert(Branch record);
    int insertSelective(Branch record);
    
    int selectCount(@Param(value="orgid") int orgid);
    List<Branch> selectList(@Param(value="orgid") int orgid);
    List<Branch> selectRoot(@Param(value="orgid") int orgid);
    List<Branch> selectByName(@Param(value="name") String name, @Param(value="orgid") String orgid);
    List<Branch> selectByCode(@Param(value="code") String code, @Param(value="orgid") String orgid);
   
    Branch selectByPrimaryKey(Integer branchid);

    int updateByPrimaryKeySelective(Branch record);

    int updateByPrimaryKey(Branch record);

}