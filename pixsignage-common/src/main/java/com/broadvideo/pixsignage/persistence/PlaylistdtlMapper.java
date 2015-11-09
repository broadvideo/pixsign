package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Playlistdtl;

public interface PlaylistdtlMapper {
	Playlistdtl selectByPrimaryKey(@Param(value = "playlistdtlid") String playlistdtlid);

	List<Playlistdtl> selectList(@Param(value = "playlistid") String playlistid);

	int deleteByPrimaryKey(@Param(value = "playlistdtlid") String playlistdtlid);

	// int insert(Playlistdtl record);

	int insertSelective(Playlistdtl record);

	int updateByPrimaryKeySelective(Playlistdtl record);

	// int updateByPrimaryKey(Playlistdtl record);
}