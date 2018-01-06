package com.broadvideo.pixsignage.persistence;

import java.util.List;

import com.broadvideo.pixsignage.domain.Attendancelog;

public interface AttendancelogMapper {
	int deleteByPrimaryKey(Integer attendancelogid);

    int insert(Attendancelog record);

    int insertSelective(Attendancelog record);

	Attendancelog selectByPrimaryKey(Integer attendancelogid);
	List<Attendancelog> selectList(Attendancelog attendancelog);

	int updateByPrimaryKeySelective(Attendancelog record);

	int updateByPrimaryKey(Attendancelog record);

}