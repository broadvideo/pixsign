package com.broadvideo.pixsignage.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Vchannel;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.VchannelMapper;

@Service("vchannelService")
public class VchannelServiceImpl implements VchannelService {

	@Autowired
	private VchannelMapper vchannelMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public int selectCount(String orgid, String search) {
		return vchannelMapper.selectCount(orgid, search);
	}

	public List<Vchannel> selectList(String orgid, String search, String start, String length) {
		return vchannelMapper.selectList(orgid, search, start, length);
	}

	@Transactional
	public void addVchannel(Vchannel vchannel) {
		vchannel.setUuid(UUID.randomUUID().toString().replace("-", ""));
		vchannelMapper.insertSelective(vchannel);
		syncVchannel();
	}

	@Transactional
	public void updateVchannel(Vchannel vchannel) {
		vchannelMapper.updateByPrimaryKeySelective(vchannel);
		syncVchannel();
	}

	@Transactional
	public void deleteVchannel(String vchannelid) {
		vchannelMapper.deleteByPrimaryKey(vchannelid);
		syncVchannel();
	}

	public void syncVchannel() {
		Msgevent msgevent1 = msgeventMapper.selectVchannelVCSSEvent();
		if (msgevent1 != null) {
			msgevent1.setStatus(Msgevent.Status_Wait);
			msgeventMapper.updateByPrimaryKeySelective(msgevent1);
		} else {
			msgevent1 = new Msgevent();
			msgevent1.setMsgtype(Msgevent.MsgType_VChannel_Info_VCSS);
			msgevent1.setObjtype1(Msgevent.ObjType_1_None);
			msgevent1.setObjid1(0);
			msgevent1.setObjtype2(Msgevent.ObjType_2_None);
			msgevent1.setObjid2(0);
			msgevent1.setStatus(Msgevent.Status_Wait);
			msgeventMapper.insertSelective(msgevent1);
		}

		Msgevent msgevent2 = msgeventMapper.selectVchannelPixboxEvent();
		if (msgevent2 != null) {
			msgevent2.setStatus(Msgevent.Status_Wait);
			msgeventMapper.updateByPrimaryKeySelective(msgevent2);
		} else {
			msgevent2 = new Msgevent();
			msgevent2.setMsgtype(Msgevent.MsgType_VChannel_Info_PixBox);
			msgevent2.setObjtype1(Msgevent.ObjType_1_None);
			msgevent2.setObjid1(0);
			msgevent2.setObjtype2(Msgevent.ObjType_2_None);
			msgevent2.setObjid2(0);
			msgevent2.setStatus(Msgevent.Status_Wait);
			msgeventMapper.insertSelective(msgevent2);
		}
	}

}
