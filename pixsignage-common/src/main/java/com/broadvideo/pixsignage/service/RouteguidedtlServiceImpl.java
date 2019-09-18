package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Routeguidedtl;
import com.broadvideo.pixsignage.persistence.RouteguidedtlMapper;

@Service("routeguidedtlService")
public class RouteguidedtlServiceImpl implements RouteguidedtlService {

	@Autowired
	private RouteguidedtlMapper routeguidedtlMapper;

	public List<Routeguidedtl> selectList(String routeguideid) {
		return routeguidedtlMapper.selectList(routeguideid);
	}

	public Routeguidedtl selectByPrimaryKey(String routeguidedtlid) {
		return routeguidedtlMapper.selectByPrimaryKey(routeguidedtlid);
	}

	@Transactional
	public void addRouteguidedtl(Routeguidedtl routeguidedtl) {
		routeguidedtlMapper.insertSelective(routeguidedtl);
	}

	@Transactional
	public void updateRouteguidedtl(Routeguidedtl routeguidedtl) {
		routeguidedtlMapper.updateByPrimaryKeySelective(routeguidedtl);
	}

	@Transactional
	public void deleteRouteguidedtl(String routeguidedtlid) {
		routeguidedtlMapper.deleteByPrimaryKey(routeguidedtlid);
	}
}
