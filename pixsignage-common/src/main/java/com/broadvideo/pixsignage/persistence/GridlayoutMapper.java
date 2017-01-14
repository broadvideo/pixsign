package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Gridlayout;

public interface GridlayoutMapper {
	Gridlayout selectByPrimaryKey(@Param(value = "gridlayoutid") String gridlayoutid);

	List<Gridlayout> selectList();

	Gridlayout selectByCode(@Param(value = "gridlayoutcode") String gridlayoutcode);

	int deleteByPrimaryKey(@Param(value = "gridlayoutid") String gridlayoutid);

	// int insert(Gridlayout record);

	int insertSelective(Gridlayout record);

	int updateByPrimaryKeySelective(Gridlayout record);

	// int updateByPrimaryKey(Gridlayout record);
}