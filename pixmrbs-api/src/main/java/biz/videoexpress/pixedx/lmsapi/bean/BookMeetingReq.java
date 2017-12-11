package biz.videoexpress.pixedx.lmsapi.bean;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BookMeetingReq {
	@JsonProperty("meeting_room_id")
	private Integer meetingRoomId;
	private String subject;
	@JsonProperty("start_time")
	private String startTime;
	@JsonProperty("end_time")
	private String endTime;
	@JsonProperty("attendee_user_ids")
	private Integer[] attendeeUserIds;
	@JsonProperty("book_user_id")
	private Integer bookUserId;

	public Integer getMeetingRoomId() {
		return meetingRoomId;
	}

	public void setMeetingRoomId(Integer meetingRoomId) {
		this.meetingRoomId = meetingRoomId;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

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

	public Integer[] getAttendeeUserIds() {
		return attendeeUserIds;
	}

	public void setAttendeeUserIds(Integer[] attendeeUserIds) {
		this.attendeeUserIds = attendeeUserIds;
	}

	public Integer getBookUserId() {
		return bookUserId;
	}

	public void setBookUserId(Integer bookUserId) {
		this.bookUserId = bookUserId;
	}

}
