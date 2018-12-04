package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Adplandtl;

public interface AdplandtlMapper {
	Adplandtl selectByPrimaryKey(@Param(value = "adplandtlid") String adplandtlid);

	int selectCount(@Param(value = "adplanid") String adplanid);

	List<Adplandtl> selectList(@Param(value = "adplanid") String adplanid, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Adplandtl> selectActiveList(@Param(value = "adplanid") String adplanid);

	int deleteByPrimaryKey(@Param(value = "adplandtlid") String adplandtlid);

	// int insert(Adplandtl record);

	int insertSelective(Adplandtl record);

	int updateByPrimaryKeySelective(Adplandtl record);

	// int updateByPrimaryKey(Adplandtl record);
}