package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.signage.domain.Stat;
import com.broadvideo.signage.persistence.StatMapper;

@Service("statService")
public class StatServiceImpl implements StatService {

	@Autowired
	private StatMapper statMapper ;
	
	public List<Stat> selectMediaCount(String orgid, String type) {
		return statMapper.selectMediaCount(orgid, type);
	}
	
	public List<Stat> selectFilesizeSum(String orgid) {
		return statMapper.selectFilesizeSum(orgid);
	}
}
