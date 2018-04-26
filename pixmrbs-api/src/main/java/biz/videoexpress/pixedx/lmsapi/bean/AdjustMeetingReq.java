package biz.videoexpress.pixedx.lmsapi.bean;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;

import com.broadvideo.pixsignage.util.DateUtil;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AdjustMeetingReq {
	@JsonProperty("meeting_id")
	private Integer meetingId;
	private String subject;
	private String description;
	@JsonProperty("start_time")
	private String startTime;
	@JsonProperty("end_time")
	private String endTime;
	@JsonProperty("period_flag")
	private String periodFlag;
	@JsonProperty("skip_holiday_flag")
	private String skipHolidayFlag;
	@JsonProperty("period_type")
	private String periodType;
	@JsonProperty("period_end_time")
	private String periodEndTime;
	@JsonProperty("period_change_scope")
	private String periodChangeScope;
	@JsonProperty("book_user_id")
	private Integer bookUserId;
	@JsonProperty("attendee_user_ids")
	private Integer[] attendeeUserId;
	@JsonProperty("meeting_room_id")
	private Integer meetingRoomId;
	@JsonProperty("service_memo")
	private String servicememo;

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public String getPeriodFlag() {
		return periodFlag;
	}

	public void setPeriodFlag(String periodFlag) {
		this.periodFlag = periodFlag;
	}

	public String getPeriodChangeScope() {
		return periodChangeScope;
	}

	public void setPeriodChangeScope(String periodChangeScope) {
		this.periodChangeScope = periodChangeScope;
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

	public String getPeriodEndTime() {
		return periodEndTime;
	}

	public void setPeriodEndTime(String periodEndTime) {
		this.periodEndTime = periodEndTime;
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

	public String getServicememo() {
		return servicememo;
	}

	public void setServicememo(String servicememo) {
		this.servicememo = servicememo;
	}

}
