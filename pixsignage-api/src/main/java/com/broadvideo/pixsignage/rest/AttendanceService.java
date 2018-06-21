package com.broadvideo.pixsignage.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
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
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.domain.Event;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.domain.Room;
import com.broadvideo.pixsignage.persistence.EventMapper;
import com.broadvideo.pixsignage.persistence.EventpersonMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.persistence.RoomMapper;
import com.broadvideo.pixsignage.service.EventService;
import com.broadvideo.pixsignage.service.PersonService;
import com.broadvideo.pixsignage.service.RoomService;
import com.broadvideo.pixsignage.util.DateUtil;

@Component
@Path("/attendance")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AttendanceService extends ResBase {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private RoomMapper roomMapper;
	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private PersonMapper personMapper;
	@Autowired
	private RoomService roomService;
	@Autowired
	private PersonService personService;
	@Autowired
	private EventService eventService;
	@Autowired
	private EventMapper eventMapper;
	@Autowired
	private EventpersonMapper eventpersonMapper;

	@Path("/sync_rooms")
	@POST
	public String syncRooms(String request, @QueryParam("org_code") String orgcode, @Context HttpServletRequest req) {
		logger.info("AttendanceService sync_rooms:orgcode({}),body({})", orgcode, request);
		if (StringUtils.isBlank(request) || StringUtils.isBlank(orgcode)) {
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, "消息体或者org_code不允许为空!");
		}
		try {
			Org org = orgMapper.selectByCode(orgcode);
			if (org == null) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "org_code(" + orgcode + ")不存在！");
			}
			JSONArray dataArr = new JSONArray(request);
			List<Room> newRooms = new ArrayList<Room>();
			for (int i = 0; i < dataArr.length(); i++) {
				JSONObject roomJson = dataArr.getJSONObject(i);
				String uuid = roomJson.getString("uuid");
				String name = roomJson.getString("name");
				String description = roomJson.getString("description");
				Room room = new Room();
				room.setUuid(uuid);
				room.setName(name);
				room.setDescription(description);
				// 人员考勤
				room.setType(2);
				// 外部导入
				room.setSource_type("1");
				room.setOrgid(org.getOrgid());
				room.setCreatetime(new Date());
				room.setCreatestaffid(-1);
				room.setStatus(GlobalFlag.VALID);
				newRooms.add(room);
			}
			this.roomService.syncRooms(newRooms, org.getOrgid());
			return this.handleResult(ApiRetCodeEnum.SUCCESS, " ");
		} catch (Exception e) {
			logger.error("AttendanceService sync_rooms exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@Path("/delete_rooms")
	@POST
	public String deleteRooms(String request, @QueryParam("org_code") String orgcode, @Context HttpServletRequest req) {
		logger.info("AttendanceService delete_rooms:org_code({}),body({})", orgcode, request);
		if (StringUtils.isBlank(request) || StringUtils.isBlank(orgcode)) {
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, "消息体或者org_code不允许为空!");
		}
		try {
			Org org = orgMapper.selectByCode(orgcode);
			if (org == null) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "org_code(" + orgcode + ")不存在！");
			}
			JSONObject dataJson = new JSONObject(request);
			JSONArray uuidArr = dataJson.getJSONArray("uuids");
			for (int i = 0; i < uuidArr.length(); i++) {
				Room qRoom = this.roomMapper.selectByUuid(uuidArr.getString(i), org.getOrgid());
				if (qRoom != null) {
					this.roomMapper.deleteByPrimaryKey(qRoom.getRoomid());
				}
			}
			return this.handleResult(ApiRetCodeEnum.SUCCESS, " ");
		} catch (Exception e) {
			logger.error("AttendanceService deleteRooms exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@Path("/sync_persons")
	@POST
	public String syncPersons(String request, @QueryParam("org_code") String orgcode, @Context HttpServletRequest req) {
		logger.info("AttendanceService sync_persons:orgcode({}),body({})", orgcode, request);
		if (StringUtils.isBlank(request) || StringUtils.isBlank(orgcode)) {
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, "消息体或者org_code不允许为空!");
		}
		try {
			Org org = orgMapper.selectByCode(orgcode);
			if (org == null) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "org_code(" + orgcode + ")不存在！");
			}
			JSONArray dataArr = new JSONArray(request);
			List<Person> newPersons = new ArrayList<Person>();
			for (int i = 0; i < dataArr.length(); i++) {
				JSONObject personJson = dataArr.getJSONObject(i);
				Person newPerson = new Person();
				String uuid = personJson.getString("uuid");
				String personno = personJson.getString("person_no");
				String name = personJson.getString("name");
				String gender = personJson.getString("sex");
				String avatar = personJson.getString("avatar");
				String face = personJson.getString("face");
				String rfid = personJson.getString("rfid");
				String voicePrompt = personJson.getString("voice_prompt");
				newPerson.setUuid(uuid);
				newPerson.setPersonno(personno);
				newPerson.setName(name);
				newPerson.setSex(gender);
				newPerson.setAvatar(avatar);
				newPerson.setImageurl(face);
				newPerson.setRfid(rfid);
				newPerson.setVoiceprompt(voicePrompt);
				newPersons.add(newPerson);
			}
			this.personService.syncPersons(newPersons, org.getOrgid());
			return this.handleResult(ApiRetCodeEnum.SUCCESS, " ");
		} catch (Exception e) {
			logger.error("AttendanceService sync_persons exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@Path("/delete_persons")
	@POST
	public String deletePersons(String request, @QueryParam("org_code") String orgcode, @Context HttpServletRequest req) {
		logger.info("AttendanceService delete_persons:org_code({}),body({})", orgcode, request);
		if (StringUtils.isBlank(request) || StringUtils.isBlank(orgcode)) {
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, "消息体或者org_code不允许为空!");
		}
		try {
			Org org = orgMapper.selectByCode(orgcode);
			if (org == null) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "org_code(" + orgcode + ")不存在！");
			}
			JSONObject dataJson = new JSONObject(request);
			JSONArray uuidArr = dataJson.getJSONArray("uuids");
			for (int i = 0; i < uuidArr.length(); i++) {
				Person qPerson = this.personMapper.selectByUuid(uuidArr.getString(i), org.getOrgid());
				if (qPerson != null) {
					this.personMapper.deleteByPrimaryKey(qPerson.getPersonid(), org.getOrgid());
				}
			}
			return this.handleResult(ApiRetCodeEnum.SUCCESS, " ");
		} catch (Exception e) {
			logger.error("AttendanceService delete_persons exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@Path("/sync_events")
	@POST
	public String syncEvents(String request, @QueryParam("org_code") String orgcode, @Context HttpServletRequest req) {
		logger.info("AttendanceService sync_events:orgcode({}),body({})", orgcode, request);
		if (StringUtils.isBlank(request) || StringUtils.isBlank(orgcode)) {
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, "消息体或者org_code不允许为空!");
		}
		try {
			Org org = orgMapper.selectByCode(orgcode);
			if (org == null) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "org_code(" + orgcode + ")不存在！");
			}
			JSONArray dataArr = new JSONArray(request);
			List<Event> newEvents = new ArrayList<Event>();
			for (int i = 0; i < dataArr.length(); i++) {
				JSONObject eventJson = dataArr.getJSONObject(i);
				String uuid = eventJson.getString("uuid");
				String name = eventJson.getString("name");
				String roomUuid = eventJson.getString("room_uuid");
				String description = eventJson.getString("description");
				String startDate = eventJson.getString("start_date");
				String endDate = eventJson.getString("end_date");
				String shortStartTime = eventJson.getString("short_start_time");
				String shortEndTime = eventJson.getString("short_end_time");
				JSONArray personUuids = eventJson.getJSONArray("person_uuids");
				Event event = new Event();
				event.setUuid(uuid);
				event.setName(name);
				Room qRoom = this.roomMapper.selectByUuid(roomUuid, org.getOrgid());
				event.setRoomid(qRoom.getRoomid());
				event.setRoomname(qRoom.getName());
				event.setStarttime(DateUtil.getDate(startDate + " " + shortStartTime, "yyyy-MM-dd HH:mm"));
				event.setEndtime(DateUtil.getDate(endDate + " " + shortEndTime, "yyyy-MM-dd HH:mm"));
				event.setSourcetype("1");
				List<String> uuidList = new ArrayList<String>();
				for (int j = 0; j < personUuids.length(); j++) {
					uuidList.add(personUuids.getString(j));
				}
				event.setPersonUuids(uuidList);
				newEvents.add(event);

			}
			this.eventService.syncEvents(newEvents, org.getOrgid());
			return this.handleResult(ApiRetCodeEnum.SUCCESS, " ");
		} catch (Exception e) {
			logger.error("AttendanceService sync_events exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@Path("/delete_events")
	@POST
	public String deleteEvents(String request, @QueryParam("org_code") String orgcode, @Context HttpServletRequest req) {
		logger.info("AttendanceService delete_events:org_code({}),body({})", orgcode, request);
		if (StringUtils.isBlank(request) || StringUtils.isBlank(orgcode)) {
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, "消息体或者org_code不允许为空!");
		}
		try {
			Org org = orgMapper.selectByCode(orgcode);
			if (org == null) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "org_code(" + orgcode + ")不存在！");
			}
			JSONObject dataJson = new JSONObject(request);
			JSONArray uuidArr = dataJson.getJSONArray("uuids");
			for (int i = 0; i < uuidArr.length(); i++) {
				Event qEvent = this.eventMapper.selectByUuid(uuidArr.getString(i), org.getOrgid());
				if (qEvent != null) {
					this.eventMapper.deleteByPrimaryKey(qEvent.getEventid());
					this.eventpersonMapper.deleteByEventid(qEvent.getEventid());
				}
			}
			return this.handleResult(ApiRetCodeEnum.SUCCESS, " ");
		} catch (Exception e) {
			logger.error("AttendanceService delete_events exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}
}
