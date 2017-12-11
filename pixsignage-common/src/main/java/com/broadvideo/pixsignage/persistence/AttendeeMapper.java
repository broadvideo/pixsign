package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Attendee;

public interface AttendeeMapper {
    int deleteByPrimaryKey(Integer attendeeid);

	int deleteByMeetingid(Integer meetingid);

    int insert(Attendee record);

    int insertSelective(Attendee record);

    Attendee selectByPrimaryKey(Integer attendeeid);

    int updateByPrimaryKeySelective(Attendee record);

    int updateByPrimaryKey(Attendee record);

	List<Attendee> selectMeetingAttendees(@Param("meetingid") Integer meetingid);

}