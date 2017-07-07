package com.broadvideo.pixsignage.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Schoolclass;

public interface SchoolclassMapper {
	int deleteByPrimaryKey(@Param("schoolclassid") Integer schoolclassid, @Param("orgid") Integer orgid);

    int insert(Schoolclass record);

    int insertSelective(Schoolclass record);

    Schoolclass selectByPrimaryKey(Integer schoolclassid);

	Schoolclass selectByClassroomid(@Param("orgid") Integer orgid, @Param("classroomid") Integer classroomid);

	int selectCount(@Param(value = "orgid") Integer orgid, @Param(value = "search") String search);

	List<Map<String, Object>> selectList(@Param(value = "orgid") Integer orgid, @Param(value = "search") String search,
			RowBounds rowBounds);
    int updateByPrimaryKeySelective(Schoolclass record);

    int updateByPrimaryKey(Schoolclass record);

	int countBindRecords(@Param("classroomid") Integer classroomid,
			@Param("excludeschoolclassid") Integer excludeschoolclassid);
}