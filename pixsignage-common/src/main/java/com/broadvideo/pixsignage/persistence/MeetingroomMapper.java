package com.broadvideo.pixsignage.persistence;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Meetingroom;

public interface MeetingroomMapper {

	List<Meetingroom> selectList(@Param(value = "orgid") Integer orgid, @Param(value = "search") String search,
			@Param("locationid") Integer locationid, RowBounds rowBounds);
	List<Meetingroom> selectList2(Meetingroom meetingroom, RowBounds rowBounds);
	List<Meetingroom> selectBindMeetingrooms(@Param("orgid") Integer orgid);
	Meetingroom selectByCode(@Param("code") String code, @Param("orgid") Integer orgid);
    int deleteByPrimaryKey(Integer meetingroomid);

    int insert(Meetingroom record);

    int insertSelective(Meetingroom record);

    Meetingroom selectByPrimaryKey(Integer meetingroomid);

    int updateByPrimaryKeySelective(Meetingroom record);

    int updateByPrimaryKey(Meetingroom record);

	int updateMeetingroom(Meetingroom meetingroom);

	List<Meetingroom> selectExists(Meetingroom meetingroom);

	int countMeetingrooms(@Param("orgid") Integer orgid);

	List<Map<String, Object>> selectHottestMeetingrooms(@Param("startdate") Date startDate,
			@Param("enddate") Date endDate, @Param("length") Integer length, @Param("orgid") Integer orgid);

}