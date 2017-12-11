package biz.videoexpress.pixedx.lmsapi.bean;

import java.util.Date;

import javax.ws.rs.QueryParam;

import org.apache.commons.lang3.StringUtils;

import com.broadvideo.pixsignage.util.DateUtil;

public class UserMeetingReq extends PageInfo {
	@QueryParam("start_time")
	private String startTime;
	@QueryParam("end_time")
	private String endTime;

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

}
