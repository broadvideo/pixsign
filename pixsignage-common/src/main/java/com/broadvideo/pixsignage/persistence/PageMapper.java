package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Page;

public interface PageMapper {
	Page selectByPrimaryKey(@Param(value = "pageid") String pageid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Page> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Page> selectPageListByPagepkg(@Param(value = "pagepkgid") String pagepkgid);

	int deleteByPrimaryKey(@Param(value = "pageid") String pageid);

	// int insert(Page record);

	int insertSelective(Page record);

	int updateByPrimaryKeySelective(Page record);

	// int updateByPrimaryKey(Page record);
}