package biz.videoexpress.pixedx.lmsapi.bean;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BookMeetingReq {
	@JsonProperty("meeting_room_id")
	private Integer meetingRoomId;
	private String subject;
	@JsonProperty("description")
	private String description;
	@JsonProperty("start_time")
	private String startTime;
	@JsonProperty("end_time")
	private String endTime;
	@JsonProperty("period_end_time")
	private String periodEndTime;
	@JsonProperty("attendee_user_ids")
	private Integer[] attendeeUserIds;
	@JsonProperty("book_user_id")
	private Integer bookUserId;
	@JsonProperty("service_memo")
	private String servicememo;
	@JsonProperty("period_flag")
	private String periodFlag;
	@JsonProperty("skip_holiday_flag")
	private String skipHolidayFlag;
	@JsonProperty("period_type")
	private String periodType;


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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public String getPeriodEndTime() {
		return periodEndTime;
	}

	public void setPeriodEndTime(String periodEndTime) {
		this.periodEndTime = periodEndTime;
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

	public String getServicememo() {
		return servicememo;
	}

	public void setServicememo(String servicememo) {
		this.servicememo = servicememo;
	}

	public String getPeriodFlag() {
		return periodFlag;
	}

	public void setPeriodFlag(String periodFlag) {
		this.periodFlag = periodFlag;
	}

	public String getSkipHolidayFlag() {
		return skipHolidayFlag;
	}

	public void setSkipHolidayFlag(String skipHolidayFlag) {
		this.skipHolidayFlag = skipHolidayFlag;
	}

	public String getPeriodType() {
		return periodType;
	}

	public void setPeriodType(String periodType) {
		this.periodType = periodType;
	}
}
