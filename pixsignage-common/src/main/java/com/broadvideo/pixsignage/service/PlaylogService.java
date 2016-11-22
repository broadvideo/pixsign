package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Playlog;

public interface PlaylogService {
	public Playlog selectByPrimaryKey(String playlogid);

	public int selectCount(String orgid, String deviceid);

	public List<Playlog> selectList(String orgid, String deviceid, String start, String length);

	public void addPlaylog(Playlog playlog);

	public void updatePlaylog(Playlog playlog);

	public void deletePlaylog(String playlogid);

}
