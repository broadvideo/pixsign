package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Debugreport;

public interface DebugreportMapper {
	Debugreport selectByPrimaryKey(@Param(value = "debugreportid") String debugreportid);

	int selectCount();

	List<Debugreport> selectList(@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "debugreportid") String debugreportid);

	// int insert(Debugreport record);

	int insertSelective(Debugreport record);

	int updateByPrimaryKeySelective(Debugreport record);

	// int updateByPrimaryKey(Debugreport record);
}