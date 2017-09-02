package com.broadvideo.pixsignage.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.time.DateUtils;
import org.apache.ibatis.session.RowBounds;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.AttendanceschemeType;
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.ObjectType;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Attendance;
import com.broadvideo.pixsignage.domain.Attendanceevent;
import com.broadvideo.pixsignage.domain.Attendancescheme;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Periodtimedtl;
import com.broadvideo.pixsignage.persistence.AttendanceMapper;
import com.broadvideo.pixsignage.persistence.AttendanceeventMapper;
import com.broadvideo.pixsignage.persistence.AttendanceschemeMapper;
import com.broadvideo.pixsignage.util.DateUtil;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
@Transactional(rollbackFor = Exception.class)
public class AttendanceServiceImpl implements AttendanceService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private AttendanceMapper attendanceMapper;
	@Autowired
	private AttendanceschemeMapper attendanceschemeMapper;
	@Autowired
	private CourseScheduleSchemeService coursescheduleschemeService;
	@Autowired
	private CourseScheduleService coursescheduleService;
	@Autowired
	private ClassroomService classroomService;
	@Autowired
	private AttendanceeventMapper attendanceeventMapper;

	@Override
	public Integer addAttendancescheme(Attendancescheme attendancescheme) {

		attendancescheme.setCreatetime(new Date());
		attendancescheme.setEnableflag(GlobalFlag.NO);
		String timeconfig = attendancescheme.getTimeconfig();
		if ("1".equals(attendancescheme.getType())) {
			attendancescheme.setAmount(-1);
		} else {
			JSONArray times = new JSONArray(timeconfig);
			attendancescheme.setAmount(times.length());
		}
		this.attendanceschemeMapper.insertSelective(attendancescheme);

		return attendancescheme.getAttendanceschemeid();
	}

	@Override
	public PageResult getAttendanceschemes(String search, PageInfo page, Integer orgid) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Attendancescheme> dataList = attendanceschemeMapper.selectAttendanceschemes(search, orgid, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public void updateAttendancescheme(Attendancescheme attendancescheme) {
		Attendancescheme qAttendancescheme = this.attendanceschemeMapper.selectByPrimaryKey(attendancescheme
				.getAttendanceschemeid());
		Attendancescheme  updateRecord=new Attendancescheme();
		updateRecord.setAttendanceschemeid(attendancescheme.getAttendanceschemeid());
		updateRecord.setName(attendancescheme.getName());
		if (AttendanceschemeType.BY_DAY.equals(qAttendancescheme.getType())) {
			JSONArray times = new JSONArray(attendancescheme.getTimeconfig());
			updateRecord.setAmount(times.length());
		} else if (AttendanceschemeType.BY_COURSESCHEDULE.equals(attendancescheme.getType())) {
			updateRecord.setAmount(-1);
		}
		updateRecord.setOrgid(attendancescheme.getOrgid());
		updateRecord.setTimeconfig(attendancescheme.getTimeconfig());
		this.attendanceschemeMapper.updateByPrimaryKeySelective(updateRecord);
		
		
	}

	@Override
	public void deleteAttendancescheme(Integer attendanceschemeid, Integer orgid) {

		this.attendanceschemeMapper.deleteAttendancescheme(attendanceschemeid, orgid);

	}

	@Override
	public void updateEnableflag(Integer attendanceschemeid, String enableflag, Integer orgid) {

		if (GlobalFlag.YES.equals(enableflag)) {
			logger.info("enable attendancescheme(id={}) and disable other records.", attendanceschemeid);
			this.attendanceschemeMapper.updateEnableflag(GlobalFlag.NO, orgid);
		}
		Attendancescheme scheme = new Attendancescheme();
		scheme.setAttendanceschemeid(attendanceschemeid);
		scheme.setEnableflag(enableflag);
		scheme.setOrgid(orgid);
		this.attendanceschemeMapper.updateByPrimaryKeySelective(scheme);


	}

	@Override
	public Attendancescheme getEnableAttendancescheme(Integer orgid) {

		return this.attendanceschemeMapper.getEnableAttendancescheme(orgid);
	}

	@Override
	public void genAttendanceevents(Integer attendanceschemeid, Integer afterDays) {


		Attendancescheme attendancescheme = this.attendanceschemeMapper.selectByPrimaryKey(attendanceschemeid);
		String timeconfig = attendancescheme.getTimeconfig();

		JSONArray jsonArr = new JSONArray(timeconfig);
		Date afterDate = DateUtils.addDays(new Date(), afterDays);
		String strDate = DateUtil.getDateStr(afterDate, "yyyy-MM-dd");
		String yyyyMMdd = DateUtil.getDateStr(afterDate, "yyyyMMdd");
		if (this.isInitAttendanceevents(attendanceschemeid, yyyyMMdd)) {
			logger.info("attendacneschemeid:{},name:{} events had inited on ({})", attendanceschemeid,
					attendancescheme.getName(), yyyyMMdd);
			return;

		}
		// 清除原有的考勤记录
		this.attendanceeventMapper.deleteAttendanceevents(attendanceschemeid, yyyyMMdd);
		if (AttendanceschemeType.BY_DAY.equals(attendancescheme.getType())) {
			for (int i = 0; i < jsonArr.length(); i++) {
				JSONObject timeconfigJson = jsonArr.getJSONObject(i);
				String shortstarttime = timeconfigJson.getString("shortstarttime");
				String shortendtime = timeconfigJson.getString("shortendtime");
				String eventname = timeconfigJson.getString("eventname");
				Date starttime = DateUtil.getDate(strDate + " " + shortstarttime, "yyyy-MM-dd HH:mm");
				Date endtime = DateUtil.getDate(strDate + " " + shortendtime, "yyyy-MM-dd HH:mm");
				// 添加事件
				Attendanceevent attendanceevent = new Attendanceevent();
				attendanceevent.setAttendanceschemeid(attendanceschemeid);
				attendanceevent.setType(AttendanceschemeType.BY_DAY);
				attendanceevent.setName(eventname);
				attendanceevent.setStarttime(starttime);
				attendanceevent.setEndtime(endtime);
				attendanceevent.setOrgid(attendancescheme.getOrgid());
				attendanceevent.setOndate(yyyyMMdd);
				attendanceevent.setCreatetime(new Date());
				this.attendanceeventMapper.insertSelective(attendanceevent);

			}
		} else if (AttendanceschemeType.BY_COURSESCHEDULE.equals(attendancescheme.getType())) {

			int workday = DateUtil.getWorkday(afterDate);
			int orgid=attendancescheme.getOrgid();
			Courseschedulescheme scheme = coursescheduleschemeService.getEnableScheme(orgid);
            List<Classroom> classrooms= this.classroomService.getClassrooms(orgid);
			JSONObject timeconfigJson = jsonArr.getJSONObject(0);
			int beforeMin = timeconfigJson.getInt("beforeminstart");
			int afterMin = timeconfigJson.getInt("afterminend");
			for (Classroom classroom : classrooms) {
				List<Courseschedule> courseschedules = coursescheduleService.getClassroomCourseSchedules(
						classroom.getClassroomid(), workday,
						scheme.getCoursescheduleschemeid(),
						orgid);
				for (Courseschedule courseschedule : courseschedules) {
					Periodtimedtl periodtimedtl = courseschedule.getPeriodtimedtl();
					String shortstarttime = periodtimedtl.getShortstarttime();
					// String shortendtime = periodtimedtl.getShortendtime();
					Date starttime = DateUtil.getDate(strDate + " " + shortstarttime, "yyyy-MM-dd HH:mm");
					// Date endtime = DateUtil.getDate(strDate + " " +
					// shortendtime, "yyyy-MM-dd HH:mm");
					Date eventstarttime = DateUtil.add(starttime, Calendar.MINUTE, -1 * beforeMin);
					Date eventendtime = DateUtil.add(starttime, Calendar.MINUTE, afterMin);
					// 添加事件
					Attendanceevent attendanceevent = new Attendanceevent();
					attendanceevent.setType(AttendanceschemeType.BY_COURSESCHEDULE);
					attendanceevent.setAttendanceschemeid(attendanceschemeid);
					attendanceevent.setName(courseschedule.getCoursename());
					attendanceevent.setStarttime(eventstarttime);
					attendanceevent.setEndtime(eventendtime);
					attendanceevent.setObjectid(courseschedule.getCoursescheduleid());
					attendanceevent.setObjecttype(ObjectType.COURSE_SCHEDULE);
					attendanceevent.setOrgid(classroom.getOrgid());
					attendanceevent.setClassroomid(classroom.getClassroomid());
					attendanceevent.setOndate(yyyyMMdd);
					attendanceevent.setCreatetime(new Date());
					this.attendanceeventMapper.insertSelective(attendanceevent);

				}


			}
		}


	}

	@Override
	public List<Attendanceevent> getAttendanceevents(Integer classroomid, String yyyyMMdd, Integer orgid) {
		Attendancescheme attendancescheme = this.getEnableAttendancescheme(orgid);
		if (attendancescheme == null) {
			logger.error("orgid:{} without attendance scheme.", orgid);
			throw new ServiceException(RetCodeEnum.EXCEPTION, "No enable scheme.");
		}
		Integer attendanceschemeid = attendancescheme.getAttendanceschemeid();
		List<Attendanceevent> attendanceevents = this.attendanceeventMapper.selectAttendanceeventsBy(
				attendanceschemeid, classroomid, yyyyMMdd, orgid);
		return attendanceevents;
	}

	@Override
	public List<Attendancescheme> getAllEnableAttendanceschemes() {

		return this.attendanceschemeMapper.selectAllEnableAttendanceschemes();
	}

	@Override
	public boolean isInitAttendanceevents(Integer attendanceschemeid, String yyyyMMdd) {
		return this.attendanceeventMapper.countRecordsBy(attendanceschemeid, yyyyMMdd) > 0;

	}


	@Override
	public Attendanceevent getAttendanceevent(Integer attendanceeventid, Integer orgid) {

		return this.attendanceeventMapper.selectByPrimaryKey(attendanceeventid, orgid);
	}

	@Override
	public List<Attendance> getAttendancesByEventid(Integer attendanceeventid, Integer classroomid, Integer orgid) {

		return this.attendanceMapper.selectAttendances(attendanceeventid, classroomid, orgid);
	}


}
