package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Sdomain;
import com.broadvideo.pixsignage.persistence.SdomainMapper;

@Service("sdomainService")
public class SdomainServiceImpl implements SdomainService {

	@Autowired
	private SdomainMapper sdomainMapper;

	public List<Sdomain> selectList() {
		return sdomainMapper.selectList();
	}

	public Sdomain selectByCode(String code) {
		return sdomainMapper.selectByCode(code);
	}

	public Sdomain selectByServername(String servername) {
		String code = servername;
		int i = servername.indexOf(".");
		if (i > 0) {
			code = servername.substring(0, i);
		}
		return sdomainMapper.selectByCode(code);
	}

	@Transactional
	public void addSdomain(Sdomain sdomain) {
		sdomainMapper.insertSelective(sdomain);
	}

	@Transactional
	public void updateSdomain(Sdomain sdomain) {
		sdomainMapper.updateByPrimaryKeySelective(sdomain);
	}

	@Transactional
	public void deleteSdomain(String sdomainid) {
		sdomainMapper.deleteByPrimaryKey(sdomainid);
	}

	public boolean validateName(Sdomain sdomain) {
		List<Sdomain> list = sdomainMapper.selectByName(sdomain.getName());
		if (list.size() == 0) {
			return true;
		} else {
			return (sdomain.getSdomainid().intValue() == list.get(0).getSdomainid().intValue());
		}
	}

	public boolean validateCode(Sdomain sdomain) {
		Sdomain oldSdomain = sdomainMapper.selectByCode(sdomain.getCode());
		if (oldSdomain == null) {
			return true;
		} else {
			return (sdomain.getSdomainid().intValue() == oldSdomain.getSdomainid().intValue());
		}
	}
}
