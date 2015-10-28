package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Crashreport;

public interface CrashreportService {
	public int selectCount();

	public List<Crashreport> selectList(String start, String length);

	public Crashreport selectByPrimaryKey(String crashreportid);

	public Crashreport selectAllByPrimaryKey(String crashreportid);

	public void addCrashreport(Crashreport crashreport);

	public void updateCrashreport(Crashreport crashreport);
}
