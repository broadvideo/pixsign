package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Playlist;

public interface PlaylistMapper {
	Playlist selectByPrimaryKey(@Param(value = "playlistid") String playlistid);

	int selectCount(@Param(value = "orgid") int orgid, @Param(value = "search") String search);

	List<Playlist> selectList(@Param(value = "orgid") int orgid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "playlistid") String playlistid);

	// int insert(Playlist record);

	int insertSelective(Playlist record);

	int updateByPrimaryKeySelective(Playlist record);

	// int updateByPrimaryKey(Playlist record);
}