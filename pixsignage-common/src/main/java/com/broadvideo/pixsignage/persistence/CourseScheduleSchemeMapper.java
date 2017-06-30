package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.CourseScheduleScheme;
import com.github.miemiedev.mybatis.paginator.domain.PageBounds;

public interface CourseScheduleSchemeMapper {
    int deleteByPrimaryKey(Integer id);

	int batchDeleteCourseScheduleSchemes(@Param("ids") List<Integer> ids, @Param("orgId") Integer orgId);

	int deleteCourseScheduleScheme(@Param("id") Integer id, @Param("orgId") Integer orgId);

    int insert(CourseScheduleScheme record);

    int insertSelective(CourseScheduleScheme record);

    CourseScheduleScheme selectByPrimaryKey(Integer id);

	CourseScheduleScheme selectEnableCourseScheduleScheme(@Param("orgId") Integer orgId);

	CourseScheduleScheme selectCourseScheduleScheme(@Param("id") Integer id, @Param("orgId") Integer orgId);

	List<CourseScheduleScheme> selectCourseScheduleSchemes(@Param("searchKey") String searchKey,
			@Param("orgId") Integer orgId, PageBounds pageBounds);

    int updateByPrimaryKeySelective(CourseScheduleScheme record);

    int updateByPrimaryKey(CourseScheduleScheme record);

	int disableCourseScheduleSchemes(@Param("excludeId") Integer excludeId, @Param("updatePsnId") Integer updatePsnId,
			@Param("orgId") Integer orgId);


}