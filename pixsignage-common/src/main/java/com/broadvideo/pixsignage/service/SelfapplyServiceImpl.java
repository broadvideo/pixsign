package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Selfapply;
import com.broadvideo.pixsignage.persistence.SelfapplyMapper;

@Service("selfapplyService")
public class SelfapplyServiceImpl implements SelfapplyService {

	@Autowired
	private SelfapplyMapper selfapplyMapper;

	public int selectCount(String status, String search) {
		return selfapplyMapper.selectCount(status, search);
	}

	public List<Selfapply> selectList(String status, String search, String start, String length) {
		return selfapplyMapper.selectList(status, search, start, length);
	}

	public Selfapply selectByPrimaryKey(String selfapplyid) {
		return selfapplyMapper.selectByPrimaryKey(selfapplyid);
	}

	@Transactional
	public void addSelfapply(Selfapply selfapply) {
		selfapplyMapper.insertSelective(selfapply);
	}

	@Transactional
	public void updateSelfapply(Selfapply selfapply) {
		selfapplyMapper.updateByPrimaryKeySelective(selfapply);
	}

	@Transactional
	public void deleteSelfapply(String selfapplyid) {
		selfapplyMapper.deleteByPrimaryKey(selfapplyid);
	}
}
