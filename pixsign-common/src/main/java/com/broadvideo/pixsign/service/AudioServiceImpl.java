package com.broadvideo.pixsign.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.domain.Audio;
import com.broadvideo.pixsign.domain.Devicefile;
import com.broadvideo.pixsign.persistence.AudioMapper;
import com.broadvideo.pixsign.persistence.DevicefileMapper;

@Service("audioService")
public class AudioServiceImpl implements AudioService {

	@Autowired
	private AudioMapper audioMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;

	public int selectCount(String orgid, String branchid, String search) {
		return audioMapper.selectCount(orgid, branchid, search);
	}

	public List<Audio> selectList(String orgid, String branchid, String search, String start, String length) {
		return audioMapper.selectList(orgid, branchid, search, start, length);
	}

	public Audio selectByPrimaryKey(String audioid) {
		return audioMapper.selectByPrimaryKey(audioid);
	}

	@Transactional
	public void addAudio(Audio audio) {
		audioMapper.insertSelective(audio);
	}

	@Transactional
	public void updateAudio(Audio audio) {
		audioMapper.updateByPrimaryKeySelective(audio);
	}

	@Transactional
	public void deleteAudio(String audioid) {
		devicefileMapper.clearByMedia(Devicefile.ObjType_Audio, audioid);
		audioMapper.deleteByPrimaryKey(audioid);
	}

}
