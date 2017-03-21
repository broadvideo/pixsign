package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Rss;

public interface RssService {
	public Rss selectByPrimaryKey(String rssid);

	public int selectCount(String orgid, String branchid, String search);

	public List<Rss> selectList(String orgid, String branchid, String search, String start, String length);

	public void addRss(Rss rss);

	public void updateRss(Rss rss);

	public void deleteRss(String rssid);

}
