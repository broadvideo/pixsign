package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Appfile;

public interface AppfileMapper {
	Appfile selectByPrimaryKey(@Param(value = "appfileid") String appfileid);

	List<Appfile> selectList(@Param(value = "name") String name, @Param(value = "mtype") String mtype);

	Appfile select(@Param(value = "name") String name, @Param(value = "mtype") String mtype,
			@Param(value = "vcode") String vcode);

	Appfile selectLatest(@Param(value = "name") String name, @Param(value = "mtype") String mtype);

	int deleteByPrimaryKey(@Param(value = "appfileid") String appfileid);

	// int insert(Appfile record);

	int insertSelective(Appfile record);

	int updateByPrimaryKeySelective(Appfile record);

	// int updateByPrimaryKey(Appfile record);

	int update2outdate(@Param(value = "name") String name, @Param(value = "mtype") String mtype);

	int update2latest(@Param(value = "name") String name, @Param(value = "mtype") String mtype);
}