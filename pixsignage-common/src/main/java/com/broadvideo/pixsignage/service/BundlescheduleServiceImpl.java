package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.persistence.BundlescheduleMapper;

@Service("bundlescheduleService")
public class BundlescheduleServiceImpl implements BundlescheduleService {
	@Autowired
	private BundlescheduleMapper bundlescheduleMapper;

	public List<Bundleschedule> selectList(String bindtype, String bindid) {
		return bundlescheduleMapper.selectList(bindtype, bindid, null, null, null);
	}

	@Transactional
	public void addBundleschedule(Bundleschedule bundleschedule) {
		if (bundleschedule.getPlaydate() == null) {
			bundlescheduleMapper.deleteByDtl(bundleschedule.getBindtype(), "" + bundleschedule.getBindid(),
					bundleschedule.getPlaymode(), null,
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(bundleschedule.getStarttime()));
		} else {
			bundlescheduleMapper.deleteByDtl(bundleschedule.getBindtype(), "" + bundleschedule.getBindid(),
					bundleschedule.getPlaymode(),
					new SimpleDateFormat(CommonConstants.DateFormat_Date).format(bundleschedule.getPlaydate()),
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(bundleschedule.getStarttime()));
		}
		bundlescheduleMapper.insertSelective(bundleschedule);
	}

	@Transactional
	public void updateBundleschedule(Bundleschedule bundleschedule) {
		bundlescheduleMapper.updateByPrimaryKeySelective(bundleschedule);
	}

	@Transactional
	public void deleteBundleschedule(String bundlescheduleid) {
		bundlescheduleMapper.deleteByPrimaryKey(bundlescheduleid);
	}

}
