package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Widgetsource;

public interface WidgetsourceMapper {
	int deleteByKeys(String ids);

    int insert(Widgetsource record);

    int insertSelective(Widgetsource record);

    Widgetsource selectByPrimaryKey(Integer widgetsourceid);
    int selectCount(@Param(value="orgid") String orgid);
    List<Widgetsource> selectList(@Param(value="orgid") String orgid, @Param(value="start") String start, @Param(value="length") String length);

    int updateByPrimaryKeySelective(Widgetsource record);

    int updateByPrimaryKey(Widgetsource record);
}