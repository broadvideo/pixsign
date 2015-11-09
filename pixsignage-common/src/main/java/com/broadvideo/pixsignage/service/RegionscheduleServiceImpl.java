package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;

@Service("regionscheduleService")
public class RegionscheduleServiceImpl implements RegionscheduleService {

	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public List<Regionschedule> selectList(String bindtype, String bindid, String regionid, String playmode,
			String fromdate, String todate) {
		return regionscheduleMapper.selectList(bindtype, bindid, regionid, playmode, fromdate, todate);
	}

	@Transactional
	public void addRegionschedule(Regionschedule regionschedule) {
		regionscheduleMapper.insertSelective(regionschedule);
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
