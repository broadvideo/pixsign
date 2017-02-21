package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Playlog;
import com.broadvideo.pixsignage.persistence.PlaylogMapper;

@Service("playlogService")
public class PlaylogServiceImpl implements PlaylogService {

	@Autowired
	private PlaylogMapper playlogMapper;

	public Playlog selectByPrimaryKey(String playlogid) {
		return playlogMapper.selectByPrimaryKey(playlogid);
	}

	public int selectCount(String orgid, String deviceid) {
		return playlogMapper.selectCount(orgid, deviceid);
	}

	public List<Playlog> selectList(String orgid, String deviceid, String start, String length) {
		return playlogMapper.selectList(orgid, deviceid, start, length);
	}

	@Transactional
	public void addPlaylog(Playlog playlog) {
		playlogMapper.insertSelective(playlog);
	}

	@Transactional
	public void updatePlaylog(Playlog playlog) {
		playlogMapper.updateByPrimaryKeySelective(playlog);
	}

	@Transactional
	public void deletePlaylog(String playlogid) {
		playlogMapper.deleteByPrimaryKey(playlogid);
	}

}