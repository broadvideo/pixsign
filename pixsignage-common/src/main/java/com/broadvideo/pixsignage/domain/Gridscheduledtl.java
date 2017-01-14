package com.broadvideo.pixsignage.domain;

public class Gridscheduledtl {
	private Integer gridscheduledtlid;

	private Integer gridscheduleid;

	private Integer mediagridid;

	private Integer sequence;

	private Mediagrid mediagrid;

	public Integer getGridscheduledtlid() {
		return gridscheduledtlid;
	}

	public void setGridscheduledtlid(Integer gridscheduledtlid) {
		this.gridscheduledtlid = gridscheduledtlid;
	}

	public Integer getGridscheduleid() {
		return gridscheduleid;
	}

	public void setGridscheduleid(Integer gridscheduleid) {
		this.gridscheduleid = gridscheduleid;
	}

	public Integer getMediagridid() {
		return mediagridid;
	}

	public void setMediagridid(Integer mediagridid) {
		this.mediagridid = mediagridid;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	public Mediagrid getMediagrid() {
		return mediagrid;
	}

	public void setMediagrid(Mediagrid mediagrid) {
		this.mediagrid = mediagrid;
	}
}