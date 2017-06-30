package com.broadvideo.pixsignage.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Attendancelog;

public interface AttendancelogMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Attendancelog record);

    int insertSelective(Attendancelog record);

    Attendancelog selectByPrimaryKey(Integer id);

	int selectCount(@Param(value = "orgid") Integer orgid, @Param(value = "classroomid") Integer classroomid,
			@Param(value = "search") String search);

	List<Map<String, Object>> selectList(@Param(value = "orgid") Integer orgid,
			@Param(value = "classroomid") Integer classroomid, @Param(value = "search") String search,
			@Param(value = "start") Integer start, @Param(value = "length") Integer length);

    int updateByPrimaryKeySelective(Attendancelog record);

    int updateByPrimaryKey(Attendancelog record);

}