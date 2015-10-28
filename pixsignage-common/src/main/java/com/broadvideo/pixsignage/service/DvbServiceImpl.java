package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.persistence.DvbMapper;

@Service("dvbService")
public class DvbServiceImpl implements DvbService {

	@Autowired
	private DvbMapper dvbMapper;

	public Dvb selectByPrimaryKey(String dvbid) {
		return dvbMapper.selectByPrimaryKey(dvbid);
	}

	public int selectCount(String orgid) {
		return dvbMapper.selectCount(orgid);
	}

	public List<Dvb> selectList(String orgid, String start, String length) {
		return dvbMapper.selectList(orgid, start, length);
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
		dvbMapper.deleteByPrimaryKey(dvbid);
	}

}
