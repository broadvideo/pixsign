package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Playlist;
import com.broadvideo.pixsignage.domain.Playlistdtl;

public interface PlaylistService {
	public int selectCount(int orgid, String search);

	public List<Playlist> selectList(int orgid, String search, String start, String length);

	public List<Playlistdtl> selectPlaylistdtlList(String playlistid);

	public void addPlaylist(Playlist playlist);

	public void updatePlaylist(Playlist playlist);

	public void deletePlaylist(String playlistid);

	public void syncPlaylistdtlList(Playlist playlist, Playlistdtl[] playlistdtls);
}
