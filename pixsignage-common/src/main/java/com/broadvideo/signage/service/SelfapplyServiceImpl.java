package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.signage.domain.Selfapply;
import com.broadvideo.signage.persistence.SelfapplyMapper;

@Service("selfapplyService")
public class SelfapplyServiceImpl implements SelfapplyService {

	@Autowired
	private SelfapplyMapper selfapplyMapper ;
	
	public int selectCount(String status, String search) {
		return selfapplyMapper.selectCount(status, search);
	}
	
	public List<Selfapply> selectList(String status, String search, String start, String length) {
		return selfapplyMapper.selectList(status, search, start, length);
	}
	
	public Selfapply selectByPrimaryKey(String selfapplyid) {
		return selfapplyMapper.selectByPrimaryKey(selfapplyid);
	}
	
	public void addSelfapply(Selfapply selfapply) {
		selfapplyMapper.insert(selfapply);
	}
	
	public void updateSelfapply(Selfapply selfapply) {
		selfapplyMapper.updateByPrimaryKeySelective(selfapply);
	}
	
	public void deleteSelfapply(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		selfapplyMapper.deleteByKeys(s);
	}
}
