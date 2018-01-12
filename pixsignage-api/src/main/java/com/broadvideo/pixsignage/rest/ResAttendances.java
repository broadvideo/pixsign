package com.broadvideo.pixsignage.rest;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Attendancelog;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.domain.Event;
import com.broadvideo.pixsignage.persistence.AttendancelogMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.EventMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.persistence.RoomMapper;
import com.broadvideo.pixsignage.persistence.RoomterminalMapper;
import com.broadvideo.pixsignage.util.DateUtil;

@Component
@Path("/attendances")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResAttendances extends ResBase {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private RoomMapper roomMapper;
	@Autowired
	private RoomterminalMapper roomterminalMapper;
	@Autowired
	private EventMapper eventMapper;
	@Autowired
	private PersonMapper personMapper;
	@Autowired
	private AttendancelogMapper attendancelogMapper;
	@Autowired
	private ConfigMapper configMapper;

	@GET
	@Path("/")
	public String getAttendanceList(String request, @Context HttpServletRequest req,
			@QueryParam("event_id") Integer eventid, @QueryParam("terminal_id") String terminalid,
			@QueryParam("room_id") Integer roomid, @QueryParam("org_id") Integer orgid,
			@QueryParam("start_date") String startDate, @QueryParam("end_date") String endDate) {

		try {
			logger.info("getAttendanceList for querystr:{}", req.getQueryString());
			Date wrapStartDate = null;
			if (StringUtils.isNotBlank(startDate)) {
				wrapStartDate = DateUtil.getDate(startDate, "yyyyMMdd");
			}
			Date wrapEndDate = null;
			if (StringUtils.isNotBlank(endDate)) {
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(DateUtil.getDate(endDate, "yyyyMMdd"));
				calendar.add(Calendar.DAY_OF_MONTH, 1);
				wrapEndDate = calendar.getTime();

			}
			Attendancelog searchObj = new Attendancelog();
			searchObj.setEventid(eventid);
			searchObj.setTerminalid(terminalid);
			searchObj.setRoomid(roomid);
			searchObj.setOrgid(orgid);
			searchObj.setStarttime(wrapStartDate);
			searchObj.setEndtime(wrapEndDate);
			if (eventid != null) {
				Event event = this.eventMapper.selectByPrimaryKey(eventid);
				searchObj.setOrgid(event.getOrgid());
			}
			List<Attendancelog> attendancelogs = this.attendancelogMapper.selectList(searchObj);
			JSONArray dataArr = new JSONArray();
			Config config = configMapper.selectByCode("ServerIP");
			for (Attendancelog attendancelog : attendancelogs) {
				JSONObject dataJson = new JSONObject();
				dataJson.put("event_id", attendancelog.getEventid());
				dataJson.put("event_name", attendancelog.getEventname());
				dataJson.put("terminal_id", attendancelog.getTerminalid());
				dataJson.put("terminal_name", attendancelog.getTerminalid());
				dataJson.put("room_id", attendancelog.getRoomid());
				dataJson.put("room_name", attendancelog.getRoomname());
				dataJson.put("person_id", attendancelog.getPersonid());
				dataJson.put("person_name", attendancelog.getPersonname());
				dataJson.put("avatar", getImageUrl(config.getValue(), attendancelog.getPerson().getAvatar()));
				dataJson.put("sign_type", attendancelog.getSigntype());
				dataJson.put("sign_time", DateUtil.getDateStr(attendancelog.getSigntime(), "yyyy-MM-dd HH:mm:ss"));
				dataJson.put("state", "0");
				dataArr.put(dataJson);
			}

			return this.handleResult(RetCodeEnum.SUCCESS, "success", dataArr);
		} catch (Exception e) {

			logger.error("getAttendanceList exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}




}
