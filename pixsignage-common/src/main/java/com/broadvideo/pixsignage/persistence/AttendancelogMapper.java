package com.broadvideo.pixsignage.persistence;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Attendancelog;

public interface AttendancelogMapper {
	int deleteByPrimaryKey(Integer attendancelogid);

	int insert(Attendancelog record);

	int insertSelective(Attendancelog record);

	Attendancelog selectByPrimaryKey(Integer attendancelogid);

	List<Attendancelog> selectListFrom(@Param("lastattendancelogid") Integer lastAttendancelogid,
			@Param("length") Integer length, @Param("orgid") Integer orgid);

	List<Attendancelog> selectList(Attendancelog attendancelog);

	List<Attendancelog> selectList2(@Param("lasttime") Date lasttime);

	List<Attendancelog> selectList3(Attendancelog attendancelog, RowBounds rowBounds);

	int updateByPrimaryKeySelective(Attendancelog record);

	int updateByPrimaryKey(Attendancelog record);

	List<Attendancelog> selectListForVip(Attendancelog attendancelog, RowBounds rowBounds);

	List<Attendancelog> selectListForPerson(Attendancelog attendancelog, RowBounds rowBounds);

}