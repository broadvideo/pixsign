package com.broadvideo.pixsignage.persistence;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Examinationroom;

public interface ExaminationroomMapper {
	int deleteByPrimaryKey(@Param("examinationroomid") Integer examinationroomid, @Param("orgid") Integer orgid);

    int insert(Examinationroom record);

    int insertSelective(Examinationroom record);

	Examinationroom selectByPrimaryKey(@Param("examinationroomid") Integer examinationroomid,
			@Param("orgid") Integer orgid);

	List<Examinationroom> selectExaminationroomsBy(@Param("classroomid") Integer classroomid);

	int countExaminationrooms(@Param("excludeid") Integer excludeid, @Param("classroomid") Integer classroomid,
			@Param("starttime") Date starttime,
			@Param("endtime") Date endtime);

	List<Map<String, Object>> selectList(@Param(value = "orgid") Integer orgid, @Param(value = "search") String search,
			RowBounds rowBounds);

    int updateByPrimaryKeySelective(Examinationroom record);

    int updateByPrimaryKey(Examinationroom record);
}