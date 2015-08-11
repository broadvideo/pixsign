package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Regiondtl;

public interface RegiondtlMapper {
    Regiondtl selectByPrimaryKey(@Param(value="regiondtlid") String regiondtlid);
    List<Regiondtl> selectByLayout(Integer layoutid);
	
    int deleteByPrimaryKey(Integer regiondtlid);
    int deleteByLayout(Integer layoutid);
    int deleteByRegion(Integer regionid);

    int insert(Regiondtl record);
    int insertSelective(Regiondtl record);
    int insertList(@Param(value="regiondtls")List<Regiondtl> regiondtls);

    int updateByPrimaryKeySelective(Regiondtl record);
    int updateByPrimaryKey(Regiondtl record);
}