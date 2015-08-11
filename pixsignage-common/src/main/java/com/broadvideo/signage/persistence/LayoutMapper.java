package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Layout;

public interface LayoutMapper {
    int deleteByKeys(String ids);
    int insert(Layout record);
    int insertSelective(Layout record);

    Layout selectByPrimaryKey(@Param(value="layoutid") String layoutid);
    Layout selectWithXmlByPrimaryKey(@Param(value="layoutid") String layoutid);
    int selectCount(@Param(value="orgid") int orgid, @Param(value="branchid") int branchid, @Param(value="search") String search);
    List<Layout> selectList(@Param(value="orgid") int orgid, @Param(value="branchid") int branchid, @Param(value="search") String search, 
    		@Param(value="start") String start, @Param(value="length") String length);
    List<Layout> selectByDevice(@Param(value="deviceid") String deviceid);
    long sumMediaSize(@Param(value="layoutid") String layoutid);

    int updateByPrimaryKeySelective(Layout record);
    int updateByPrimaryKey(Layout record);
}