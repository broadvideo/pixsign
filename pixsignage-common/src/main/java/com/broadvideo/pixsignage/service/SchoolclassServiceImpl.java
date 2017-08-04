package com.broadvideo.pixsignage.service;

import java.util.Calendar;
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
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Schoolclass;
import com.broadvideo.pixsignage.persistence.SchoolclassMapper;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
@Transactional(rollbackFor = Exception.class)
public class SchoolclassServiceImpl implements SchoolclassService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private SchoolclassMapper schoolclassMapper;

	@Override
	public Integer addSchoolclass(Schoolclass schoolclass) {
		if (hasNameExists(null, schoolclass.getName(), schoolclass.getOrgid())) {
			logger.error("schoolclass.name={} has exists.", schoolclass.getName());
			throw new ServiceException(String.format("schoolclass.name=%s has exists.", schoolclass.getName()));
		}
		if (hasBind(schoolclass.getClassroomid(), null)) {
			logger.error("Classroomid={} has bind.", schoolclass.getClassroomid());
			throw new ServiceException("Classroom is bind.");
		}
		schoolclass.setCreatetime(Calendar.getInstance().getTime());
		schoolclassMapper.insertSelective(schoolclass);

		return schoolclass.getSchoolclassid();
	}

	@Override
	public boolean hasBind(Integer classroomid, Integer excludeschoolclassid) {
		if (classroomid == null) {
			return false;
		}
		int total = this.schoolclassMapper.countBindRecords(classroomid, excludeschoolclassid);
		return total>0;
	}

	@Override
	public PageResult getSchoolclassList(String search, PageInfo page, Integer orgid) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Map<String, Object>> dataList = schoolclassMapper.selectList(orgid, search, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public void upateSchoolclass(Schoolclass schoolclass) {

		boolean isBind = hasBind(schoolclass.getClassroomid(), schoolclass.getSchoolclassid());
		if (isBind) {
			logger.error("Classroomid={} is bind by antoher schoolclass.", schoolclass.getSchoolclassid());
			throw new ServiceException("Classroomid=" + schoolclass.getSchoolclassid()
					+ " is bind by antoher schoolclass.");
		}
		this.schoolclassMapper.updateByPrimaryKeySelective(schoolclass);

	}
	
	private boolean hasNameExists(Integer excludeid, String name, Integer orgid) {

		return this.schoolclassMapper.countBy(name, excludeid, orgid) > 0;
	}

	@Override
	public void deleteSchoolclass(Integer schoolclassid, Integer orgid) {
		logger.info("Delete schoolclass(schoolclassid={},orgid={})", schoolclassid, orgid);
		this.schoolclassMapper.deleteByPrimaryKey(schoolclassid, orgid);

	}

	@Override
	public Schoolclass loadSchoolclassByName(String name, Integer orgid) {

		return this.schoolclassMapper.selectByName(name, orgid);
	}

}
