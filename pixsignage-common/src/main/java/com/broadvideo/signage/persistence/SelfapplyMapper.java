package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Selfapply;

public interface SelfapplyMapper {
    Selfapply selectByPrimaryKey(@Param(value="selfapplyid") String selfapplyid);
    int selectCount(@Param(value="status") String status, @Param(value="search") String search);
    List<Selfapply> selectList(@Param(value="status") String status, @Param(value="search") String search, 
    		@Param(value="start") String start, @Param(value="length") String length);

    int insert(Selfapply record);
    int insertSelective(Selfapply record);
    int updateByPrimaryKeySelective(Selfapply record);
    int updateByPrimaryKey(Selfapply record);
    int deleteByKeys(String ids);
}