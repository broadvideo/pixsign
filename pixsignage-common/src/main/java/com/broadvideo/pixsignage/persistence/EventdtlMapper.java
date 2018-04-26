package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Eventdtl;

public interface EventdtlMapper {
    int deleteByPrimaryKey(Integer eventdtlid);

	int deleteByEventid(Integer eventid);

    int insert(Eventdtl record);

    int insertSelective(Eventdtl record);

    Eventdtl selectByPrimaryKey(Integer eventdtlid);

	List<Eventdtl> selectByEventid(@Param("eventid") Integer eventid);

    int updateByPrimaryKeySelective(Eventdtl record);

    int updateByPrimaryKey(Eventdtl record);
}