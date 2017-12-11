package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Meetingroom;

public interface MeetingroomService {

	PageResult getMeetingroomList(String search, Integer locationid, PageInfo pageinfo, Integer orgid);
	PageResult getMeetingroomList(Meetingroom meetingroom, PageInfo pageinfo);
	Integer addMeetingroom(Meetingroom meetingroom);

	void addEquipments(Meetingroom meetingroom, String[] equipmentids);

	void deleteEquipments(Meetingroom meetingroom, String[] equipmentids);

	void updateMeetingroom(Meetingroom meetingroom);

	void deleteMeetingroom(Meetingroom meetingroom);

	boolean validateNameCode(Meetingroom meetingroom);

	List<Device> listUnbindTerminals(Integer orgid);

}
