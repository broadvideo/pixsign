package com.broadvideo.pixsignage.persistence;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Meeting;

public interface MeetingMapper {
	
	List<Meeting> selectList(@Param(value = "orgid") Integer orgid, @Param(value = "search") String search,
			@Param("locationid") Integer locationid, RowBounds rowBounds);

	List<Meeting> selectList2(Meeting meeting, RowBounds rowBounds);

	List<Meeting> selectExistMeetings(Meeting meeting);

	List<Map<String, Integer>> countMeetingSumary(@Param("startdate") Date startDate, @Param("enddate") Date endDate,
			@Param("orgid") Integer orgid);

	List<Map<String, Integer>> countMeetingroomUsage(@Param("startdate") Date startDate,
			@Param("enddate") Date endDate, @Param("orgid") Integer orgid);

	Meeting selectMatchMeeting(@Param("meetingroomid") Integer meetingroomid, @Param("signtime") Date signtime);
    int deleteByPrimaryKey(Integer meetingid);

    int insert(Meeting record);

    int insertSelective(Meeting record);

    Meeting selectByPrimaryKey(Integer meetingid);

    int updateByPrimaryKeySelective(Meeting record);

    int updateByPrimaryKey(Meeting record);
    
	void updateMeeting(Meeting meeting);
}