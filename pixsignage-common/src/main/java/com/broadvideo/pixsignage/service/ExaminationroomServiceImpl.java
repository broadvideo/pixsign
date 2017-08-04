package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Examinationroom;
import com.broadvideo.pixsignage.persistence.ExaminationroomMapper;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Transactional(rollbackFor = Exception.class)
@Service
public class ExaminationroomServiceImpl implements ExaminationroomService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ExaminationroomMapper examinationroomMapper;

	@Override
	public PageResult getExaminationroomList(String search, PageInfo page, Integer orgid) {

		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Map<String, Object>> dataList = examinationroomMapper.selectList(orgid, search, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public Integer addExaminationroom(Examinationroom examinationroom) {

		if (hasExists(null, examinationroom.getClassroomid(), examinationroom.getStarttime(),
				examinationroom.getEndtime())) {
			logger.error(
					"Conflict:classroomid={} for starttime:{} - endtime:{}",
					new Object[] { examinationroom.getClassroomid(), examinationroom.getStarttime(),
							examinationroom.getEndtime() });
			throw new ServiceException(RetCodeEnum.EXIST, "Arrange classroom and time conflict.");
		}
		examinationroom.setCreatetime(new Date());

		this.examinationroomMapper.insertSelective(examinationroom);

		return examinationroom.getExaminationroomid();
	}

	/**
	 * 检查一个教室在指定的时间段只能设置一个考场
	 * 
	 * @param excludeid
	 * @param classroomid
	 * @param starttime
	 * @param endtime
	 * @return
	 */
	private boolean hasExists(Integer excludeid, Integer classroomid, Date starttime, Date endtime) {

		return this.examinationroomMapper.countExaminationrooms(excludeid, classroomid, starttime, endtime) > 0;

	}

	@Override
	public void updateExaminationroom(Examinationroom examinationroom) {
		if (hasExists(examinationroom.getExaminationroomid(), examinationroom.getClassroomid(),
				examinationroom.getStarttime(), examinationroom.getEndtime())) {
			logger.error(
					"Conflict:classroomid={} for starttime:{} - endtime:{}",
					new Object[] { examinationroom.getClassroomid(), examinationroom.getStarttime(),
							examinationroom.getEndtime() });
			throw new ServiceException(RetCodeEnum.EXIST, "Arrange classroom and time conflict.");
		}

		this.examinationroomMapper.updateByPrimaryKeySelective(examinationroom);

	}

	@Override
	public void deleteExaminationroom(Integer examinationroomid, Integer orgid) {

		this.examinationroomMapper.deleteByPrimaryKey(examinationroomid, orgid);

	}

	@Override
	public List<Examinationroom> getExaminationroomsByClassroomid(Integer classroomid) {
		return this.examinationroomMapper.selectExaminationroomsBy(classroomid);
	}

}
