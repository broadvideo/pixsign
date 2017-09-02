package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Attendancescheme;

public interface AttendanceschemeMapper {
    int deleteByPrimaryKey(Integer attendanceschemeid);

	int deleteAttendancescheme(@Param("attendanceschemeid") Integer attendanceschemeid, @Param("orgid") Integer orgid);

    int insert(Attendancescheme record);

    int insertSelective(Attendancescheme record);

    Attendancescheme selectByPrimaryKey(Integer attendanceschemeid);

	Attendancescheme selectAttendancescheme(@Param("attendanceschemeid") Integer attendanceschemeid,
			@Param("orgid") Integer orgid);

	List<Attendancescheme> selectAllEnableAttendanceschemes();

	Attendancescheme getEnableAttendancescheme(Integer orgid);

	List<Attendancescheme> selectAttendanceschemes(@Param("search") String search, @Param("orgid") Integer orgid,
			RowBounds rowBounds);

    int updateByPrimaryKeySelective(Attendancescheme record);

    int updateByPrimaryKey(Attendancescheme record);

	int updateEnableflag(@Param("enableflag") String enableflag, @Param("orgid") Integer orgid);
}