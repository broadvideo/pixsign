package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;

@Service("dvbService")
public class DvbServiceImpl implements DvbService {

	@Autowired
	private DvbMapper dvbMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;

	public Dvb selectByPrimaryKey(String dvbid) {
		return dvbMapper.selectByPrimaryKey(dvbid);
	}

	public int selectCount(String orgid, String branchid) {
		return dvbMapper.selectCount(orgid, branchid);
	}

	public List<Dvb> selectList(String orgid, String branchid, String start, String length) {
		return dvbMapper.selectList(orgid, branchid, start, length);
	}

	@Transactional
	public void addDvb(Dvb dvb) {
		dvbMapper.insertSelective(dvb);
	}

	@Transactional
	public void updateDvb(Dvb dvb) {
		dvbMapper.updateByPrimaryKeySelective(dvb);
	}

	@Transactional
	public void deleteDvb(String dvbid) {
		regionscheduleMapper.deleteByObj(Regionschedule.ObjType_Dvb, dvbid);
		dvbMapper.deleteByPrimaryKey(dvbid);
	}

}
