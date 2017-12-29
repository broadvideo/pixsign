package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Attendee;
import com.broadvideo.pixsignage.domain.Meeting;
import com.broadvideo.pixsignage.vo.StaffSwipe;

public interface MeetingService {

	Meeting getMeeting(Integer meetingid, Integer orgid);
	PageResult getMeetingList(String search, Integer locationid, PageInfo pageinfo, Integer orgid);
	PageResult getMeetingList(Meeting meeting, PageInfo pageinfo);
	Integer addMeeting(Meeting meeting);
	void updateMeeting(Meeting meeting);
	void deleteMeeting(Meeting meeting);
	List<Attendee> getMeetingAttendees(Integer meetingid, Integer orgid);
	void syncMeetingSignin(StaffSwipe staffswipe, Integer orgid);
	byte[] genExportExcel(List<Meeting> meetings, Integer orgid);

	List<Map<String, Integer>> getMeetingSumary(Date startDate, Date endDate, Integer orgid);

	List<Map<String, Integer>> getMeetingroomSumary(Date startDate, Date endDate, Integer orgid);

	void auditMeeting(Meeting meeting);


}
