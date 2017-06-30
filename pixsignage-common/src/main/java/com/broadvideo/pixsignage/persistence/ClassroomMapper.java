package com.broadvideo.pixsignage.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Classroom;
import com.github.miemiedev.mybatis.paginator.domain.PageBounds;

public interface ClassroomMapper {
    int deleteByPrimaryKey(Integer id);

	int batchDeleteClassrooms(@Param("ids") List<Integer> ids, @Param("orgId") Integer orgId);

    int insert(Classroom record);

    int insertSelective(Classroom record);

    Classroom selectByPrimaryKey(Integer id);

	Classroom selectClassroom(@Param("id") Integer id, @Param("orgId") Integer orgId);

	List<Map<String, Object>> selectClassrooms(@Param("searchKey") String searchKey, @Param("orgId") Integer orgId,
			PageBounds pageBounds);

	List<Classroom> selectClassroomsByOrgId(@Param("orgId") Integer orgId);

	int countBy(@Param("name") String name, @Param("excludeId") Integer excludeId, @Param("orgId") Integer orgId);

    int updateByPrimaryKeySelective(Classroom record);

    int updateByPrimaryKey(Classroom record);


}