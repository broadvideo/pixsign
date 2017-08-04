package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Classroom;

public interface ClassroomMapper {
	int deleteByPrimaryKey(Integer classroomid);

	int batchDeleteClassrooms(@Param("classroomids") List<Integer> ids, @Param("orgid") Integer orgId);

    int insert(Classroom record);

    int insertSelective(Classroom record);

	Classroom selectByPrimaryKey(Integer classroomid);

	Classroom selectClassroom(@Param("classroomid") Integer classroomid, @Param("orgid") Integer orgid);

	Classroom selectByName(@Param("name") String name, @Param("orgid") Integer orgid);

	List<Classroom> selectClassrooms(@Param("search") String search, @Param("orgid") Integer orgid,
			RowBounds rowBounds);

	List<Classroom> selectClassroomsByOrgId(@Param("orgid") Integer orgid);

	int countBy(@Param("name") String name, @Param("excludeid") Integer excludeid, @Param("orgid") Integer orgid);

    int updateByPrimaryKeySelective(Classroom record);

    int updateByPrimaryKey(Classroom record);


}