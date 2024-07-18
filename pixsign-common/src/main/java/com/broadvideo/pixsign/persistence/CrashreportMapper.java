package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Crashreport;

public interface CrashreportMapper {
	Crashreport selectByPrimaryKey(@Param(value = "crashreportid") String crashreportid);

	Crashreport selectAllByPrimaryKey(@Param(value = "crashreportid") String crashreportid);

	int selectCount();

	List<Crashreport> selectList(@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "crashreportid") String crashreportid);

	// int insert(Crashreport record);

	int insertSelective(Crashreport record);

	int updateByPrimaryKeySelective(Crashreport record);

	int updateByPrimaryKeyWithBLOBs(Crashreport record);

	// int updateByPrimaryKey(Crashreport record);
}