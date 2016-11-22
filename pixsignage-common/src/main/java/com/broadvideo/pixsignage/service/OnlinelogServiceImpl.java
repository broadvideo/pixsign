package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.persistence.OnlinelogMapper;

@Service("onlinelogService")
public class OnlinelogServiceImpl implements OnlinelogService {

	@Autowired
	private OnlinelogMapper onlinelogMapper;

	public Onlinelog selectByPrimaryKey(String onlinelogid) {
		return onlinelogMapper.selectByPrimaryKey(onlinelogid);
	}

	public int selectCount(String orgid, String deviceid) {
		return onlinelogMapper.selectCount(orgid, deviceid);
	}

	public List<Onlinelog> selectList(String orgid, String deviceid, String start, String length) {
		return onlinelogMapper.selectList(orgid, deviceid, start, length);
	}

	@Transactional
	public void addOnlinelog(Onlinelog onlinelog) {
		onlinelogMapper.insertSelective(onlinelog);
	}

	@Transactional
	public void updateOnlinelog(Onlinelog onlinelog) {
		onlinelogMapper.updateByPrimaryKeySelective(onlinelog);
	}

	@Transactional
	public void deleteOnlinelog(String onlinelogid) {
		onlinelogMapper.deleteByPrimaryKey(onlinelogid);
	}

	@Transactional
	public void updateAll() {
		onlinelogMapper.updateAll();
	}

	@Transactional
	public void updateLast2Offline(String deviceid) {
		onlinelogMapper.updateLast2Offline(deviceid);
	}

	@Transactional
	public void updateLast2Online(String deviceid) {
		onlinelogMapper.updateLast2Online(deviceid);
	}
}
