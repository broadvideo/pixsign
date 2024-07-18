package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Audio;

public interface AudioService {
	public int selectCount(String orgid, String branchid, String search);

	public List<Audio> selectList(String orgid, String branchid, String search, String start, String length);

	public Audio selectByPrimaryKey(String audioid);

	public void addAudio(Audio audio);

	public void updateAudio(Audio audio);

	public void deleteAudio(String audioid);
}
