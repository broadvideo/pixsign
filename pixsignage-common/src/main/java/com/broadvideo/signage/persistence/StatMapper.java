package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Stat;

public interface StatMapper {
	List<Stat> selectMediaCount(@Param(value="orgid") String orgid, @Param(value="type") String type);
	List<Stat> selectFilesizeSum(@Param(value="orgid") String orgid);
}
