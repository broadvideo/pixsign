package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.persistence.StatMapper;

@Service("statService")
public class StatServiceImpl implements StatService {

	@Autowired
	private StatMapper statMapper;

	public List<HashMap<String, String>> selectVideoCount(String orgid) {
		return statMapper.selectVideoCount(orgid);
	}

	public List<HashMap<String, String>> selectImageCount(String orgid) {
		return statMapper.selectImageCount(orgid);
	}

	public List<HashMap<String, String>> selectFilesizeSum(String orgid) {
		return statMapper.selectFilesizeSum(orgid);
	}
}
