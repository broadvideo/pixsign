package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Livesource;

public interface LivesourceMapper {
	int deleteByKeys(String ids);

    int insert(Livesource record);

    int insertSelective(Livesource record);

    Livesource selectByPrimaryKey(Integer livesourceid);
    int selectCount(@Param(value="orgid") String orgid);
    List<Livesource> selectList(@Param(value="orgid") String orgid, @Param(value="start") String start, @Param(value="length") String length);

    int updateByPrimaryKeySelective(Livesource record);

    int updateByPrimaryKey(Livesource record);
}