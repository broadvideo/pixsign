package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Student;

public interface StudentMapper {
	Student selectByPrimaryKey(@Param(value = "studentid") String studentid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "schoolclassid") String classid,
			@Param(value = "search") String search);

	List<Student> selectList(@Param(value = "orgid") String orgid, @Param(value = "schoolclassid") String classid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "studentid") Integer studentid, @Param("orgid") Integer orgid);

	// int insert(Student record);

	int insertSelective(Student record);

	int updateByPrimaryKeySelective(Student record);

	int countBy(@Param("excludeid") Integer excludeId, @Param("studentno") String studentno,
			@Param("hardid") String hardid, @Param("orgid") Integer orgid);

	// int updateByPrimaryKey(Student record);
}