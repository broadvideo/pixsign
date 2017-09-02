package com.broadvideo.pixsignage.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Attendanceevent;

public interface AttendanceeventMapper {
	int deleteByPrimaryKey(Integer attendanceeventid);

	int deleteAttendanceevents(@Param("attendanceschemeid") Integer attendanceschemeid, @Param("date") String date);

    int insert(Attendanceevent record);

    int insertSelective(Attendanceevent record);

	Attendanceevent selectByPrimaryKey(@Param("attendanceeventid") Integer attendanceeventid,
			@Param("orgid") Integer orgid);

	List<Map<String, Object>> selectClassroomeventdtls(@Param("attendanceeventid") Integer attendanceeventid,
			@Param("classroomid") Integer classroomid, @Param("orgid") Integer orgid);

    int updateByPrimaryKeySelective(Attendanceevent record);

    int updateByPrimaryKey(Attendanceevent record);

	List<Attendanceevent> selectAttendanceeventsBy(@Param("attendanceschemeid") Integer attendanceschemeid,
			@Param("classroomid") Integer classroomid, @Param("date") String date, @Param("orgid") Integer orgid);

	int countRecordsBy(@Param("attendanceschemeid") Integer attendanceschemeid, @Param("date") String date);
}