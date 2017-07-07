package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Courseschedule;

public interface CoursescheduleMapper {
    int deleteByPrimaryKey(Integer id);

	int deleteCourseschedule(@Param("coursescheduleid") Integer coursescheduleid, @Param("orgid") Integer orgid);

	int batchDeleteCourseschedules(@Param("coursescheduleids") List<Integer> coursescheduleids,
			@Param("orgid") Integer orgid);

	int deleteClassroomCourseschedules(@Param("classroomids") List<Integer> classroomids, @Param("orgid") Integer orgid);

    int insert(Courseschedule record);

    int insertSelective(Courseschedule record);

	Courseschedule selectByPrimaryKey(Integer coursescheduleid);

	Courseschedule selectCourseschedule(@Param("coursescheduleid") Integer coursescheduleid,
			@Param("orgid") Integer orgid);

	Courseschedule selectCurCourseschedule(@Param("coursescheduleschemeid") Integer coursescheduleschemeid,
			@Param("classroomid") Integer classroomid, @Param("workday") int workday,
			@Param("curshorttime") String curshorttime,
			@Param("orgid") Integer orgid);

	List<Courseschedule> selectClassroomCourseschedules(@Param("classroomid") Integer classroomid,
			@Param("coursescheduleschemeid") Integer coursescheduleschemeid, @Param("orgid") Integer orgid);
	
	int countBy(@Param("classroomid") Integer classroomid, @Param("periodtimedtlid") Integer periodtimedtlid,
			@Param("workday") Integer workday, @Param("orgid") Integer orgid);

    int updateByPrimaryKeySelective(Courseschedule record);

    int updateByPrimaryKey(Courseschedule record);

}