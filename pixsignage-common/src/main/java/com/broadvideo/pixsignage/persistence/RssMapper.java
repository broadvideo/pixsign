package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Rss;

public interface RssMapper {
	Rss selectByPrimaryKey(@Param(value = "rssid") String rssid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid);

	List<Rss> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "rssid") String rssid);
	// int insert(Rss record);

	int insertSelective(Rss record);

	int updateByPrimaryKeySelective(Rss record);

	// int updateByPrimaryKey(Rss record);
}