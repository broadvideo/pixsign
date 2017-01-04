package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Audio;
import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.persistence.AudioMapper;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;

@Service("audioService")
public class AudioServiceImpl implements AudioService {

	@Autowired
	private AudioMapper audioMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
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
		medialistdtlMapper.deleteByObj(Medialistdtl.ObjType_Audio, audioid);
		devicefileMapper.deleteByObj(Devicefile.ObjType_Audio, audioid);
		audioMapper.deleteByPrimaryKey(audioid);
	}

}
