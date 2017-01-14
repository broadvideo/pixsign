package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Mmediadtl;

public interface MmediadtlMapper {
	Mmediadtl selectByPrimaryKey(@Param(value = "mmediadtlid") String mmediadtlid);

	List<Mmediadtl> selectList(@Param(value = "mmediaid") String mmediaid);

	Mmediadtl selectByPos(@Param(value = "mmediaid") String mmediaid, @Param(value = "xpos") String xpos,
			@Param(value = "ypos") String ypos);

	int deleteByPrimaryKey(@Param(value = "mmediadtlid") String mmediadtlid);

	// int insert(Mmediadtl record);

	int insertSelective(Mmediadtl record);

	int updateByPrimaryKeySelective(Mmediadtl record);

	// int updateByPrimaryKey(Mmediadtl record);
}