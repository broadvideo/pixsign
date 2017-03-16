package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Templet;

public interface TempletMapper {
	Templet selectByPrimaryKey(@Param(value = "templetid") String templetid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "touchflag") String touchflag,
			@Param(value = "homeflag") String homeflag, @Param(value = "search") String search);

	List<Templet> selectList(@Param(value = "orgid") String orgid, @Param(value = "touchflag") String touchflag,
			@Param(value = "homeflag") String homeflag, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<Templet> selectSubList(@Param(value = "hometempletid") String hometempletid);

	int deleteByPrimaryKey(@Param(value = "templetid") String templetid);

	// int insert(Templet record);

	int insertSelective(Templet record);

	int updateByPrimaryKeySelective(Templet record);

	// int updateByPrimaryKey(Templet record);
}