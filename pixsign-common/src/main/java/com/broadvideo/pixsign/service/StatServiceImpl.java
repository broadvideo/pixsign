package com.broadvideo.pixsign.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsign.persistence.StatMapper;

@Service("statService")
public class StatServiceImpl implements StatService {

	@Autowired
	private StatMapper statMapper;

	public List<HashMap<String, String>> statDevices(String orgid, String branchid, String cataitemid1,
			String cataitemid2) {
		return statMapper.statDevices(orgid, branchid, cataitemid1, cataitemid2);
	}

	public List<HashMap<String, String>> statVideoCount(String orgid) {
		return statMapper.statVideoCount(orgid);
	}

	public List<HashMap<String, String>> statImageCount(String orgid) {
		return statMapper.statImageCount(orgid);
	}

	public List<HashMap<String, String>> statFilesizeSum(String orgid) {
		return statMapper.statFilesizeSum(orgid);
	}
}
