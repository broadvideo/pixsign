package biz.videoexpress.pixedx.lmsapi.bean;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;

import com.broadvideo.pixsignage.util.DateUtil;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AdjustMeetingReq {
	@JsonProperty("meeting_id")
	private Integer meetingId;
	private String subject;
	@JsonProperty("start_time")
	private String startTime;
	@JsonProperty("end_time")
	private String endTime;
	@JsonProperty("book_user_id")
	private Integer bookUserId;
	@JsonProperty("attendee_user_ids")
	private Integer[] attendeeUserId;
	@JsonProperty("meeting_room_id")
	private Integer meetingRoomId;

	public Integer getMeetingId() {
		return meetingId;
	}

	public void setMeetingId(Integer meetingId) {
		this.meetingId = meetingId;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public Date getStartTime() {
		if (StringUtils.isNotBlank(startTime)) {
			return DateUtil.getDate(startTime, "yyyy-MM-dd HH:mm");
		}
		return null;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		if (StringUtils.isNotBlank(endTime)) {
			return DateUtil.getDate(endTime, "yyyy-MM-dd HH:mm");
		}

		return null;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public Integer getBookUserId() {
		return bookUserId;
	}

	public void setBookUserId(Integer bookUserId) {
		this.bookUserId = bookUserId;
	}

	public Integer[] getAttendeeUserId() {
		return attendeeUserId;
	}

	public void setAttendeeUserId(Integer[] attendeeUserId) {
		this.attendeeUserId = attendeeUserId;
	}

	public Integer getMeetingRoomId() {
		return meetingRoomId;
	}

	public void setMeetingRoomId(Integer meetingRoomId) {
		this.meetingRoomId = meetingRoomId;
	}


}
