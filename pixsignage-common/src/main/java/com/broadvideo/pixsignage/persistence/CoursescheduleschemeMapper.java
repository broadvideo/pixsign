package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Courseschedulescheme;

public interface CoursescheduleschemeMapper {
    int deleteByPrimaryKey(Integer id);

	int batchDeleteCoursescheduleschemes(@Param("coursescheduleschemeids") List<Integer> coursescheduleschemeids,
			@Param("orgid") Integer orgid);

	int deleteCourseschedulescheme(@Param("coursescheduleschemeid") Integer coursescheduleschemeid,
			@Param("orgid") Integer orgid);

    int insert(Courseschedulescheme record);

    int insertSelective(Courseschedulescheme record);

	Courseschedulescheme selectByPrimaryKey(Integer coursescheduleschemeid);

	Courseschedulescheme selectEnableCourseschedulescheme(@Param("orgid") Integer orgid);

	Courseschedulescheme selectCourseschedulescheme(@Param("coursescheduleschemeid") Integer coursescheduleschemeid,
			@Param("orgid") Integer orgid);

	List<Courseschedulescheme> selectCoursescheduleschemes(@Param("search") String search,
			@Param("orgid") Integer orgid, RowBounds rowBounds);

    int updateByPrimaryKeySelective(Courseschedulescheme record);

    int updateByPrimaryKey(Courseschedulescheme record);

	int disableCoursescheduleschemes(@Param("excludeid") Integer excludeid, @Param("updatepsnid") Integer updatepsnid,
			@Param("orgid") Integer orgid);


}