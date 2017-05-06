package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Mmedia;

public interface MmediaMapper {
	Mmedia selectByPrimaryKey(@Param(value = "mmediaid") String mmediaid);

	List<Mmedia> selectList(@Param(value = "status") String status);

	Mmedia select(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid,
			@Param(value = "xcount") String xcount, @Param(value = "ycount") String ycount);

	Mmedia selectByMmediadtlid(@Param(value = "mmediadtlid") String mmediadtlid);

	int deleteByPrimaryKey(@Param(value = "mmediaid") String mmediaid);

	// int insert(Mmedia record);

	int insertSelective(Mmedia record);

	int updateByPrimaryKeySelective(Mmedia record);

	// int updateByPrimaryKey(Mmedia record);
}