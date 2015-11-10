package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;

@Service("regionscheduleService")
public class RegionscheduleServiceImpl implements RegionscheduleService {

	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
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
					regionschedule.getPlaymode(), null,
					CommonConstants.DateFormat_Time.format(regionschedule.getStarttime()));
		} else {
			regionscheduleMapper.deleteByDtl(regionschedule.getBindtype(), "" + regionschedule.getBindid(),
					regionschedule.getPlaymode(), CommonConstants.DateFormat_Date.format(regionschedule.getPlaydate()),
					CommonConstants.DateFormat_Time.format(regionschedule.getStarttime()));
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
		syncRegionschedule(regionschedule.getBindtype(), regionschedule.getBindid(), regionschedule.getRegionid());
	}

	@Transactional
	public void updateRegionschedule(Regionschedule regionschedule) {
		regionscheduleMapper.updateByPrimaryKeySelective(regionschedule);
		syncRegionschedule(regionschedule.getBindtype(), regionschedule.getBindid(), regionschedule.getRegionid());
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
		syncRegionschedule(regionschedule.getBindtype(), regionschedule.getBindid(), regionschedule.getRegionid());
	}

	public void syncRegionschedule(String bindtype, int bindid, int regionid) {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Region_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(bindid);
		msgevent.setObjtype2(Msgevent.ObjType_2_Region);
		msgevent.setObjid2(regionid);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Region_Schedule, bindtype, "" + bindid, Msgevent.ObjType_2_Region,
				"" + regionid, null);
		msgeventMapper.insertSelective(msgevent);
	}
}
