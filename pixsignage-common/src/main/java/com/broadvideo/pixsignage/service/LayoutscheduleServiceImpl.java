package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.persistence.LayoutscheduleMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;

@Service("layoutscheduleService")
public class LayoutscheduleServiceImpl implements LayoutscheduleService {

	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public List<Layoutschedule> selectList(String bindtype, String bindid) {
		return layoutscheduleMapper.selectList(bindtype, bindid, null, null, null);
	}

	@Transactional
	public void addLayoutschedule(Layoutschedule layoutschedule) {
		if (layoutschedule.getPlaydate() == null) {
			layoutscheduleMapper.deleteByDtl(layoutschedule.getBindtype(), "" + layoutschedule.getBindid(),
					layoutschedule.getPlaymode(), null,
					CommonConstants.DateFormat_Time.format(layoutschedule.getStarttime()));
		} else {
			layoutscheduleMapper.deleteByDtl(layoutschedule.getBindtype(), "" + layoutschedule.getBindid(),
					layoutschedule.getPlaymode(), CommonConstants.DateFormat_Date.format(layoutschedule.getPlaydate()),
					CommonConstants.DateFormat_Time.format(layoutschedule.getStarttime()));
		}
		layoutscheduleMapper.insertSelective(layoutschedule);
		syncLayoutschedule(layoutschedule.getBindtype(), layoutschedule.getBindid());
	}

	@Transactional
	public void updateLayoutschedule(Layoutschedule layoutschedule) {
		layoutscheduleMapper.updateByPrimaryKeySelective(layoutschedule);
		syncLayoutschedule(layoutschedule.getBindtype(), layoutschedule.getBindid());
	}

	@Transactional
	public void deleteLayoutschedule(String layoutscheduleid) {
		Layoutschedule layoutschedule = layoutscheduleMapper.selectByPrimaryKey(layoutscheduleid);
		layoutscheduleMapper.deleteByPrimaryKey(layoutscheduleid);
		syncLayoutschedule(layoutschedule.getBindtype(), layoutschedule.getBindid());
	}

	public void syncLayoutschedule(String bindtype, int bindid) {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Layout_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(bindid);
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Layout_Schedule, bindtype, "" + bindid, null, null, null);
		msgeventMapper.insertSelective(msgevent);
	}
}
