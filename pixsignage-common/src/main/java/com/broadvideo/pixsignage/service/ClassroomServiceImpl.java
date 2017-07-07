package com.broadvideo.pixsignage.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.persistence.ClassroomMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

/**
 * 
 * @author charles
 *
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ClassroomServiceImpl implements ClassroomService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClassroomMapper classroomMapper;
	@Autowired
	private OrgService orgService;
	@Autowired
	private CourseScheduleSchemeService schemeService;
	@Autowired
	private CourseScheduleService scheduleService;

	@Override
	public PageResult getClassrooms(String search, PageInfo page, Integer orgid) {

		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Classroom> dataList = classroomMapper.selectClassrooms(search, orgid, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount=pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount,dataList,page);
			
	}

	@Override
	public Integer addClassroom(Classroom classroom) {

		String name = classroom.getName();
		String description = classroom.getDescription();
		Integer orgId = classroom.getOrgid();
		if (hasNameExists(null, name, orgId)) {
			logger.error("classroom.name={} is exists.", name);
			throw new ServiceException(String.format("classroom name:%s is exists.", name));
		}
		Classroom nclassroom = new Classroom();
		nclassroom.setName(name);
		nclassroom.setSeqno(0);
		nclassroom.setDescription(description);
		nclassroom.setOrgid(orgId);
		nclassroom.setDescription(description);
		nclassroom.setUuid(UUIDUtils.generateUUID());
		nclassroom.setCreatetime(new Date());
		nclassroom.setCreatepsnid(classroom.getCreatepsnid());
		this.classroomMapper.insertSelective(nclassroom);
		return classroom.getClassroomid();
	}

	private boolean hasNameExists(Integer excludeId, String name, Integer orgId) {

		return classroomMapper.countBy(name, excludeId, orgId) > 0;

	}

	@Override
	public void deleteClassroom(List<Integer> idList, Integer optPsnId, Integer orgId) {

		logger.info("Delete classrooms(id={}),optPsnId={},orgId={}", new Object[] { idList, optPsnId,
				orgId });

		classroomMapper.batchDeleteClassrooms(idList, orgId);
		logger.info("Delete clasrooms(idList=%s) attach schedules.", idList);
		this.scheduleService.deleteCourseSchedulesByClassroomId(idList, optPsnId, orgId);



		
		
	}

	@Override
	public void updateClassroom(Classroom classroom) {

		String classroomName = classroom.getName();
		String description = classroom.getDescription();
		int id = classroom.getClassroomid();
		logger.info("Load classroom(id={}).... ", id);
		Classroom updateClassroom = new Classroom();
		if (StringUtils.isNotBlank(classroomName)) {
			if (hasNameExists(id, classroomName, classroom.getOrgid())) {
				logger.error("classroom.name={} has exists.", classroomName);
				throw new ServiceException(String.format("classroom.name=%s exists.", classroomName));
			}
			updateClassroom.setName(classroomName);
		}
		if (classroom.getDescription() == null) {
			updateClassroom.setDescription("");
		} else {
			updateClassroom.setDescription(description);
		}
		updateClassroom.setClassroomid(id);
		updateClassroom.setUpdatepsnid(classroom.getUpdatepsnid());
		updateClassroom.setUpdatetime(new Date());
		this.classroomMapper.updateByPrimaryKeySelective(updateClassroom);

	}

	@Override
	public Classroom loadClassroom(Integer id, Integer orgId) {
		
		return this.classroomMapper.selectClassroom(id, orgId);
	}

	@Override
	public List<Classroom> getClassroomsByOrgCode(String orgCode) {

		Org org = this.orgService.selectByCode(orgCode);

		return getClassrooms(org.getOrgid());

	}

	@Override
	public List<Classroom> getClassrooms(Integer orgId) {
		return this.classroomMapper.selectClassroomsByOrgId(orgId);
	}

	@Override
	public List<Courseschedule> getClassroomSchedules(Integer classroomId) {
		Classroom classroom = this.classroomMapper.selectByPrimaryKey(classroomId);
		Courseschedulescheme scheme = schemeService.getEnableScheme(classroom.getOrgid());
		if (scheme == null) {
			logger.error("classroomId:{} without enable scheme!", classroomId);
			return null;
		}
		List<Courseschedule> scheduleList = scheduleService.getClassroomCourseSchedules(classroomId,
				scheme.getCoursescheduleschemeid(),
				classroom.getOrgid());
		Collections.sort(scheduleList, new Comparator<Courseschedule>() {

			@Override
			public int compare(Courseschedule o1, Courseschedule o2) {

				String sst1 = o1.getPeriodtimedtl().getShortstarttime();
				String sst2 = o2.getPeriodtimedtl().getShortstarttime();
				if (sst1.length() < 5) {
					sst1 = "0" + sst1;
				}
				if (sst2.length() < 5) {

					sst2 = "0" + sst2;
				}

				String str1 = o1.getWorkday() + "" + sst1.replace(":", "");
				String str2 = o2.getWorkday() + "" + sst2.replace(":", "");
				int num1 = Integer.parseInt(str1);
				int num2 = Integer.parseInt(str2);
				if (num1 < num2) {
					return -1;
				} else if (num1 > num2) {

					return 1;
				}
				return 0;
			}

		});

		return scheduleList;

	}


}
