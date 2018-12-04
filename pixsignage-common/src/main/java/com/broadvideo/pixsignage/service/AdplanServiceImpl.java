package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Adplan;
import com.broadvideo.pixsignage.persistence.AdplanMapper;

@Service("adplanService")
public class AdplanServiceImpl implements AdplanService {

	@Autowired
	private AdplanMapper adplanMapper;

	public Adplan selectByPrimaryKey(String adplanid) {
		return adplanMapper.selectByPrimaryKey(adplanid);
	}

	public int selectCount(String orgid) {
		return adplanMapper.selectCount(orgid);
	}

	public List<Adplan> selectList(String orgid, String start, String length) {
		return adplanMapper.selectList(orgid, start, length);
	}

	@Transactional
	public void addAdplan(Adplan adplan) {
		adplanMapper.insertSelective(adplan);
	}

	@Transactional
	public void updateAdplan(Adplan adplan) {
		adplanMapper.updateByPrimaryKeySelective(adplan);
	}

	@Transactional
	public void deleteAdplan(String adplanid) {
		adplanMapper.deleteByPrimaryKey(adplanid);
	}

}
