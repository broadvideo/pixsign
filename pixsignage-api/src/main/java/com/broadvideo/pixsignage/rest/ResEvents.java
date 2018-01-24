package com.broadvideo.pixsignage.rest;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Attendancelog;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Event;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.domain.Room;
import com.broadvideo.pixsignage.domain.Roomterminal;
import com.broadvideo.pixsignage.persistence.AttendancelogMapper;
import com.broadvideo.pixsignage.persistence.EventMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.persistence.RoomMapper;
import com.broadvideo.pixsignage.persistence.RoomterminalMapper;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.util.DateUtil;

@Component
@Path("/events")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResEvents extends ResBase {
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
	private DeviceService deviceService;

	@GET
	@Path("/org_events")
	public String getOrgEventList(String request, @Context HttpServletRequest req,
			@QueryParam("org_id") Integer orgid) {

		try {
			logger.info("getOrgEventList for org_id:{}", orgid);
			RowBounds rowBounds = new RowBounds(0, Integer.MAX_VALUE);
			Integer roomType = 2;
			Event searchEvent = new Event();
			searchEvent.setOrgid(orgid);
			searchEvent.setRoomtype(roomType);
			List<Event> eventList = eventMapper.selectList(searchEvent, rowBounds);
			JSONArray dataArr = new JSONArray();
			for (Event event : eventList) {
				JSONObject json = new JSONObject();
				json.put("event_id", event.getEventid());
				json.put("name", event.getName());
				json.put("room_id", event.getRoomid());
				json.put("room_name", event.getRoomname());
				json.put("start_time", DateUtil.getDateStr(event.getStarttime(), "yyyy-MM-dd HH:mm:ss"));
				json.put("end_time", DateUtil.getDateStr(event.getEndtime(), "yyyy-MM-dd HH:mm:ss"));
				json.put("person_ids", new JSONArray());
				dataArr.put(json);
			}

			return this.handleResult(RetCodeEnum.SUCCESS, "success", dataArr);
		} catch (Exception e) {

			logger.error("getOrgEventList exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@GET
	@Path("/")
	public String getEventList(String request, @Context HttpServletRequest req,
			@QueryParam("terminal_id") String terminalid, @QueryParam("room_id") Integer roomid,
			@QueryParam("start_date") String startDate, @QueryParam("end_date") String endDate) {

		try {
			logger.info("getEventList for terminalid:{},room_id:{} start_date:{},end_date:{}",
					new Object[] { terminalid, roomid, startDate, endDate });
			Integer eventRoomid = roomid;
			if (StringUtils.isNotBlank(terminalid)) {
				Roomterminal roomterminal = this.roomterminalMapper.selectRoomterminal(terminalid);
				eventRoomid = roomterminal.getRoomid();
			}
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
			Room room = this.roomMapper.selectByPrimaryKey(eventRoomid);
			RowBounds rowBounds = new RowBounds(0, Integer.MAX_VALUE);
			Event searchEvent = new Event();
			searchEvent.setOrgid(room.getOrgid());
			searchEvent.setRoomid(eventRoomid);
			searchEvent.setStarttime(wrapStartDate);
			searchEvent.setEndtime(wrapEndDate);
			Integer persontype = null;
			if (room.getType().intValue() == 1) { // VIP类型
				persontype = 3;
			} else if (room.getType().intValue() == 2) {// 考勤类型
				persontype = 2;
			} else if (room.getType().intValue() == 4) {// 班牌类型
				persontype = 1;
			}
			List<Person> personList = personMapper.selectList(room.getOrgid() + "", null, persontype, "0",
					Integer.MAX_VALUE
					+ "");

			List<Event> eventList = eventMapper.selectList(searchEvent, rowBounds);
			JSONArray dataArr = new JSONArray();
			for (Event event : eventList) {
				JSONObject json = new JSONObject();
				json.put("event_id", event.getEventid());
				json.put("name", event.getName());
				json.put("room_id", event.getRoomid());
				json.put("room_name", event.getRoomname());
				json.put("start_time", DateUtil.getDateStr(event.getStarttime(), "yyyy-MM-dd HH:mm:ss"));
				json.put("end_time", DateUtil.getDateStr(event.getEndtime(), "yyyy-MM-dd HH:mm:ss"));
				JSONArray personidArr = new JSONArray();
				for (Person person : personList) {
					personidArr.put(person.getPersonid());
				}
				json.put("person_ids", personidArr);
				dataArr.put(json);
			}

			return this.handleResult(RetCodeEnum.SUCCESS, "success", dataArr);
		} catch (Exception e) {

			logger.error("getEventList exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@POST
	@Path("/event_report")
	public String eventReport(String request, @Context HttpServletRequest req) {

		try {
			logger.info("eventReport for body:{}", request);
			JSONObject requestJson = new JSONObject(request);
			Integer eventid = requestJson.getInt("event_id");
			Integer roomid = requestJson.getInt("room_id");
			String terminalid = requestJson.getString("terminal_id");
			Integer personid = requestJson.getInt("person_id");
			String signtype = requestJson.getString("sign_type");
			String signtime = requestJson.getString("sign_time");
			Attendancelog attendancelog = new Attendancelog();
			attendancelog.setEventid(eventid);
			Event event = this.eventMapper.selectByPrimaryKey(eventid);
			attendancelog.setEventname(event.getName());
			attendancelog.setRoomid(roomid);
			Room room = this.roomMapper.selectByPrimaryKey(roomid);
			attendancelog.setRoomname(room.getName());
			attendancelog.setPersonid(personid);
			Person person = this.personMapper.selectByPrimaryKey(personid);
			attendancelog.setPersonname(person.getName());
			attendancelog.setTerminalid(terminalid);
			attendancelog.setTerminalname(terminalid);
			attendancelog.setSigntype(signtype);
			attendancelog.setSigntime(DateUtil.getDate(signtime, "yyyy-MM-dd HH:mm:ss"));
			attendancelog.setCreatetime(new Date());
			attendancelog.setStatus(GlobalFlag.VALID);
			Device device = this.deviceService.selectByTerminalid(terminalid);
			attendancelog.setOrgid(device.getOrgid());
			attendancelogMapper.insertSelective(attendancelog);
			return this.handleResult(RetCodeEnum.SUCCESS, "success");
		} catch (Exception e) {

			logger.error("eventReport exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

}
