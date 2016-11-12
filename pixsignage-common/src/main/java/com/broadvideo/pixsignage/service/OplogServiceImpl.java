package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Oplog;
import com.broadvideo.pixsignage.persistence.OplogMapper;

@Service("oplogService")
public class OplogServiceImpl implements OplogService {

	@Autowired
	private OplogMapper oplogMapper;

	public Oplog selectByPrimaryKey(String oplogid) {
		return oplogMapper.selectByPrimaryKey(oplogid);
	}

	public int selectCount(String orgid, String branchid, String type) {
		return oplogMapper.selectCount(orgid, branchid, type);
	}

	public List<Oplog> selectList(String orgid, String branchid, String type, String start, String length) {
		return oplogMapper.selectList(orgid, branchid, type, start, length);
	}

	@Transactional
	public void addOplog(Oplog oplog) {
		oplogMapper.insertSelective(oplog);
	}

	@Transactional
	public void updateOplog(Oplog oplog) {
		oplogMapper.updateByPrimaryKeySelective(oplog);
	}

	@Transactional
	public void deleteOplog(String oplogid) {
		oplogMapper.deleteByPrimaryKey(oplogid);
	}

}
