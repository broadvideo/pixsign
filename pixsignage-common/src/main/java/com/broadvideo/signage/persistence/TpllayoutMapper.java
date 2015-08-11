package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Tpllayout;

public interface TpllayoutMapper {
    Tpllayout selectByPrimaryKey(@Param(value="tpllayoutid") String tpllayoutid);
    List<Tpllayout> selectList(@Param(value="type") String type);
    List<Tpllayout> selectByCode(@Param(value="code") String code);
    
    int deleteByKeys(String ids);
    int insert(Tpllayout record);
    int insertSelective(Tpllayout record);
    int updateByPrimaryKeySelective(Tpllayout record);
    int updateByPrimaryKey(Tpllayout record);
}