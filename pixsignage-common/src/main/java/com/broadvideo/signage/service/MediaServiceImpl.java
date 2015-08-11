package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.persistence.MediaMapper;

@Service("mediaService")
public class MediaServiceImpl implements MediaService {

	@Autowired
	private MediaMapper mediaMapper;

	public int selectCount(String orgid, String branchid, String type, String genre, String search) {
		return mediaMapper.selectCount(orgid, branchid, type, genre, search);
	}

	public List<Media> selectList(String orgid, String branchid, String type, String genre, String search,
			String start, String length) {
		return mediaMapper.selectList(orgid, branchid, type, genre, search, start, length);
	}

	public Media selectByPrimaryKey(String mediaid) {
		return mediaMapper.selectByPrimaryKey(mediaid);
	}

	public Media selectWithBLOBsByPrimaryKey(String mediaid) {
		return mediaMapper.selectWithBLOBsByPrimaryKey(mediaid);
	}

	@Transactional
	public void addMedia(Media media) {
		mediaMapper.insert(media);
	}

	public void updateMedia(Media media) {
		mediaMapper.updateByPrimaryKeySelective(media);
	}

	public void deleteMedia(String[] ids) {
		String s = "";
		if (ids.length > 0)
			s = ids[0];
		for (int i = 1; i < ids.length; i++) {
			s += "," + ids[i];
		}
		mediaMapper.deleteByKeys(s);
	}

}
