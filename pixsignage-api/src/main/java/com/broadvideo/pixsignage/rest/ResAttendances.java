package com.broadvideo.pixsignage.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

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
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.domain.Room;
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

	/**
	 * 考勤明细列表
	 * 
	 * @param request
	 * @param req
	 * @param eventid
	 * @param terminalid
	 * @param roomid
	 * @param orgid
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	@GET
	@Path("/")
	public String getAttendanceList(String request, @Context HttpServletRequest req,
			@QueryParam("event_id") Integer eventid, @QueryParam("org_id") Integer orgid,
			@QueryParam("start_date") String startDate, @QueryParam("end_date") String endDate,
			@QueryParam("person_id") Integer personid) {

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
			searchObj.setPersonid(personid);
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

	@GET
	@Path("/attendances_summary")
	public String getAttendancesSummary(String request, @Context HttpServletRequest req,
			@QueryParam("event_id") Integer eventid, @QueryParam("start_date") String startDate,
			@QueryParam("end_date") String endDate, @QueryParam("person_id") Integer personid) {

		logger.info("getAttendancesSummary for querystr:{}", req.getQueryString());
		if (eventid == null) {
			logger.error("eventid is null");
			return handleResult(ApiRetCodeEnum.EXCEPTION, "event_id不允许为空");
		}
		try {
			if (StringUtils.isBlank(startDate)) {
				startDate = DateUtil.getDateStr(new Date(), "yyyyMMdd");
				logger.info("param:start_date is null,assigned with cur date:{}", startDate);
			}
			if (StringUtils.isBlank(endDate)) {
				endDate = DateUtil.getDateStr(new Date(), "yyyyMMdd");
				logger.info("param:end_date is null,assigned with cur date:{}", endDate);
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
			Event event = this.eventMapper.selectByPrimaryKey(eventid);
			Room bindRoom = this.roomMapper.selectByPrimaryKey(event.getRoomid());
			Attendancelog searchObj = new Attendancelog();
			searchObj.setEventid(eventid);
			searchObj.setStarttime(wrapStartDate);
			searchObj.setEndtime(wrapEndDate);
			searchObj.setOrgid(event.getOrgid());
			searchObj.setPersonid(personid);
			List<Attendancelog> attendancelogs = this.attendancelogMapper.selectList(searchObj);
			// 按天关联考勤明细
			Map<String, List<Attendancelog>> dataMap = mapByDate(attendancelogs);
			for (String key : dataMap.keySet()) {
				List<Attendancelog> values = dataMap.get(key);
				// 当天同一人记录合并为一条记录
				dataMap.put(key, reduceByPerson(values));
			}
			// 计算人员考勤状态
			List<JSONObject> summaryList = new ArrayList<JSONObject>();
			// 考勤总人数
			int total = this.personMapper.selectCount(event.getOrgid() + "", null, null,
					roomPersonMap.get(bindRoom.getType()));

			Date beginDate = wrapStartDate;
			while (beginDate.getTime() < wrapEndDate.getTime()) {
				// TODO: 先关闭周末不做考勤统计的部分
				/**
				 * if (isWeekend(beginDate)) { logger.info("Ingore weekend:{}",
				 * beginDate); Calendar calendar = Calendar.getInstance();
				 * calendar.setTime(beginDate);
				 * calendar.add(Calendar.DAY_OF_MONTH, 1); beginDate =
				 * calendar.getTime(); continue; }
				 **/
				int normals = 0;
				// 漏打卡
				int leaks = 0;
				// 旷工
				int absents = 0;
				// 迟到
				int lates = 0;
				// 早退
				int earlyLeaves = 0;
				JSONObject jsonObject = new JSONObject();
				String key = DateUtil.getDateStr(beginDate, "yyyy-MM-dd");
				jsonObject.put("date", key);
				List<Attendancelog> values = new ArrayList<Attendancelog>();
				if (dataMap.containsKey(key)) {
					values = dataMap.get(key);
				}
				for (Attendancelog attendancelog : values) {
					List<Date> signtimes = attendancelog.getSigntimes();
					if (signtimes == null || signtimes.size() == 0) {
						logger.error("signtimes is empty");
						continue;
					}
					if (isLeak(event, attendancelog.getSigntimes())) {
						logger.info("Leak:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						leaks++;
					}

					if (isLate(event, signtimes)) {
						logger.info("Late:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						lates++;
					}
					if (isEarlyLeave(event, signtimes)) {
						logger.info("EarlyLeave:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						earlyLeaves++;
					}
					if (isNormal(event, signtimes)) {
						logger.info("Normal:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						normals++;
					}

				}
				absents = total - values.size();
				logger.info("####Summary info(total：{}，normals:{},leaks:{},lates:{},earlyleaves:{},absents:{})",
						new Object[] { total, normals, leaks, lates, earlyLeaves, absents });
				jsonObject.put("total", total);
				jsonObject.put("normals", normals);
				jsonObject.put("lates", lates);
				jsonObject.put("early_leaves", earlyLeaves);
				jsonObject.put("leaks", leaks);
				jsonObject.put("absents", absents);
				summaryList.add(jsonObject);

				Calendar calendar = Calendar.getInstance();
				calendar.setTime(beginDate);
				calendar.add(Calendar.DAY_OF_MONTH, 1);
				beginDate = calendar.getTime();
			}
			Collections.sort(summaryList, new Comparator<JSONObject>() {
				@Override
				public int compare(JSONObject o1, JSONObject o2) {
					Date d1 = DateUtil.getDate(o1.getString("date"), "yyyy-MM-dd");
					Date d2 = DateUtil.getDate(o2.getString("date"), "yyyy-MM-dd");
					if (d1.getTime() < d2.getTime()) {
						return -1;
					}
					if (d1.getTime() > d2.getTime()) {
						return 1;
					}

					return 0;
				}

			});

			return this.handleResult(ApiRetCodeEnum.SUCCESS, "", summaryList);

		} catch (Exception ex) {
			logger.error("getAttendances exceptoin:", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());
		}
	}

	@GET
	@Path("/person_attendances_summary")
	public String getPersonAttendancesSummary(String request, @Context HttpServletRequest req,
			@QueryParam("event_id") Integer eventid, @QueryParam("start_date") String startDate,
			@QueryParam("end_date") String endDate, @QueryParam("person_id") Integer personid) {

		logger.info("getPersonAttendancesSummary for querystr:{}", req.getQueryString());
		if (eventid == null) {
			logger.error("eventid is null");
			return handleResult(ApiRetCodeEnum.EXCEPTION, "event_id不允许为空");
		}
		try {
			if (StringUtils.isBlank(startDate)) {
				startDate = DateUtil.getDateStr(new Date(), "yyyyMMdd");
				logger.info("param:start_date is null,assigned with cur date:{}", startDate);
			}
			if (StringUtils.isBlank(endDate)) {
				endDate = DateUtil.getDateStr(new Date(), "yyyyMMdd");
				logger.info("param:end_date is null,assigned with cur date:{}", endDate);
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
			Event event = this.eventMapper.selectByPrimaryKey(eventid);
			Room bindRoom = this.roomMapper.selectByPrimaryKey(event.getRoomid());
			Attendancelog searchObj = new Attendancelog();
			searchObj.setEventid(eventid);
			searchObj.setStarttime(wrapStartDate);
			searchObj.setEndtime(wrapEndDate);
			searchObj.setOrgid(event.getOrgid());
			searchObj.setPersonid(personid);
			List<Attendancelog> attendancelogs = this.attendancelogMapper.selectList(searchObj);
			// 按天关联考勤明细
			Map<String, List<Attendancelog>> dataMap = mapByDate(attendancelogs);
			JSONObject jsonObject = new JSONObject();
			for (String key : dataMap.keySet()) {
				List<Attendancelog> values = dataMap.get(key);
				// 当天同一人记录合并为一条记录
				dataMap.put(key, reduceByPerson(values));
			}
			// 计算人员考勤状态
			int normals = 0;
			// 漏打卡
			int leaks = 0;
			// 旷工
			int absents = 0;
			// 迟到
			int lates = 0;
			// 早退
			int earlyLeaves = 0;
			Date beginDate = wrapStartDate;
			while (beginDate.getTime() < wrapEndDate.getTime()) {
				if (isWeekend(beginDate)) {
					logger.info("Ingore weekend:{}", beginDate);
					Calendar calendar = Calendar.getInstance();
					calendar.setTime(beginDate);
					calendar.add(Calendar.DAY_OF_MONTH, 1);
					beginDate = calendar.getTime();
					continue;
				}
				String dateKey = DateUtil.getDateStr(beginDate, "yyyy-MM-dd");
				List<Attendancelog> values = new ArrayList<Attendancelog>();
				if (dataMap.containsKey(dateKey)) {
					values = dataMap.get(dateKey);
				} else {
					absents++;
				}
				for (Attendancelog attendancelog : values) {
					List<Date> signtimes = attendancelog.getSigntimes();
					if (signtimes == null || signtimes.size() == 0) {
						logger.error("signtimes is empty");
						continue;
					}
					if (isLeak(event, attendancelog.getSigntimes())) {
						logger.info("Leak:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						leaks++;
					}
					if (isLate(event, signtimes)) {
						logger.info("Late:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						lates++;
					}
					if (isEarlyLeave(event, signtimes)) {
						logger.info("EarlyLeave:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						earlyLeaves++;
					}
					if (isNormal(event, signtimes)) {
						logger.info("Normal:person(id:{},name:{}) ", attendancelog.getPersonid(),
								attendancelog.getPersonname());
						normals++;
					}

				}
				logger.info("####Summary info(normals:{},leaks:{},lates:{},earlyleaves:{},absents:{})", new Object[] {
						normals, leaks, lates, earlyLeaves, absents });
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(beginDate);
				calendar.add(Calendar.DAY_OF_MONTH, 1);
				beginDate = calendar.getTime();
			}
			jsonObject.put("normal_times", normals);
			jsonObject.put("late_times", lates);
			jsonObject.put("early_leave_times", earlyLeaves);
			jsonObject.put("leak_times", leaks);
			jsonObject.put("absent_times", absents);
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "", jsonObject);

		} catch (Exception ex) {
			logger.error("getPersonAttendancesSummary exceptoin:", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());
		}
	}

	@GET
	@Path("/attendance_dtls")
	public String getAttendanceDtls(String request, @Context HttpServletRequest req,
			@QueryParam("event_id") Integer eventid, @QueryParam("start_date") String startDate,
			@QueryParam("end_date") String endDate, @QueryParam("state") String state,
			@QueryParam("person_id") Integer personid) {

		logger.info("getAttendances for querystr:{}", req.getQueryString());
		if (eventid == null) {
			logger.error("eventid is null");
			return handleResult(ApiRetCodeEnum.EXCEPTION, "event_id不允许为空");
		}
		try {
			if (StringUtils.isBlank(startDate)) {
				startDate = DateUtil.getDateStr(new Date(), "yyyyMMdd");
				logger.info("param:start_date is null,assigned with cur date:{}", startDate);
			}
			if (StringUtils.isBlank(endDate)) {
				endDate = DateUtil.getDateStr(new Date(), "yyyyMMdd");
				logger.info("param:end_date is null,assigned with cur date:{}", endDate);
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
			Event event = this.eventMapper.selectByPrimaryKey(eventid);
			Room bindRoom = this.roomMapper.selectByPrimaryKey(event.getRoomid());
			Attendancelog searchObj = new Attendancelog();
			searchObj.setEventid(eventid);
			searchObj.setStarttime(wrapStartDate);
			searchObj.setEndtime(wrapEndDate);
			searchObj.setOrgid(event.getOrgid());
			searchObj.setPersonid(personid);
			List<Attendancelog> attendancelogs = this.attendancelogMapper.selectList(searchObj);
			// 按天关联考勤明细
			Map<String, List<Attendancelog>> dataMap = mapByDate(attendancelogs);
			for (String key : dataMap.keySet()) {
				List<Attendancelog> values = dataMap.get(key);
				dataMap.put(key, reduceByPerson(values));
			}
			Config config = configMapper.selectByCode("ServerIP");
			List<JSONObject> returnList = new ArrayList<JSONObject>();
			for (String key : dataMap.keySet()) {
				List<Attendancelog> values = dataMap.get(key);
				for (Attendancelog attendancelog : values) {
					if ("0".equals(state) && !isNormal(event, attendancelog.getSigntimes())) {// 考勤正常
						continue;
					} else if ("1".equals(state) && !isLate(event, attendancelog.getSigntimes())) {// 迟到
						continue;
					} else if ("2".equals(state) && !isEarlyLeave(event, attendancelog.getSigntimes())) {// 早退
						continue;
					} else if ("3".equals(state) && !isLeak(event, attendancelog.getSigntimes())) {// 缺卡
						continue;
					}
					Collections.sort(attendancelog.getSigntimes());
					if ("4".equals(state) && !"4".equals(getState(event, attendancelog.getSigntimes()))) {
						continue;
					}
					JSONObject dataJson = new JSONObject();
					dataJson.put("date", key);
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
					List<String> dateStrList = new ArrayList<String>();
					for (Date signtime : attendancelog.getSigntimes()) {
						dateStrList.add(DateUtil.getDateStr(signtime, "yyyy-MM-dd HH:mm"));
					}

					dataJson.put("sign_times", dateStrList);
					String userState = state;
					if (StringUtils.isBlank(userState)) {
						userState = getState(event, attendancelog.getSigntimes());
					}
					dataJson.put("state", userState);
					returnList.add(dataJson);
				}
			}
			// 补充旷工记录
			if (StringUtils.isBlank(state) || "4".equals(state)) {// 旷工
				// 统计已经存在的考勤记录
				HashMap<String, HashSet<Integer>> datePersonIdsMap = new HashMap<String, HashSet<Integer>>();
				for (Attendancelog attendancelog : attendancelogs) {
					String dateStr = DateUtil.getDateStr(attendancelog.getSigntime(), "yyyy-MM-dd");
					if (datePersonIdsMap.containsKey(dateStr)) {
						datePersonIdsMap.get(dateStr).add(attendancelog.getPersonid());
					} else {
						HashSet<Integer> personIdSet = new HashSet<Integer>();
						personIdSet.add(attendancelog.getPersonid());
						datePersonIdsMap.put(dateStr, personIdSet);
					}
				}
				List<Person> persons = new ArrayList<Person>();
				if (personid != null) {
					persons.add(this.personMapper.selectByPrimaryKey(personid));
				} else {
					persons = this.personMapper.selectList(event.getOrgid() + "", null, null, bindRoom.getType(), "0",
							Integer.MAX_VALUE + "");

				}
				Date beginDate = wrapStartDate;
				while (beginDate.getTime() < wrapEndDate.getTime()) {
					if (isWeekend(beginDate)) {
						logger.info("Ingore weekend:{}", beginDate);
						Calendar calendar = Calendar.getInstance();
						calendar.setTime(beginDate);
						calendar.add(Calendar.DAY_OF_MONTH, 1);
						beginDate = calendar.getTime();
						continue;
					}
					String dateKey = DateUtil.getDateStr(beginDate, "yyyy-MM-dd");
					HashSet<Integer> personIdSet = datePersonIdsMap.get(dateKey);
					for (Person person : persons) {
						if (personIdSet != null && personIdSet.contains(person.getPersonid())) {
							continue;
						}
						JSONObject dataJson = new JSONObject();
						dataJson.put("date", dateKey);
						dataJson.put("event_id", event.getEventid());
						dataJson.put("event_name", event.getName());
						dataJson.put("terminal_id", "");
						dataJson.put("terminal_name", "");
						dataJson.put("room_id", -1);
						dataJson.put("room_name", "");
						dataJson.put("person_id", person.getPersonid());
						dataJson.put("person_name", person.getName());
						dataJson.put("avatar", getImageUrl(config.getValue(), person.getAvatar()));
						dataJson.put("sign_type", "");
						List<String> dateStrList = new ArrayList<String>();
						dataJson.put("sign_times", dateStrList);
						dataJson.put("state", "4");
						returnList.add(dataJson);
					}
					Calendar calendar = Calendar.getInstance();
					calendar.setTime(beginDate);
					calendar.add(Calendar.DAY_OF_MONTH, 1);
					beginDate = calendar.getTime();
				}

			}

			Collections.sort(returnList, new Comparator<JSONObject>() {
				@Override
				public int compare(JSONObject o1, JSONObject o2) {
					Date d1 = DateUtil.getDate(o1.getString("date"), "yyyy-MM-dd");
					Date d2 = DateUtil.getDate(o2.getString("date"), "yyyy-MM-dd");
					if (d1.getTime() < d2.getTime()) {
						return -1;
					}
					if (d1.getTime() > d2.getTime()) {
						return 1;
					}
					return 0;
				}
			});
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "", returnList);

		} catch (Exception ex) {
			logger.error("getAttendances exceptoin:", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());
		}
	}

	private String getState(Event event, List<Date> signtimes) {

		if (isLeak(event, signtimes)) {

			return "3";
		} else if (isLate(event, signtimes)) {

			return "1";
		} else if (isEarlyLeave(event, signtimes)) {

			return "2";
		} else if (isNormal(event, signtimes)) {

			return "0";
		} else {
			return "4";
		}

	}

	// 缺卡
	private boolean isLeak(Event event, List<Date> signtimes) {

		if (signtimes.size() == 1) {
			Date signtime = signtimes.get(0);
			Date endTime = getConvertDate(event.getEndtime(), signtime);
			if (endTime.getTime() <= System.currentTimeMillis()) {
				return true;
			}

		}
		return false;

	}

	// 是否正常考勤
	private boolean isNormal(Event event, List<Date> signtimes) {
		Date startTime = event.getStarttime();
		Date endTime = event.getEndtime();
		Collections.sort(signtimes);
		startTime = getConvertDate(startTime, signtimes.get(0));
		endTime = getConvertDate(endTime, signtimes.get(signtimes.size() - 1));
		if (endTime.getTime() <= System.currentTimeMillis()) { // 已经结束的事件签到
			if (signtimes.size() < 2) {
				return false;
			}
			if (signtimes.get(0).getTime() <= startTime.getTime()
					&& signtimes.get(signtimes.size() - 1).getTime() >= endTime.getTime()) {
				return true;
			}
		} else {// 未结束时间
			if (signtimes.get(0).getTime() <= startTime.getTime()) {
				return true;
			}
		}

		return false;
	}

	// 是否迟到
	private boolean isLate(Event event, List<Date> signtimes) {
		Date startTime = event.getStarttime();
		Collections.sort(signtimes);
		startTime = getConvertDate(startTime, signtimes.get(0));
		if (signtimes.get(0).getTime() > startTime.getTime()) {
			return true;
		}
		return false;
	}

	// 是否早退
	private boolean isEarlyLeave(Event event, List<Date> signtimes) {
		if (signtimes.size() < 2) {
			return false;
		}
		Date endTime = event.getEndtime();
		Collections.sort(signtimes);
		endTime = getConvertDate(endTime, signtimes.get(signtimes.size() - 1));
		if (System.currentTimeMillis() < endTime.getTime()) {// 考勤时间还没结束
			return false;
		}
		if (signtimes.get(signtimes.size() - 1).getTime() < endTime.getTime()) {

			return true;
		}
		return false;
	}

	private static Date getConvertDate(Date time, Date date) {

		String yyyyMMdd = DateUtil.getDateStr(date, "yyyy-MM-dd");
		String HHmmss = DateUtil.getDateStr(time, "HH:mm:ss");
		String formatStr = yyyyMMdd + " " + HHmmss;
		System.out.println("formatStr:" + formatStr);
		return DateUtil.getDate(formatStr, "yyyy-MM-dd HH:mm:ss");

	}

	private List<Attendancelog> reduceByPerson(List<Attendancelog> values) {
		Map<Integer, Attendancelog> refMap = new HashMap<Integer, Attendancelog>();
		List<Attendancelog> newAttendancelogs = new ArrayList<Attendancelog>();
		for (Attendancelog value : values) {
			Integer personid = value.getPersonid();
			if (refMap.containsKey(personid)) {
				refMap.get(personid).getSigntimes().add(value.getSigntime());
			} else {
				refMap.put(personid, value);
				value.getSigntimes().add(value.getSigntime());
				newAttendancelogs.add(value);
			}

		}
		refMap = null;
		return newAttendancelogs;
	}

	private Map<String, List<Attendancelog>> mapByDate(List<Attendancelog> attendancelogs) {

		Map<String, List<Attendancelog>> dataMap = new HashMap<String, List<Attendancelog>>();
		for (Attendancelog attendancelog : attendancelogs) {
			Date signtime = attendancelog.getSigntime();
			String dayKeyStr = DateUtil.getDateStr(signtime, "yyyy-MM-dd");
			if (dataMap.containsKey(dayKeyStr)) {
				dataMap.get(dayKeyStr).add(attendancelog);
			} else {
				List<Attendancelog> values = new ArrayList<Attendancelog>();
				values.add(attendancelog);
				dataMap.put(dayKeyStr, values);
			}
		}

		return dataMap;
	}

	private static boolean isWeekend(Date selDate) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(selDate);
		int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
		return dayOfWeek == 1 || dayOfWeek == 7;

	}

	public static void main(String[] args) {

		Calendar calendar = Calendar.getInstance();
		calendar.set(2018, 0, 21);
		Date date = calendar.getTime();
		calendar.set(2019, 1, 10, 16, 12, 21);
		Date time = calendar.getTime();

		Calendar calendar2 = Calendar.getInstance();
		calendar2.set(2018, 0, 21, 16, 12, 21);
		calendar2.set(Calendar.MILLISECOND, 0);
		Date resultDate = calendar2.getTime();
		System.out
				.println("convert date:" + DateUtil.getDateStr(getConvertDate(time, date), "yyyy-MM-dd HH:mm:ss SSS"));

	}

}
