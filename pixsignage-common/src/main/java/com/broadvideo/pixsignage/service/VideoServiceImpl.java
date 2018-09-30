package com.broadvideo.pixsignage.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.PlaylistdtlMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;

@Service("videoService")
public class VideoServiceImpl implements VideoService {

	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private PlaylistdtlMapper playlistdtlMapper;
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
		medialistdtlMapper.deleteByObj(Medialistdtl.ObjType_Video, videoid);
		playlistdtlMapper.deleteByDtl(videoid);
		devicefileMapper.clearByMedia(Devicefile.ObjType_Video, videoid);
		videoMapper.deleteByPrimaryKey(videoid);
	}

}
