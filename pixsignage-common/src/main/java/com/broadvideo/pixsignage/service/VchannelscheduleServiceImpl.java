package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Vchannelschedule;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.VchannelscheduleMapper;

@Service("vchannelscheduleService")
public class VchannelscheduleServiceImpl implements VchannelscheduleService {

	@Autowired
	private VchannelscheduleMapper vchannelscheduleMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public List<Vchannelschedule> selectList(String vchannelid) {
		return vchannelscheduleMapper.selectList(vchannelid);
	}

	@Transactional
	public void addVchannelschedule(Vchannelschedule vchannelschedule) {
		vchannelscheduleMapper.insertSelective(vchannelschedule);
		syncVchannelschedule(vchannelschedule.getVchannelid());
	}

	@Transactional
	public void updateVchannelschedule(Vchannelschedule vchannelschedule) {
		vchannelscheduleMapper.updateByPrimaryKeySelective(vchannelschedule);
		syncVchannelschedule(vchannelschedule.getVchannelid());
	}

	@Transactional
	public void deleteVchannelschedule(String vchannelscheduleid) {
		Vchannelschedule vchannelschedule = vchannelscheduleMapper.selectByPrimaryKey(vchannelscheduleid);
		vchannelscheduleMapper.deleteByPrimaryKey(vchannelscheduleid);
		syncVchannelschedule(vchannelschedule.getVchannelid());
	}

	public void syncVchannelschedule(int vchannelid) {
		Msgevent msgevent = msgeventMapper.selectVchannelscheduleVCSSEvent("" + vchannelid);
		if (msgevent != null) {
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.updateByPrimaryKeySelective(msgevent);
		} else {
			msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_VChannel_Schedule_VCSS);
			msgevent.setObjtype1(Msgevent.ObjType_1_VChannel);
			msgevent.setObjid1(vchannelid);
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.insertSelective(msgevent);
		}
	}
}
