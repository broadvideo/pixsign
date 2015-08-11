package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Livesource;
import com.broadvideo.signage.persistence.LivesourceMapper;

@Service("livesourceService")
public class LivesourceServiceImpl implements LivesourceService {

	@Autowired
	private LivesourceMapper livesourceMapper ;
	
	public Livesource selectByPrimaryKey(Integer livesourceid) {
		return livesourceMapper.selectByPrimaryKey(livesourceid);
	}
	
	public int selectCount(String orgid) {
		return livesourceMapper.selectCount(orgid);
	}
	
	public List<Livesource> selectList(String orgid, String start, String length) {
		return livesourceMapper.selectList(orgid, start, length);
	}
	
	@Transactional
	public void addLivesource(Livesource livesource) {
		livesourceMapper.insert(livesource);
	}
	
	public void updateLivesource(Livesource livesource) {
		livesourceMapper.updateByPrimaryKeySelective(livesource);
	}
	
	public void deleteLivesource(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		livesourceMapper.deleteByKeys(s);
	}

}
