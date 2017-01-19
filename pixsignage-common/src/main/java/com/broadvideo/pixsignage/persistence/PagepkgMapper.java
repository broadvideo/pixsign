package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Pagepkg;

public interface PagepkgMapper {
	Pagepkg selectByPrimaryKey(@Param(value = "pagepkgid") String pagepkgid);

	int selectCount(@Param(value = "orgid") int orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Pagepkg> selectList(@Param(value = "orgid") int orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "pagepkgid") String pagepkgid);

	// int insert(Pagepkg record);

	int insertSelective(Pagepkg record);

	int updateByPrimaryKeySelective(Pagepkg record);

	// int updateByPrimaryKey(Pagepkg record);
}