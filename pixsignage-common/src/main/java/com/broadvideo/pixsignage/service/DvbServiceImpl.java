package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;

@Service("dvbService")
public class DvbServiceImpl implements DvbService {

	@Autowired
	private DvbMapper dvbMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;

	public Dvb selectByPrimaryKey(String dvbid) {
		return dvbMapper.selectByPrimaryKey(dvbid);
	}

	public int selectCount(String orgid, String branchid, String status, String search) {
		return dvbMapper.selectCount(orgid, branchid, status, search);
	}

	public List<Dvb> selectList(String orgid, String branchid, String status, String search, String start,
			String length) {
		return dvbMapper.selectList(orgid, branchid, status, search, start, length);
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
		bundledtlMapper.clearByObj(Bundledtl.ObjType_Dvb, dvbid);
		dvbMapper.deleteByPrimaryKey(dvbid);
	}

}
