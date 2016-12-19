package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Rss;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.RssMapper;

@Service("rssService")
public class RssServiceImpl implements RssService {

	@Autowired
	private RssMapper rssMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;

	public Rss selectByPrimaryKey(String rssid) {
		return rssMapper.selectByPrimaryKey(rssid);
	}

	public int selectCount(String orgid, String branchid) {
		return rssMapper.selectCount(orgid, branchid);
	}

	public List<Rss> selectList(String orgid, String branchid, String start, String length) {
		return rssMapper.selectList(orgid, branchid, start, length);
	}

	@Transactional
	public void addRss(Rss rss) {
		rssMapper.insertSelective(rss);
	}

	@Transactional
	public void updateRss(Rss rss) {
		rssMapper.updateByPrimaryKeySelective(rss);
	}

	@Transactional
	public void deleteRss(String rssid) {
		bundledtlMapper.clearByObj(Bundledtl.ObjType_Rss, rssid);
		rssMapper.deleteByPrimaryKey(rssid);
	}

}
