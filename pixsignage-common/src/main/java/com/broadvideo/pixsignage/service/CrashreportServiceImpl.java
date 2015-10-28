package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;

@Service("crashreportService")
public class CrashreportServiceImpl implements CrashreportService {

	@Autowired
	private CrashreportMapper crashreportMapper;

	public int selectCount() {
		return crashreportMapper.selectCount();
	}

	public List<Crashreport> selectList(String start, String length) {
		return crashreportMapper.selectList(start, length);
	}

	public Crashreport selectByPrimaryKey(String crashreportid) {
		return crashreportMapper.selectByPrimaryKey(crashreportid);
	}

	public Crashreport selectAllByPrimaryKey(String crashreportid) {
		return crashreportMapper.selectAllByPrimaryKey(crashreportid);
	}

	public void addCrashreport(Crashreport crashreport) {
		crashreportMapper.insertSelective(crashreport);
	}

	public void updateCrashreport(Crashreport crashreport) {
		crashreportMapper.updateByPrimaryKeySelective(crashreport);
	}

}
