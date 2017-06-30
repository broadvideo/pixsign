package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.CourseSchedule;

public interface CourseScheduleMapper {
    int deleteByPrimaryKey(Integer id);

	int deleteCourseSchedule(@Param("id") Integer id, @Param("orgId") Integer orgId);

	int batchDeleteCourseSchedules(@Param("ids") List<Integer> ids, @Param("orgId") Integer orgId);

	int deleteClassroomCourseSchedules(@Param("classroomIds") List<Integer> classroomIds, @Param("orgId") Integer orgId);

    int insert(CourseSchedule record);

    int insertSelective(CourseSchedule record);

    CourseSchedule selectByPrimaryKey(Integer id);

	CourseSchedule selectCourseSchedule(@Param("id") Integer id, @Param("orgId") Integer orgId);

	CourseSchedule selectCurCourseSchedule(@Param("coursescheduleschemeid") Integer schemeId,
			@Param("classroomid") Integer classroomid, @Param("workday") int workday,
			@Param("curshorttime") String curshorttime,
			@Param("orgid") Integer orgid);

	List<CourseSchedule> selectClassroomCourseSchedules(@Param("classroomId") Integer classroomId,
			@Param("courseScheduleSchemeId") Integer courseScheduleSchemeId, @Param("orgId") Integer orgId);
	
	int countBy(@Param("classroomId") Integer classroomId, @Param("periodTimeDtlId") Integer periodTimeDtlId,
			@Param("workday") Integer workday, @Param("orgId") Integer orgId);

    int updateByPrimaryKeySelective(CourseSchedule record);

    int updateByPrimaryKey(CourseSchedule record);

}