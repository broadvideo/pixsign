package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Playlist;
import com.broadvideo.pixsignage.domain.Playlistdtl;
import com.broadvideo.pixsignage.persistence.PlaylistMapper;
import com.broadvideo.pixsignage.persistence.PlaylistdtlMapper;

@Service("playlistService")
public class PlaylistServiceImpl implements PlaylistService {

	@Autowired
	private PlaylistMapper playlistMapper;
	@Autowired
	private PlaylistdtlMapper playlistdtlMapper;

	public int selectCount(int orgid, String search) {
		return playlistMapper.selectCount(orgid, search);
	}

	public List<Playlist> selectList(int orgid, String search, String start, String length) {
		return playlistMapper.selectList(orgid, search, start, length);
	}

	public List<Playlistdtl> selectPlaylistdtlList(String playlistid) {
		return playlistdtlMapper.selectList(playlistid);
	}

	@Transactional
	public void addPlaylist(Playlist playlist) {
		playlistMapper.insertSelective(playlist);
	}

	@Transactional
	public void updatePlaylist(Playlist playlist) {
		playlistMapper.updateByPrimaryKeySelective(playlist);
	}

	@Transactional
	public void deletePlaylist(String playlistid) {
		playlistMapper.deleteByPrimaryKey(playlistid);
	}

	@Transactional
	public void syncPlaylistdtlList(Playlist playlist, Playlistdtl[] playlistdtls) {
		int playlistid = playlist.getPlaylistid();
		List<Playlistdtl> oldplaylistdtls = playlistdtlMapper.selectList("" + playlistid);
		HashMap<Integer, Playlistdtl> hash = new HashMap<Integer, Playlistdtl>();
		for (int i = 0; i < playlistdtls.length; i++) {
			Playlistdtl playlistdtl = playlistdtls[i];
			if (playlistdtl.getPlaylistdtlid() == 0) {
				playlistdtl.setPlaylistid(playlistid);
				playlistdtlMapper.insertSelective(playlistdtl);
			} else {
				playlistdtlMapper.updateByPrimaryKeySelective(playlistdtl);
				hash.put(playlistdtl.getPlaylistdtlid(), playlistdtl);
			}
		}
		for (int i = 0; i < oldplaylistdtls.size(); i++) {
			if (hash.get(oldplaylistdtls.get(i).getPlaylistdtlid()) == null) {
				playlistdtlMapper.deleteByPrimaryKey("" + oldplaylistdtls.get(i).getPlaylistdtlid());
			}
		}
	}
}
