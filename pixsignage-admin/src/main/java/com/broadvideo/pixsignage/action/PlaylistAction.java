package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Playlist;
import com.broadvideo.pixsignage.domain.Playlistdtl;
import com.broadvideo.pixsignage.service.PlaylistService;
import com.broadvideo.pixsignage.util.SqlUtil;

@Scope("request")
@Controller("playlistAction")
public class PlaylistAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Playlist playlist;
	private Playlistdtl[] playlistdtls;

	@Autowired
	private PlaylistService playlistService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			int count = playlistService.selectCount(getLoginStaff().getOrgid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Playlist> playlistList = playlistService.selectList(getLoginStaff().getOrgid(), search, start, length);
			for (int i = 0; i < playlistList.size(); i++) {
				aaData.add(playlistList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			playlist.setOrgid(getLoginStaff().getOrgid());
			playlist.setCreatestaffid(getLoginStaff().getStaffid());
			playlistService.addPlaylist(playlist);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			playlistService.updatePlaylist(playlist);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			playlistService.deletePlaylist("" + playlist.getPlaylistid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDtlList() {
		try {
			String playlistid = getParameter("playlistid");
			List<Object> aaData = new ArrayList<Object>();
			List<Playlistdtl> playlistdtlList = playlistService.selectPlaylistdtlList(playlistid);
			for (int i = 0; i < playlistdtlList.size(); i++) {
				aaData.add(playlistdtlList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDtlSync() {
		try {
			playlistService.syncPlaylistdtlList(playlist, playlistdtls);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Playlist getPlaylist() {
		return playlist;
	}

	public void setPlaylist(Playlist playlist) {
		this.playlist = playlist;
	}

	public Playlistdtl[] getPlaylistdtls() {
		return playlistdtls;
	}

	public void setPlaylistdtls(Playlistdtl[] playlistdtls) {
		this.playlistdtls = playlistdtls;
	}
}
