package biz.videoexpress.pixedx.lmsapi.bean;

import javax.ws.rs.QueryParam;

public class MeetingReq extends PageInfo {

	@QueryParam("start_time")
	private String startTime;
	@QueryParam("end_time")
	private String endTime;
	@QueryParam("meeting_room_id")
	private Integer meetingRoomId;

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public Integer getMeetingRoomId() {
		return meetingRoomId;
	}

	public void setMeetingRoomId(Integer meetingRoomId) {
		this.meetingRoomId = meetingRoomId;
	}

}
