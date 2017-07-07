package com.broadvideo.pixsignage.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Attendance;

public interface AttendanceMapper {
	int deleteByPrimaryKey(Integer attendanceid);

    int insert(Attendance record);

    int insertSelective(Attendance record);

	Attendance selectByPrimaryKey(Integer attendanceid);

	int selectCount(@Param(value = "orgid") Integer orgid, @Param(value = "classroomid") Integer classroomid,
			@Param(value = "search") String search);

	List<Map<String, Object>> selectList(@Param(value = "orgid") Integer orgid,
			@Param(value = "classroomid") Integer classroomid, @Param(value = "search") String search,
			@Param(value = "start") Integer start, @Param(value = "length") Integer length);

    int updateByPrimaryKeySelective(Attendance record);

    int updateByPrimaryKey(Attendance record);

}