package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Wxappinfo;

public interface WxappinfoMapper {
    int deleteByPrimaryKey(Integer wxappinfoid);

    int insert(Wxappinfo record);

    int insertSelective(Wxappinfo record);

    Wxappinfo selectByPrimaryKey(Integer wxappinfoid);

    int updateByPrimaryKeySelective(Wxappinfo record);

    int updateByPrimaryKey(Wxappinfo record);

	Wxappinfo selectWxappinfo(@Param("type") String type, @Param("orgid") Integer orgid);

	List<Wxappinfo> selectAllWxappinfo(@Param("type") String type);
}