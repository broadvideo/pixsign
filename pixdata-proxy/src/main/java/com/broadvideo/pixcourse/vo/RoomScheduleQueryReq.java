package com.broadvideo.pixcourse.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RoomScheduleQueryReq extends ScheduleQueryReq {

	@Override
	@JsonProperty("room_id")
	public String getObjectid() {
		// TODO Auto-generated method stub
		return super.getObjectid();
	}
}
