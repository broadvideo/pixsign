package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;

@Service("regionscheduleService")
public class RegionscheduleServiceImpl implements RegionscheduleService {
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;

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
		if (regionschedule.getBindtype().equals("1")) {
			devicefileMapper.deleteDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDeviceImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceImageFiles("" + regionschedule.getBindid());
		} else if (regionschedule.getBindtype().equals("2")) {
			devicefileMapper.deleteDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDevicegroupImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupImageFiles("" + regionschedule.getBindid());
		}
	}

	@Transactional
	public void updateRegionschedule(Regionschedule regionschedule) {
		regionscheduleMapper.updateByPrimaryKeySelective(regionschedule);
	}

	@Transactional
	public void deleteRegionschedule(String regionscheduleid) {
		Regionschedule regionschedule = regionscheduleMapper.selectByPrimaryKey(regionscheduleid);
		regionscheduleMapper.deleteByPrimaryKey(regionscheduleid);
		if (regionschedule.getBindtype().equals("1")) {
			devicefileMapper.deleteDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDeviceImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceImageFiles("" + regionschedule.getBindid());
		} else if (regionschedule.getBindtype().equals("2")) {
			devicefileMapper.deleteDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDevicegroupImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupImageFiles("" + regionschedule.getBindid());
		}
	}

}
