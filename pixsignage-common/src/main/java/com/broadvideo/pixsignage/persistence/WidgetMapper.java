package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Widget;

public interface WidgetMapper {
	Widget selectByPrimaryKey(@Param(value = "widgetid") String widgetid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Widget> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "widgetid") String widgetid);
	// int insert(Widget record);

	int insertSelective(Widget record);

	int updateByPrimaryKeySelective(Widget record);

	// int updateByPrimaryKey(Widget record);
}