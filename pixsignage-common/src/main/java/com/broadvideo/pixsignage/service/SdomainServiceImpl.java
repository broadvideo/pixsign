package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
