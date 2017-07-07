package com.broadvideo.pixsignage.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.persistence.CoursescheduleMapper;
import com.broadvideo.pixsignage.util.DateUtil;

@Service
@Transactional(rollbackFor = Exception.class)
public class CourseScheduleServiceImpl implements CourseScheduleService {

	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClassroomService classroomService;
	@Autowired
	private CoursescheduleMapper courseScheduleMapper;

	@Override
	public Integer addCourseSchedule(Courseschedule schedule) {

		// 检查schedule中，classroomId+periodTimeDtlId（第几节） +
		// workday（工作日）+orgId（单位）是否已经占用，占用了则拒绝新增操作
		if (hasRecordExists(schedule.getClassroomid(), schedule.getPeriodtimedtlid(), schedule.getWorkday(),
				schedule.getOrgid())) {
			logger.error("schedule(classroomId:{},periodTimeDtlId:{},workday:{}) has exist.",
					new Object[] { schedule.getClassroomid(), schedule.getClassroomid(), schedule.getWorkday() });
			throw new ServiceException("Record exist!");
		}
		Courseschedule newSchedule = newCourseSchedule(schedule);
		courseScheduleMapper.insertSelective(newSchedule);
		return newSchedule.getCoursescheduleid();
	}

	@Override
	public void updateCourseSchedule(Courseschedule schedule) {

		Courseschedule schedulePo = getCourseSchedule(schedule.getCoursescheduleid(), schedule.getOrgid());
		if (schedulePo == null) {
			throw new ServiceException("Not found record.");
		}
		Courseschedule uSchedule = new Courseschedule();
		uSchedule.setCoursescheduleid(schedule.getCoursescheduleid());
		uSchedule.setCoursename(schedule.getCoursename());
		uSchedule.setTeachername(schedule.getTeachername());
		uSchedule.setUpdatepsnid(schedule.getUpdatepsnid());
		uSchedule.setUpdatetime(new Date());
		courseScheduleMapper.updateByPrimaryKeySelective(uSchedule);

	}

	private Courseschedule newCourseSchedule(Courseschedule scheduleDto) {
		Courseschedule newSchedule = new Courseschedule();
		newSchedule.setClassroomid(scheduleDto.getClassroomid());
		Integer orgId = scheduleDto.getOrgid();
		Classroom classroom = classroomService.loadClassroom(scheduleDto.getClassroomid(), orgId);
		newSchedule.setClassroomname(classroom.getName());
		newSchedule.setPeriodtimedtlid(scheduleDto.getPeriodtimedtlid());
		newSchedule.setWorkday(scheduleDto.getWorkday());
		newSchedule.setCoursescheduleschemeid(scheduleDto.getCoursescheduleschemeid());
		newSchedule.setCoursename(scheduleDto.getCoursename());
		newSchedule.setTeachername(scheduleDto.getTeachername());
		newSchedule.setCreatepsnid(scheduleDto.getCreatepsnid());
		newSchedule.setOrgid(orgId);
		newSchedule.setCreatetime(new Date());
		return newSchedule;

	}

	public boolean hasRecordExists(Integer classroomId, Integer periodTimeDtlId, Integer workday, Integer orgId) {

		return courseScheduleMapper.countBy(classroomId, periodTimeDtlId, workday, orgId) > 0;

	}

	@Override
	public Courseschedule getCourseSchedule(Integer id, Integer orgId) {

		return this.courseScheduleMapper.selectCourseschedule(id, orgId);
		}

	@Override
	public List<Courseschedule> getClassroomCourseSchedules(Integer classroomId, Integer courseScheduleSchemeId,
			Integer orgId) {

		return this.courseScheduleMapper.selectClassroomCourseschedules(classroomId, courseScheduleSchemeId, orgId);
	}

	@Override
	public void deleteCourseSchedule(Integer id, Integer optPsnId, Integer orgId) {

		this.courseScheduleMapper.deleteCourseschedule(optPsnId, orgId);


	}

	@Override
	public void deleteCourseSchedules(List<Integer> ids, Integer optPsnId, Integer orgId) {

		this.courseScheduleMapper.batchDeleteCourseschedules(ids, orgId);

	}

	@Override
	public void deleteCourseSchedulesByClassroomId(List<Integer> classroomIds, Integer optPsnId, Integer orgId) {

		this.courseScheduleMapper.deleteClassroomCourseschedules(classroomIds, orgId);

	}

	@Override
	public Courseschedule getCurCourseSchedule(Integer schemeId, Integer classroomId, Date classTime, Integer orgId) {


		String shorttime = DateUtil.getDateStr(classTime, "HH:mm");
		return this.courseScheduleMapper.selectCurCourseschedule(schemeId, classroomId, getWorkday(classTime),
				shorttime, orgId);
	}

	private static int getWorkday(Date date) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int workday = calendar.get(Calendar.DAY_OF_WEEK);
		if (workday == 1) {
			workday = 7;
		} else {
			workday = workday - 1;
		}

		return workday;

	}


}
