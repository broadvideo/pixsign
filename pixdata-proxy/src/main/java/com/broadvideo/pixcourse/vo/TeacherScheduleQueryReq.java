package com.broadvideo.pixcourse.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TeacherScheduleQueryReq extends ScheduleQueryReq {

	@Override
	@JsonProperty("teacher_id")
	public String getObjectid() {
		// TODO Auto-generated method stub
		return super.getObjectid();
	}
}
