package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;

@Service("regionscheduleService")
public class RegionscheduleServiceImpl implements RegionscheduleService {
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private DevicefileService devicefileService;

	public List<Regionschedule> selectList(String bindtype, String bindid, String regionid, String playmode,
			String fromdate, String todate) {
		return regionscheduleMapper.selectList(bindtype, bindid, regionid, playmode, fromdate, todate);
	}

	@Transactional
	public void addRegionschedule(Regionschedule regionschedule) {
		if (regionschedule.getPlaydate() == null) {
			regionscheduleMapper.deleteByDtl(regionschedule.getBindtype(), "" + regionschedule.getBindid(),
					"" + regionschedule.getRegionid(), regionschedule.getPlaymode(), null,
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(regionschedule.getStarttime()));
		} else {
			regionscheduleMapper.deleteByDtl(regionschedule.getBindtype(), "" + regionschedule.getBindid(),
					"" + regionschedule.getRegionid(), regionschedule.getPlaymode(),
					new SimpleDateFormat(CommonConstants.DateFormat_Date).format(regionschedule.getPlaydate()),
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(regionschedule.getStarttime()));
		}
		regionscheduleMapper.insertSelective(regionschedule);
		devicefileService.refreshDevicefiles(regionschedule.getBindtype(), "" + regionschedule.getBindid());
	}

	@Transactional
	public void updateRegionschedule(Regionschedule regionschedule) {
		regionscheduleMapper.updateByPrimaryKeySelective(regionschedule);
	}

	@Transactional
	public void deleteRegionschedule(String regionscheduleid) {
		Regionschedule regionschedule = regionscheduleMapper.selectByPrimaryKey(regionscheduleid);
		regionscheduleMapper.deleteByPrimaryKey(regionscheduleid);
		devicefileService.refreshDevicefiles(regionschedule.getBindtype(), "" + regionschedule.getBindid());
	}

}
