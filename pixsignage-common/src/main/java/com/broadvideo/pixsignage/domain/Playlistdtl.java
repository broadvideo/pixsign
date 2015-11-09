package com.broadvideo.pixsignage.domain;

public class Playlistdtl {
	private Integer playlistdtlid;

	private Integer playlistid;

	private Integer videoid;

	private Integer sequence;

	private Video video;

	public Integer getPlaylistdtlid() {
		return playlistdtlid;
	}

	public void setPlaylistdtlid(Integer playlistdtlid) {
		this.playlistdtlid = playlistdtlid;
	}

	public Integer getPlaylistid() {
		return playlistid;
	}

	public void setPlaylistid(Integer playlistid) {
		this.playlistid = playlistid;
	}

	public Integer getVideoid() {
		return videoid;
	}

	public void setVideoid(Integer videoid) {
		this.videoid = videoid;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	public Video getVideo() {
		return video;
	}

	public void setVideo(Video video) {
		this.video = video;
	}
}