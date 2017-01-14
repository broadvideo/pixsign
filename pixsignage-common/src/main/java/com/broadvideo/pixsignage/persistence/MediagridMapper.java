package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Mediagrid;

public interface MediagridMapper {
	Mediagrid selectByPrimaryKey(@Param(value = "mediagridid") String mediagridid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "status") String status, @Param(value = "gridlayoutcode") String gridlayoutcode,
			@Param(value = "search") String search);

	List<Mediagrid> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "status") String status, @Param(value = "gridlayoutcode") String gridlayoutcode,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Mediagrid> selectWaiting2ActiveList();

	List<Mediagrid> selectWaiting2ErrorList();

	int deleteByPrimaryKey(@Param(value = "mediagridid") String mediagridid);

	// int insert(Mediagrid record);

	int insertSelective(Mediagrid record);

	int updateByPrimaryKeySelective(Mediagrid record);

	// int updateByPrimaryKey(Mediagrid record);
}