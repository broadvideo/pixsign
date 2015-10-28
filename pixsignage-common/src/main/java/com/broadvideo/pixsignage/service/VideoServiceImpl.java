package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.VideoMapper;

@Service("videoService")
public class VideoServiceImpl implements VideoService {

	@Autowired
	private VideoMapper videoMapper;

	public int selectCount(String orgid, String branchid, String type, String search) {
		return videoMapper.selectCount(orgid, branchid, type, search);
	}

	public List<Video> selectList(String orgid, String branchid, String type, String search, String start,
			String length) {
		return videoMapper.selectList(orgid, branchid, type, search, start, length);
	}

	public Video selectByPrimaryKey(String videoid) {
		return videoMapper.selectByPrimaryKey(videoid);
	}

	@Transactional
	public void addVideo(Video video) {
		videoMapper.insertSelective(video);
	}

	@Transactional
	public void updateVideo(Video video) {
		videoMapper.updateByPrimaryKeySelective(video);
	}

	@Transactional
	public void deleteVideo(String videoid) {
		videoMapper.deleteByPrimaryKey(videoid);
	}

}
