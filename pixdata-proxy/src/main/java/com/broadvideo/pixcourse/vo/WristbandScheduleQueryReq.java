package com.broadvideo.pixcourse.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WristbandScheduleQueryReq extends ScheduleQueryReq {

	@Override
	@JsonProperty("wristband_id")
	public String getObjectid() {
		// TODO Auto-generated method stub
		return super.getObjectid();
	}

}
