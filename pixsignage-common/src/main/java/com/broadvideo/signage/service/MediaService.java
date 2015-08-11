package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Media;

public interface MediaService {
	public int selectCount(String orgid, String branchid, String type, String genre, String search);

	public List<Media> selectList(String orgid, String branchid, String type, String genre, String search,
			String start, String length);

	public Media selectByPrimaryKey(String mediaid);

	public Media selectWithBLOBsByPrimaryKey(String mediaid);

	public void addMedia(Media media);

	public void updateMedia(Media media);

	public void deleteMedia(String[] ids);

}
