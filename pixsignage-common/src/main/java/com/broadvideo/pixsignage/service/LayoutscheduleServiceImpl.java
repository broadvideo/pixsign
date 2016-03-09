package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.persistence.LayoutscheduleMapper;

@Service("layoutscheduleService")
public class LayoutscheduleServiceImpl implements LayoutscheduleService {
	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;

	public List<Layoutschedule> selectList(String bindtype, String bindid) {
		return layoutscheduleMapper.selectList(bindtype, bindid, null, null, null);
	}

	@Transactional
	public void addLayoutschedule(Layoutschedule layoutschedule) {
		if (layoutschedule.getPlaydate() == null) {
			layoutscheduleMapper.deleteByDtl(layoutschedule.getBindtype(), "" + layoutschedule.getBindid(),
					layoutschedule.getPlaymode(), null,
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(layoutschedule.getStarttime()));
		} else {
			layoutscheduleMapper.deleteByDtl(layoutschedule.getBindtype(), "" + layoutschedule.getBindid(),
					layoutschedule.getPlaymode(),
					new SimpleDateFormat(CommonConstants.DateFormat_Date).format(layoutschedule.getPlaydate()),
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(layoutschedule.getStarttime()));
		}
		layoutscheduleMapper.insertSelective(layoutschedule);
	}

	@Transactional
	public void updateLayoutschedule(Layoutschedule layoutschedule) {
		layoutscheduleMapper.updateByPrimaryKeySelective(layoutschedule);
	}

	@Transactional
	public void deleteLayoutschedule(String layoutscheduleid) {
		layoutscheduleMapper.deleteByPrimaryKey(layoutscheduleid);
	}

}
