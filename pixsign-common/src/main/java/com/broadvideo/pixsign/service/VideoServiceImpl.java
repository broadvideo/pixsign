package com.broadvideo.pixsign.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.domain.Devicefile;
import com.broadvideo.pixsign.domain.Video;
import com.broadvideo.pixsign.persistence.DevicefileMapper;
import com.broadvideo.pixsign.persistence.VideoMapper;

@Service("videoService")
public class VideoServiceImpl implements VideoService {

	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;

	public int selectCount(String orgid, String branchid, String folderid, String type, String previewflag,
			String format, String adflag, String search) {
		return videoMapper.selectCount(orgid, branchid, folderid, type, previewflag, format, adflag, search);
	}

	public List<Video> selectList(String orgid, String branchid, String folderid, String type, String previewflag,
			String format, String adflag, String search, String start, String length) {
		return videoMapper.selectList(orgid, branchid, folderid, type, previewflag, format, adflag, search, start,
				length);
	}

	public Video selectByPrimaryKey(String videoid) {
		return videoMapper.selectByPrimaryKey(videoid);
	}

	@Transactional
	public void addVideo(Video video) {
		if (video.getUuid() == null) {
			video.setUuid(UUID.randomUUID().toString().replace("-", ""));
		}
		videoMapper.insertSelective(video);
	}

	@Transactional
	public void updateVideo(Video video) {
		videoMapper.updateByPrimaryKeySelective(video);
	}

	@Transactional
	public void deleteVideo(String videoid) {
		devicefileMapper.clearByMedia(Devicefile.ObjType_Video, videoid);
		videoMapper.deleteByPrimaryKey(videoid);
	}

}
