package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Attendee;
import com.broadvideo.pixsignage.domain.Meeting;

public interface MeetingService {

	Meeting getMeeting(Integer meetingid, Integer orgid);
	PageResult getMeetingList(String search, Integer locationid, PageInfo pageinfo, Integer orgid);
	
	PageResult getMeetingList(Meeting meeting, PageInfo pageinfo);

	Integer addMeeting(Meeting meeting);
	void updateMeeting(Meeting meeting);

	void deleteMeeting(Meeting meeting);

	List<Attendee> getMeetingAttendees(Integer meetingid, Integer orgid);



}
