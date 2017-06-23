package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Ptemplet;

public interface PtempletMapper {
	Ptemplet selectByPrimaryKey(@Param(value = "ptempletid") String ptempletid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "ratio") String ratio,
			@Param(value = "publicflag") String publicflag, @Param(value = "search") String search);

	List<Ptemplet> selectList(@Param(value = "orgid") String orgid, @Param(value = "ratio") String ratio,
			@Param(value = "publicflag") String publicflag, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "ptempletid") String ptempletid);

	// int insert(Ptemplet record);

	int insertSelective(Ptemplet record);

	int updateByPrimaryKeySelective(Ptemplet record);

	// int updateByPrimaryKey(Ptemplet record);
}