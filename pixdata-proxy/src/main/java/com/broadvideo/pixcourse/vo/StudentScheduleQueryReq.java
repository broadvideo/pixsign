package com.broadvideo.pixcourse.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StudentScheduleQueryReq extends ScheduleQueryReq {

	@Override
	@JsonProperty("student_id")
	public String getObjectid() {
		// TODO Auto-generated method stub
		return super.getObjectid();
	}

}
