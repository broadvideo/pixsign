package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Video;

public interface VideoService {
	public int selectCount(String orgid, String branchid, String folderid, String type, String previewflag,
			String format, String adflag, String search);

	public List<Video> selectList(String orgid, String branchid, String folderid, String type, String previewflag,
			String format, String adflag, String search, String start, String length);

	public Video selectByPrimaryKey(String videoid);

	public void addVideo(Video video);

	public void updateVideo(Video video);

	public void deleteVideo(String videoid);
}
